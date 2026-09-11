/**
 * AI Gateway — Server-side only
 * This runs as a Supabase Edge Function or similar serverless backend.
 * Client NEVER calls AI providers directly.
 *
 * Flow:
 * 1. Client sends request to gateway
 * 2. Gateway authenticates user via Supabase JWT
 * 3. Gateway calls AI provider with server-side API key
 * 4. Gateway validates AI response against schemas
 * 5. Gateway stores draft in ai_generations (status: pending)
 * 6. Gateway returns validated draft to client
 * 7. Client shows review card
 * 8. User confirms → client calls confirm endpoint → status: approved
 */

import type {
  AIProvider,
  AIMessage,
  AITool,
  AIResponse,
  ExerciseDraft,
  RoutineDraft,
  ExerciseContext,
  RoutineContext,
} from "./ai-provider";
import {
  validateExerciseDraft,
  validateRoutineDraft,
  safeValidateExerciseDraft,
  safeValidateRoutineDraft,
  searchExercisesParamsSchema,
  analyzeProgressParamsSchema,
  suggestProgressionParamsSchema,
} from "./schemas";
import { AI_TOOLS } from "./tools";

// ============================================================
// Gateway Configuration
// ============================================================

export interface GatewayConfig {
  provider: AIProvider;
  supabaseUrl: string;
  supabaseServiceKey: string;
}

// ============================================================
// Tool Execution
// ============================================================

async function _executeTool(
  toolName: string,
  args: Record<string, unknown>,
  _context: {
    userId: string;
    supabaseClient: unknown;
  }
): Promise<unknown> {
  switch (toolName) {
    case "search_exercises": {
      const _params = searchExercisesParamsSchema.parse(args);
      // Query exercises from database
      // Return matching exercises
      return { exercises: [], total: 0 };
    }

    case "draft_exercise": {
      const validated = validateExerciseDraft(args);
      return validated;
    }

    case "draft_routine": {
      const validated = validateRoutineDraft(args);
      return validated;
    }

    case "analyze_progress": {
      const params = analyzeProgressParamsSchema.parse(args);
      // Query workout history for exercise
      // Calculate statistics
      return {
        exercise_id: params.exercise_id,
        date_range: params.date_range,
        total_workouts: 0,
        total_sets: 0,
        total_volume: 0,
        trend: "stable",
      };
    }

    case "suggest_progression": {
      const params = suggestProgressionParamsSchema.parse(args);
      // Query recent workouts for exercise
      // Calculate progression suggestion
      return {
        exercise_id: params.exercise_id,
        suggested_load: 0,
        suggested_sets: 3,
        suggested_reps: 10,
        confidence: 0.8,
      };
    }

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

// ============================================================
// Main Chat Handler
// ============================================================

export async function handleChat(params: {
  messages: AIMessage[];
  userId: string;
  model?: string;
  temperature?: number;
  provider: AIProvider;
}): Promise<AIResponse> {
  const { messages, userId: _userId, model, temperature, provider } = params;

  // Add system prompt if not present
  const systemMessage: AIMessage = {
    role: "system",
    content: `You are a fitness AI assistant for the Gym Progress platform.
You help users create exercises and workout routines.
Always use the provided tools to create structured drafts.
Never auto-save — always require user confirmation.
Be concise and professional.`,
  };

  const fullMessages =
    messages[0]?.role === "system" ? messages : [systemMessage, ...messages];

  // Call provider
  const response = await provider.chat({
    messages: fullMessages,
    tools: AI_TOOLS,
    model,
    temperature,
  });

  return response;
}

// ============================================================
// Exercise Draft Generation
// ============================================================

export async function generateExerciseDraft(params: {
  prompt: string;
  userId: string;
  context?: ExerciseContext;
  provider: AIProvider;
}): Promise<{ draft: ExerciseDraft; validation: { valid: boolean; errors?: string[] } }> {
  const { prompt, context, provider } = params;

  const draft = await provider.generateExerciseDraft(prompt, context);
  const validation = safeValidateExerciseDraft(draft);

  if (!validation.success) {
    return {
      draft,
      validation: {
        valid: false,
        errors: validation.error.issues.map((i) => i.message),
      },
    };
  }

  return {
    draft: validation.data,
    validation: { valid: true },
  };
}

// ============================================================
// Routine Draft Generation
// ============================================================

export async function generateRoutineDraft(params: {
  prompt: string;
  userId: string;
  context?: RoutineContext;
  provider: AIProvider;
}): Promise<{ draft: RoutineDraft; validation: { valid: boolean; errors?: string[] } }> {
  const { prompt, context, provider } = params;

  const draft = await provider.generateRoutineDraft(prompt, context);
  const validation = safeValidateRoutineDraft(draft);

  if (!validation.success) {
    return {
      draft,
      validation: {
        valid: false,
        errors: validation.error.issues.map((i) => i.message),
      },
    };
  }

  return {
    draft: validation.data,
    validation: { valid: true },
  };
}

// ============================================================
// Confirmation Handler
// ============================================================

export async function confirmGeneration(params: {
  generationId: string;
  userId: string;
  status: "approved" | "rejected" | "modified";
  modifiedData?: unknown;
  supabaseClient: unknown;
}): Promise<{ success: boolean; error?: string }> {
  const { generationId, userId, status, modifiedData } = params;

  // Validate status
  if (!["approved", "rejected", "modified"].includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  // In production:
  // 1. Verify user owns the generation
  // 2. Update ai_generations.status
  // 3. If approved: persist to main tables
  // 4. Log: model, provider, schema_version, tool_calls, user_id, timestamp

  console.log("Confirming generation:", {
    generationId,
    userId,
    status,
    modifiedData,
    timestamp: new Date().toISOString(),
  });

  return { success: true };
}

// ============================================================
// Mock Provider (for testing)
// ============================================================

export class MockAIProvider implements AIProvider {
  name = "mock";

  async chat(params: {
    messages: AIMessage[];
    tools?: AITool[];
    model?: string;
    temperature?: number;
  }): Promise<AIResponse> {
    return {
      content: "This is a mock response. Configure a real AI provider.",
      tool_calls: [],
      model: params.model ?? "mock-model",
      usage: { prompt_tokens: 0, completion_tokens: 0 },
    };
  }

  async generateExerciseDraft(
    prompt: string,
    _context?: ExerciseContext
  ): Promise<ExerciseDraft> {
    return {
      name: "AI Generated Exercise",
      description: "Created from: " + prompt,
      category: "push",
      muscle: "Chest",
      equipment: "Barbell",
      instructions: ["Step 1", "Step 2", "Step 3"],
      difficulty: "intermediate",
    };
  }

  async generateRoutineDraft(
    prompt: string,
    _context?: RoutineContext
  ): Promise<RoutineDraft> {
    return {
      name: "AI Generated Routine",
      description: "Created from: " + prompt,
      exercises: [
        {
          exercise_id: "bench",
          target_sets: 3,
          target_reps: 10,
        },
      ],
    };
  }
}
