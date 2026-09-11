/**
 * AI Provider Interface — Provider-agnostic abstraction
 * Server-side only — NEVER imported by client code
 */

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  tool_calls?: AIToolCall[];
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  tool_calls: AIToolCall[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface ExerciseContext {
  existingExercises?: Array<{
    id: string;
    name: string;
    category: string;
    muscle: string;
  }>;
  userPreferences?: {
    level?: "beginner" | "intermediate" | "advanced";
    equipment?: string[];
    goals?: string[];
  };
}

export interface RoutineContext {
  existingExercises?: Array<{
    id: string;
    name: string;
    category: string;
    muscle: string;
    equipment: string;
  }>;
  userPreferences?: {
    level?: "beginner" | "intermediate" | "advanced";
    split?: string;
    daysPerWeek?: number;
    goals?: string[];
  };
  recentWorkouts?: Array<{
    routineName: string;
    date: string;
    exercises: Array<{
      exerciseName: string;
      sets: number;
      reps: number;
      weight: number;
    }>;
  }>;
}

export interface ExerciseDraft {
  name: string;
  description?: string;
  category: "push" | "pull" | "legs" | "core";
  muscle: string;
  secondary_muscles?: string[];
  equipment: string;
  instructions: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  contraindications?: string;
  tags?: string[];
}

export interface RoutineDraftExercise {
  exercise_id: string;
  target_sets: number;
  target_reps: number;
  target_load?: number;
  target_rpe?: number;
  rest_seconds?: number;
  notes?: string;
}

export interface RoutineDraft {
  name: string;
  description?: string;
  exercises: RoutineDraftExercise[];
}

export interface AIProvider {
  name: string;

  chat(params: {
    messages: AIMessage[];
    tools?: AITool[];
    model?: string;
    temperature?: number;
  }): Promise<AIResponse>;

  generateExerciseDraft(
    prompt: string,
    context?: ExerciseContext
  ): Promise<ExerciseDraft>;

  generateRoutineDraft(
    prompt: string,
    context?: RoutineContext
  ): Promise<RoutineDraft>;
}
