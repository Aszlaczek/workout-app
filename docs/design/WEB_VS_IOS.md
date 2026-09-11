# Web vs iOS Layout Variants — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A1 — UX/UI Designer

---

## Design Philosophy

**NOT 100% visual parity.** Same design system, same components, but deliberately optimized information density per platform. Web leverages horizontal space; iOS leverages touch ergonomics.

---

## 1. Navigation

### Web: Top Sidebar
```
┌──────────────────────────────────────────────────────┐
│ GP │ DASHBOARD  CWICZENIA  RUTYNY  KALENDARZ  ...   │
├──────────────────────────────────────────────────────┤
│                                                      │
│                   [Page Content]                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│ ▲ AI  $ [input____________________________] [↵]     │
└──────────────────────────────────────────────────────┘
```

**Specs:**
- Height: 48px (h-12)
- Background: --color-surface
- Border bottom: 1px solid --color-border
- Logo "GP" left, nav links center, logout right
- Active link: --color-orange, bottom border 2px
- AI bar: fixed at bottom, collapsible

### iOS: Bottom Tabs
```
┌──────────────────────────────┐
│                              │
│       [Page Content]         │
│                              │
├──────────────────────────────┤
│ 🏠    💪    📅    📊    📚  │
│ Home  Workout Calendar Progress Library │
└──────────────────────────────┘
```

**Specs:**
- Height: 56px (tab bar) + safe area
- Background: --color-surface
- Border top: 1px solid --color-border
- 5 tabs: Home, Workout, Calendar, Progress, Library
- Active tab: --color-orange icon + label
- Inactive tab: --color-muted icon + label
- AI accessed via dedicated tab or long-press

---

## 2. Dashboard

### Web Dashboard
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ 11 WRZESNIA 2026                                     │
│ DZIEN                                                │
│ ROBOCZY                              [TRENING W TOKU]│
│                                                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │   5    │ │   42   │ │  285   │ │   3    │        │
│ │TRENI.  │ │SERIE   │ │MINUTY  │ │SERIA   │        │
│ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                      │
│ OBJETOSC TYGODNIA                                   │
│ ┌──────────────────────────────────────────────┐    │
│ │ 12.5k kg                                     │    │
│ │ 5 treningow w tym tygodniu                   │    │
│ └──────────────────────────────────────────────┘    │
│                                                      │
│ SZYBKI START          HISTORIA                      │
│ ┌────────┐ ┌────┐ ┌────┐  ┌────────────────────┐  │
│ │PUSH A  │ │Pull│ │Legs│  │ 09/09 Push A 58min │  │
│ │4 cw.   │ │A   │ │A   │  │ 09/07 Push A 60min │  │
│ └────────┘ └────┘ └────┘  │ 09/05 Legs A  70min │  │
│                            └────────────────────┘  │
│ REKORDY (PR)                                       │
│ ┌──────────────────────────────────────────────┐    │
│ │ Bench Press                    85 kg  09/09  │    │
│ │ Deadlift                      120 kg  09/03  │    │
│ │ Back Squat                    100 kg  09/05  │    │
│ └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

**Layout:** Two-column on desktop, single column on mobile
- Stats: 4-column grid
- Quick start + History: 2-column grid
- PRs: full-width list

### iOS Dashboard (Home Tab)
```
┌──────────────────────────────┐
│ DZIEN ROBOCZY                │
│ 11 wrzesnia 2026             │
│                              │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐│
│ │ 5  │ │ 42 │ │285 │ │ 3  ││
│ │TRE.│ │SER.│ │MIN.│ │SER.││
│ └────┘ └────┘ └────┘ └────┘│
│                              │
│ SZYBKI START                │
│ ┌──────────────────────────┐│
│ │ PUSH A          START >  ││
│ │ 4 cw. · 12 serii        ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ PULL A          START >  ││
│ │ 4 cw. · 12 serii        ││
│ └──────────────────────────┘│
│                              │
│ + NOWY TRENING               │
│                              │
│ OSTATNIE                     │
│ ┌──────────────────────────┐│
│ │ 09/09 Push A    58 min  ││
│ │ 09/07 Push A    60 min  ││
│ └──────────────────────────┘│
└──────────────────────────────┘
```

**Layout:** Single column, scrollable
- Stats: 2x2 grid (compact)
- Quick start: full-width cards
- History: simplified list

---

## 3. Workout Logger

### Web Workout
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ ▪ AKTYWNY TRENING                                    │
│ PUSH A                                  [ZAKONCZ]   │
│ 12 min · 0 serii                                    │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ ► 1:30  TIMER  [60s] [90s] [120s] [180s]      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ BENCH PRESS                                    │  │
│ │ #   KG      POWT.   RPE     ✓       ✕         │  │
│ │ 1   [80]    [5]     [8]     [○]     [ ]       │  │
│ │ 2   [  ]    [5]     [ ]     [○]     [ ]       │  │
│ │ 3   [  ]    [5]     [ ]     [○]     [ ]       │  │
│ │ + DODAJ SERIE                                  │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ OVERHEAD PRESS                                 │  │
│ │ #   KG      POWT.   RPE     ✓       ✕         │  │
│ │ 1   [52.5]  [8]     [ ]     [○]     [ ]       │  │
│ │ 2   [  ]    [8]     [ ]     [○]     [ ]       │  │
│ │ + DODAJ SERIE                                  │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Layout:** Centered single column, max-width 672px
- Full set row with all columns visible
- Delete button per set visible
- Timer with all preset buttons

### iOS Workout
```
┌──────────────────────────────┐
│ ▪ AKTYWNY TRENING     [×]   │
│ PUSH A                      │
│ 12 min · 0 serii            │
│                              │
│ ┌──────────────────────────┐│
│ │ ► 1:30      [60] [90]   ││
│ │             [120] [180]  ││
│ └──────────────────────────┘│
│                              │
│ BENCH PRESS                 │
│ ┌──────────────────────────┐│
│ │ 1  [ 80 ]kg  [ 5 ]rep  ✓││
│ │ 2  [    ]kg  [ 5 ]rep  ○││
│ │ 3  [    ]kg  [ 5 ]rep  ○││
│ │        + DODAJ SERIE     ││
│ └──────────────────────────┘│
│                              │
│ OVERHEAD PRESS              │
│ ┌──────────────────────────┐│
│ │ 1  [52.5]kg  [ 8 ]rep  ○││
│ │ 2  [    ]kg  [ 8 ]rep  ○││
│ │        + DODAJ SERIE     ││
│ └──────────────────────────┘│
│                              │
│ ┌──────────────────────────┐│
│ │        ZAKONCZ           ││
│ └──────────────────────────┘│
└──────────────────────────────┘
```

**Layout:** Full-width, optimized for one-handed use
- Larger set rows (min-height 48px)
- Quick +/- buttons for weight/reps (hidden on web, shown on iOS)
- Check-off button: 44x44px minimum tap target
- Timer collapsed by default (tap to expand)
- Finish button: full-width at bottom

---

## 4. Exercise Library

### Web Exercise Library
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ CWICZENIA                            [+ STWORZ]     │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Szukaj cwiczenia...                            │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ [WSZYSTKIE] [PUSH] [PULL] [LEGS] [CORE]            │
│                                                      │
│ [Wszystkie] [SZTANGA] [WYCIAG] [PORĘCZE] [MASZYNA] │
│                                                      │
│ ┌──────────────────┐ ┌──────────────────┐           │
│ │ Bench Press PUSH │ │ Incline Bench PUS│           │
│ │ Klatka · Sztanga │ │ Klatka · Sztanga │           │
│ │ ▪ INTERMEDIATE   │ │ ▪ INTERMEDIATE   │           │
│ └──────────────────┘ └──────────────────┘           │
│ ┌──────────────────┐ ┌──────────────────┐           │
│ │ OHP        PUSH │ │ Dip        PUSH  │           │
│ │ Barki · Sztanga │ │ Klatka · Poręcze │           │
│ │ ▪ INTERMEDIATE   │ │ ▪ ADVANCED       │           │
│ └──────────────────┘ └──────────────────┘           │
│ ┌──────────────────┐ ┌──────────────────┐           │
│ │ Tricep PD  PUSH │ │ Back Squat LEGS  │           │
│ │ Tricepsy · Wyciąg│ │ Nogi · Sztanga   │           │
│ │ ▪ BEGINNER       │ │ ▪ INTERMEDIATE   │           │
│ └──────────────────┘ └──────────────────┘           │
└──────────────────────────────────────────────────────┘
```

**Layout:** 2-column grid of exercise cards

### iOS Exercise Library (Library Tab)
```
┌──────────────────────────────┐
│ CWICZENIA                    │
│                              │
│ ┌──────────────────────────┐│
│ │ Szukaj cwiczenia...      ││
│ └──────────────────────────┘│
│                              │
│ [ALL] [PUSH] [PULL] [LEGS]  │
│                              │
│ ┌──────────────────────────┐│
│ │ Bench Press        PUSH  ││
│ │ Klatka · Sztanga         ││
│ │ ▪ INTERMEDIATE           ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ Incline Bench      PUSH  ││
│ │ Klatka · Sztanga         ││
│ │ ▪ INTERMEDIATE           ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ Overhead Press     PUSH  ││
│ │ Barki · Sztanga          ││
│ │ ▪ INTERMEDIATE           ││
│ └──────────────────────────┘│
│                              │
│ ┌──────────────────────────┐│
│ │ + STWORZ CWICZENIE       ││
│ └──────────────────────────┘│
└──────────────────────────────┘
```

**Layout:** Single column list, swipe to edit/delete

---

## 5. Calendar

### Web Calendar
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ KALENDARZ           [◀]  WRZESIEN 2026  [▶]         │
│                                                      │
│ Pn    Wt    Sr    Cz    Pt    So    Nd              │
│ ┌────┬────┬────┬────┬────┬────┬────┐                │
│ │    │    │ 1  │ 2  │ 3● │ 4  │ 5● │                │
│ │    │    │    │    │    │    │    │                │
│ ├────┼────┼────┼────┼────┼────┼────┤                │
│ │ 6  │ 7● │ 8  │ 9● │ 10 │ 11 │ 12 │                │
│ │    │    │    │    │    │ ◉  │    │                │
│ ├────┼────┼────┼────┼────┼────┼────┤                │
│ │ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │                │
│ └────┴────┴────┴────┴────┴────┴────┘                │
│                                                      │
│ ● Push  ● Pull  ● Legs  ◉ Today                     │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ 9 WRZESNIA 2026                          [x]   │  │
│ │                                                │  │
│ │ ● Push A                                       │  │
│ │   58 min · 12 serii                            │  │
│ │   bench: 85x5, 85x4, 82.5x5                   │  │
│ │   ohp: 55x8, 55x7                              │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

**Layout:** Centered, max-width 768px
- Large day cells (clickable)
- Color-coded workout dots
- Day detail panel slides in below calendar

### iOS Calendar (Calendar Tab)
```
┌──────────────────────────────┐
│ KALENDARZ                    │
│ [◀]     WRZIEN 2026     [▶] │
│                              │
│ Pn  Wt  Sr  Cz  Pt  So  Nd │
│ ┌──┬──┬──┬──┬──┬──┬──┐     │
│ │  │  │ 1│ 2│ 3│ 4│ 5│     │
│ │  │  │  │  │●│  │●│     │
│ ├──┼──┼──┼──┼──┼──┼──┤     │
│ │ 6│ 7│ 8│ 9│10│11│12│     │
│ │  │●│  │●│  │◉│  │     │
│ ├──┼──┼──┼──┼──┼──┼──┤     │
│ │13│14│15│16│17│18│19│     │
│ └──┴──┴──┴──┴──┴──┴──┘     │
│                              │
│ 9 WRZESNIA                  │
│ ┌──────────────────────────┐│
│ │ ● Push A     58 min     ││
│ │   bench 85x5, ohp 55x8 ││
│ └──────────────────────────┘│
└──────────────────────────────┘
```

**Layout:** Compact grid, scrollable day detail below

---

## 6. Routine Builder

### Web Routine Builder
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ RUTYNY                            [+ NOWA RUTYNA]   │
│                                                      │
│ ┌────────┐ ┌──────────────────────────────────────┐ │
│ │PUSH A■ │ │ PUSH A                    [EDYTUJ]   │ │
│ │        │ │                          [START]      │ │
│ │PULL A  │ │                                      │ │
│ │        │ │ 1. Bench Press          3 × 5        │ │
│ │LEGS A  │ │ 2. Overhead Press       3 × 8        │ │
│ │        │ │ 3. Weighted Dip         3 × 10       │ │
│ │        │ │ 4. Tricep Pushdown      3 × 12       │ │
│ │        │ │                                      │ │
│ │        │ │ 4 cwiczen · 12 serii                 │ │
│ └────────┘ └──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Layout:** Split-pane — sidebar list + detail panel

### iOS Routine Builder (Library Tab → Routines)
```
┌──────────────────────────────┐
│ RUTYNY           [+ NOWA]    │
│                              │
│ ┌──────────────────────────┐│
│ │ PUSH A          START >  ││
│ │ 4 cw. · 12 serii        ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ PULL A          START >  ││
│ │ 4 cw. · 12 serii        ││
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │ LEGS A          START >  ││
│ │ 3 cw. · 9 serii         ││
│ └──────────────────────────┘│
│                              │
│ Tap → detail view (push)    │
│ Swipe → edit/delete          │
└──────────────────────────────┘
```

**Layout:** Single column list, push navigation to detail

---

## 7. Settings

### Web Settings
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│ USTAWIENIA                                          │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Jezyk interfejsu                               │  │
│ │ [PL] [EN]                                      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Motyw                                         │  │
│ │ [CIEMNY] [JASNY]                              │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Domyslny czas odpoczynku                       │  │
│ │ [30s] [60s] [90s] [120s] [180s] [300s]        │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Konto                                         │  │
│ │ Email          demo@gymapp.io                  │  │
│ │ Plan           PRO (Demo)                      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌────────────────────────────────────────────────┐  │
│ │ Eksport danych                                │  │
│ │ [POBIERZ JSON]                                │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│            GYM PROGRESS                             │
│            Wersja 1.0.0                             │
│            React + Vite + Tailwind CSS              │
└──────────────────────────────────────────────────────┘
```

### iOS Settings (Profile/Settings tab)
```
┌──────────────────────────────┐
│ USTAWIENIA                   │
│                              │
│ Jezyk interfejsu            │
│ ┌──────────────────────────┐│
│ │ [PL]              [EN]   ││
│ └──────────────────────────┘│
│                              │
│ Motyw                       │
│ ┌──────────────────────────┐│
│ │ [CIEMNY]         [JASNY] ││
│ └──────────────────────────┘│
│                              │
│ Domyslny czas odpoczynku    │
│ ┌──────────────────────────┐│
│ │ [30s][60s][90s][120s]    ││
│ │ [180s][300s]             ││
│ └──────────────────────────┘│
│                              │
│ Konto                       │
│ demo@gymapp.io              │
│                              │
│ Eksport danych              │
│ [POBIERZ JSON]              │
│                              │
│ GYM PROGRESS v1.0.0         │
└──────────────────────────────┘
```

---

## 8. Breakpoint Strategy

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | Single column, bottom tabs (iOS style) |
| Tablet | 640-1024px | 2-column grid, collapsible sidebar |
| Desktop | > 1024px | Full sidebar, multi-column layouts |

### Implementation
```css
/* Mobile-first approach */
.component { /* mobile: single column */ }

@media (min-width: 640px) {
  .component { /* tablet: 2 columns */ }
}

@media (min-width: 1024px) {
  .component { /* desktop: sidebar + content */ }
}
```

---

## 9. Touch Target Requirements

| Platform | Minimum Target | Recommended |
|---|---|---|
| Web | 32×32px | 40×40px |
| iOS | 44×44px | 48×48px |

### Components Affected
- Navigation links: min 44px height on iOS
- Check-off buttons: 44×44px on iOS, 32×32px on web
- Set remove button: 44×44px on iOS (with confirmation)
- Timer presets: 44×44px on iOS
- Calendar day cells: 44×44px minimum
