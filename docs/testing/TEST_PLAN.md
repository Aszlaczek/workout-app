# Test Plan

## Overview

This document maps MVP features to test layers, ensuring comprehensive coverage across the Gym Progress Platform.

## Test Layers

### 1. Unit Tests (Vitest)

**Scope:** Domain calculations, validation schemas, utility functions, i18n keys

| Feature | Test File | What's Tested |
|---------|-----------|---------------|
| 1RM Calculation | `calculations/oneRM.test.ts` | Epley formula, Brzycki formula, safety bounds |
| Volume Calculation | `calculations/volume.test.ts` | Session volume, weekly volume, monthly aggregation |
| PR Detection | `calculations/pr.test.ts` | New PR detection, tie-breaking, edge cases |
| Streak Calculation | `calculations/streak.test.ts` | Daily streaks, gap handling, current streak |
| Date Grouping | `calculations/dates.test.ts` | Week grouping, month grouping, timezone handling |
| Exercise Validation | `validation/exercise.test.ts` | Schema validation, required fields, enums |
| Routine Validation | `validation/routine.test.ts` | Schema validation, exercise references |
| Workout Validation | `validation/workout.test.ts` | Schema validation, set completion |
| i18n Keys | `i18n/keys.test.ts` | All keys exist in PL and EN |
| Service Layer | `services/*.test.ts` | CRUD operations, search, localStorage fallback |

### 2. Component Tests (React Testing Library)

**Scope:** UI component rendering, interaction, state changes

| Component | Test File | What's Tested |
|-----------|-----------|---------------|
| SetRow | `SetRow.test.tsx` | Input handling, weight/reps entry, completion toggle |
| ExerciseCard | `ExerciseCard.test.tsx` | Display, expand/collapse, navigation |
| CalendarDay | `CalendarDay.test.tsx` | Workout indicators, click handling, today highlight |
| ChartCard | `ChartCard.test.tsx` | Data rendering, filter changes, loading state |
| RoutineSection | `RoutineSection.test.tsx` | Exercise list, start workout, edit mode |
| AiDraftReview | `AiDraftReview.test.tsx` | Draft display, edit fields, save/cancel |
| Login | `Login.test.tsx` | Form submission, validation, error display |
| Nav | `Nav.test.tsx` | Navigation items, active state, logout |

### 3. Integration Tests

**Scope:** Multi-step user flows across services

| Flow | Test File | What's Tested |
|------|-----------|---------------|
| Auth Flow | `auth-flow.test.ts` | Login → session → logout → session restore |
| Workout Flow | `workout-flow.test.ts` | Routine → start → sets → finish → save |
| Exercise CRUD | `exercise-crud.test.ts` | Create → edit → delete → search |
| Progress Update | `progress-update.test.ts` | Workout → PR detection → chart update |
| Settings Flow | `settings-flow.test.ts` | Change language → persist → reload |
| Routine Flow | `routine-flow.test.ts` | Create routine → add exercises → start workout |

### 4. E2E Tests (Playwright)

**Scope:** Full user journeys through the browser

| Journey | Test File | What's Tested |
|---------|-----------|---------------|
| Login | `auth.spec.ts` | Login form, session persistence, logout |
| Dashboard | `dashboard.spec.ts` | Stats display, quick start, history |
| Exercises | `exercises.spec.ts` | Library view, search, create custom |
| Routines | `routines.spec.ts` | Builder, add exercises, start workout |
| Workout | `workout.spec.ts` | Active workout, set entry, rest timer, finish |
| Calendar | `calendar.spec.ts` | Month navigation, day detail, workout markers |
| Progress | `progress.spec.ts` | Charts, PR display, exercise selection |
| Settings | `settings.spec.ts` | Language switch, theme, data export |

### 5. Security Tests (RLS)

**Scope:** Row Level Security positive + negative tests

| Table | Test File | Positive Test | Negative Test |
|-------|-----------|---------------|---------------|
| profiles | `rls-profiles.test.ts` | User reads own profile | User cannot read other profiles |
| exercises | `rls-exercises.test.ts` | User reads system exercises | User cannot read others' custom exercises |
| routines | `rls-routines.test.ts` | User CRUDs own routines | User cannot read others' routines |
| workouts | `rls-workouts.test.ts` | User reads own workouts | User cannot read others' workouts |
| sets | `rls-sets.test.ts` | User reads sets through own workout | User cannot read others' sets |
| measurements | `rls-measurements.test.ts` | User reads own measurements | User cannot read others' measurements |
| ai_conversations | `rls-ai.test.ts` | User reads own conversations | User cannot read others' conversations |
| storage | `signed-urls.test.ts` | Signed URL works | Expired URL fails |

### 6. Performance Tests

**Scope:** Render performance, search latency, data handling

| Metric | Test File | Threshold |
|--------|-----------|-----------|
| Chart Render | `chart-render.test.ts` | 1000+ data points < 2s |
| Exercise Search | `exercise-search.test.ts` | 500+ exercises filter < 200ms |
| Workout Load | `workout-load.test.ts` | Active workout loads < 500ms |
| Cold Start | `cold-start.test.ts` | App ready < 3s |

## Coverage Targets

| Layer | Minimum Coverage |
|-------|-----------------|
| Unit Tests | 80% |
| Component Tests | 70% |
| Integration Tests | Main happy paths |
| E2E Tests | Critical user journeys |
| Security Tests | 100% of RLS tables |

## Test Data

### Seed Data
- 18 exercises (4 push, 5 pull, 4 legs, 3 core, 2 misc)
- 3 routines (Push A, Pull A, Legs A)
- 5 workouts with varied dates
- Default settings (PL, dark, 90s rest)

### Mock Data
- `mockExercise` — Valid exercise object
- `mockRoutine` — Valid routine with exercises
- `mockWorkout` — Completed workout with sets
- `mockUser` — Authenticated user session

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Component tests only
npm run test:component

# Integration tests
npm run test:integration

# E2E tests (requires running app)
npm run test:e2e

# Security tests (requires Supabase)
npm run test:security

# Coverage report
npm run test:coverage
```

## CI Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Nightly security scan

Failing tests block merge.
