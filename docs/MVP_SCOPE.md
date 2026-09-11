# MVP Scope — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A0 — Product Manager
**Status:** FROZEN — Changes require A0 approval

---

## Scope Statement

The MVP delivers an excellent workout logger with progress analytics, exercise library, routine builder, calendar, and a foundation for AI features. The product is a web-first application with iOS companion planned.

**Primary promise:** "Log a workout in seconds, understand your progress in minutes."

---

## IN SCOPE

### Authentication
| Feature | User Stories | Priority |
|---|---|---|
| Email/password registration | US-001 | P0 |
| Email/password login | US-002 | P0 |
| Sign in with Apple | US-003 | P1 |
| Session persistence | US-004 | P0 |
| Account deletion | US-005 | P1 |

### Exercise Library
| Feature | User Stories | Priority |
|---|---|---|
| Browse exercise library | US-006 | P0 |
| Search exercises | US-007 | P0 |
| Filter exercises | US-008 | P0 |
| Exercise detail view | US-009 | P0 |
| Create custom exercise | US-010 | P1 |
| Upload exercise media | US-011 | P2 |

### Routine Builder
| Feature | User Stories | Priority |
|---|---|---|
| View routines | US-012 | P0 |
| Create routine | US-013 | P0 |
| Edit routine | US-014 | P0 |
| Reorder exercises | US-015 | P1 |
| Superset grouping | US-016 | P2 |
| Delete routine | US-017 | P1 |

### Workout Logger
| Feature | User Stories | Priority |
|---|---|---|
| Start workout from routine | US-018 | P0 |
| Start empty workout | US-019 | P0 |
| Log sets (weight/reps/RPE) | US-020 | P0 |
| Add/remove sets | US-021 | P1 |
| Rest timer | US-022 | P0 |
| Finish workout | US-023 | P0 |
| Workout history | US-024 | P1 |

### Calendar
| Feature | User Stories | Priority |
|---|---|---|
| Monthly calendar view | US-025 | P0 |
| Day detail drill-down | US-026 | P0 |
| Weekly view | US-027 | P2 |

### Progress Analytics
| Feature | User Stories | Priority |
|---|---|---|
| Exercise progress chart | US-028 | P0 |
| Volume chart | US-029 | P1 |
| Estimated 1RM | US-030 | P1 |
| PR detection | US-031 | P0 |
| Muscle group volume | US-032 | P2 |
| Training frequency | US-033 | P1 |

### AI Assistant
| Feature | User Stories | Priority |
|---|---|---|
| AI command bar | US-034 | P1 |
| AI creates exercise | US-035 | P2 |
| AI navigation commands | US-036 | P2 |

### Settings
| Feature | User Stories | Priority |
|---|---|---|
| Language toggle (PL/EN) | US-037 | P1 |
| Theme toggle (dark/light) | US-038 | P1 |
| Rest timer default config | US-039 | P1 |
| Data export (JSON) | US-040 | P2 |

### Localization
| Feature | User Stories | Priority |
|---|---|---|
| Polish interface | US-041 | P1 |
| English interface | US-042 | P1 |

### Offline
| Feature | User Stories | Priority |
|---|---|---|
| Log workout offline | US-043 | P1 |
| Sync when online | US-044 | P1 |

---

## NOT IN SCOPE (Explicit Exclusions)

The following features are **explicitly excluded** from the MVP. They may be added in future phases but must go through full PRD and prioritization process.

### Health & Wearables
- Apple HealthKit / HealthKit synchronization
- Apple Watch companion app
- Heart rate monitoring integration
- Step counting integration
- Calorie burn calculation from health data

### Advanced AI
- AI workout-plan generation (only foundation/tool calls in MVP)
- AI progression suggestions
- AI exercise creation from natural language (only structured commands)
- AI coaching chat (only command-based interface)
- Natural language workout logging

### Social & Sharing
- Routine sharing via link
- Workout sharing to social media
- Community features
- Leaderboards
- Friend/follower system

### Coach & B2B
- Coach/client mode
- Trainer dashboard
- Client management
- B2B subscription tier

### Data Management
- CSV import/export (JSON export only in MVP)
- Progress photos (not in MVP scope)
- Body measurements tracking
- Body fat percentage tracking
- Workout notes (free-form per workout)

### Platform Features
- Widgets (iOS/Android)
- Live Activities
- Push notifications
- Rich notifications
- Spotlight search integration

### Monetization
- Subscription tier
- In-app purchases
- Premium analytics
- Premium AI usage

### Advanced Analytics
- Advanced charting (beyond load/volume/1RM)
- Predictive analytics
- Training load calculation (TRIMP)
- Recovery time estimation
- Plateau detection

---

## Scope Freeze Rules

1. **No new features** can be added to MVP without A0 approval
2. **Existing features** can be descoped (moved to post-MVP) with justification
3. **Bug fixes** are always in scope
4. **Performance improvements** are in scope if they don't add new features
5. **Scope changes** must be documented in ADR format

---

## Phase Mapping

| Phase | Features | Duration |
|---|---|---|
| Phase 0 — Discovery | PRD, design tokens, wireframes, schema draft | 1 week |
| Phase 1 — Foundation | Repo setup, auth, Supabase, CI, i18n | 1-2 weeks |
| Phase 2 — Exercises & Routines | Exercise library, custom exercises, routine builder | 2 weeks |
| Phase 3 — Workout Logger | Set logging, rest timer, offline, history | 2 weeks |
| Phase 4 — Analytics & Calendar | Charts, PRs, volume, 1RM, calendar, dashboard | 1-2 weeks |
| Phase 5 — AI | AI gateway, chat, exercise/routine generation | 1-2 weeks |
| Phase 6 — Hardening | E2E, security, performance, accessibility | 1-2 weeks |
| Phase 7 — Release | App Store assets, privacy docs, production rollout | 1 week |

**Total estimated MVP timeline: 10-14 weeks**
