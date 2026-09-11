# AI Tool Schemas

## Overview

The AI assistant uses structured tools to interact with the gym progress platform. All tools are defined in `src/services/ai/tools.ts` and validated with Zod schemas in `src/services/ai/schemas.ts`.

## Available Tools

### 1. search_exercises

Search existing exercises to avoid duplicates before creating new ones.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| query | string | No | Search query (matches name, muscle, equipment) |
| category | enum | No | Filter by: push, pull, legs, core |
| muscle | string | No | Filter by target muscle group |
| equipment | string | No | Filter by required equipment |

**Example:**
```json
{
  "query": "bench",
  "category": "push",
  "muscle": "chest"
}
```

**Response:**
```json
{
  "exercises": [
    {
      "id": "bench",
      "name": "Bench Press",
      "category": "push",
      "muscle": "Chest",
      "equipment": "Barbell"
    }
  ],
  "total": 1
}
```

---

### 2. draft_exercise

Create a structured exercise draft for user review.

**Parameters:**
| Name | Type | Required | Constraints | Description |
|------|------|----------|-------------|-------------|
| name | string | Yes | 2-100 chars | Exercise name |
| description | string | No | max 500 chars | Brief description |
| category | enum | Yes | push, pull, legs, core | Primary movement pattern |
| muscle | string | Yes | min 1 char | Primary target muscle |
| secondary_muscles | string[] | No | | Additional muscles worked |
| equipment | string | Yes | min 1 char | Required equipment |
| instructions | string[] | Yes | min 1 item | Step-by-step instructions |
| difficulty | enum | No | beginner, intermediate, advanced | Default: intermediate |
| contraindications | string | No | | Safety warnings |
| tags | string[] | No | | Searchable tags |

**Example:**
```json
{
  "name": "Bulgarian Split Squat",
  "description": "Single-leg squat with rear foot elevated",
  "category": "legs",
  "muscle": "Quadriceps",
  "secondary_muscles": ["Glutes", "Hamstrings"],
  "equipment": "Dumbbells",
  "instructions": [
    "Stand lunge distance from bench",
    "Place rear foot on bench",
    "Hold dumbbells at sides",
    "Lower until front thigh is parallel",
    "Drive through front heel to stand"
  ],
  "difficulty": "intermediate",
  "contraindications: "Not recommended for knee injuries",
  "tags": ["single-leg", "unilateral", "hypertrophy"]
}
```

**Validation:**
- Name: 2-100 characters
- Category: must be one of push/pull/legs/core
- Muscle: non-empty string
- Equipment: non-empty string
- Instructions: at least 1 non-empty string
- Difficulty: must be one of beginner/intermediate/advanced

---

### 3. draft_routine

Create a structured workout routine draft for user review.

**Parameters:**
| Name | Type | Required | Constraints | Description |
|------|------|----------|-------------|-------------|
| name | string | Yes | 1-100 chars | Routine name |
| description | string | No | max 500 chars | Brief description |
| exercises | array | Yes | min 1 item | List of exercises |

**Exercise Object:**
| Name | Type | Required | Constraints | Description |
|------|------|----------|-------------|-------------|
| exercise_id | string | Yes | | ID of existing exercise |
| target_sets | integer | Yes | 1-20 | Number of sets |
| target_reps | integer | Yes | 1-100 | Repetitions per set |
| target_load | number | No | min 0 | Target weight in kg |
| target_rpe | number | No | 1-10 | Target RPE |
| rest_seconds | integer | No | min 0 | Rest time in seconds |
| notes | string | No | | Additional notes |

**Example:**
```json
{
  "name": "Push Day A",
  "description": "Upper body push workout",
  "exercises": [
    {
      "exercise_id": "bench",
      "target_sets": 4,
      "target_reps": 8,
      "target_load": 80,
      "target_rpe": 7,
      "rest_seconds": 180,
      "notes": "Focus on controlled descent"
    },
    {
      "exercise_id": "ohp",
      "target_sets": 3,
      "target_reps": 10,
      "target_rpe": 7,
      "rest_seconds": 120
    }
  ]
}
```

**Validation:**
- Name: 1-100 characters
- Exercises: at least 1
- Each exercise: exercise_id non-empty, target_sets 1-20, target_reps 1-100
- Optional fields validated when present

---

### 4. analyze_progress

Analyze training progress for a specific exercise.

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| exercise_id | string | Yes | | Exercise to analyze |
| date_range | enum | No | month | Time period |

**date_range options:** week, month, 3months, year, all

**Example:**
```json
{
  "exercise_id": "bench",
  "date_range": "3months"
}
```

**Response:**
```json
{
  "exercise_id": "bench",
  "date_range": "3months",
  "total_workouts": 12,
  "total_sets": 48,
  "total_volume": 38400,
  "trend": "improving",
  "estimated_1rm": 100,
  "personal_record": {
    "weight": 95,
    "reps": 1,
    "date": "2026-08-15"
  }
}
```

---

### 5. suggest_progression

Suggest next workout load based on training history.

**Parameters:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| exercise_id | string | Yes | | Exercise to progress |
| target_rpe | number | No | 7 | Target RPE (1-10) |

**Example:**
```json
{
  "exercise_id": "bench",
  "target_rpe": 7
}
```

**Response:**
```json
{
  "exercise_id": "bench",
  "suggested_load": 85,
  "suggested_sets": 4,
  "suggested_reps": 6,
  "suggested_rpe": 7,
  "confidence": 0.85,
  "rationale": "Based on recent progression from 80kg to 82.5kg"
}
```

## Error Handling

All tool calls may return:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid parameters",
    "details": [
      {
        "field": "name",
        "message": "Name must be at least 2 characters"
      }
    ]
  }
}
```

## Security

- All tools require authenticated user
- User can only access their own data
- AI cannot modify data without explicit confirmation
- All tool calls logged for audit trail
