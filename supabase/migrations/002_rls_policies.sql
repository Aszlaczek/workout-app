-- Migration 002: Row Level Security policies
-- Every user-owned table MUST have RLS enabled
-- Run after 001_initial_schema.sql

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- EXERCISES
-- ============================================================
-- System exercises (owner_id IS NULL) visible to all authenticated users
CREATE POLICY "System exercises visible to all"
  ON exercises FOR SELECT
  USING (owner_id IS NULL);

-- Custom exercises visible to owner
CREATE POLICY "Custom exercises visible to owner"
  ON exercises FOR SELECT
  USING (auth.uid() = owner_id);

-- Users can create custom exercises
CREATE POLICY "Users can create custom exercises"
  ON exercises FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update own custom exercises
CREATE POLICY "Users can update own custom exercises"
  ON exercises FOR UPDATE
  USING (auth.uid() = owner_id);

-- Users can delete own custom exercises
CREATE POLICY "Users can delete own custom exercises"
  ON exercises FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- EXERCISE MEDIA
-- ============================================================
-- Media for system exercises visible to all
CREATE POLICY "System exercise media visible to all"
  ON exercise_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exercises
      WHERE exercises.id = exercise_media.exercise_id
      AND exercises.owner_id IS NULL
    )
  );

-- Media for custom exercises visible to owner
CREATE POLICY "Custom exercise media visible to owner"
  ON exercise_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exercises
      WHERE exercises.id = exercise_media.exercise_id
      AND exercises.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage media for own exercises"
  ON exercise_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM exercises
      WHERE exercises.id = exercise_media.exercise_id
      AND exercises.owner_id = auth.uid()
    )
  );

-- ============================================================
-- ROUTINES
-- ============================================================
CREATE POLICY "Users can view own routines"
  ON routines FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own routines"
  ON routines FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own routines"
  ON routines FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own routines"
  ON routines FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- ROUTINE EXERCISES
-- ============================================================
-- Users can manage routine exercises through routine ownership
CREATE POLICY "Users can view own routine exercises"
  ON routine_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_exercises.routine_id
      AND routines.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own routine exercises"
  ON routine_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM routines
      WHERE routines.id = routine_exercises.routine_id
      AND routines.owner_id = auth.uid()
    )
  );

-- ============================================================
-- WORKOUTS
-- ============================================================
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- WORKOUT EXERCISES
-- ============================================================
CREATE POLICY "Users can view own workout exercises"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own workout exercises"
  ON workout_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.owner_id = auth.uid()
    )
  );

-- ============================================================
-- SETS
-- ============================================================
CREATE POLICY "Users can view own sets"
  ON sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = sets.workout_exercise_id
      AND workouts.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own sets"
  ON sets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = sets.workout_exercise_id
      AND workouts.owner_id = auth.uid()
    )
  );

-- ============================================================
-- MEASUREMENTS
-- ============================================================
CREATE POLICY "Users can view own measurements"
  ON measurements FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own measurements"
  ON measurements FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own measurements"
  ON measurements FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own measurements"
  ON measurements FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- PROGRESS PHOTOS
-- ============================================================
CREATE POLICY "Users can view own progress photos"
  ON progress_photos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own progress photos"
  ON progress_photos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own progress photos"
  ON progress_photos FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- AI CONVERSATIONS
-- ============================================================
CREATE POLICY "Users can view own AI conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own AI conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own AI conversations"
  ON ai_conversations FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own AI conversations"
  ON ai_conversations FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================
-- AI MESSAGES
-- ============================================================
CREATE POLICY "Users can view own AI messages"
  ON ai_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own AI messages"
  ON ai_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.owner_id = auth.uid()
    )
  );

-- ============================================================
-- AI GENERATIONS
-- ============================================================
CREATE POLICY "Users can view own AI generations"
  ON ai_generations FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own AI generations"
  ON ai_generations FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own AI generations"
  ON ai_generations FOR UPDATE
  USING (auth.uid() = owner_id);
