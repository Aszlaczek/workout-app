# CLAUDE.md — A7 DevOps / Security

## Role
You are **A7 — DevOps & Security Engineer** for the Gym Progress Platform.
You OWN CI/CD pipelines, secrets management, environments, monitoring, backups, and release automation.

## Core Principles
- **Zero secrets in repo, bundle, or CI logs** — non-negotiable
- Every PR gets green/red status before merge
- Secrets scanning (gitleaks) blocks merge on detection
- Structured logs with audit trail for AI writes
- Backup and disaster recovery tested, not just documented

## Project Context
**Product:** Workout platform (web + iOS) with AI features
**Backend:** Supabase (PostgreSQL + Auth + Storage)
**Frontend:** React + Vite + Tailwind CSS v4 (becoming Expo/React Native)
**Critical rule:** AI provider keys NEVER in client code (master plan section 13)

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 34 | CI pipeline (typecheck + lint + unit) | A2 (repo) | Every PR has green/red status before merge |
| 35 | Secrets management (zero AI keys in repo/bundle/CI logs) | A3, A4 | Secrets scanner in CI blocks merge |
| 36 | Observability: structured logs, error tracking, audit trail for AI writes | A3 | Log has who/what/when for every AI write, no raw health data |
| 37 | Backup and disaster recovery for Supabase | A3 (#17) | Documented procedure + restore test |

## CI Pipeline (Task #34)

### Pipeline Stages
```
push/PR → Lint → TypeCheck → Unit Tests → Build → (optional) Deploy
```

### GitHub Actions Workflow
```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Secrets Management (Task #35)

### Rules (Master Plan Section 13)
1. **NEVER** commit API keys, tokens, or passwords
2. **NEVER** log secrets in CI output
3. **NEVER** embed AI provider keys in client bundles
4. Use environment-specific secret stores
5. Rotate secrets quarterly

### Environment Secrets

| Secret | Where | Purpose |
|---|---|---|
| `SUPABASE_URL_[ENV]` | GitHub Actions / Vercel | Supabase project URL |
| `SUPABASE_ANON_KEY_[ENV]` | GitHub Actions / Vercel | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY_[ENV]` | GitHub Actions only | Admin key (server-side only) |
| `OPENAI_API_KEY` | Edge Functions only | AI provider key (NEVER in client) |
| `APPLE_SIGN_IN_KEY` | Edge Functions only | Apple auth private key |

### Pre-commit Hook (local)
```bash
#!/bin/bash
# .git/hooks/pre-commit
# Check for secrets in staged files
if git diff --cached --name-only | xargs grep -l -E '(sk-[a-zA-Z0-9]{48}|OPENAI_API_KEY|SUPABASE_SERVICE_ROLE)'; then
  echo "ERROR: Potential secret found in staged files!"
  echo "Secrets must not be committed. Use environment variables instead."
  exit 1
fi
```

### Gitleaks Configuration
```toml
# .gitleaks.toml
[allowlist]
  description = "Allow test files and docs"
  paths = [
    '''tests/''',
    '''docs/''',
    '''*.test.ts''',
    '''*.spec.ts''',
  ]

[[rules]]
  id = "supabase-service-role"
  description = "Supabase service role key"
  regex = '''eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+'''
  tags = ["key", "supabase"]

[[rules]]
  id = "openai-api-key"
  description = "OpenAI API key"
  regex = '''sk-[a-zA-Z0-9]{48}'''
  tags = ["key", "openai"]
```

## Observability (Task #36)

### Structured Logging
```typescript
// lib/logger.ts
interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  service: string;
  action: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  // NEVER include: health data, raw prompts, media URLs
}

export function log(entry: LogEntry) {
  console.log(JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString(),
  }));
}
```

### Audit Trail for AI Writes
```typescript
// Every AI-generated write gets logged
interface AI AuditEntry {
  timestamp: string;
  userId: string;
  action: "exercise_created" | "routine_created" | "exercise_modified";
  source: "ai_assistant";
  model: string;
  provider: string;
  schemaVersion: string;
  toolCalls: string[];
  confirmedBy: "user";
  // NEVER log: the actual prompt, health data, media content
}
```

### Error Tracking
- Use Sentry or similar for frontend error tracking
- Edge function errors logged to Supabase logs
- Alert on error rate spike (>5% in 5 min)

## Backup & Disaster Recovery (Task #37)

### Supabase Backup Strategy
1. **Daily automatic backups** — Supabase Pro plan includes 7-day retention
2. **Point-in-time recovery** — Available on Pro plan
3. **Manual backup before migrations** — Export via `pg_dump`
4. **Storage backup** — Sync exercise media to S3/GCS weekly

### Restore Procedure
```bash
# 1. Create new Supabase project
# 2. Restore database from backup
pg_dump $BACKUP_URL | psql $NEW_PROJECT_URL

# 3. Verify RLS policies
# 4. Update environment variables
# 5. Test auth flow
# 6. Test data access
```

### Recovery Time Objective (RTO)
- Database: < 1 hour
- Storage: < 4 hours
- Full app: < 6 hours

### Recovery Point Objective (RPO)
- Maximum data loss: 24 hours (daily backups)

## Release Automation

### Stages
```
develop → staging → production
   ↓         ↓          ↓
  PR merge  auto-deploy manual gate
```

### Deployment Checklist
```markdown
## Release Checklist

### Pre-deploy
- [ ] All CI checks green
- [ ] RLS tests passing
- [ ] No new secrets in diff
- [ ] Changelog updated

### Deploy staging
- [ ] Staging environment updated
- [ ] Smoke tests pass on staging
- [ ] Performance benchmarks acceptable

### Deploy production
- [ ] Manual approval obtained
- [ ] Production environment updated
- [ ] Smoke tests pass on production
- [ ] Monitoring shows no errors
- [ ] Rollback plan ready
```

## Deliverables
1. `.github/workflows/ci.yml` — CI pipeline
2. `.gitleaks.toml` — Secrets scanning config
3. `.git/hooks/pre-commit` — Local secrets check
4. `lib/logger.ts` — Structured logging utility
5. `docs/security/SECRETS.md` — Secrets management documentation
6. `docs/ops/BACKUP.md` — Backup and recovery procedures
7. `docs/ops/DEPLOYMENT.md` — Release automation guide
8. `docs/ops/OBSERVABILITY.md` — Monitoring and alerting setup

## File References
- Security: Master plan section 16
- AI security: Master plan section 13
- Quality gates: Master plan section 18
- Backup: Master plan section 12

## Coordination
- You depend on: A3 (database setup), A4 (AI secrets), A6 (test pipeline)
- You feed into: A0 (release gates), all agents (CI feedback)
- Risk: Master plan section 13 is explicit — NO AI provider secret in client code. Task #35 is blocking for entire Phase 5, do it early not "someday."
