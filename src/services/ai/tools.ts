import type { AITool } from "./ai-provider";

export const AI_TOOLS: AITool[] = [
  {
    name: "search_exercises",
    description:
      "Search existing exercises by name, muscle, or equipment. Use this before creating new exercises to avoid duplicates.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (matches name, muscle, equipment)",
        },
        category: {
          type: "string",
          enum: ["push", "pull", "legs", "core"],
          description: "Filter by exercise category",
        },
        muscle: {
          type: "string",
          description: "Filter by target muscle group",
        },
        equipment: {
          type: "string",
          description: "Filter by required equipment",
        },
      },
    },
  },
  {
    name: "draft_exercise",
    description:
      "Create a structured exercise draft for user review. Never auto-save — always require user confirmation.",
    parameters: {
      type: "object",
      required: ["name", "category", "muscle", "equipment", "instructions"],
      properties: {
        name: {
          type: "string",
          minLength: 2,
          maxLength: 100,
          description: "Exercise name",
        },
        description: {
          type: "string",
          maxLength: 500,
          description: "Brief description of the exercise",
        },
        category: {
          type: "string",
          enum: ["push", "pull", "legs", "core"],
          description: "Primary movement pattern",
        },
        muscle: {
          type: "string",
          minLength: 1,
          description: "Primary target muscle",
        },
        secondary_muscles: {
          type: "array",
          items: { type: "string" },
          description: "Additional muscles worked",
        },
        equipment: {
          type: "string",
          minLength: 1,
          description: "Required equipment",
        },
        instructions: {
          type: "array",
          items: { type: "string" },
          minItems: 1,
          description: "Step-by-step instructions",
        },
        difficulty: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
          description: "Difficulty level",
        },
        contraindications: {
          type: "string",
          description: "Safety warnings or contraindications",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Searchable tags",
        },
      },
    },
  },
  {
    name: "draft_routine",
    description:
      "Create a structured workout routine draft for user review. Never auto-save — always require user confirmation.",
    parameters: {
      type: "object",
      required: ["name", "exercises"],
      properties: {
        name: {
          type: "string",
          minLength: 1,
          maxLength: 100,
          description: "Routine name",
        },
        description: {
          type: "string",
          maxLength: 500,
          description: "Brief description of the routine",
        },
        exercises: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["exercise_id", "target_sets", "target_reps"],
            properties: {
              exercise_id: {
                type: "string",
                description: "ID of existing exercise",
              },
              target_sets: {
                type: "integer",
                minimum: 1,
                maximum: 20,
                description: "Number of sets",
              },
              target_reps: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                description: "Repetitions per set",
              },
              target_load: {
                type: "number",
                minimum: 0,
                description: "Target weight in kg",
              },
              target_rpe: {
                type: "number",
                minimum: 1,
                maximum: 10,
                description: "Target Rate of Perceived Exertion",
              },
              rest_seconds: {
                type: "integer",
                minimum: 0,
                description: "Rest time between sets in seconds",
              },
              notes: {
                type: "string",
                description: "Additional notes",
              },
            },
          },
        },
      },
    },
  },
  {
    name: "analyze_progress",
    description:
      "Analyze user's training progress for a specific exercise over a time period.",
    parameters: {
      type: "object",
      required: ["exercise_id"],
      properties: {
        exercise_id: {
          type: "string",
          description: "Exercise to analyze",
        },
        date_range: {
          type: "string",
          enum: ["week", "month", "3months", "year", "all"],
          description: "Time period to analyze",
          default: "month",
        },
      },
    },
  },
  {
    name: "suggest_progression",
    description:
      "Suggest next workout load, sets, and reps based on training history.",
    parameters: {
      type: "object",
      required: ["exercise_id"],
      properties: {
        exercise_id: {
          type: "string",
          description: "Exercise to suggest progression for",
        },
        target_rpe: {
          type: "number",
          minimum: 1,
          maximum: 10,
          description: "Target RPE for next session",
          default: 7,
        },
      },
    },
  },
];

export function getToolByName(name: string): AITool | undefined {
  return AI_TOOLS.find((t) => t.name === name);
}

export function getToolNames(): string[] {
  return AI_TOOLS.map((t) => t.name);
}
