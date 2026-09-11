# Database Schema

## Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   profiles   │────<│   exercises   │────<│ exercise_media   │
└─────────────┘     └──────────────┘     └─────────────────┘
       │
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌──────────────┐                    ┌──────────────────┐
│   routines   │────<───────────────│ routine_exercises │
└──────────────┘                    └──────────────────┘
       │
       ▼
┌──────────────┐     ┌─────────────────┐     ┌─────────┐
│   workouts   │────<│ workout_exercises│────<│  sets   │
└──────────────┘     └─────────────────┘     └─────────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌──────────────┐                    ┌────────────────┐
│ measurements │                    │ progress_photos │
└──────────────┘                    └────────────────┘

┌──────────────────┐     ┌──────────────┐
│ ai_conversations │────<│  ai_messages  │
└──────────────────┘     └──────────────┘

┌──────────────────┐
│  ai_generations  │
└──────────────────┘
```

## Table Details

### profiles

User profiles, auto-created on signup via trigger.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User ID |
| email | TEXT | NOT NULL | Email address |
| display_name | TEXT | | Display name |
| avatar_url | TEXT | | Avatar URL |
| locale | TEXT | DEFAULT 'pl' | Interface language |
| units | TEXT | DEFAULT 'metric' | Measurement units |
| preferences | JSONB | DEFAULT '{}' | User preferences |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

### exercises

System exercises (owner_id IS NULL) and custom exercises.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Exercise ID |
| owner_id | UUID | FK → profiles | NULL = system exercise |
| name | TEXT | NOT NULL | Exercise name |
| category | TEXT | NOT NULL | push \| pull \| legs \| core |
| muscle | TEXT | NOT NULL | Target muscle group |
| equipment | TEXT | | Equipment needed |
| instructions | TEXT[] | | Step-by-step instructions |
| difficulty | TEXT | DEFAULT 'intermediate' | beginner \| intermediate \| advanced |
| is_custom | BOOLEAN | DEFAULT false | Custom exercise flag |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

### routines

Workout templates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Routine ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| name | TEXT | NOT NULL | Routine name |
| template | BOOLEAN | DEFAULT false | Template flag |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

### routine_exercises

Exercises within a routine, with ordering and targets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | ID |
| routine_id | UUID | FK → routines | Parent routine |
| exercise_id | UUID | FK → exercises | Exercise reference |
| position | INT | NOT NULL | Sort order |
| target_sets | INT | DEFAULT 3 | Target sets |
| target_reps | INT | DEFAULT 10 | Target reps |
| target_load | DECIMAL | | Target weight |
| target_rpe | DECIMAL | | Target RPE |
| superset | BOOLEAN | DEFAULT false | Superset flag |
| superset_group | INT | | Superset group ID |
| notes | TEXT | | Exercise notes |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### workouts

Actual workout sessions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Workout ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| routine_id | UUID | FK → routines | Source routine (nullable) |
| routine_name | TEXT | | Routine name snapshot |
| started_at | TIMESTAMPTZ | NOT NULL | Start time |
| finished_at | TIMESTAMPTZ | | End time |
| duration | INT | | Duration in minutes |
| notes | TEXT | | Workout notes |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### workout_exercises

Exercises within a workout.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | ID |
| workout_id | UUID | FK → workouts | Parent workout |
| exercise_id | UUID | FK → exercises | Exercise reference |
| position | INT | NOT NULL | Sort order |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### sets

Individual sets within workout exercises.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Set ID |
| workout_exercise_id | UUID | FK → workout_exercises | Parent exercise |
| set_number | INT | NOT NULL | Set number (1, 2, 3...) |
| weight | DECIMAL | DEFAULT 0 | Weight used |
| reps | INT | DEFAULT 0 | Repetitions |
| unit | TEXT | DEFAULT 'kg' | Weight unit |
| rpe | DECIMAL | | Rate of Perceived Exertion |
| set_type | TEXT | DEFAULT 'normal' | normal \| warmup \| drop \| failure |
| completed_at | TIMESTAMPTZ | | Completion timestamp |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### measurements

Body measurements (weight, body fat, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| type | TEXT | NOT NULL | Measurement type |
| value | DECIMAL | NOT NULL | Measurement value |
| unit | TEXT | NOT NULL | Unit of measurement |
| measured_at | TIMESTAMPTZ | NOT NULL | Measurement time |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### progress_photos

Progress photos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| url | TEXT | NOT NULL | Photo URL |
| thumbnail_url | TEXT | | Thumbnail URL |
| body_part | TEXT | | Body part shown |
| taken_at | TIMESTAMPTZ | NOT NULL | Photo time |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### ai_conversations

AI chat conversations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Conversation ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| title | TEXT | | Conversation title |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

### ai_messages

Messages within AI conversations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Message ID |
| conversation_id | UUID | FK → ai_conversations | Parent conversation |
| role | TEXT | NOT NULL | user \| assistant \| system |
| content | TEXT | NOT NULL | Message content |
| tool_calls | JSONB | | Tool call data |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

### ai_generations

AI-generated content (exercises, routines).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Generation ID |
| owner_id | UUID | FK → profiles | Owner user ID |
| type | TEXT | NOT NULL | exercise \| routine |
| draft | JSONB | NOT NULL | Generated content |
| status | TEXT | DEFAULT 'pending' | pending \| approved \| rejected \| modified |
| source_model | TEXT | | AI model used |
| provider | TEXT | | AI provider |
| schema_version | TEXT | | Schema version |
| created_at | TIMESTAMPTZ | DEFAULT now() | Creation timestamp |

## Indexes

See `supabase/migrations/003_indexes.sql` for all indexes.

Key indexes:
- `idx_workouts_owner_date` - Workout list queries
- `idx_exercises_category` - Exercise filtering
- `idx_sets_workout_exercise` - Set lookups
- `idx_measurements_owner_type` - Measurement time-series

## Database Functions

### get_exercise_pr(user_id, exercise_id)

Returns personal records for an exercise:
- max_weight
- max_reps
- estimated_1rm
- last_performed

### get_weekly_stats(user_id, week_start)

Returns weekly workout statistics:
- workout_count
- total_sets
- total_volume
- total_minutes
