# Secrets Management

## Overview

Zero secrets in repo, bundle, or CI logs. This is non-negotiable.

## Rules

1. **NEVER** commit API keys, tokens, or passwords
2. **NEVER** log secrets in CI output
3. **NEVER** embed AI provider keys in client bundles
4. Use environment-specific secret stores
5. Rotate secrets quarterly

## Environment Secrets

### Development

| Secret | Where | Purpose |
|--------|-------|---------|
| `VITE_SUPABASE_URL` | `.env.local` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Public anon key |

### Staging/Production

| Secret | Where | Purpose |
|--------|-------|---------|
| `SUPABASE_URL` | GitHub Actions / Vercel | Supabase project URL |
| `SUPABASE_ANON_KEY` | GitHub Actions / Vercel | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions only | Admin key (server-side only) |
| `OPENAI_API_KEY` | Edge Functions only | AI provider key (NEVER in client) |
| `APPLE_SIGN_IN_KEY` | Edge Functions only | Apple auth private key |

## Pre-commit Hook

A pre-commit hook checks for secrets before every commit:

```bash
# Check staged files for secrets
git diff --cached --name-only | xargs grep -l -E 'sk-[a-zA-Z0-9]{48}|OPENAI_API_KEY|SUPABASE_SERVICE_ROLE'
```

Install: Copy `.git/hooks/pre-commit` to your local repo.

## Gitleaks Configuration

Secrets scanning runs on every PR via GitHub Actions:

```yaml
- uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Configuration: `.gitleaks.toml`

## Client Bundle

The client app only uses:
- `VITE_SUPABASE_URL` — Public URL (safe for client)
- `VITE_SUPABASE_ANON_KEY` — Public anon key (safe for client)

**NEVER** included in client:
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `APPLE_SIGN_IN_KEY`

## Secret Rotation

| Secret | Frequency | Process |
|--------|-----------|---------|
| Supabase anon key | Quarterly | Regenerate in Supabase dashboard |
| Supabase service key | Quarterly | Regenerate in Supabase dashboard |
| OpenAI API key | Quarterly | Regenerate in OpenAI dashboard |
| Apple Sign-In key | Annually | Regenerate in Apple Developer |

## Incident Response

If a secret is exposed:
1. **Immediately** revoke the exposed secret
2. Generate a new secret
3. Update all environments
4. Check git history for other exposures
5. Review access logs for unauthorized use
6. Document the incident

## CI/CD Secrets

GitHub Actions secrets are environment-scoped:
- `GITHUB_TOKEN` — Automatic, limited scope
- `SUPABASE_URL_*` — Per-environment
- `SUPABASE_ANON_KEY_*` — Per-environment
- `SUPABASE_SERVICE_ROLE_KEY_*` — Per-environment, protected branches only

## .env.example

Reference file for required environment variables:

```bash
# Supabase (required for backend mode)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: AI Provider (server-side only)
# OPENAI_API_KEY=sk-...
```

## Verification

```bash
# Check for secrets in codebase
npx gitleaks detect --source . --verbose

# Check for .env files
git status --porcelain | grep .env

# Check git history
npx gitleaks protect --staged --verbose
```
