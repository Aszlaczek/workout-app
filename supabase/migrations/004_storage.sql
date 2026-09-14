-- Migration 004: Storage buckets and policies
-- Run after 001_initial_schema.sql
-- Note: Storage buckets are created via Supabase Dashboard or CLI
-- This file documents the expected configuration

-- ============================================================
-- STORAGE BUCKETS (create via Supabase Dashboard)
-- ============================================================
-- exercise-media:  private, 10MB limit
-- progress-photos: private, 5MB limit
-- avatars:         public,  2MB limit

-- ============================================================
-- STORAGE POLICIES (run after buckets are created)
-- ============================================================

-- EXERCISE MEDIA (private bucket)
DROP POLICY IF EXISTS "Users can view exercise media" ON storage.objects;
CREATE POLICY "Users can view exercise media"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'exercise-media'
    AND (
      -- System exercises: anyone authenticated can view
      EXISTS (
        SELECT 1 FROM exercises
        WHERE exercises.id::text = (storage.foldername(name))[1]
        AND exercises.owner_id IS NULL
      )
      OR
      -- Custom exercises: only owner can view
      EXISTS (
        SELECT 1 FROM exercises
        WHERE exercises.id::text = (storage.foldername(name))[1]
        AND exercises.owner_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users can upload exercise media" ON storage.objects;
CREATE POLICY "Users can upload exercise media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'exercise-media'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT exercises.id::text FROM exercises
      WHERE exercises.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own exercise media" ON storage.objects;
CREATE POLICY "Users can delete own exercise media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'exercise-media'
    AND EXISTS (
      SELECT 1 FROM exercises
      WHERE exercises.id::text = (storage.foldername(name))[1]
      AND exercises.owner_id = auth.uid()
    )
  );

-- PROGRESS PHOTOS (private bucket)
DROP POLICY IF EXISTS "Users can view own progress photos" ON storage.objects;
CREATE POLICY "Users can view own progress photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'progress-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can upload own progress photos" ON storage.objects;
CREATE POLICY "Users can upload own progress photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'progress-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own progress photos" ON storage.objects;
CREATE POLICY "Users can delete own progress photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'progress-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- AVATARS (public bucket)
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
