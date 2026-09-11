import { z } from "zod";

// ============================================================
// Base schemas
// ============================================================

export const categorySchema = z.enum(["push", "pull", "legs", "core"]);
export type Category = z.infer<typeof categorySchema>;

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);
export type Difficulty = z.infer<typeof difficultySchema>;

// ============================================================
// Exercise Draft Schema
// ============================================================

export const exerciseDraftSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().max(500).optional(),
  category: categorySchema,
  muscle: z.string().min(1, "Muscle is required"),
  secondary_muscles: z.array(z.string()).optional(),
  equipment: z.string().min(1, "Equipment is required"),
  instructions: z
    .array(z.string().min(1))
    .min(1, "At least one instruction is required"),
  difficulty: difficultySchema.default("intermediate"),
  contraindications: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ExerciseDraftInput = z.infer<typeof exerciseDraftSchema>;

export function validateExerciseDraft(
  data: unknown
): ExerciseDraftInput {
  return exerciseDraftSchema.parse(data);
}

export function safeValidateExerciseDraft(data: unknown) {
  return exerciseDraftSchema.safeParse(data);
}

// ============================================================
// Routine Exercise Schema
// ============================================================

export const routineExerciseDraftSchema = z.object({
  exercise_id: z.string().min(1, "Exercise ID is required"),
  target_sets: z
    .number()
    .int()
    .min(1, "At least 1 set")
    .max(20, "Maximum 20 sets"),
  target_reps: z
    .number()
    .int()
    .min(1, "At least 1 rep")
    .max(100, "Maximum 100 reps"),
  target_load: z.number().min(0).optional(),
  target_rpe: z.number().min(1).max(10).optional(),
  rest_seconds: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export type RoutineExerciseDraftInput = z.infer<
  typeof routineExerciseDraftSchema
>;

// ============================================================
// Routine Draft Schema
// ============================================================

export const routineDraftSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().max(500).optional(),
  exercises: z
    .array(routineExerciseDraftSchema)
    .min(1, "At least one exercise is required"),
});

export type RoutineDraftInput = z.infer<typeof routineDraftSchema>;

export function validateRoutineDraft(data: unknown): RoutineDraftInput {
  return routineDraftSchema.parse(data);
}

export function safeValidateRoutineDraft(data: unknown) {
  return routineDraftSchema.safeParse(data);
}

// ============================================================
// AI Generation Status
// ============================================================

export const generationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "modified",
]);
export type GenerationStatus = z.infer<typeof generationStatusSchema>;

// ============================================================
// AI Message Role
// ============================================================

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

// ============================================================
// Tool Call Schema
// ============================================================

export const toolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  arguments: z.record(z.string(), z.unknown()),
});

export type ToolCall = z.infer<typeof toolCallSchema>;

// ============================================================
// Search Exercises Params
// ============================================================

export const searchExercisesParamsSchema = z.object({
  query: z.string().optional(),
  category: categorySchema.optional(),
  muscle: z.string().optional(),
  equipment: z.string().optional(),
});

export type SearchExercisesParams = z.infer<
  typeof searchExercisesParamsSchema
>;

// ============================================================
// Analyze Progress Params
// ============================================================

export const analyzeProgressParamsSchema = z.object({
  exercise_id: z.string().min(1),
  date_range: z
    .enum(["week", "month", "3months", "year", "all"])
    .default("month"),
});

export type AnalyzeProgressParams = z.infer<
  typeof analyzeProgressParamsSchema
>;

// ============================================================
// Suggest Progression Params
// ============================================================

export const suggestProgressionParamsSchema = z.object({
  exercise_id: z.string().min(1),
  target_rpe: z.number().min(1).max(10).default(7),
});

export type SuggestProgressionParams = z.infer<
  typeof suggestProgressionParamsSchema
>;
