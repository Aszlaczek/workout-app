-- Migration 003: Performance indexes
-- Run after 001_initial_schema.sql

-- ============================================================
-- CRITICAL QUERY PATTERNS
-- ============================================================

-- Workouts: list by user ordered by date
CREATE INDEX idx_workouts_owner_date ON workouts(owner_id, started_at DESC);

-- Workout exercises: lookup by workout
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);

-- Sets: lookup by workout exercise
CREATE INDEX idx_sets_workout_exercise ON sets(workout_exercise_id);

-- Exercises: list by user + filter by category
CREATE INDEX idx_exercises_owner ON exercises(owner_id);
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_owner_category ON exercises(owner_id, category);

-- Routines: list by user
CREATE INDEX idx_routines_owner ON routines(owner_id);

-- Routine exercises: lookup by routine
CREATE INDEX idx_routine_exercises_routine ON routine_exercises(routine_id);

-- Measurements: time-series queries
CREATE INDEX idx_measurements_owner_type ON measurements(owner_id, type);
CREATE INDEX idx_measurements_owner_date ON measurements(owner_id, measured_at DESC);

-- Progress photos: time-series queries
CREATE INDEX idx_progress_photos_owner ON progress_photos(owner_id, taken_at DESC);

-- AI conversations: list by user
CREATE INDEX idx_ai_conversations_owner ON ai_conversations(owner_id);

-- AI messages: lookup by conversation
CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id);

-- AI generations: list by user + status
CREATE INDEX idx_ai_generations_owner ON ai_generations(owner_id);
CREATE INDEX idx_ai_generations_owner_status ON ai_generations(owner_id, status);

-- Exercise media: lookup by exercise
CREATE INDEX idx_exercise_media_exercise ON exercise_media(exercise_id);
