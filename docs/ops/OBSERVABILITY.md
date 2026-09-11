# Observability

## Overview

Monitoring, alerting, and audit trail for the Gym Progress Platform.

## Structured Logging

All application logs use structured JSON format:

```json
{
  "timestamp": "2026-09-11T12:00:00.000Z",
  "level": "info",
  "service": "workout",
  "action": "finished",
  "userId": "abc123",
  "metadata": {
    "duration": 45,
    "exercises": 3,
    "sets": 12
  }
}
```

### Log Levels

| Level | Usage |
|-------|-------|
| `info` | Normal operations (login, workout saved, etc.) |
| `warn` | Recoverable issues (slow query, retry needed) |
| `error` | Failures requiring attention |
| `debug` | Development debugging (disabled in production) |

## Audit Trail

### AI Writes

Every AI-generated write is logged:

```json
{
  "timestamp": "2026-09-11T12:00:00.000Z",
  "level": "info",
  "service": "ai-assistant",
  "action": "exercise_created",
  "userId": "abc123",
  "metadata": {
    "source": "ai_assistant",
    "model": "gpt-4",
    "provider": "openai",
    "schemaVersion": "1.0",
    "toolCalls": ["draft_exercise"],
    "confirmedBy": "user"
  }
}
```

### Data Access

Track all data operations:

```json
{
  "timestamp": "2026-09-11T12:00:00.000Z",
  "level": "info",
  "service": "data",
  "action": "write:workouts",
  "userId": "abc123",
  "metadata": {
    "workoutId": "xyz789",
    "duration": 45
  }
}
```

## Error Tracking

### Frontend Errors

Use Sentry or similar:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

### Backend Errors

Edge function errors logged to Supabase logs:

```typescript
import { logError } from "../lib/logger";

try {
  // AI provider call
} catch (error) {
  logError("ai-gateway", "provider_error", error, {
    provider: "openai",
    model: "gpt-4",
  });
  throw error;
}
```

## Alerting

### Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > 5% in 5 min | Page on-call |
| Response time | > 2s p95 | Investigate |
| Failed deployments | > 1 | Block next deploy |
| AI provider errors | > 10/min | Check provider status |

### Alert Channels

- **Critical**: PagerDuty / phone
- **Warning**: Slack / email
- **Info**: Dashboard only

## Metrics to Track

### Application

- Active users (daily/weekly/monthly)
- Workout completions per day
- Average workout duration
- Feature usage (exercises, routines, progress)

### Performance

- Page load time (p50, p95, p99)
- API response time (p50, p95, p99)
- Database query time
- AI response time

### Business

- User retention (7-day, 30-day)
- AI feature adoption
- Premium conversion rate
- Support ticket volume

## Dashboard

### Key Metrics

- Real-time error rate
- Active sessions
- Response time distribution
- Recent deployments

### Logs Explorer

Search and filter structured logs:

```
service:workout action:finished userId:abc123
level:error service:ai-gateway
timestamp:[2026-09-11 TO 2026-09-12]
```

## Privacy

- Never log health data values
- Never log raw AI prompts
- Never log media URLs
- Never log PII (email, name)
- Use anonymized user IDs
- Rotate log retention (90 days)
