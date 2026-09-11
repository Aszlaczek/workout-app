# Release Gates — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A0 — Product Manager

---

## Purpose

Release gates define the criteria that MUST be met before transitioning between phases. No phase starts until the previous phase's gate is passed. This prevents technical debt accumulation and ensures quality.

---

## Gate Process

1. **Self-assessment:** Phase owner completes gate checklist
2. **Peer review:** At least one other agent reviews evidence
3. **Gate meeting:** A0 confirms all criteria met
4. **Go/No-go decision:** A0 makes final call
5. **Document result:** Record decision and any exceptions

---

## Phase 0 — Discovery → Phase 1 Foundation

**Gate Owner:** A0
**Target Date:** End of Week 1

### Criteria
- [ ] PRD completed with user stories for all MVP features
- [ ] Definition of Ready documented and approved
- [ ] ADR-001 (stack choice) accepted
- [ ] MVP scope frozen with explicit "not in scope" list
- [ ] Design tokens file created (colors, typography, spacing)
- [ ] Wireframes for 5 core journeys completed
- [ ] Database schema draft reviewed by A3
- [ ] Risk register documented

### Evidence Required
- `docs/PRD.md` — Complete with 40+ user stories
- `docs/DEFINITION_OF_READY.md` — Checklist template
- `docs/ADR/001-stack-choice.md` — Accepted
- `docs/MVP_SCOPE.md` — Frozen
- `docs/design/TOKENS.md` — Design tokens
- `docs/design/WIREFRAMES.md` — Journey wireframes

### Go/No-go
- **Go:** All criteria met, no blocking risks
- **No-go:** Missing PRD, no design tokens, unresolved stack debate

---

## Phase 1 — Foundation → Phase 2 Exercises & Routines

**Gate Owner:** A2 (Frontend) + A3 (Backend)
**Target Date:** End of Week 2-3

### Criteria
- [ ] Expo project created with TypeScript
- [ ] ESLint + Prettier + Husky configured
- [ ] Pre-commit hooks blocking type/lint errors
- [ ] Supabase dev environment created
- [ ] Initial database migration applied
- [ ] RLS policies on all user-owned tables
- [ ] Auth working (email/password + Apple)
- [ ] AppShell renders with sidebar (web) / tabs (iOS)
- [ ] i18n infrastructure in place (PL + EN)
- [ ] CI pipeline running (typecheck + lint + unit)
- [ ] Data-access service layer created

### Evidence Required
- `expo start` works on web + iOS simulator
- Pre-commit blocks a deliberate type error
- Supabase dashboard shows all tables
- RLS test suite passes (positive + negative)
- Auth flow works end-to-end
- CI shows green on main branch

### Go/No-go
- **Go:** All infrastructure ready, no manual setup needed
- **No-go:** Missing RLS, auth broken, no CI, manual DB access

---

## Phase 2 — Exercises & Routines → Phase 3 Workout Logger

**Gate Owner:** A2 (Frontend)
**Target Date:** End of Week 4-5

### Criteria
- [ ] Exercise library displays all exercises
- [ ] Search and filter working
- [ ] Exercise detail view shows all info
- [ ] Custom exercise CRUD working
- [ ] Routine CRUD working
- [ ] Routine exercise reorder working
- [ ] Superset grouping functional
- [ ] All components have loading/empty/error states
- [ ] All strings through i18n
- [ ] Unit tests for exercise/routine logic
- [ ] Component tests for ExerciseCard, RoutineSection

### Evidence Required
- Can create, edit, delete custom exercises
- Can create, edit, delete routines
- Can reorder exercises in routine
- Can toggle superset grouping
- All screens show loading/empty/error states
- Test coverage > 80% for exercise/routine features

### Go/No-go
- **Go:** Exercise/routine features complete and tested
- **No-go:** Missing CRUD operations, no error states, low test coverage

---

## Phase 3 — Workout Logger → Phase 4 Analytics & Calendar

**Gate Owner:** A2 (Frontend) + A3 (Backend)
**Target Date:** End of Week 6-7

### Criteria
- [ ] Workout starts from routine or empty
- [ ] Set logging works (weight/reps/RPE)
- [ ] Add/remove sets working
- [ ] Rest timer functional with presets
- [ ] Finish workout saves correctly
- [ ] Workout history displays correctly
- [ ] Offline logging works (no network)
- [ ] Sync works when network restored
- [ ] Keyboard shortcut (Space) toggles timer
- [ ] Unit tests for workout calculations
- [ ] Integration test: routine → workout → save

### Evidence Required
- Full workout flow works end-to-end
- Timer counts down correctly
- Offline mode doesn't crash
- Sync recovers from offline
- Workout appears in history after save
- Test coverage > 80% for workout features

### Go/No-go
- **Go:** Workout logging complete, offline works, sync works
- **No-go:** Data loss on finish, timer broken, offline crashes

---

## Phase 4 — Analytics & Calendar → Phase 5 AI

**Gate Owner:** A2 (Frontend)
**Target Date:** End of Week 8-9

### Criteria
- [ ] Progress chart shows load over time
- [ ] Volume chart shows volume over time
- [ ] Estimated 1RM calculated correctly (Epley)
- [ ] PR detection works correctly
- [ ] Muscle group volume analysis works
- [ ] Calendar shows workout dots
- [ ] Day detail shows workout info
- [ ] Dashboard shows stats, streaks, recent PRs
- [ ] Charts handle 1000+ data points
- [ ] Unit tests for calculations (1RM, volume, PR)
- [ ] Component tests for charts

### Evidence Required
- Charts render correctly with seed data
- PR detection matches manual calculation
- Calendar highlights workout days
- Dashboard shows accurate stats
- Performance: charts render < 2s with 1000 sessions
- Test coverage > 80% for analytics

### Go/No-go
- **Go:** Analytics accurate, calendar functional, performance acceptable
- **No-go:** Wrong calculations, charts broken, calendar empty

---

## Phase 5 — AI → Phase 6 Hardening

**Gate Owner:** A4 (AI) + A7 (DevOps)
**Target Date:** End of Week 10-11

### Criteria
- [ ] AIProvider interface defined and tested
- [ ] AI gateway (Edge Function) deployed
- [ ] AI tools defined with JSON schemas
- [ ] AI creates exercise drafts correctly
- [ ] AI creates routine drafts correctly
- [ ] Explicit confirmation flow works
- [ ] No AI secrets in client code
- [ ] AI audit trail logging works
- [ ] AI generation history stored
- [ ] Integration test: AI draft → review → save

### Evidence Required
- AI generates valid exercise JSON
- AI generates valid routine JSON
- Review card shows editable fields
- Save only happens after user confirmation
- No API keys in client bundle (gitleaks scan)
- AI logs contain who/what/when

### Go/No-go
- **Go:** AI generates valid drafts, secrets secure, audit works
- **No-go:** Secrets in client, invalid JSON, no confirmation flow

---

## Phase 6 — Hardening → Phase 7 Release

**Gate Owner:** A6 (QA) + A7 (DevOps)
**Target Date:** End of Week 12-13

### Criteria
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing (Playwright)
- [ ] All RLS security tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Localization complete (PL + EN)
- [ ] Security scan clean (gitleaks)
- [ ] Backup/restore tested

### Evidence Required
- CI shows 100% green on main
- E2E suite covers all critical paths
- RLS tests detect unauthorized access
- Lighthouse score > 90 (performance)
- Contrast ratios meet WCAG AA
- All strings translated (PL + EN)
- No secrets in repo (gitleaks clean)
- Backup restored successfully

### Go/No-go
- **Go:** All tests green, performance acceptable, security clean
- **No-go:** Failing tests, security issues, accessibility failures

---

## Phase 7 — Release → Production

**Gate Owner:** A0 (Product Manager) + A7 (DevOps)
**Target Date:** End of Week 14

### Criteria
- [ ] App Store assets ready (screenshots, description)
- [ ] Privacy policy published
- [ ] App Store privacy declarations complete
- [ ] TestFlight beta tested
- [ ] Production environment configured
- [ ] Monitoring and alerting active
- [ ] Rollback procedure documented
- [ ] Release notes drafted
- [ ] Support contact available

### Evidence Required
- App Store submission approved
- TestFlight beta feedback addressed
- Production URL accessible
- Monitoring shows no errors
- Rollback tested successfully
- Support channel ready

### Go/No-go
- **Go:** App approved, monitoring active, support ready
- **No-go:** App rejected, monitoring blind, no support

---

## Exception Process

If a gate criterion cannot be met:

1. **Document** the exception with justification
2. **Assess** risk of proceeding without the criterion
3. **Get approval** from A0 (Product Manager)
4. **Create follow-up ticket** to address post-phase
5. **Record** in decision log

Maximum 2 exceptions per gate. More than 2 = no-go.
