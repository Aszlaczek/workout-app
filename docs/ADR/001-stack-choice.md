# ADR-001: Technology Stack Choice

**Date:** 2026-09-11
**Status:** Accepted
**Deciders:** A0 (Product Manager), A2 (Frontend Architecture), A3 (Backend)
**Relates to:** Project inception

---

## Context

We need to choose a technology stack for a cross-platform workout tracking application that runs on web and iOS. The product must:
- Work on browser and iPhone with shared codebase
- Support offline workout logging
- Integrate with Supabase backend
- Have AI features (server-side only)
- Be maintainable by a small team

## Decision

### Frontend
**Expo + React Native + TypeScript + Expo Router**

Rationale:
- Single TypeScript codebase for web + iOS
- Expo Router provides file-based routing for universal apps
- React Native ecosystem is mature and well-documented
- TypeScript enforced from day one
- Can use platform-specific files (`.web.tsx`, `.native.tsx`) when needed
- Expo handles build tooling, OTA updates, and native module integration

### Backend
**Supabase (PostgreSQL + Auth + Storage + Edge Functions)**

Rationale:
- PostgreSQL with Row Level Security for data isolation
- Built-in Auth with email/password + social providers
- Private storage buckets with signed URLs for media
- Edge Functions for server-side AI calls (keeps secrets secure)
- Real-time subscriptions available for future features
- Managed service reduces DevOps burden

### Styling
**Tailwind CSS v4 (web) + React Native StyleSheet (native)**

Rationale:
- Tailwind for rapid web development
- Native StyleSheet for iOS performance
- Shared design tokens (colors, spacing) across platforms
- Dark mode support via CSS variables (web) and Appearance API (native)

### State Management
**React useState/useReducer + AsyncStorage (native) + localStorage (web)**

Rationale:
- No external state library needed for MVP
- LocalStorage for UI preferences (theme, language)
- AsyncStorage for offline workout data (native)
- Service layer abstracts storage access

### Charts
**Recharts (web) + Victory Native (iOS)**

Rationale:
- Recharts is mature and well-documented for web
- Victory Native provides similar API for React Native
- Both support line charts, bar charts, and custom styling

### Testing
**Vitest (unit) + Playwright (E2E web) + React Native Testing Library (components)**

Rationale:
- Vitest is fast and Vite-native
- Playwright provides reliable cross-browser E2E testing
- React Native Testing Library for component tests
- RLS tests via Supabase client directly

---

## Alternatives Considered

### React + Next.js (web only)
- **Pros:** Server-side rendering, great SEO, mature ecosystem
- **Cons:** No native iOS app, separate codebases needed
- **Rejected because:** We need iOS app, not just web

### Flutter
- **Pros:** Excellent cross-platform performance, growing ecosystem
- **Cons:** Dart language (team knows TypeScript), smaller ecosystem
- **Rejected because:** Team expertise in TypeScript, ecosystem maturity

### Supabase + Custom Node.js backend
- **Pros:** Full control, familiar stack
- **Cons:** More DevOps, duplicate auth/storage, slower development
- **Rejected because:** Supabase already provides auth, storage, and database

---

## Consequences

### Positive
- Single codebase reduces maintenance overhead
- TypeScript end-to-end catches errors early
- Supabase reduces backend complexity
- Expo simplifies iOS deployment

### Negative
- React Native has platform-specific quirks to handle
- Supabase vendor lock-in (mitigated by PostgreSQL standard)
- Tailwind on web vs StyleSheet on native requires design token abstraction

### Risks
- React Native web support is not as mature as pure web frameworks
- Supabase Edge Functions have cold start latency
- AI features require careful secrets management

---

## Review Date

This ADR should be reviewed after Phase 1 (Foundation) is complete. If critical issues arise with Expo or Supabase, consider alternatives before Phase 2.
