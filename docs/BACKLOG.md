# Product Backlog — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A0 — Product Manager
**Status:** Active

---

## Priority Legend

| Priority | Definition | SLA |
|---|---|---|
| **P0** | Blocker — nothing works without this | 24h |
| **P1** | Critical — core feature missing | 48h |
| **P2** | Important — significant feature | 1 week |
| **P3** | Nice to have — can ship without | Next sprint |

---

## Phase 0 — Discovery (Week 1)

| # | Ticket | Owner | Priority | Status |
|---|---|---|---|---|
| A0-001 | Write PRD with user stories | A0 | P0 | DONE |
| A0-002 | Define Definition of Ready | A0 | P0 | DONE |
| A0-003 | Create ADR-001 (stack choice) | A0 | P0 | DONE |
| A0-004 | Freeze MVP scope | A0 | P0 | DONE |
| A0-005 | Plan release gates | A0 | P0 | DONE |
| A0-006 | Create product backlog | A0 | P0 | DONE |
| A1-001 | Design tokens (colors, type, spacing) | A1 | P0 | TODO |
| A1-002 | Wireframes: 5 core journeys | A1 | P0 | TODO |
| A1-003 | Component specs (4 states each) | A1 | P1 | TODO |
| A3-001 | Database schema draft | A3 | P0 | TODO |

---

## Phase 1 — Foundation (Week 1-2)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A2-001 | Create Expo + TypeScript project | A2 | P0 | A1-001 | TODO |
| A2-002 | Configure ESLint + Prettier + Husky | A2 | P0 | A2-001 | TODO |
| A2-003 | Set up repo structure (src/features, src/services) | A2 | P0 | A2-001 | TODO |
| A3-002 | Create Supabase dev environment | A3 | P0 | A0-004 | TODO |
| A3-003 | Initial database migration | A3 | P0 | A3-002 | TODO |
| A3-004 | RLS policies on all tables | A3 | P0 | A3-003 | TODO |
| A3-005 | Auth configuration (email + Apple) | A3 | P0 | A3-002 | TODO |
| A3-006 | Storage buckets setup | A3 | P1 | A3-003 | TODO |
| A2-004 | AppShell (sidebar web / tabs iOS) | A2 | P0 | A2-003 | TODO |
| A2-005 | i18n infrastructure (PL + EN) | A2 | P1 | A2-003 | TODO |
| A2-006 | Data-access service layer | A2 | P0 | A3-003 | TODO |
| A7-001 | CI pipeline (typecheck + lint + unit) | A7 | P0 | A2-002 | TODO |
| A7-002 | Secrets management setup | A7 | P0 | A3-002 | TODO |
| A6-001 | Test plan document | A6 | P1 | A0-001 | TODO |
| A6-002 | Configure Vitest | A6 | P1 | A2-002 | TODO |

---

## Phase 2 — Exercises & Routines (Week 3-4)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A2-007 | Exercise library list view | A2 | P0 | A2-004 | TODO |
| A2-008 | Exercise search | A2 | P0 | A2-007 | TODO |
| A2-009 | Exercise filters (category, equipment) | A2 | P0 | A2-007 | TODO |
| A2-010 | Exercise detail view | A2 | P0 | A2-007 | TODO |
| A2-011 | Create custom exercise form | A2 | P1 | A2-010 | TODO |
| A2-012 | Exercise media upload | A2 | P2 | A2-011 | TODO |
| A2-013 | Routine list view | A2 | P0 | A2-004 | TODO |
| A2-014 | Create routine form | A2 | P0 | A2-013 | TODO |
| A2-015 | Edit routine | A2 | P0 | A2-014 | TODO |
| A2-016 | Reorder exercises in routine | A2 | P1 | A2-015 | TODO |
| A2-017 | Superset grouping | A2 | P2 | A2-016 | TODO |
| A2-018 | Delete routine | A2 | P1 | A2-013 | TODO |
| A3-007 | Exercise service (CRUD) | A3 | P0 | A3-003 | TODO |
| A3-008 | Routine service (CRUD) | A3 | P0 | A3-003 | TODO |
| A6-003 | Exercise unit tests | A6 | P1 | A2-007 | TODO |
| A6-004 | Routine unit tests | A6 | P1 | A2-013 | TODO |

---

## Phase 3 — Workout Logger (Week 5-6)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A2-019 | Start workout from routine | A2 | P0 | A2-015 | TODO |
| A2-020 | Start empty workout | A2 | P0 | A2-004 | TODO |
| A2-021 | Set logging UI (weight/reps/RPE) | A2 | P0 | A2-019 | TODO |
| A2-022 | Add/remove sets | A2 | P1 | A2-021 | TODO |
| A2-023 | Rest timer | A2 | P0 | A2-021 | TODO |
| A2-024 | Finish workout flow | A2 | P0 | A2-021 | TODO |
| A2-025 | Workout history list | A2 | P1 | A2-024 | TODO |
| A2-026 | Offline workout logging | A2 | P1 | A2-021 | TODO |
| A2-027 | Sync engine | A2 | P1 | A2-026 | TODO |
| A3-009 | Workout service (CRUD) | A3 | P0 | A3-003 | TODO |
| A3-010 | Set service (CRUD) | A3 | P0 | A3-009 | TODO |
| A6-005 | Workout integration test | A6 | P1 | A2-024 | TODO |
| A6-006 | Offline test | A6 | P1 | A2-026 | TODO |

---

## Phase 4 — Analytics & Calendar (Week 7-8)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A2-028 | Progress chart (load over time) | A2 | P0 | A2-025 | TODO |
| A2-029 | Volume chart | A2 | P1 | A2-028 | TODO |
| A2-030 | Estimated 1RM chart | A2 | P1 | A2-028 | TODO |
| A2-031 | PR detection | A2 | P0 | A2-025 | TODO |
| A2-032 | Muscle group volume analysis | A2 | P2 | A2-025 | TODO |
| A2-033 | Training frequency stats | A2 | P1 | A2-025 | TODO |
| A2-034 | Calendar month view | A2 | P0 | A2-025 | TODO |
| A2-035 | Calendar day detail | A2 | P0 | A2-034 | TODO |
| A2-036 | Calendar week view | A2 | P2 | A2-034 | TODO |
| A2-037 | Dashboard (stats, streaks, PRs) | A2 | P0 | A2-025 | TODO |
| A2-038 | Dashboard quick-start | A2 | P0 | A2-037 | TODO |
| A6-007 | Calculation unit tests (1RM, volume, PR) | A6 | P1 | A2-028 | TODO |
| A6-008 | Chart component tests | A6 | P1 | A2-028 | TODO |

---

## Phase 5 — AI (Week 9-10)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A4-001 | AIProvider interface | A4 | P0 | A3-003 | TODO |
| A4-002 | AI tool schemas (Zod/JSON Schema) | A4 | P0 | A4-001 | TODO |
| A4-003 | AI gateway (Edge Function) | A4 | P0 | A4-001 | TODO |
| A4-004 | AI exercise draft generation | A4 | P1 | A4-002 | TODO |
| A4-005 | AI routine draft generation | A4 | P1 | A4-002 | TODO |
| A4-006 | Explicit confirmation policy | A4 | P0 | A4-004 | TODO |
| A2-039 | AI command bar UI | A2 | P1 | A2-004 | TODO |
| A2-040 | AI draft review card | A2 | P1 | A4-004 | TODO |
| A2-041 | AI navigation commands | A2 | P2 | A2-039 | TODO |
| A7-003 | AI secrets in CI (gitleaks) | A7 | P0 | A4-003 | TODO |
| A6-009 | RLS security tests | A6 | P0 | A3-004 | TODO |
| A6-010 | AI integration test | A6 | P1 | A4-004 | TODO |

---

## Phase 6 — Hardening (Week 11-12)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A6-011 | Full E2E suite (Playwright) | A6 | P0 | ALL | TODO |
| A6-012 | Performance benchmarks | A6 | P1 | ALL | TODO |
| A6-013 | Accessibility audit (WCAG AA) | A6 | P1 | ALL | TODO |
| A6-014 | Localization audit (PL + EN) | A6 | P1 | ALL | TODO |
| A7-004 | Observability setup (logs, errors) | A7 | P1 | ALL | TODO |
| A7-005 | Backup/restore test | A7 | P1 | A3-002 | TODO |
| A1-004 | Web vs iOS layout variants | A1 | P1 | A2-004 | TODO |
| A1-005 | Accessibility checklist | A1 | P1 | ALL | TODO |

---

## Phase 7 — Release (Week 13-14)

| # | Ticket | Owner | Priority | Depends On | Status |
|---|---|---|---|---|---|
| A7-006 | Production environment setup | A7 | P0 | A6-011 | TODO |
| A7-007 | Deployment automation | A7 | P0 | A7-006 | TODO |
| A0-007 | App Store assets (screenshots, description) | A0 | P0 | A6-011 | TODO |
| A0-008 | Privacy policy | A0 | P0 | A7-006 | TODO |
| A0-009 | Release notes | A0 | P1 | A0-007 | TODO |
| A5-001 | HealthKit requirements document | A5 | P2 | — | TODO |
| A5-002 | Media picker implementation | A5 | P2 | A2-004 | TODO |

---

## Backlog Statistics

| Metric | Count |
|---|---|
| Total tickets | 82 |
| P0 (Blocker) | 31 |
| P1 (Critical) | 33 |
| P2 (Important) | 16 |
| P3 (Nice to have) | 2 |
| Assigned to A0 | 9 |
| Assigned to A1 | 5 |
| Assigned to A2 | 32 |
| Assigned to A3 | 10 |
| Assigned to A4 | 6 |
| Assigned to A5 | 2 |
| Assigned to A6 | 12 |
| Assigned to A7 | 6 |

---

## Update Schedule

- **Weekly:** A0 reviews and reprioritizes backlog
- **Per sprint:** Tickets enter sprint only if Definition of Ready is met
- **Per phase:** Gate review determines if next phase starts
- **Ad-hoc:** Bug fixes and critical issues can be added anytime
