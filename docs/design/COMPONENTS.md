# Component Specifications — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A1 — UX/UI Designer

---

## Component States

Every component MUST implement 4 states:
1. **Default** — Normal display with data
2. **Loading** — Skeleton/shimmer placeholder
3. **Empty** — No data state with call-to-action
4. **Error** — Error state with retry option

---

## 1. Card

**Purpose:** Generic container for grouping content
**Variants:** Default, with left accent, interactive (clickable)

### Default State
```
┌─────────────────────────────────┐
│ [Content here]                  │
│                                 │
└─────────────────────────────────┘
Background: #11112a
Border: 1px solid #1c1c3a
Padding: 16-24px
```

### With Left Accent
```
┃┌────────────────────────────────┐
┃│ [Content here]                 │
┃│                                │
┃└────────────────────────────────┘
Left border: 3px solid [accent color]
Accent colors: orange (push/default), violet (pull/secondary), cyan (legs/active)
```

### Loading State
```
┌─────────────────────────────────┐
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ████████░░░░░░░░░░░░░░░░░░░░░░ │
│ █░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
Skeleton bars with shimmer animation
Bar color: #252548
```

### Empty State
```
┌─────────────────────────────────┐
│                                 │
│         [Icon]                  │
│    Brak danych                  │
│   [CTA Button]                  │
│                                 │
└─────────────────────────────────┘
Centered content
Icon: muted color, 32px
Text: --color-muted, --text-body-sm
Button: outlined, orange on hover
```

### Error State
```
┌─────────────────────────────────┐
│                                 │
│         [!] Icon                │
│    Wystapil blad               │
│   [Sprobuj ponownie]            │
│                                 │
└─────────────────────────────────┘
Icon: --color-red, 32px
Text: --color-red
Button: outlined, red border
```

### Props
```typescript
interface CardProps {
  children: React.ReactNode;
  accent?: "orange" | "violet" | "cyan" | "green" | "red";
  interactive?: boolean;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}
```

---

## 2. MetricCard

**Purpose:** Display a single large metric value with label
**Variants:** Default, with trend indicator, with comparison

### Default State
```
┌─────────────────────────────────┐
│ TRENINGI                        │
│ 12                              │
└─────────────────────────────────┘
Label: --text-label-sm, --color-muted, uppercase
Value: --text-data-lg, --color-text, bold
Top border: 2px solid --color-orange
```

### With Trend
```
┌─────────────────────────────────┐
│ TREND                           │
│ +5.2 kg                         │
└─────────────────────────────────┘
Trend positive: --color-cyan
Trend negative: --color-red
Trend neutral: --color-muted
```

### Loading State
```
┌─────────────────────────────────┐
│ ██████░░░░░░                    │
│ ████████████░░░░                │
└─────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────┐
│ METRYKA                         │
│ —                               │
└─────────────────────────────────┘
Dash character instead of value
```

### Props
```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  accent?: "orange" | "violet" | "cyan" | "green" | "red";
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}
```

---

## 3. ExerciseCard

**Purpose:** Display exercise info in a list/grid
**Variants:** Default, selected, compact

### Default State
```
┌─────────────────────────────────┐
│ Bench Press              PUSH   │
│ Klatka · Sztanga                │
│ ▪ INTERMEDIATE                  │
└─────────────────────────────────┘
Left border: 3px solid [category color]
  Push: orange, Pull: violet, Legs: cyan, Core: green
Name: --text-body-lg, --color-text
Muscle/Equipment: --text-mono-sm, --color-muted
Difficulty badge: colored text on dim background
```

### Selected State
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Bench Press              PUSH   ┃
┃ Klatka · Sztanga                ┃
┃ ▪ INTERMEDIATE                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Border: 2px solid --color-orange
Background: slightly lighter
```

### Loading State
```
┌─────────────────────────────────┐
│ ████████████████░░░░  ██████░░  │
│ ████████████░░░░░░░░░░░░░░░░░░  │
│ ▪ ████████░░                    │
└─────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────┐
│                                 │
│      Brak cwiczen               │
│  [Stworz nowe cwiczenie]        │
│                                 │
└─────────────────────────────────┘
```

### Props
```typescript
interface ExerciseCardProps {
  exercise: {
    id: string;
    name: string;
    category: "push" | "pull" | "legs" | "core";
    muscle: string;
    equipment: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    isCustom?: boolean;
  };
  selected?: boolean;
  onClick?: () => void;
}
```

---

## 4. SetRow

**Purpose:** Display and edit a single workout set
**Variants:** Default, completed, active, previous

### Default State (Not Completed)
```
┌───┬──────┬──────┬──────┬─────┐
│ 1 │  80  │  5   │  8   │  ○  │
│   │  kg  │ rep  │ RPE  │     │
└───┴──────┴──────┴──────┴─────┘
Set number: --text-mono-sm, --color-muted
Inputs: --color-surface bg, --color-border border
Check button: circle outline, --color-muted
```

### Completed State
```
┌───┬──────┬──────┬──────┬─────┐
│ 1 │  80  │  5   │  8   │  ✓  │
│   │  kg  │ rep  │ RPE  │     │
└───┴──────┴──────┴──────┴─────┘
Row: opacity 50%
Check button: filled --color-orange, white checkmark
```

### Active State (Being Edited)
```
┌───┬──────┬──────┬──────┬─────┐
│ 1 │  80  │  5   │  8   │  ○  │
│   │  kg  │ rep  │ RPE  │     │
└───┴──────┴──────┴──────┴─────┘
Focused input: border --color-violet
```

### Previous Values (Reference)
```
     Poprzednio: 82.5 kg × 5
┌───┬──────┬──────┬──────┬─────┐
│ 1 │      │  5   │      │  ○  │
└───┴──────┴──────┴──────┴─────┘
Reference text above: --text-mono-xs, --color-muted
Inputs pre-filled with previous values
```

### Loading State
```
┌───┬──────┬──────┬──────┬─────┐
│ █ │ ████ │ ████ │ ████ │ ███ │
└───┴──────┴──────┴──────┴─────┘
```

### Props
```typescript
interface SetRowProps {
  setNumber: number;
  weight: string;
  reps: string;
  rpe: string;
  done: boolean;
  previousWeight?: number;
  previousReps?: number;
  onWeightChange: (val: string) => void;
  onRepsChange: (val: string) => void;
  onRpeChange: (val: string) => void;
  onToggleDone: () => void;
  onRemove?: () => void;
}
```

---

## 5. ChartCard

**Purpose:** Container for progress charts with controls
**Variants:** Line chart, bar chart, empty

### Default State (Line Chart)
```
┌─────────────────────────────────┐
│ BENCH PRESS — kg / SESJA        │
│                                 │
│     ·                           │
│    · ·    ·                     │
│   ·   · · · ·                   │
│  ·         · ·                  │
│ ·            ·                  │
│─────────────────────────────────│
│ 09/01  09/05  09/09  09/12      │
└─────────────────────────────────┘
Title: --text-label-sm, --color-muted
Chart: --color-orange line, --color-dim grid
Axes: --color-muted labels, --color-border lines
Tooltip: --color-surface bg, --color-border border
```

### Bar Chart Variant
```
┌─────────────────────────────────┐
│ OBJETOSC — kg-rep / SESJA       │
│                                 │
│     ████                        │
│     ████  ████                  │
│  █  ████  ████                  │
│  █  ████  ████  ████            │
│  █  ████  ████  ████            │
│─────────────────────────────────│
│ 09/01  09/05  09/09  09/12      │
└─────────────────────────────────┘
Bars: --color-violet fill
```

### PR Reference Line
```
--- PR 85kg --- (dashed violet line)
```

### Loading State
```
┌─────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░ │
│                                 │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────┐
│                                 │
│    Za malo danych               │
│  ukoncz wiecej treningow        │
│    z tym cwiczeniem.            │
│                                 │
└─────────────────────────────────┘
```

### Props
```typescript
interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataKey: string;
  label: string;
  color?: string;
  showPR?: boolean;
  prValue?: number;
  type?: "line" | "bar";
  loading?: boolean;
}
```

---

## 6. CalendarDay

**Purpose:** Day cell in calendar grid
**Variants:** Empty, with workouts, today, selected

### Empty State
```
┌─────────┐
│   15    │
│         │
└─────────┘
Day number: --text-mono-sm, --color-muted
Background: transparent
```

### With Workouts
```
┌─────────┐
│   15    │
│  ● ●    │
└─────────┘
Dots: 8px circles, color-coded by routine type
  Push: orange, Pull: violet, Legs: cyan
Max 3 dots shown
```

### Today
```
┏━━━━━━━━━┓
┃   15    ┃
┃  ● ●    ┃
┗━━━━━━━━━┛
Border: 2px solid --color-orange
Day number: --color-orange
```

### Selected
```
┏━━━━━━━━━┓
┃   15    ┃
┃  ● ●    ┃
┗━━━━━━━━━┛
Background: --color-card
Border: 2px solid --color-orange
```

### Loading State
```
┌─────────┐
│  ███    │
│  █      │
└─────────┘
```

### Props
```typescript
interface CalendarDayProps {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  workouts: Workout[];
  onClick: () => void;
}
```

---

## 7. RoutineSection

**Purpose:** Display routine info with exercises and start action
**Variants:** Default, expanded, compact

### Default State
```
┌─────────────────────────────────┐
│ PUSH A                    ▶    │
│ 4 cw. · 12 serii              │
└─────────────────────────────────┘
Name: --text-display-sm, --color-text
Stats: --text-mono-sm, --color-muted
Right arrow indicates expandable
```

### Expanded State
```
┌─────────────────────────────────┐
│ PUSH A                    ▼    │
│ 4 cw. · 12 serii              │
├─────────────────────────────────┤
│ 1. Bench Press      3 × 5      │
│ 2. Overhead Press   3 × 8      │
│ 3. Weighted Dip     3 × 10     │
│ 4. Tricep Pushdown  3 × 12     │
├─────────────────────────────────┤
│          [ START ]              │
└─────────────────────────────────┘
Exercise list: --text-body-sm
Sets/reps: --text-mono-sm, --color-orange
Start button: full-width, --color-orange bg
```

### Compact State (Dashboard)
```
┌─────────────────────────────────┐
│ PUSH A                         │
│ 4 cw. · 12 serii              │
└─────────────────────────────────┘
No expand, tap starts workout
```

### Loading State
```
┌─────────────────────────────────┐
│ ████████████░░░░░░░░  ██████░░  │
│ ████████████░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────┐
│                                 │
│      Brak rutyn                 │
│   [Stworz nowa rutyne]          │
│                                 │
└─────────────────────────────────┘
```

### Props
```typescript
interface RoutineSectionProps {
  routine: {
    id: string;
    name: string;
    exercises: RoutineExercise[];
  };
  expanded?: boolean;
  onStart: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

---

## 8. ChatDrawer

**Purpose:** Collapsible AI chat panel
**Variants:** Collapsed, expanded, with messages

### Collapsed State
```
┌─────────────────────────────────┐
│ ▲ AI                           │
└─────────────────────────────────┘
Height: 40px
Background: --color-surface
Border top: 1px solid --color-border
Toggle button: --color-orange
```

### Expanded State (Empty)
```
┌─────────────────────────────────┐
│ ▼ AI                           │
├─────────────────────────────────┤
│                                 │
│ Wpisz komende — np.             │
│ `dodaj ćwiczenie Farmer Walk`   │
│                                 │
├─────────────────────────────────┤
│ $ [input field____________] [↵] │
└─────────────────────────────────┘
Message area: max-height 160px, scrollable
Input: --color-surface bg
Send button: --color-orange
```

### With Messages
```
┌─────────────────────────────────┐
│ ▼ AI                           │
├─────────────────────────────────┤
│ > dodaj ćwiczenie Squat legs    │
│ Dodano cwiczenie: Squat (legs)  │
│ > nowy trening Push             │
│ Rozpoczeto: Push A              │
├─────────────────────────────────┤
│ $ [input field____________] [↵] │
└─────────────────────────────────┘
User messages: --color-cyan, prefix ">"
System messages: --color-muted
Scrollable message area
```

### Loading State
```
┌─────────────────────────────────┐
│ ▼ AI                           │
├─────────────────────────────────┤
│ ████░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

### Props
```typescript
interface ChatDrawerProps {
  messages: { role: "user" | "system"; text: string }[];
  onSend: (message: string) => void;
  loading?: boolean;
}
```

---

## Component Matrix

| Component | Default | Loading | Empty | Error |
|---|---|---|---|---|
| Card | ✓ | ✓ | ✓ | ✓ |
| MetricCard | ✓ | ✓ | ✓ | — |
| ExerciseCard | ✓ | ✓ | ✓ | ✓ |
| SetRow | ✓ | ✓ | — | — |
| ChartCard | ✓ | ✓ | ✓ | ✓ |
| CalendarDay | ✓ | ✓ | — | — |
| RoutineSection | ✓ | ✓ | ✓ | ✓ |
| ChatDrawer | ✓ | ✓ | ✓ | — |

**Legend:** ✓ = Required, — = Not applicable (error state handled by parent)
