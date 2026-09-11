# AI Explicit Confirmation Policy

## Overview

All AI-generated content requires explicit user confirmation before being persisted to the database. This ensures users maintain full control over their data.

## Core Rules

### Rule 1: Preview Only
AI can generate drafts but **never auto-saves** to main tables. All AI output goes through a review flow.

### Rule 2: Review Card
Users must review AI-generated content in a dedicated review card with:
- Editable fields (name, description, instructions, etc.)
- Clear indication that content is AI-generated
- Save and Cancel buttons

### Rule 3: Explicit Save
The save action requires an explicit tap/click. No auto-save, no background persistence.

### Rule 4: Audit Logging
After save, the following is logged:
- `model` — AI model used
- `provider` — AI provider name
- `schema_version` — Validation schema version
- `tool_calls` — Tools invoked during generation
- `user_id` — User who approved
- `timestamp` — When approval happened

### Rule 5: AI Generation Marking
AI-generated data is marked with:
```sql
is_ai_generated BOOLEAN DEFAULT true
ai_generation_id UUID REFERENCES ai_generations(id)
```

## Flow Diagram

```
User Request
    ↓
AI Provider → Generates Draft
    ↓
Backend Validates JSON Schema
    ↓
Store in ai_generations (status: pending)
    ↓
Return Draft to Client
    ↓
Client Shows Review Card
    ↓
User Reviews & Edits
    ↓
User Taps "Save"
    ↓
Backend Updates status → "approved"
    ↓
Persist to Main Tables (exercises, routines, etc.)
    ↓
Log Audit Trail
```

## Review Card UI Requirements

### Display
- Clear "AI Generated" badge
- Editable fields for all draft properties
- Preview of instructions/steps
- Warning: "Review carefully before saving"

### Actions
- **Save** — Approves and persists to main tables
- **Edit** — Allows modifying fields before save
- **Discard** — Rejects the draft, status → "rejected"

### Accessibility
- Keyboard navigable
- Screen reader announcements for status changes
- Clear focus management

## Database Schema

### ai_generations table
```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- exercise | routine
  draft JSONB NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending | approved | rejected | modified
  source_model TEXT,
  provider TEXT,
  schema_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Status Transitions
```
pending → approved    (user confirms)
pending → rejected    (user discards)
pending → modified    (user edits then confirms)
```

## Security Considerations

1. **Server-side validation** — All drafts validated against Zod schemas before storage
2. **User ownership** — Only the user who generated the draft can approve/reject
3. **Rate limiting** — Prevent abuse of AI generation endpoints
4. **Cost tracking** — Log token usage per user for billing

## Implementation Checklist

- [ ] Backend validates all AI output against schemas
- [ ] ai_generations table created with RLS
- [ ] Review card UI component built
- [ ] Save/Discard actions implemented
- [ ] Audit logging in place
- [ ] is_ai_generated flag on exercises/routines
- [ ] Rate limiting configured
- [ ] Error handling for invalid AI output
