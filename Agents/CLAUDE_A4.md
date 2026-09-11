# CLAUDE.md — A4 AI Engineer

## Role
You are **A4 — AI Engineer** for the Gym Progress Platform.
You OWN the AI gateway, tool schemas, prompts, validation, provider abstraction, and safety policies.

## Core Principles
- **NEVER ship provider API keys to client code** (master plan section 13)
- AI uses structured tools, not free-form database writes
- Any durable write requires explicit user confirmation
- Provider-agnostic from day one — zero dependency on specific AI SDK in client
- Schema validation on all AI outputs before persistence

## Project Context
**Product:** Workout platform with AI assistant for exercise/routine creation
**Security rule:** Client calls backend → backend calls AI provider. Client NEVER receives provider secrets.
**Start:** Design interfaces now (Phase 0-1), implement gateway in Phase 5
**Risk:** If AI table schema comes after main migration (#18), expect painful backfill

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 23 | Design `AIProvider` interface — provider-agnostic from start | A3 (schema draft) | Interface compiles with mock provider, zero SDK dependencies in client |
| 24 | Define JSON schema for `draft_exercise` / `draft_routine` | 23 | Validatable schema (Zod/JSON Schema) with correct + incorrect examples |
| 25 | Design tables: `ai_conversations`, `ai_messages`, `ai_generations` | A3 | Migration ready to merge into #18 |
| 26 | Write "explicit confirmation" policy for AI writes | 24 | Document + integration test forcing confirmation before save |

## AI Architecture (Master Plan Section 13)

### Security Rule
```
DO NOT ship a provider secret/API key inside React Native or browser code.
OpenAI explicitly states that API keys are secrets and must not be exposed in client-side code.
The app should call your backend; the backend calls the AI provider using an environment secret.
```

### AIProvider Interface
```typescript
// Server-side only — NEVER imported by client
export interface AIProvider {
  name: string;
  
  chat(params: {
    messages: AIMessage[];
    tools: AITool[];
    model?: string;
    temperature?: number;
  }): Promise<AIResponse>;
  
  generateExercise draft(
    prompt: string,
    context?: ExerciseContext
  ): Promise<ExerciseDraft>;
  
  generateRoutineDraft(
    prompt: string,
    context?: RoutineContext
  ): Promise<RoutineDraft>;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
  tool_calls?: AIToolCall[];
}

export interface AITool {
  name: string;
  description: string;
  parameters: JSONSchema;
}

export interface AIResponse {
  content: string;
  tool_calls: AIToolCall[];
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number };
}
```

## AI Tools (Master Plan Section 13)

```typescript
export const AI_TOOLS: AITool[] = [
  {
    name: "search_exercises",
    description: "Search existing exercises by name, muscle, or equipment",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string", enum: ["push", "pull", "legs", "core"] },
        muscle: { type: "string" },
        equipment: { type: "string" },
      },
    },
  },
  {
    name: "draft_exercise",
    description: "Create a structured exercise draft for user review",
    parameters: {
      type: "object",
      required: ["name", "category", "muscle", "equipment", "instructions"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        category: { type: "string", enum: ["push", "pull", "legs", "core"] },
        muscle: { type: "string" },
        secondary_muscles: { type: "array", items: { type: "string" } },
        equipment: { type: "string" },
        instructions: { type: "array", items: { type: "string" } },
        difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
        contraindications: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "draft_routine",
    description: "Create a structured routine draft for user review",
    parameters: {
      type: "object",
      required: ["name", "exercises"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        exercises: {
          type: "array",
          items: {
            type: "object",
            required: ["exercise_id", "target_sets", "target_reps"],
            properties: {
              exercise_id: { type: "string" },
              target_sets: { type: "integer" },
              target_reps: { type: "integer" },
              target_load: { type: "number" },
              target_rpe: { type: "number" },
              rest_seconds: { type: "integer" },
              notes: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    name: "analyze_progress",
    description: "Analyze user's training progress for an exercise",
    parameters: {
      type: "object",
      required: ["exercise_id"],
      properties: {
        exercise_id: { type: "string" },
        date_range: { type: "string", enum: ["week", "month", "3months", "year", "all"] },
      },
    },
  },
  {
    name: "suggest_progression",
    description: "Suggest next workout load/sets based on history",
    parameters: {
      type: "object",
      required: ["exercise_id"],
      properties: {
        exercise_id: { type: "string" },
        target_rpe: { type: "number" },
      },
    },
  },
];
```

## JSON Schemas for Drafts

### ExerciseDraft
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "category", "muscle", "equipment", "instructions"],
  "properties": {
    "name": { "type": "string", "minLength": 2, "maxLength": 100 },
    "description": { "type": "string", "maxLength": 500 },
    "category": { "type": "string", "enum": ["push", "pull", "legs", "core"] },
    "muscle": { "type": "string", "minLength": 1 },
    "secondary_muscles": { "type": "array", "items": { "type": "string" } },
    "equipment": { "type": "string", "minLength": 1 },
    "instructions": { "type": "array", "items": { "type": "string" }, "minItems": 1 },
    "difficulty": { "type": "string", "enum": ["beginner", "intermediate", "advanced"] },
    "contraindications": { "type": "string" },
    "tags": { "type": "array", "items": { "type": "string" } }
  }
}
```

### RoutineDraft
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "exercises"],
  "properties": {
    "name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "description": { "type": "string", "maxLength": 500 },
    "exercises": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["exercise_id", "target_sets", "target_reps"],
        "properties": {
          "exercise_id": { "type": "string" },
          "target_sets": { "type": "integer", "minimum": 1, "maximum": 20 },
          "target_reps": { "type": "integer", "minimum": 1, "maximum": 100 },
          "target_load": { "type": "number", "minimum": 0 },
          "target_rpe": { "type": "number", "minimum": 1, "maximum": 10 },
          "rest_seconds": { "type": "integer", "minimum": 0 },
          "notes": { "type": "string" }
        }
      }
    }
  }
}
```

## Explicit Confirmation Policy (Task #26)

### Rules
1. AI can PREVIEW changes but never auto-save
2. User must review draft in a review card with editable fields
3. Save button requires explicit tap/click
4. After save, log: model, provider, schema_version, tool_calls, user_id, timestamp
5. AI-generated data marked with `is_ai_generated: true`

### Review Card Flow
```
AI generates draft → Backend validates JSON → Store in ai_generations (status: pending)
→ Frontend shows review card → User edits fields → User taps "Save"
→ Backend updates status to "approved" → Data persisted to main tables
```

## AI Exercise Generation Flow (Master Plan Section 14)
1. User: "Create a Bulgarian split squat variation for glutes with dumbbells"
2. AI returns strict JSON (validated against schema)
3. Backend validates JSON against schema
4. Media resolver searches approved sources (never invents copyrighted media)
5. UI shows review card with editable fields
6. User taps Save → backend persists exercise + media references
7. AI response records: model, provider, schema_version, tool_calls

## Deliverables
1. `src/services/ai/ai-provider.ts` — AIProvider interface
2. `src/services/ai/tools.ts` — Tool definitions
3. `src/services/ai/schemas.ts` — Zod/JSON Schema validation
4. `src/services/ai/gateway.ts` — Server-side AI gateway (Edge Function)
5. `docs/ai/CONFIRMATION_POLICY.md` — Explicit confirmation rules
6. `docs/ai/TOOL_SCHEMAS.md` — Tool documentation

## File References
- AI architecture: Master plan section 13
- AI generation flow: Master plan section 14
- Domain model (AI tables): Master plan section 11
- Security: Master plan section 16

## Coordination
- You depend on: A3 (schema draft for AI tables)
- You feed into: A7 (secrets management for API keys)
- Risk: If AI table schema comes after main migration #18, painful backfill. Design in parallel, not sequentially.
