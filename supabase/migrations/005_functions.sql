-- Migration 005: Database functions and triggers
-- Run after 001_initial_schema.sql

-- ============================================================
-- UPDATED_AT AUTO-UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER routines_updated_at
  BEFORE UPDATE ON routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- WORKOUT DURATION CALCULATION
-- ============================================================
CREATE OR REPLACE FUNCTION calculate_workout_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.finished_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration := EXTRACT(EPOCH FROM (NEW.finished_at - NEW.started_at)) / 60;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workouts_calculate_duration
  BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION calculate_workout_duration();

-- ============================================================
-- HELPER: Get user's exercise personal records
-- ============================================================
CREATE OR REPLACE FUNCTION get_exercise_pr(
  p_user_id UUID,
  p_exercise_id UUID
)
RETURNS TABLE(
  max_weight DECIMAL,
  max_reps INT,
  estimated_1rm DECIMAL,
  last_performed TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MAX(s.weight) as max_weight,
    MAX(s.reps) as max_reps,
    MAX(s.weight * (1 + s.reps / 30.0)) as estimated_1rm,
    MAX(w.started_at) as last_performed
  FROM sets s
  JOIN workout_exercises we ON we.id = s.workout_exercise_id
  JOIN workouts w ON w.id = we.workout_id
  WHERE w.owner_id = p_user_id
    AND we.exercise_id = p_exercise_id
    AND s.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HELPER: Get weekly workout stats
-- ============================================================
CREATE OR REPLACE FUNCTION get_weekly_stats(
  p_user_id UUID,
  p_week_start DATE DEFAULT (date_trunc('week', CURRENT_DATE))::DATE
)
RETURNS TABLE(
  workout_count BIGINT,
  total_sets BIGINT,
  total_volume DECIMAL,
  total_minutes INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT w.id) as workout_count,
    COUNT(s.id) as total_sets,
    COALESCE(SUM(s.weight * s.reps), 0) as total_volume,
    COALESCE(SUM(w.duration), 0) as total_minutes
  FROM workouts w
  LEFT JOIN workout_exercises we ON we.workout_id = w.id
  LEFT JOIN sets s ON s.workout_exercise_id = we.id
  WHERE w.owner_id = p_user_id
    AND w.started_at >= p_week_start
    AND w.started_at < p_week_start + INTERVAL '7 days'
    AND s.completed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
