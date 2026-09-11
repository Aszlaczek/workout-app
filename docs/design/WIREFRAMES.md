# Wireframes — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A1 — UX/UI Designer

---

## Journey 1: Onboarding (First Use)

### Screen 1.1: Login
```
┌─────────────────────────────────────────┐
│                                         │
│     [Animated gradient orbs bg]         │
│                                         │
│           GYM                           │
│         PROGRESS                        │
│     PROTOTYP / KLIKALNY DEMO            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ E-MAIL                          │    │
│  │ ┌─────────────────────────────┐ │    │
│  │ │ demo@gymapp.io              │ │    │
│  │ └─────────────────────────────┘ │    │
│  │                                │    │
│  │ HASŁO                          │    │
│  │ ┌─────────────────────────────┐ │    │
│  │ │ ••••••••                    │ │    │
│  │ └─────────────────────────────┘ │    │
│  │                                │    │
│  │ ┌─────────────────────────────┐ │    │
│  │ │      ZALOGUJ SIĘ            │ │    │
│  │ └─────────────────────────────┘ │    │
│  │                                │    │
│  │ ┌─────────────────────────────┐ │    │
│  │ │  [Apple] ZALOGUJ PRZEZ APPLE│ │    │
│  │ └─────────────────────────────┘ │    │
│  └─────────────────────────────────┘    │
│                                         │
│            Wersja 1.0.0                 │
└─────────────────────────────────────────┘

Flow: Login → Dashboard
```

### Screen 1.2: Dashboard (First Visit)
```
┌─────────────────────────────────────────┐
│ GP │ DASHBOARD CWICZENIA RUTYNY ...     │
├─────────────────────────────────────────┤
│                                         │
│ 11 WRZESNIA 2026                        │
│ DZIEN                                  │
│ ROBOCZY                                │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │  0   │ │  0   │ │  0   │ │  0   │   │
│ │TRENI.│ │SERIE │ │MINUTY│ │SERIA │   │
│ └──────┘ └──────┘ └──────┘ └──────┘   │
│                                         │
│ SZYBKI START                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ PUSH A   │ │ PULL A   │ │ LEGS A   │ │
│ │ 4 cw.    │ │ 4 cw.    │ │ 3 cw.    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ + NOWY TRENING (PUSTY)                 │
│                                         │
│ HISTORIA                               │
│ (empty state)                           │
└─────────────────────────────────────────┘
```

---

## Journey 2: Workout

### Screen 2.1: Select Routine
```
From Dashboard, tap "PUSH A" quick-start button
→ Navigates to Workout Logger with Push A exercises loaded
```

### Screen 2.2: Workout Logger
```
┌─────────────────────────────────────────┐
│ GP │ DASHBOARD ... TRENING ▪            │
├─────────────────────────────────────────┤
│                                         │
│ ▪ AKTYWNY TRENING                      │
│ PUSH A                                 │
│ 12 min · 0 serii                       │
│                              [ZAKONCZ]  │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ ► TIMER     1:30                │     │
│ │   ODPOCZYNEK    [60] [90] [120] │     │
│ └─────────────────────────────────┘     │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ BENCH PRESS                     │     │
│ │ #  KG    POWT.  RPE    ✓       │     │
│ │ 1  [80]  [5]    [8]    [○]     │     │
│ │ 2  [  ]  [5]    [ ]    [○]     │     │
│ │ 3  [  ]  [5]    [ ]    [○]     │     │
│ │ + DODAJ SERIE                   │     │
│ └─────────────────────────────────┘     │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ OVERHEAD PRESS                  │     │
│ │ #  KG    POWT.  RPE    ✓       │     │
│ │ 1  [52.5] [8]   [ ]    [○]     │     │
│ │ 2  [  ]   [8]   [ ]    [○]     │     │
│ │ 3  [  ]   [8]   [ ]    [○]     │     │
│ │ + DODAJ SERIE                   │     │
│ └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Screen 2.3: Set Completed
```
┌─────────────────────────────────────────┐
│ BENCH PRESS                     │
│ #  KG    POWT.  RPE    ✓       │
│ 1  80    5      8      ✓  ← done, dimmed│
│ 2  [80]  [5]    [ ]    [○]  ← active    │
│ 3  [  ]  [5]    [ ]    [○]             │
│ + DODAJ SERIE                   │
└─────────────────────────────────────────┘

Timer auto-starts after completing a set
```

### Screen 2.4: Finish Summary
```
┌─────────────────────────────────────────┐
│                                         │
│         TRENING ZAKONCZONY              │
│         Swietna robota!                 │
│                                         │
│ ┌──────────┐ ┌──────┐ ┌──────────┐     │
│ │   CZAS   │ │SERIE │ │ OBJETOSC │     │
│ │  58 min  │ │  12  │ │  12.5k   │     │
│ └──────────┘ └──────┘ └──────────┘     │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ BENCH PRESS                     │     │
│ │ 80x5 · 80x5 · 80x4             │     │
│ └─────────────────────────────────┘     │
│ ┌─────────────────────────────────┐     │
│ │ OVERHEAD PRESS                  │     │
│ │ 52.5x8 · 52.5x7                │     │
│ └─────────────────────────────────┘     │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │      ZAKONCZ I ZAPISZ           │     │
│ └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

---

## Journey 3: Exercise Creation

### Screen 3.1: Exercise Library
```
┌─────────────────────────────────────────┐
│ GP │ DASHBOARD CWICZENIA RUTYNY ...     │
├─────────────────────────────────────────┤
│                                         │
│ CWICZENIA                  [+ STWORZ]  │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ Szukaj cwiczenia...             │     │
│ └─────────────────────────────────┘     │
│                                         │
│ [WSZYSTKIE] [PUSH] [PULL] [LEGS] [CORE]│
│                                         │
│ [Wszystkie sprzet] [SZTANGA] [WYCIAG]  │
│                                         │
│ ┌─────────────────────┐ ┌────────────┐  │
│ │ Bench Press    PUSH │ │ Incline..  │  │
│ │ Klatka · Sztanga    │ │ Klatka ... │  │
│ │ ▪ INTERMEDIATE      │ │ ▪ INTERM.. │  │
│ └─────────────────────┘ └────────────┘  │
│ ┌─────────────────────┐ ┌────────────┐  │
│ │ Overhead Press PUSH │ │ Dip   PUSH │  │
│ │ Barki · Sztanga     │ │ Klatka ... │  │
│ │ ▪ INTERMEDIATE      │ │ ▪ ADVANCED │  │
│ └─────────────────────┘ └────────────┘  │
└─────────────────────────────────────────┘
```

### Screen 3.2: Create Custom Exercise
```
┌─────────────────────────────────────────┐
│ CWICZENIA                  [+ STWORZ]  │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ NOWE CWICZENIE                  │     │
│ │                                 │     │
│ │ NAZWA          KATEGORIA        │     │
│ │ [Bulgarian..]  [Push ▼]         │     │
│ │                                 │     │
│ │ MIESNIE       SPRZET            │     │
│ │ [Quads]        [Sztanga]        │     │
│ │                                 │     │
│ │ INSTRUKCJE (po 1 na linie)      │     │
│ │ ┌─────────────────────────────┐ │     │
│ │ │ Stand with lunge position   │ │     │
│ │ │ Lower back knee to floor    │ │     │
│ │ │ Drive through front heel    │ │     │
│ │ └─────────────────────────────┘ │     │
│ │                                 │     │
│ │ [DODAJ CWICZENIE]              │     │
│ └─────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Screen 3.3: Exercise Detail Modal
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Bench Press                [x]  │    │
│  │                                 │    │
│  │ [PUSH]  [Klatka]  [Sztanga]    │    │
│  │                                 │    │
│  │ INSTRUKCJE                      │    │
│  │ 1. Poloz sie na lawce           │    │
│  │ 2. Chwyc sztange szerzej niz..  │    │
│  │ 3. Opuszczaj sztange do klatki  │    │
│  │ 4. Wypchnij do pelnego wyprostu │    │
│  │                                 │    │
│  │ ─────────────────────────────── │    │
│  │ TRUDNOSC    SPRZET    TYP      │    │
│  │ INTERM.     Sztanga   BIBLIOT. │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

Modal overlay: rgba(0,0,0,0.7)
Slide-up animation
```

---

## Journey 4: Progress Review

### Screen 4.1: Progress View
```
┌─────────────────────────────────────────┐
│ GP │ ... PROGRES                        │
├─────────────────────────────────────────┤
│                                         │
│ PROGRES                                │
│                                         │
│ [BENCH] [OHP] [SQUAT] [DEADLIFT] ...  │
│                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │   PR     │ │ SREDNIA  │ │  TREND   │ │
│ │  85 kg   │ │  82 kg   │ │ +5 kg    │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│ [MAKS.OBCIAZ.] [OBJETOSC] [SZAC.1RM]  │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ BENCH PRESS — kg / SESJA        │     │
│ │                                 │     │
│ │     ·                           │     │
│ │    · ·    ·                     │     │
│ │   ·   · · · ·                   │     │
│ │  ·         · ·                  │     │
│ │ ·            ·                  │     │
│ │---PR 85kg---                    │     │
│ │─────────────────────────────────│     │
│ │ 09/01  09/05  09/09  09/12      │     │
│ └─────────────────────────────────┘     │
│                                         │
│ OBJETOSC WEDLUG MIESNI                 │
│ ┌─────────────────────────────────┐     │
│ │ Klatka        ████████████  4.2k│     │
│ │ Barki         ████████      2.8k│     │
│ │ Plecy         ██████        2.1k│     │
│ │ Nogi          ████          1.5k│     │
│ └─────────────────────────────────┘     │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │TYDZIEN│ │MIESIAC│ │RAZEM │            │
│ │  3    │ │  12   │ │  45  │            │
│ └──────┘ └──────┘ └──────┘            │
└─────────────────────────────────────────┘
```

---

## Journey 5: AI Flow

### Screen 5.1: AI Command Bar (Collapsed)
```
┌─────────────────────────────────────────┐
│ (any screen content)                    │
├─────────────────────────────────────────┤
│ ▲ AI   $ [input________________] [↵]   │
└─────────────────────────────────────────┘
```

### Screen 5.2: AI Command Bar (Expanded)
```
┌─────────────────────────────────────────┤
│ (any screen content)                    │
├─────────────────────────────────────────┤
│ ▼ AI                                   │
│ > dodaj ćwiczenie Bulgarian Split legs  │
│ Dodano cwiczenie: Bulgarian Split (legs)│
│ > nowy trening Push                     │
│ Rozpoczeto: Push A                      │
├─────────────────────────────────────────┤
│ ▼ AI   $ [input________________] [↵]   │
└─────────────────────────────────────────┘
```

### Screen 5.3: AI View (Full Page)
```
┌─────────────────────────────────────────┐
│ GP │ ... AI                             │
├─────────────────────────────────────────┤
│                                         │
│ ASYSTENT AI                            │
│ Uzyj paska ponizej aby wpisac komende.  │
│                                         │
│ ┌─────────────────────────────────┐     │
│ │ DOSTEPNE KOMENDY                │     │
│ │                                 │     │
│ │ dodaj ćwiczenie [nazwa] [cat]  │     │
│ │ nowy trening [nazwa rutyny]     │     │
│ │ dodaj serie [kg]x[reps]         │     │
│ │ zakoncz trening                 │     │
│ │ nowa rutyne [nazwa]             │     │
│ │ pokaz progres                   │     │
│ │ kalendarz | rutyny | dashboard  │     │
│ └─────────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Navigation Flow Summary

### Web
```
Login → Dashboard ←→ Exercises ←→ Routines ←→ Calendar
              ↕            ↕           ↕           ↕
           Workout      Progress      AI        Settings
```

### iOS
```
Login → [Home] [Workout] [Calendar] [Progress] [Library]
              ↕
           Workout Screen (full screen)
```
