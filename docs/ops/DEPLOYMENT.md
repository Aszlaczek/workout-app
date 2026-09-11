# Deployment Guide

## Overview

Release automation and deployment procedures for the Gym Progress Platform.

## Environments

| Environment | Purpose | URL | Auto-deploy |
|-------------|---------|-----|-------------|
| Development | Local development | localhost:5173 | N/A |
| Staging | Pre-production testing | staging.gymprogress.app | Yes (develop branch) |
| Production | Live application | gymprogress.app | Manual gate |

## Deployment Flow

```
develop → staging → production
   ↓         ↓          ↓
  PR merge  auto-deploy manual gate
```

## Pre-deploy Checklist

```markdown
## Release Checklist

### Pre-deploy
- [ ] All CI checks green
- [ ] RLS tests passing
- [ ] No new secrets in diff
- [ ] Changelog updated
- [ ] Version bumped

### Deploy staging
- [ ] Staging environment updated
- [ ] Smoke tests pass on staging
- [ ] Performance benchmarks acceptable
- [ ] No errors in monitoring

### Deploy production
- [ ] Manual approval obtained
- [ ] Production environment updated
- [ ] Smoke tests pass on production
- [ ] Monitoring shows no errors
- [ ] Rollback plan ready
```

## Deploy to Staging

Automatic on push to `develop` branch:

```bash
# Manual trigger
git push origin develop

# Or via GitHub Actions
gh workflow run deploy-staging
```

## Deploy to Production

Manual gate required:

```bash
# 1. Merge develop to main
git checkout main
git merge develop
git push origin main

# 2. Wait for CI to pass
gh run list --branch main

# 3. Deploy via Vercel/Netlify dashboard
# Or via CLI
vercel --prod

# 4. Verify deployment
curl -I https://gymprogress.app
```

## Rollback Procedure

### Immediate Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --prod --dir=dist --message="Rollback"

# Manual
git revert HEAD
git push origin main
```

### Database Rollback

```bash
# If migration caused issues
psql $DATABASE_URL < pre_migration_backup.sql
```

## Smoke Tests

### Post-Deploy Verification

```bash
# 1. Check app loads
curl -s https://gymprogress.app | grep -q "root"

# 2. Check API endpoints
curl -s https://gymprogress.app/api/health | grep -q "ok"

# 3. Check auth flow (manual)
# - Open app
# - Login
# - Verify dashboard loads
```

## Monitoring

### Health Checks

- Frontend: https://gymprogress.app (HTTP 200)
- API: https://gymprogress.app/api/health (HTTP 200)
- Database: Supabase dashboard

### Alerting

- Error rate > 5% in 5 minutes
- Response time > 2 seconds
- Failed deployments

## Versioning

### Semantic Versioning

- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Changelog

Maintain `CHANGELOG.md`:

```markdown
## [1.2.0] - 2026-09-11

### Added
- AI exercise generation
- Progress charts

### Fixed
- Calendar date display

### Changed
- Improved workout logger performance
```
