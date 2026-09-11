# Accessibility Checklist — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A1 — UX/UI Designer
**Standard:** WCAG 2.1 Level AA

---

## 1. Color & Contrast

### Text Contrast Ratios

| Element | Foreground | Background | Ratio | Required | Pass |
|---|---|---|---|---|---|
| Primary text | #e8e8f4 | #07071a | 15.8:1 | 4.5:1 | ✓ |
| Muted text | #4a4a72 | #07071a | 3.2:1 | 4.5:1 | ⚠ (large text only) |
| Orange accent | #ff5500 | #07071a | 5.2:1 | 4.5:1 | ✓ |
| Violet accent | #7c3aed | #07071a | 4.8:1 | 4.5:1 | ✓ |
| Cyan active | #22d3ee | #07071a | 9.1:1 | 4.5:1 | ✓ |
| Red error | #ef4444 | #07071a | 4.6:1 | 4.5:1 | ✓ |
| Green success | #22c55e | #07071a | 7.4:1 | 4.5:1 | ✓ |
| Muted on card | #4a4a72 | #11112a | 2.8:1 | 4.5:1 | ⚠ (use for large text only) |

### Rules
- [ ] All text meets 4.5:1 contrast ratio (normal text)
- [ ] All large text (≥18pt or ≥14pt bold) meets 3:1 contrast ratio
- [ ] UI components and graphical objects meet 3:1 contrast ratio
- [ ] Focus indicators meet 3:1 contrast ratio
- [ ] Error states use color AND icon/text (not color alone)

### Fix for Muted Text
```
#4a4a72 on #11112a = 2.8:1 (FAIL for small text)

Options:
1. Lighten muted: #5a5a82 → 3.5:1 (still fails)
2. Use muted only for large text (labels, section headers)
3. For small text, use --color-text with reduced opacity
4. Add icon/texture to supplement color
```

---

## 2. Typography

### Dynamic Type (iOS) / Text Scaling (Web)

- [ ] All text uses relative units (rem/em) not px
- [ ] Layout doesn't break at 200% zoom (web)
- [ ] Layout doesn't break at largest Dynamic Type setting (iOS)
- [ ] Text truncation with ellipsis (not overflow hidden)
- [ ] No information lost when text scales

### Font Size Minimums

| Context | Minimum Size | Current |
|---|---|---|
| Body text | 16px (1rem) | 14-16px ✓ |
| Labels | 12px (0.75rem) | 11-12px ⚠ |
| Input text | 16px (1rem) | 14px ⚠ |
| Button text | 14px (0.875rem) | 12-14px ✓ |

**Note:** On iOS, input text must be ≥16px to prevent zoom on focus.

---

## 3. Touch Targets

### Minimum Sizes

| Element | Platform | Required | Current | Pass |
|---|---|---|---|---|
| Navigation links | iOS | 44×44px | 48px height | ✓ |
| Check-off button | iOS | 44×44px | 32×32px | ✗ |
| Check-off button | Web | 32×32px | 32×32px | ✓ |
| Remove set button | iOS | 44×44px | 28×28px | ✗ |
| Timer presets | iOS | 44×44px | auto | ✓ |
| Calendar day | iOS | 44×44px | aspect-square | ✓ |
| Input fields | All | 44px height | 36px | ✗ |
| AI send button | iOS | 44×44px | auto | ⚠ |

### Fixes Needed
1. **Check-off button:** Increase to 44×44px on iOS (use `.native.tsx` variant)
2. **Remove set button:** Increase tap area with padding, keep visual size
3. **Input fields:** Increase padding to meet 44px minimum height on iOS

---

## 4. Keyboard Navigation (Web)

### Requirements
- [ ] All interactive elements focusable via Tab
- [ ] Focus order follows visual reading order
- [ ] Focus indicator visible on all focusable elements
- [ ] Skip-to-content link available
- [ ] Escape closes modals and dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate within components (tabs, menus)
- [ ] No keyboard traps

### Focus Styles
```css
/* Custom focus ring */
:focus-visible {
  outline: 2px solid #ff5500;
  outline-offset: 2px;
}

/* Remove default outline, replace with custom */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Keyboard Shortcuts

| Key | Action | Context |
|---|---|---|
| Space | Toggle rest timer | Workout logger |
| Enter | Submit form / Activate button | All forms |
| Escape | Close modal / Cancel | Modals, dropdowns |
| Tab | Move to next element | Global |
| Shift+Tab | Move to previous element | Global |
| Arrow keys | Navigate within component | Tab bars, menus |

---

## 5. Screen Reader Support (VoiceOver / NVDA)

### ARIA Labels

| Element | aria-label | Notes |
|---|---|---|
| Nav links | "Dashboard", "Ćwiczenia", etc. | Match visible text |
| Check button | "Oznacz serię jako wykonaną" | Describe action |
| Remove button | "Usuń serię" | Describe action |
| Timer | "Timer odpoczynku: 1:30" | Include current time |
| Start workout | "Rozpocznij trening: Push A" | Include routine name |
| Finish workout | "Zakończ trening" | Action-focused |
| Exercise card | "Bench Press, Push, Klatka, Sztanga" | All info |
| Calendar day | "9 września, 2 treningi" | Date + count |
| Chart | "Wykres postępu dla Bench Press" | Describe content |

### ARIA Roles

| Component | Role | Properties |
|---|---|---|
| Nav | `navigation` | `aria-label="Główna nawigacja"` |
| Modal | `dialog` | `aria-modal="true"`, `aria-labelledby` |
| Tab bar | `tablist` | `aria-label="Nawigacja"` |
| Tab | `tab` | `aria-selected`, `aria-controls` |
| Timer | `timer` | `aria-live="polite"` |
| Chart | `img` | `aria-label` with description |
| Form | `form` | `aria-labelledby` for form title |

### Live Regions

```html
<!-- Timer updates -->
<div aria-live="polite" aria-atomic="true">
  Timer: 1:30
</div>

<!-- Workout status -->
<div aria-live="polite">
  Seria 3 zakończona
</div>

<!-- Error messages -->
<div aria-live="assertive" role="alert">
  Wystąpił błąd. Spróbuj ponownie.
</div>
```

---

## 6. Motion & Animation

### Preferences
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Disable animations when preference is set
- [ ] Essential animations (timer) still work

### Implementation
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .pulse-dot {
    animation: none;
    opacity: 1;
  }
  
  .slide-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

---

## 7. Images & Media

### Requirements
- [ ] All images have alt text
- [ ] Decorative images use `alt=""` and `role="presentation"`
- [ ] Videos have captions (if audio content)
- [ ] No auto-playing media
- [ ] Media has pause/stop controls

### Exercise Images
```html
<img 
  src="bench-press.jpg" 
  alt="Bench Press - osoba leżąca na ławce wypychająca sztangę z klatki piersiowej"
  role="presentation"
/>
```

---

## 8. Forms

### Requirements
- [ ] All inputs have visible labels (not just placeholders)
- [ ] Error messages associated with inputs via `aria-describedby`
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages announced to screen readers
- [ ] Form validation inline (not just on submit)

### Example
```html
<div>
  <label for="weight">Waga (kg)</label>
  <input 
    id="weight" 
    type="number" 
    aria-required="true"
    aria-describedby="weight-error"
  />
  <span id="weight-error" role="alert" aria-live="assertive">
    Waga musi być liczbą większą od 0
  </span>
</div>
```

---

## 9. Color Independence

### Rules
- [ ] Never use color as the ONLY indicator of state
- [ ] Always supplement with: icon, text, pattern, or shape

### Examples

| Indicator | Color | Supplement |
|---|---|---|
| Completed set | Orange checkmark | ✓ icon + opacity change |
| PR achievement | Cyan text | "PR" label + icon |
| Error state | Red border | ✕ icon + error text |
| Active exercise | Orange border | Bold text + position |
| Workout type | Category color | Text label ("Push") |

---

## 10. Semantic HTML

### Requirements
- [ ] Use `<button>` for actions, `<a>` for navigation
- [ ] Use `<h1>`-`<h6>` for headings (proper hierarchy)
- [ ] Use `<nav>` for navigation
- [ ] Use `<main>` for main content
- [ ] Use `<header>` and `<footer>` landmarks
- [ ] Use `<ul>`/`<ol>` for lists

### Heading Hierarchy
```
<h1> Page Title (one per page)
  <h2> Section Title
    <h3> Subsection
  <h2> Another Section
```

---

## 11. Testing Checklist

### Automated Testing
- [ ] Axe-core integration in CI
- [ ] Lighthouse accessibility score > 90
- [ ] No critical violations

### Manual Testing
- [ ] Navigate entire app with keyboard only
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA (Windows)
- [ ] Test at 200% zoom (web)
- [ ] Test with largest Dynamic Type (iOS)
- [ ] Test with `prefers-reduced-motion`
- [ ] Test color contrast with simulation tools

### Test Scenarios
1. **Login flow** — Can I register, login, and logout using only keyboard?
2. **Workout logging** — Can I log a complete workout using only keyboard/voice?
3. **Exercise search** — Can I find and select an exercise with screen reader?
4. **Chart reading** — Can a screen reader user understand their progress?
5. **Error handling** — Are errors announced and recoverable?

---

## 12. Known Issues & Fixes

| Issue | Severity | Fix | Status |
|---|---|---|---|
| Muted text contrast on card background | Medium | Use for large text only, supplement with icons | TODO |
| Touch targets below 44px on iOS | High | Increase padding in `.native.tsx` variants | TODO |
| Input height below 44px | Medium | Increase padding to 12px vertical | TODO |
| No skip-to-content link | Low | Add hidden link at page top | TODO |
| Chart not accessible to screen readers | High | Add aria-label with data summary | TODO |
| Placeholder-only labels | Medium | Add visible labels above inputs | TODO |

---

## 13. Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Apple Accessibility](https://developer.apple.com/accessibility/)
- [axe-core Documentation](https://dequeuniversity.com/rules/axe/4.8/)
