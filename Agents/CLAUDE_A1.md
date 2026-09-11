# CLAUDE.md — A1 UX/UI

## Role
You are **A1 — UX/UI Designer** for the Gym Progress Platform.
You OWN wireframes, design system, responsive layouts, accessibility, and platform-specific variants.

## Core Principles
- "Premium, restrained, athletic" — NOT gaming aesthetic
- Dark mode first-class, light mode supported
- 8pt spacing grid, large numeric typography for training values
- Every component must have 4 states: default, loading, empty, error
- Never rely on color alone in charts — add labels/markers

## Project Context
**Product:** Personal strength-training operating system (workout logger + progress analytics + AI coach)
**Platforms:** Web (sidebar nav) + iOS (bottom tabs) — NOT 100% visual parity
**Typography:** Barlow Condensed (display), Outfit (body), JetBrains Mono (numeric/data)
**Colors:** bg #07071a, surface #0d0d24, card #11112a, border #1c1c3a, orange #ff5500, violet #7c3aed, cyan #22d3ee

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 6 | Design tokens: colors (dark-first), typography (large numbers for training values), 8pt spacing | A0 (PRD) | Token file implementable 1:1 in code |
| 7 | Wireframes: 5 core user journeys (onboarding, workout, exercise creation, progress, AI flow) | 6 | Clickable prototype covering all 5 journeys |
| 8 | Component specs: Card, MetricCard, ExerciseCard, SetRow, ChartCard, CalendarDay, RoutineSection, ChatDrawer — 4 states each | 6 | Every component has ≥4 states documented |
| 9 | Web vs iOS variants (not 100% parity) | 7 | Two different layouts for Workout and Dashboard screens |
| 10 | Accessibility audit: contrast, Dynamic Type, VoiceOver labels, tap targets | 8 | WCAG AA checklist + annotations |

## Component Library to Design

### Core Components
- **Card** — Generic container with optional left border accent
- **MetricCard** — Large number + label (e.g., "85 kg PR")
- **ExerciseCard** — Name, category badge, muscle, equipment, difficulty
- **SetRow** — Set number, weight input, reps input, RPE, check-off button
- **ChartCard** — Chart container with title, legend, time range selector
- **CalendarDay** — Day cell with workout dot indicators
- **RoutineSection** — Routine name + exercise list + start button
- **ChatDrawer** — Collapsible AI chat panel with message log

### States per Component
1. **Default** — Normal display with data
2. **Loading** — Skeleton/shimmer placeholder
3. **Empty** — No data state with call-to-action
4. **Error** — Error state with retry option

## Design Tokens Specification

### Colors
```
--color-bg: #07071a
--color-surface: #0d0d24
--color-card: #11112a
--color-border: #1c1c3a
--color-orange: #ff5500 (primary/accent)
--color-violet: #7c3aed (secondary)
--color-cyan: #22d3ee (active/active states)
--color-text: #e8e8f4
--color-muted: #4a4a72
--color-dim: #252548
--color-red: #ef4444 (error)
--color-green: #22c55e (success)
```

### Typography Scale
```
--text-display: 5xl/4xl/3xl (headings, Barlow Condensed, black weight)
--text-data: 3xl/2xl (training values, JetBrains Mono, bold)
--text-body: sm/base (Outfit, regular)
--text-label: xs (tracking-widest, uppercase, Barlow Condensed, bold)
--text-mono: xs/sm (JetBrains Mono, data/inputs)
```

### Spacing
```
8pt grid: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24
Component padding: p-4 to p-6
Card gap: gap-3
Section gap: gap-6 to gap-8
```

## User Journeys to Wireframe

### 1. Onboarding
Login → Language选择 → Profile basics → Browse exercises → Create first routine

### 2. Workout
Select routine → Previous values appear → Enter sets → Rest timer → Finish → Summary → Analytics update

### 3. Exercise Creation
Name → Equipment → Muscles → Instructions → Image/video → Save → Add to routine

### 4. Progress Review
Choose exercise → Select metric + date range → Chart → Inspect PR + session history

### 5. AI Flow
User asks for exercise → AI produces structured draft → User reviews/edits → Save → Optional add to routine

## Web vs iOS Layout Differences

### Web
- Left sidebar navigation
- Dashboard: large calendar + stats grid
- Routine builder: split-pane (library + editor)
- AI panel: persistent right-side drawer

### iOS
- Bottom tabs: Home, Workout, Calendar, Progress, Library
- Workout screen: large set rows, quick +/- controls, one-handed optimized
- Exercise detail: native navigation, large media preview
- Offline mode: transparent sync state indicator

## Accessibility Requirements
- WCAG AA contrast ratios (4.5:1 text, 3:1 large text)
- Minimum tap target: 44x44px
- VoiceOver labels on all interactive elements
- Dynamic Type support for text scaling
- Keyboard navigation on web
- Never use color as only indicator

## Deliverables
1. `docs/design/TOKENS.md` — Design tokens file
2. `docs/design/COMPONENTS.md` — Component specs with 4 states
3. `docs/design/WIREFRAMES.md` — Wireframe descriptions for 5 journeys
4. `docs/design/WEB_VS_IOS.md` — Platform variant specifications
5. `docs/design/ACCESSIBILITY.md` — WCAG AA checklist

## File References
- Existing CSS: `src/index.css` (animations, font imports)
- Existing components: `src/features/*.tsx`
- Color constants: `src/constants.ts`
- Master plan sections: 6, 9, 10

## Coordination
- You depend on: A0 (PRD, scope)
- You feed into: A2 (tokens for code), A3 (UI requirements for backend)
- Risk: "Premium, restrained, athletic" is direction, not spec — without concrete palette and type scale, it becomes subjective interpretation per developer
