# Backup & Disaster Recovery

## Overview

Backup and recovery procedures for the Gym Progress Platform Supabase backend.

## Backup Strategy

### 1. Daily Automatic Backups

Supabase Pro plan includes:
- Daily automatic database backups
- 7-day retention
- Point-in-time recovery (PITR)

### 2. Manual Backup Before Migrations

Always create a manual backup before running migrations:

```bash
# Export database
pg_dump $SUPABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Or using Supabase CLI
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Storage Backup

Exercise media and progress photos should be synced to external storage:

```bash
# Sync to S3/GCS weekly
aws s3 sync ./media s3://gym-progress-backups/media/$(date +%Y%m%d)
```

## Recovery Procedures

### Database Restore

```bash
# 1. Create new Supabase project (if needed)
# 2. Restore database from backup
psql $NEW_PROJECT_URL < backup_20260911.sql

# 3. Verify RLS policies
psql $NEW_PROJECT_URL -c "SELECT schemaname, tablename FROM pg_policies;"

# 4. Update environment variables
# 5. Test auth flow
# 6. Test data access
```

### Point-in-Time Recovery

Available on Supabase Pro plan:

1. Go to Supabase Dashboard > Database > Backups
2. Select "Point-in-Time Recovery"
3. Choose restore point (timestamp)
4. Confirm restore

### Storage Restore

```bash
# Restore from S3/GCS backup
aws s3 sync s3://gym-progress-backups/media/20260911 ./media
```

## Recovery Objectives

### RTO (Recovery Time Objective)

| Component | Target |
|-----------|--------|
| Database | < 1 hour |
| Storage | < 4 hours |
| Full app | < 6 hours |

### RPO (Recovery Point Objective)

| Component | Target |
|-----------|--------|
| Database | 24 hours (daily backups) |
| Storage | 24 hours (weekly sync) |

## Backup Verification

### Monthly Test

```bash
# 1. Create test restore
# 2. Verify data integrity
psql $TEST_URL -c "
  SELECT
    (SELECT COUNT(*) FROM profiles) as profiles,
    (SELECT COUNT(*) FROM exercises) as exercises,
    (SELECT COUNT(*) FROM workouts) as workouts;
"

# 3. Verify RLS policies
# 4. Test auth flow
# 5. Document results
```

## Emergency Contacts

| Role | Contact |
|------|---------|
| Database Admin | [Name] |
| DevOps Lead | [Name] |
| Supabase Support | support@supabase.io |

## Runbook

### Scenario: Database Corruption

1. Stop all writes to database
2. Assess damage scope
3. Create point-in-time recovery
4. Verify data integrity
5. Update application configuration
6. Resume operations
7. Document incident

### Scenario: Accidental Data Deletion

1. Identify deleted records and timestamp
2. Create point-in-time recovery to before deletion
3. Export restored data
4. Import into production database
5. Verify data integrity

### Scenario: Storage Bucket Corruption

1. Stop uploads to affected bucket
2. Restore from external backup (S3/GCS)
3. Update signed URL generation
4. Verify media access
5. Resume operations
