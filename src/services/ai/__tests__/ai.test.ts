import { describe, it, expect } from "vitest";
import {
  exerciseDraftSchema,
  routineDraftSchema,
  routineExerciseDraftSchema,
  searchExercisesParamsSchema,
  analyzeProgressParamsSchema,
  suggestProgressionParamsSchema,
  safeValidateExerciseDraft,
  safeValidateRoutineDraft,
} from "../schemas";
import { AI_TOOLS, getToolByName, getToolNames } from "../tools";
import { MockAIProvider } from "../gateway";

describe("exerciseDraftSchema", () => {
  const validDraft = {
    name: "Bulgarian Split Squat",
    category: "legs",
    muscle: "Quadriceps",
    equipment: "Dumbbells",
    instructions: ["Step 1", "Step 2"],
    difficulty: "intermediate",
  };

  it("accepts valid exercise draft", () => {
    const result = exerciseDraftSchema.safeParse(validDraft);
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = exerciseDraftSchema.safeParse({
      ...validDraft,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = exerciseDraftSchema.safeParse({
      ...validDraft,
      category: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty instructions", () => {
    const result = exerciseDraftSchema.safeParse({
      ...validDraft,
      instructions: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid difficulty", () => {
    const result = exerciseDraftSchema.safeParse({
      ...validDraft,
      difficulty: "expert",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional fields", () => {
    const result = exerciseDraftSchema.safeParse({
      ...validDraft,
      description: "A test exercise",
      secondary_muscles: ["Glutes"],
      contraindications: "None",
      tags: ["test"],
    });
    expect(result.success).toBe(true);
  });

  it("defaults difficulty to intermediate", () => {
    const { difficulty, ...draft } = validDraft;
    const result = exerciseDraftSchema.parse(draft);
    expect(result.difficulty).toBe("intermediate");
  });
});

describe("routineDraftSchema", () => {
  const validRoutine = {
    name: "Push Day",
    exercises: [
      {
        exercise_id: "bench",
        target_sets: 3,
        target_reps: 10,
      },
    ],
  };

  it("accepts valid routine draft", () => {
    const result = routineDraftSchema.safeParse(validRoutine);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = routineDraftSchema.safeParse({
      ...validRoutine,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty exercises", () => {
    const result = routineDraftSchema.safeParse({
      ...validRoutine,
      exercises: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid target_sets", () => {
    const result = routineDraftSchema.safeParse({
      ...validRoutine,
      exercises: [{ exercise_id: "bench", target_sets: 0, target_reps: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects target_sets > 20", () => {
    const result = routineDraftSchema.safeParse({
      ...validRoutine,
      exercises: [{ exercise_id: "bench", target_sets: 21, target_reps: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional exercise fields", () => {
    const result = routineDraftSchema.safeParse({
      ...validRoutine,
      exercises: [
        {
          exercise_id: "bench",
          target_sets: 3,
          target_reps: 10,
          target_load: 80,
          target_rpe: 7,
          rest_seconds: 180,
          notes: "Focus on form",
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("searchExercisesParamsSchema", () => {
  it("accepts empty params", () => {
    const result = searchExercisesParamsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts valid params", () => {
    const result = searchExercisesParamsSchema.safeParse({
      query: "bench",
      category: "push",
      muscle: "chest",
      equipment: "barbell",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = searchExercisesParamsSchema.safeParse({
      category: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("analyzeProgressParamsSchema", () => {
  it("accepts valid params", () => {
    const result = analyzeProgressParamsSchema.safeParse({
      exercise_id: "bench",
      date_range: "month",
    });
    expect(result.success).toBe(true);
  });

  it("defaults date_range to month", () => {
    const result = analyzeProgressParamsSchema.parse({
      exercise_id: "bench",
    });
    expect(result.date_range).toBe("month");
  });
});

describe("suggestProgressionParamsSchema", () => {
  it("accepts valid params", () => {
    const result = suggestProgressionParamsSchema.safeParse({
      exercise_id: "bench",
      target_rpe: 7,
    });
    expect(result.success).toBe(true);
  });

  it("defaults target_rpe to 7", () => {
    const result = suggestProgressionParamsSchema.parse({
      exercise_id: "bench",
    });
    expect(result.target_rpe).toBe(7);
  });

  it("rejects target_rpe < 1", () => {
    const result = suggestProgressionParamsSchema.safeParse({
      exercise_id: "bench",
      target_rpe: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects target_rpe > 10", () => {
    const result = suggestProgressionParamsSchema.safeParse({
      exercise_id: "bench",
      target_rpe: 11,
    });
    expect(result.success).toBe(false);
  });
});

describe("safeValidateExerciseDraft", () => {
  it("returns success for valid data", () => {
    const result = safeValidateExerciseDraft({
      name: "Test",
      category: "push",
      muscle: "Chest",
      equipment: "Barbell",
      instructions: ["Step 1"],
    });
    expect(result.success).toBe(true);
  });

  it("returns errors for invalid data", () => {
    const result = safeValidateExerciseDraft({
      name: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("safeValidateRoutineDraft", () => {
  it("returns success for valid data", () => {
    const result = safeValidateRoutineDraft({
      name: "Test Routine",
      exercises: [{ exercise_id: "bench", target_sets: 3, target_reps: 10 }],
    });
    expect(result.success).toBe(true);
  });

  it("returns errors for invalid data", () => {
    const result = safeValidateRoutineDraft({
      name: "",
      exercises: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("AI_TOOLS", () => {
  it("defines 5 tools", () => {
    expect(AI_TOOLS.length).toBe(5);
  });

  it("each tool has name, description, and parameters", () => {
    AI_TOOLS.forEach((tool) => {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.parameters).toBeTruthy();
    });
  });

  it("getToolByName returns correct tool", () => {
    const tool = getToolByName("draft_exercise");
    expect(tool?.name).toBe("draft_exercise");
  });

  it("getToolByName returns undefined for unknown tool", () => {
    const tool = getToolByName("unknown");
    expect(tool).toBeUndefined();
  });

  it("getToolNames returns all tool names", () => {
    const names = getToolNames();
    expect(names).toEqual([
      "search_exercises",
      "draft_exercise",
      "draft_routine",
      "analyze_progress",
      "suggest_progression",
    ]);
  });
});

describe("MockAIProvider", () => {
  const provider = new MockAIProvider();

  it("has correct name", () => {
    expect(provider.name).toBe("mock");
  });

  it("chat returns mock response", async () => {
    const response = await provider.chat({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(response.content).toBeTruthy();
    expect(response.model).toBe("mock-model");
  });

  it("generateExerciseDraft returns valid draft", async () => {
    const draft = await provider.generateExerciseDraft("test");
    const result = exerciseDraftSchema.safeParse(draft);
    expect(result.success).toBe(true);
  });

  it("generateRoutineDraft returns valid draft", async () => {
    const draft = await provider.generateRoutineDraft("test");
    const result = routineDraftSchema.safeParse(draft);
    expect(result.success).toBe(true);
  });
});
