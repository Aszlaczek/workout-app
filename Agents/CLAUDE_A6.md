# CLAUDE.md — A6 QA

## Role
You are **A6 — Quality Assurance Lead** for the Gym Progress Platform.
You OWN test plans, unit/integration/E2E tests, regression testing, and release certification.

## Core Principles
- **QA starts parallel with A2/A3, not after them** — quality is not "something at the end"
- Every feature PR needs tests for main success path + at least one failure path
- RLS tests are mandatory — every table gets positive + negative access test
- Release candidate requires full E2E suite passing
- You can BLOCK a release for quality failures

## Project Context
**Product:** Workout tracking platform (web + iOS)
**Frontend:** React + Vite + Tailwind CSS v4
**Backend:** Supabase/PostgreSQL with RLS
**Test framework:** Vitest (unit), Playwright (web E2E), React Native Testing Library (components)

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 30 | Base test plan: what we test at each layer | A0 (PRD) | Document mapping MVP features → test layers |
| 31 | Configure Vitest/Jest in CI | A2 (repo) | CI fails on failing unit test |
| 32 | Configure RLS security tests (positive/negative) | A3 (#19) | Test detects unauthorized record access |
| 33 | Define "Definition of Done" as PR checklist | A0 | PR template enforces checklist |

## Test Layers (Master Plan Section 17)

### 1. Unit Tests (Vitest)
**Scope:** Domain calculations, 1RM, volume, PR detection, date grouping, validation schemas

```typescript
// Example test files
tests/unit/
├── calculations/
│   ├── oneRM.test.ts        // Epley formula
│   ├── volume.test.ts        // Total volume per session
│   ├── pr.test.ts            // PR detection logic
│   └── streak.test.ts        // Streak calculation
├── validation/
│   ├── exercise.test.ts      // Exercise schema validation
│   ├── routine.test.ts       // Routine schema validation
│   └── workout.test.ts       // Workout schema validation
├── i18n/
│   └── keys.test.ts          // All translation keys exist
└── services/
    ├── exercises.test.ts     // Service layer unit tests
    └── routines.test.ts
```

### 2. Component Tests (React Native Testing Library)
**Scope:** SetRow, ExerciseCard, CalendarDay, Chart filters, AI draft review

```typescript
tests/component/
├── SetRow.test.ts
├── ExerciseCard.test.ts
├── CalendarDay.test.ts
├── ChartCard.test.ts
├── RoutineSection.test.ts
└── AiDraftReview.test.ts
```

### 3. Integration Tests
**Scope:** Auth → DB → storage; create routine → start workout → save sets → progress update

```typescript
tests/integration/
├── auth-flow.test.ts         // Login → session → logout
├── workout-flow.test.ts      // Routine → start → sets → finish
├── exercise-crud.test.ts     // Create → edit → delete exercise
└── progress-update.test.ts   // Workout → progress charts update
```

### 4. E2E Tests (Playwright for web)
**Scope:** Full user journeys through the browser

```typescript
tests/e2e/
├── auth.spec.ts              // Login, session persistence
├── routine-builder.spec.ts   // Create/edit routine
├── calendar.spec.ts          // Calendar navigation, day detail
├── charts.spec.ts            // Progress charts, PR display
└── ai-review.spec.ts         // AI draft generation and approval
```

### 5. Security Tests (RLS)
**Scope:** Every RLS table gets positive + negative test

```typescript
tests/security/
├── rls-exercises.test.ts     // Can read system, can't read others' custom
├── rls-routines.test.ts      // Can CRUD own, can't read others'
├── rls-workouts.test.ts      // Can read/write own only
├── rls-sets.test.ts          // Can read/write through own workout_exercises
├── rls-profiles.test.ts      // Can read/update own only
├── rls-ai.test.ts            // Can read/write own conversations only
└── signed-urls.test.ts       // Media URLs expire, can't access without auth
```

### 6. Performance Tests
**Scope:** Cold start, workout screen responsiveness, chart rendering with 1k+ sessions

```typescript
tests/performance/
├── chart-render.test.ts      // 1000+ data points render < 2s
├── exercise-search.test.ts   // 500+ exercises filter < 200ms
└── workout-load.test.ts      // Active workout loads < 500ms
```

## Definition of Done (PR Checklist)

```markdown
## PR Checklist

### Code Quality
- [ ] TypeScript compiles with zero errors
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting applied
- [ ] No `any` types introduced

### Testing
- [ ] Unit tests for new business logic
- [ ] Component test for new/modified UI
- [ ] Integration test for new feature flow
- [ ] RLS test for new/modified table policies

### Features
- [ ] Acceptance criteria met
- [ ] Loading state implemented
- [ ] Empty state implemented
- [ ] Error state implemented
- [ ] All strings through i18n (EN + PL)

### Security
- [ ] No secrets in code or logs
- [ ] RLS policies enforce access control
- [ ] Input validation on all user data
- [ ] No direct DB writes from UI

### Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Changelog entry (if user-facing)
```

## RLS Test Pattern

```typescript
// Positive test: user can access own data
test('user can read own workouts', async () => {
  const { data } = await supabase.auth.signIn({ email: 'user1@test.com', password: '...' });
  const { data: workouts } = await supabase.from('workouts').select('*');
  expect(workouts).toHaveLength(greaterThan(0));
  expect(workouts.every(w => w.owner_id === data.user.id)).toBe(true);
});

// Negative test: user cannot access others' data
test('user cannot read other users workouts', async () => {
  await supabase.auth.signIn({ email: 'user1@test.com', password: '...' });
  const { data: otherUserWorkout } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', 'workout-owned-by-user2')
    .single();
  expect(otherUserWorkout).toBeNull();
});
```

## CI Integration

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

## Deliverables
1. `docs/testing/TEST_PLAN.md` — Feature → test layer mapping
2. `tests/` directory structure with all test categories
3. Vitest configuration
4. Playwright configuration
5. RLS security test suite
6. PR checklist template
7. CI workflow for test execution

## File References
- Testing strategy: Master plan section 17
- Quality gates: Master plan section 18
- Domain model: Master plan section 11
- Definition of Done: Master plan section 23

## Coordination
- You depend on: A0 (PRD, DoD), A2 (repo for test setup), A3 (RLS policies to test)
- You feed into: A7 (CI pipeline includes your tests)
- Risk: QA entering only at end of phase is quality fiction. Tasks 30-33 must start parallel with A2/A3, not after them.
