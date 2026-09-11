# Definition of Ready — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A0 — Product Manager

---

## Purpose

Every ticket entering a sprint MUST pass this checklist. If any item is unchecked, the ticket goes back to the Product Manager for refinement. No exceptions.

---

## Checklist

### 1. User Story Format
- [ ] Written in standard format: "As a [persona], I want [action], so that [benefit]"
- [ ] Persona is specific (not "user" — use "strength hobbyist", "beginner", etc.)
- [ ] Benefit is measurable or observable

### 2. Acceptance Criteria
- [ ] Minimum 1 acceptance criterion per user story
- [ ] Every criterion is testable (can write a test for it)
- [ ] Criteria are specific — no vague terms like "should be fast" or "user-friendly"
- [ ] Includes at least one failure/edge case criterion
- [ ] Criteria cover: happy path, validation errors, empty states, loading states

### 3. Scope Definition
- [ ] Feature mapped to MVP scope document (in scope / out of scope)
- [ ] Dependencies on other tickets identified
- [ ] Dependent tickets already in backlog or scheduled
- [ ] No hidden scope — what's NOT included is explicit

### 4. Design Reference
- [ ] Wireframe or mockup linked (for UI features)
- [ ] Design tokens referenced (colors, spacing, typography)
- [ ] Component states specified: default, loading, empty, error
- [ ] Responsive behavior defined (web vs mobile)

### 5. Technical Feasibility
- [ ] Tech lead (A2/A3) confirmed implementation approach
- [ ] Database schema changes identified (if any)
- [ ] API changes identified (if any)
- [ ] Third-party dependencies identified and available
- [ ] Performance impact assessed

### 6. Data & Security
- [ ] Data model changes documented (if any)
- [ ] RLS policy changes identified (if any)
- [ ] Privacy implications reviewed
- [ ] No sensitive data logged unnecessarily

### 7. Localization
- [ ] All user-facing strings identified
- [ ] Polish translations provided
- [ ] English translations provided
- [ ] No hard-coded strings in acceptance criteria

### 8. Testing Requirements
- [ ] Unit test scope identified
- [ ] Integration test scope identified (if applicable)
- [ ] E2E test scope identified (if critical path)
- [ ] RLS test scope identified (if data access changes)

### 9. Definition of Done Reference
- [ ] Ticket aligns with PR checklist (see `CLAUDE_A6.md`)
- [ ] Release notes entry drafted (if user-facing)
- [ ] Documentation updates identified (if needed)

---

## Ticket Template

```markdown
### TICKET-[ID]: [Title]

**User Story:**
As a [persona], I want [action], so that [benefit].

**Priority:** [P0/P1/P2/P3]
**Phase:** [0/1/2/3/4/5/6/7]
**Depends on:** [TICKET-XXX, ...]
**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

**Design Reference:** [Link to wireframe/mockup]
**Technical Notes:** [Implementation approach, schema changes, etc.]
**Out of Scope:** [What this ticket does NOT include]
```

---

## Priority Levels

| Level | Definition | SLA |
|---|---|---|
| **P0** | Blocker — nothing works without this | 24 hours |
| **P1** | Critical — core feature broken or missing | 48 hours |
| **P2** | Important — significant feature, not blocking | 1 week |
| **P3** | Nice to have — can ship without it | Next sprint |

---

## Refinement Process

1. **Backlog Grooming** (weekly): A0 presents candidate tickets
2. **Technical Review** (48h): A2/A3 confirm feasibility
3. **Design Review** (48h): A1 confirms design specs
4. **Final Approval** (24h): A0 marks READY or sends back
5. **Sprint Planning**: Only READY tickets enter sprint

---

## Anti-Patterns (What We Avoid)

- **"It should work like Hevy"** — Too vague. Specify exact behavior.
- **"Make it nice"** — Not testable. Define visual criteria.
- **"Add AI feature"** — Too broad. Break into specific user stories.
- **"Quick fix"** — Still needs acceptance criteria. No shortcuts.
- **"Just do it"** — Every ticket needs a "so that". Purpose matters.
