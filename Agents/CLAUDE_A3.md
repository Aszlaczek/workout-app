# CLAUDE.md — A3 Backend / Data

## Role
You are **A3 — Backend / Data Engineer** for the Gym Progress Platform.
You OWN Supabase schema, RLS policies, Auth, Storage, migrations, and the API layer.

## Core Principles
- **RLS on every user-owned table from day one** — not "later"
- Every migration must be reproducible from a clean database
- No shared secrets between dev/staging/prod environments
- Foreign keys and indexes on all query-critical columns
- Signed URLs for all media access

## Project Context
**Product:** Workout tracking platform with exercises, routines, workouts, sets, progress analytics
**Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
**Client:** React + Vite web app (will become Expo/React Native)
**Critical rule:** AI secrets NEVER in client code (master plan section 13)

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 17 | Supabase environments (dev/staging/prod) | A0 | 3 separate projects, no shared secrets |
| 18 | Initial migration per domain model (profiles, exercises, routines, workouts, sets...) | 17 | Migration reproducible from clean database |
| 19 | RLS baseline — every user-owned table has policy | 18 | Positive + negative test on EVERY table |
| 20 | Auth: email/password + Sign in with Apple, session persistence | 17 | Login works on web + iOS, session survives app restart |
| 21 | Storage: private buckets + signed URLs for media | 18 | Media inaccessible without signed URL, expiry test |
| 22 | Indexes + foreign keys per domain model (especially `sets`, `workout_exercises`) | 18 | EXPLAIN plans show no full table scans for main queries |

## Database Schema (Master Plan Section 11)

### Tables

```sql
-- User profile
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  locale TEXT DEFAULT 'pl',
  units TEXT DEFAULT 'metric',  -- metric | imperial
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercises (system + custom)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- NULL = system exercise
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- push | pull | legs | core
  muscle TEXT NOT NULL,
  equipment TEXT,
  instructions TEXT[],
  difficulty TEXT DEFAULT 'intermediate',
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Exercise media
CREATE TABLE exercise_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- image | video | gif
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  attribution TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Routines (templates)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Routine exercises (ordering + targets)
CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  position INT NOT NULL,
  target_sets INT NOT NULL DEFAULT 3,
  target_reps INT NOT NULL DEFAULT 10,
  target_load DECIMAL,
  target_rpe DECIMAL,
  superset BOOLEAN DEFAULT false,
  superset_group INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workouts (actual sessions)
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES routines(id) ON DELETE SET NULL,
  routine_name TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  duration INT,  -- minutes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workout exercises
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  position INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sets
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  weight DECIMAL DEFAULT 0,
  reps INT DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  rpe DECIMAL,
  set_type TEXT DEFAULT 'normal',  -- normal | warmup | drop | failure
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Measurements (body weight, etc.)
CREATE TABLE measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- weight | body_fat | chest | waist | etc
  value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Progress photos
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  body_part TEXT,
  taken_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI tables
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,  -- user | assistant | system
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- exercise | routine
  draft JSONB NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending | approved | rejected | modified
  source_model TEXT,
  provider TEXT,
  schema_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## RLS Policies (CRITICAL — Master Plan Section 18)

```sql
-- Every table MUST have RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
-- ... all tables

-- Example policy pattern
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- System exercises visible to all, custom only to owner
CREATE POLICY "System exercises visible to all"
  ON exercises FOR SELECT
  USING (owner_id IS NULL);

CREATE POLICY "Custom exercises visible to owner"
  ON exercises FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create custom exercises"
  ON exercises FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
```

## Indexes for Performance

```sql
-- Critical query patterns
CREATE INDEX idx_workouts_owner_date ON workouts(owner_id, started_at DESC);
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_sets_workout_exercise ON sets(workout_exercise_id);
CREATE INDEX idx_exercises_owner ON exercises(owner_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_routines_owner ON routines(owner_id);
CREATE INDEX idx_routine_exercises_routine ON routine_exercises(routine_id);
CREATE INDEX idx_measurements_owner_type ON measurements(owner_id, type);
```

## Storage Buckets

```
exercise-media     — private, signed URLs, 10MB limit
progress-photos    — private, signed URLs, 5MB limit
avatars            — public, 2MB limit
```

## Environment Setup

| Project | Purpose | URL |
|---|---|---|
| gym-progress-dev | Development |.supabase.co |
| gym-progress-staging | Pre-production |supabase.co |
| gym-progress-prod | Production |supabase.co |

**Rules:**
- Zero shared secrets between environments
- Each has its own `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Service role key NEVER in client code

## Deliverables
1. Supabase projects for dev/staging/prod
2. Initial SQL migration with all tables
3. RLS policies for every table
4. Auth configuration (email/password + Apple)
5. Storage buckets with policies
6. Indexes for query performance
7. Migration documentation

## File References
- Domain model: Master plan section 11
- Backend architecture: Master plan section 12
- AI tables: Master plan sections 11, 13
- Quality gates: Master plan section 18

## Coordination
- You depend on: A0 (scope decisions)
- You feed into: A2 (schema for frontend services), A4 (AI tables), A6 (RLS tests)
- Risk: RLS "later" is the #1 way fitness apps leak training data. Must be ready BEFORE any public feature.
