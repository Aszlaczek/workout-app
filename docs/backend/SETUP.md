# Backend Setup Guide

## Overview

The Gym Progress Platform uses Supabase as the backend, providing:
- PostgreSQL database
- Authentication (email/password + Apple Sign-In)
- Row Level Security (RLS)
- Storage (exercise media, progress photos, avatars)
- Edge Functions (AI integration)

## Environment Setup

### 1. Create Supabase Projects

Create three separate Supabase projects:

| Project | Purpose | Environment Variable Prefix |
|---------|---------|----------------------------|
| `gym-progress-dev` | Development | `VITE_SUPABASE_*` |
| `gym-progress-staging` | Pre-production | `VITE_SUPABASE_*` |
| `gym-progress-prod` | Production | `VITE_SUPABASE_*` |

**Important:** Never share secrets between environments.

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
# Development
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# NEVER commit these to version control
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Migrations

Using Supabase CLI:

```bash
# Initialize Supabase in your project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Or apply individual migrations
psql -f supabase/migrations/001_initial_schema.sql
psql -f supabase/migrations/002_rls_policies.sql
psql -f supabase/migrations/003_indexes.sql
psql -f supabase/migrations/004_storage.sql
psql -f supabase/migrations/005_functions.sql
```

### 4. Create Storage Buckets

In Supabase Dashboard > Storage:

1. **exercise-media** (Private)
   - File size limit: 10MB
   - Allowed MIME types: image/*, video/*

2. **progress-photos** (Private)
   - File size limit: 5MB
   - Allowed MIME types: image/*

3. **avatars** (Public)
   - File size limit: 2MB
   - Allowed MIME types: image/*

### 5. Configure Authentication

In Supabase Dashboard > Authentication > Providers:

1. **Email/Password** - Enable
2. **Apple** - Configure with your Apple Developer credentials

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

### Key Tables

- `profiles` - User profiles (auto-created on signup)
- `exercises` - System + custom exercises
- `routines` - Workout templates
- `workouts` - Actual workout sessions
- `sets` - Individual sets within workouts
- `measurements` - Body measurements
- `progress_photos` - Progress photos
- `ai_*` - AI conversation and generation tables

## Security

### Row Level Security (RLS)

Every table has RLS enabled with policies ensuring:
- Users can only read/write their own data
- System exercises are visible to all authenticated users
- Custom exercises are only visible to their owner

See `supabase/migrations/002_rls_policies.sql` for all policies.

### Storage Policies

- Private buckets use signed URLs
- Users can only access their own files
- System exercise media is publicly readable

See `supabase/migrations/004_storage.sql` for all policies.

## Development Mode

The app runs in **localStorage mode** when Supabase is not configured:

1. No `.env.local` file, or
2. Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`

In this mode:
- All data is stored in localStorage
- No authentication required
- Seed data is loaded on first visit

## Production Checklist

- [ ] Create production Supabase project
- [ ] Run all migrations
- [ ] Create storage buckets
- [ ] Configure authentication providers
- [ ] Set environment variables
- [ ] Test RLS policies
- [ ] Enable Point-in-Time Recovery
- [ ] Set up database backups
- [ ] Configure monitoring/alerting
