# Design Tokens — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A1 — UX/UI Designer
**Status:** Active — implementable 1:1 in code

---

## Philosophy

Premium, restrained, athletic. NOT gaming. Dark mode first-class. Large numeric typography for training data. 8pt spacing grid throughout.

---

## 1. Color Palette

### Core Colors

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--color-bg` | `#07071a` | 7, 7, 26 | App background, deepest layer |
| `--color-surface` | `#0d0d24` | 13, 13, 36 | Nav bars, input backgrounds, elevated surfaces |
| `--color-card` | `#11112a` | 17, 17, 42 | Cards, panels, content containers |
| `--color-border` | `#1c1c3a` | 28, 28, 58 | Default borders, dividers |
| `--color-dim` | `#252548` | 37, 37, 72 | Subtle borders, disabled states, inactive indicators |

### Brand Colors

| Token | Hex | RGB | Usage | Contrast on #07071a |
|---|---|---|---|---|
| `--color-orange` | `#ff5500` | 255, 85, 0 | Primary accent, CTAs, active nav, PR indicators | 5.2:1 |
| `--color-violet` | `#7c3aed` | 124, 58, 237 | Secondary accent, superset badges, chart secondary | 4.8:1 |
| `--color-cyan` | `#22d3ee` | 34, 211, 238 | Active states, links, pulse indicators | 9.1:1 |

### Semantic Colors

| Token | Hex | RGB | Usage | Contrast on #07071a |
|---|---|---|---|---|
| `--color-text` | `#e8e8f4` | 232, 232, 244 | Primary text, headings | 15.8:1 |
| `--color-muted` | `#4a4a72` | 74, 74, 114 | Secondary text, labels, timestamps | 3.2:1 |
| `--color-red` | `#ef4444` | 239, 68, 68 | Errors, delete actions, danger | 4.6:1 |
| `--color-green` | `#22c55e` | 34, 197, 94 | Success, completion, streaks | 7.4:1 |

### Category Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-push` | `#ff5500` | Push exercises, orange accent |
| `--color-pull` | `#7c3aed` | Pull exercises, violet accent |
| `--color-legs` | `#22d3ee` | Leg exercises, cyan accent |
| `--color-core` | `#22c55e` | Core exercises, green accent |

### Light Mode Overrides

| Token | Light Value | Notes |
|---|---|---|
| `--color-bg` | `#f8f9fa` | Light gray background |
| `--color-surface` | `#ffffff` | White surfaces |
| `--color-card` | `#ffffff` | White cards |
| `--color-border` | `#e2e8f0` | Light borders |
| `--color-text` | `#1a1a2e` | Dark text |
| `--color-muted` | `#64748b` | Muted text |

---

## 2. Typography

### Font Families

| Token | Font | Fallback | Usage |
|---|---|---|---|
| `--font-display` | Barlow Condensed | sans-serif | Headings, nav labels, section titles |
| `--font-body` | Outfit | sans-serif | Body text, descriptions |
| `--font-mono` | JetBrains Mono | monospace | Training data, inputs, code |

### Font Weights

| Token | Weight | Usage |
|---|---|---|
| `--weight-light` | 300 | Outfit light (rare) |
| `--weight-regular` | 400 | Body text |
| `--weight-medium` | 500 | Emphasized body |
| `--weight-semibold` | 600 | Subheadings |
| `--weight-bold` | 700 | Section titles, labels |
| `--weight-extrabold` | 800 | Large headings |
| `--weight-black` | 900 | Display headings, hero text |

### Type Scale

| Token | Size | Line Height | Font | Weight | Usage |
|---|---|---|---|---|---|
| `--text-display-lg` | 3rem (48px) | 1.1 | Barlow Condensed | 900 | Hero headings ("DZIEN ROBOCZY") |
| `--text-display-md` | 2.25rem (36px) | 1.15 | Barlow Condensed | 900 | Page titles ("RUTYNY") |
| `--text-display-sm` | 1.875rem (30px) | 1.2 | Barlow Condensed | 900 | Card titles, routine names |
| `--text-data-lg` | 1.875rem (30px) | 1.2 | JetBrains Mono | 700 | Large metric values ("85 kg") |
| `--text-data-md` | 1.5rem (24px) | 1.3 | JetBrains Mono | 700 | Chart values, PR numbers |
| `--text-data-sm` | 1.125rem (18px) | 1.4 | JetBrains Mono | 600 | Set weights, timer display |
| `--text-body-lg` | 1rem (16px) | 1.5 | Outfit | 400 | Body text, descriptions |
| `--text-body-sm` | 0.875rem (14px) | 1.5 | Outfit | 400 | Secondary body text |
| `--text-label-lg` | 0.75rem (12px) | 1.4 | Barlow Condensed | 700 | Section headers ("TRENINGI") |
| `--text-label-sm` | 0.6875rem (11px) | 1.4 | Barlow Condensed | 700 | Nav items, badges, chips |
| `--text-mono-lg` | 0.875rem (14px) | 1.5 | JetBrains Mono | 400 | Input values, data display |
| `--text-mono-sm` | 0.75rem (12px) | 1.5 | JetBrains Mono | 400 | Timestamps, small data |

### Text Transform Rules

| Context | Transform | Example |
|---|---|---|
| Nav labels | UPPERCASE | DASHBOARD, RUTYNY |
| Section titles | UPPERCASE | TRENINGI, HISTORIA |
| Button labels | UPPERCASE | START, ZALOGUJ |
| Exercise names | Title Case | Bench Press, Back Squat |
| Body text | Sentence case | 3 treningi w tym tygodniu |
| Timestamps | Lowercase | 12 min · 5 serii |

---

## 3. Spacing

### 8pt Grid

| Token | Value | Usage |
|---|---|---|
| `--space-0` | 0px | Reset |
| `--space-0.5` | 2px | Micro gaps (icon to text) |
| `--space-1` | 4px | Tight gaps (badge padding) |
| `--space-1.5` | 6px | Small gaps (chip spacing) |
| `--space-2` | 8px | Default gap (input padding) |
| `--space-3` | 12px | Card internal gap |
| `--space-4` | 16px | Card padding, section gap |
| `--space-5` | 20px | Large card padding |
| `--space-6` | 24px | Section margin |
| `--space-8` | 32px | Page padding, large gaps |
| `--space-10` | 40px | Hero spacing |
| `--space-12` | 48px | Page section separation |
| `--space-16` | 64px | Maximum spacing |

### Component-Specific Spacing

| Component | Property | Value |
|---|---|---|
| Card | padding | `p-4` to `p-6` (16-24px) |
| Card | gap between cards | `gap-3` (12px) |
| Nav | height | `h-12` (48px) |
| Input | padding | `px-3 py-2` (12px 8px) |
| Button | padding | `px-4 py-2` (16px 8px) |
| Button | padding (large) | `px-6 py-3` (24px 12px) |
| Section | margin bottom | `mb-8` (32px) |
| Page | padding | `px-6 py-8` (24px 32px) |

---

## 4. Borders & Radii

### Border Widths

| Token | Value | Usage |
|---|---|---|
| `--border-thin` | 1px | Default borders, dividers |
| `--border-medium` | 2px | Active states, today highlight |
| `--border-thick` | 3px | Left accent on cards |

### Border Radii

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | 0px | Cards, inputs (sharp edges = athletic) |
| `--radius-sm` | 2px | Subtle rounding |
| `--radius-md` | 4px | Badges, chips |
| `--radius-full` | 9999px | Dots, avatars, pills |

### Border Colors

| Context | Color |
|---|---|
| Default | `--color-border` (#1c1c3a) |
| Hover | `--color-orange` (#ff5500) |
| Focus | `--color-orange` (#ff5500) |
| Active/Selected | `--color-orange` (#ff5500) |
| Error | `--color-red` (#ef4444) |
| Success | `--color-green` (#22c55e) |

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-none` | none | Default (flat athletic look) |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle elevation |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Modal overlays |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` | Dropdown menus |

**Note:** Shadows are minimal. The design uses border accents and background contrast for elevation, not drop shadows.

---

## 6. Animations

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `--transition-fast` | 150ms | ease | Hover states, focus rings |
| `--transition-normal` | 250ms | ease | Panel slides, fade-ins |
| `--transition-slow` | 400ms | ease | Page transitions |

### Keyframe Animations

| Name | Duration | Usage |
|---|---|---|
| `pulse-dot` | 1.4s infinite | Active workout indicator |
| `slide-up` | 250ms forwards | Panel/card entrance |
| `fade-in` | 300ms forwards | Modal overlay |
| `glow-pulse` | 2s infinite | Subtle glow effect |
| `float-orb` | 8s infinite | Login background orbs |
| `shimmer` | 2s infinite | Loading skeleton |

---

## 7. Elevation Levels

| Level | Background | Border | Shadow | Usage |
|---|---|---|---|---|
| 0 | `--color-bg` | none | none | App background |
| 1 | `--color-surface` | `--color-border` | none | Nav, sidebars, inputs |
| 2 | `--color-card` | `--color-border` | none | Cards, panels |
| 3 | `--color-card` | `--color-orange` | `--shadow-md` | Modals, dropdowns |
| 4 | `--color-surface` | `--color-orange` | `--shadow-lg` | Tooltips, popovers |

---

## 8. Implementation Reference

### CSS Custom Properties (for `index.css`)
```css
:root {
  /* Colors */
  --color-bg: #07071a;
  --color-surface: #0d0d24;
  --color-card: #11112a;
  --color-border: #1c1c3a;
  --color-dim: #252548;
  --color-orange: #ff5500;
  --color-violet: #7c3aed;
  --color-cyan: #22d3ee;
  --color-text: #e8e8f4;
  --color-muted: #4a4a72;
  --color-red: #ef4444;
  --color-green: #22c55e;

  /* Typography */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### Tailwind CSS Classes (already in use)
```
font-display  → Barlow Condensed
font-mono     → JetBrains Mono
(default)     → Outfit

bg-[#07071a]  → --color-bg
bg-[#0d0d24]  → --color-surface
bg-[#11112a]  → --color-card
text-[#e8e8f4] → --color-text
text-[#4a4a72] → --color-muted
text-[#ff5500] → --color-orange
```

### React Constants (already in `src/constants.ts`)
```typescript
export const C = {
  bg:      "#07071a",
  surface: "#0d0d24",
  card:    "#11112a",
  border:  "#1c1c3a",
  orange:  "#ff5500",
  violet:  "#7c3aed",
  cyan:    "#22d3ee",
  text:    "#e8e8f4",
  muted:   "#4a4a72",
  dim:     "#252548",
  red:     "#ef4444",
  green:   "#22c55e",
};
```
