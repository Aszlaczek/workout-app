# Zadania dla zespołu agentów — Gym Progress Platform
### Zakres: Faza 0 (Discovery) + Faza 1 (Foundation) + start Fazy 2

Bazuje na sekcjach 4, 6, 11–13, 17–22 dokumentu. Każdy task ma właściciela,
zależności i kryterium odbioru — bez tego "backlog" to lista życzeń, nie plan pracy.

---

## A0 — Product Manager

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 1 | Spisać PRD z sekcji 4–5 jako osobny dokument z user stories (nie tylko listą funkcji) | — | Każda funkcja MVP ma min. 1 user story + acceptance criteria |
| 2 | Zdefiniować "Definition of Ready" dla ticketów (żeby A2–A6 nie zgadywały wymagań) | 1 | Checklistę stosuje się do każdego nowego ticketu |
| 3 | Ustalić hierarchię decyzyjną z sekcji 26 jako ADR (Architecture Decision Record) template | — | Szablon ADR + pierwszy wypełniony ADR (wybór stacku) |
| 4 | Zamrozić zakres MVP pisemnie — lista "co NIE wchodzi w MVP" (żeby uniknąć feature creep z sekcji 24) | 1 | Dokument z jawnym "not in scope" |
| 5 | Zaplanować cotygodniowy release gate (kryteria przejścia między fazami z sekcji 20) | 1–4 | Checklista gate'u fazowego |

**Ryzyko do pilnowania:** to Ty jesteś jedynym agentem bez twardego "dependency in" — łatwo stać się wąskim gardłem. Ustal SLA na odpowiedzi dla innych agentów, inaczej cały zespół czeka na Ciebie.

---

## A1 — UX/UI

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 6 | Design tokens: kolory (dark-first), typografia (duże liczby dla wartości treningowych), spacing 8pt | A0 (PRD) | Plik tokenów zaimplementowalny 1:1 w kodzie (nie tylko w Figmie) |
| 7 | Wireframe: 5 głównych podróży użytkownika z sekcji 10 (onboarding, workout, tworzenie ćwiczenia, progres, AI flow) | 6 | Klikalny prototyp Figma pokrywający wszystkie 5 |
| 8 | Zaprojektować komponenty z listy w sekcji 9 (Card, MetricCard, ExerciseCard, SetRow, ChartCard, CalendarDay, RoutineSection, ChatDrawer) — stany: default/loading/empty/error | 6 | Każdy komponent ma min. 4 stany udokumentowane |
| 9 | Warianty web vs iOS (nie 100% parity — sekcja 6) | 7 | Dwa różne layouty dla ekranu Workout i Dashboard |
| 10 | Audyt dostępności: kontrast, Dynamic Type, VoiceOver labels, tap targets | 8 | Checklist WCAG AA + adnotacje w Figmie |

**Ryzyko do pilnowania:** "premium, restrained, athletic" (sekcja 9) to kierunek, nie specyfikacja — bez konkretnej palety i skali typograficznej to hasło zostanie subiektywną interpretacją każdego dewelopera z osobna.

---

## A2 — Frontend Architecture

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 11 | Utworzyć Expo + TypeScript + Expo Router (backlog #13) | A1 (tokens) | `expo start` działa na web + iOS symulator |
| 12 | Lint/format/typecheck/commit hooks (#14) | 11 | Pre-commit blokuje błędy typów i lint |
| 13 | Struktura repo wg sekcji 21 (`src/features/*`, `src/services/*`, itd.) | 11 | Struktura katalogów zgodna z dokumentem, z README |
| 14 | AppShell + responsywny layout (sidebar web / bottom tabs iOS) (#22) | 8, 13 | Ten sam routing renderuje dwa różne layouty wg platformy |
| 15 | i18n EN/PL — infrastruktura (nie treści) (#23) | 13 | Zero hard-coded stringów w kodzie startowym; test lint sprawdzający to automatycznie |
| 16 | Warstwa data-access (serwisy) — zakaz bezpośrednich zapisów do DB z komponentów (reguła z sekcji 18) | A3 (schema) | Każdy dostęp do danych przechodzi przez `src/services/` |

**Ryzyko do pilnowania:** zasada "no direct DB writes from UI" z sekcji 18 wymaga wymuszenia narzędziowego (lint rule / code review checklist), inaczej to martwy przepis już w tydzień 2.

---

## A3 — Backend / Data

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 17 | Środowiska Supabase (dev/staging/prod) (#16) | A0 | 3 oddzielne projekty, żadnych współdzielonych sekretów |
| 18 | Migracja inicjalna wg modelu domenowego z sekcji 11 (profiles, exercises, routines, workouts, sets…) | 17 | Migracja odtwarzalna z czystej bazy |
| 19 | RLS baseline — każda tabela user-owned ma policy | 18 | Test pozytywny + negatywny na KAŻDEJ tabeli (wymóg z sekcji 18, nie opcja) |
| 20 | Auth: email/hasło + Sign in with Apple, persystencja sesji | 17 | Logowanie działa na web i iOS, sesja przeżywa restart appki |
| 21 | Storage: prywatne buckety + signed URLs dla mediów | 18 | Media niedostępne bez podpisanego URL, test wygasania |
| 22 | Indeksy i klucze obce zgodnie z modelem z sekcji 11 (szczególnie `sets`, `workout_exercises`) | 18 | Plan zapytań (EXPLAIN) bez pełnych skanów tabel dla głównych query |

**Ryzyko do pilnowania:** RLS "na później" to najczęstszy sposób, w jaki apki fitness wyciekają cudze dane treningowe. To musi być gotowe przed jakąkolwiek publiczną funkcją, nie po.

---

## A4 — AI Engineer

*(Startuje realnie w Fazie 5, ale fundamenty warto zaprojektować wcześniej, żeby A3 nie musiał przerabiać schematu.)*

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 23 | Zaprojektować `AIProvider` interface (sekcja 13) — provider-agnostic już od początku | A3 (schema draft) | Interfejs kompiluje się z mock-providerem, zero zależności od konkretnego SDK w kliencie |
| 24 | Zdefiniować schemat JSON dla `draft_exercise` / `draft_routine` (sekcja 14) | 23 | Schemat walidowalny (np. Zod/JSON Schema) z przykładami poprawnymi i błędnymi |
| 25 | Zaprojektować tabele `ai_conversations`, `ai_messages`, `ai_generations` (sekcja 11) | A3 | Migracja gotowa do wpięcia w #18 |
| 26 | Napisać politykę "explicit confirmation" dla zapisów AI (sekcja 13/18) | 24 | Dokument + test integracyjny wymuszający potwierdzenie przed zapisem |

**Ryzyko do pilnowania:** jeśli schemat AI-tabel powstanie po migracji #18, czeka Cię bolesna migracja wsteczna. Zrób to równolegle, nie sekwencyjnie.

---

## A5 — Mobile Native

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 27 | Media picker (zdjęcie/wideo dla custom exercise) | A2 (AppShell) | Upload działa offline-tolerant (kolejkuje, nie crashuje) |
| 28 | Szkielet integracji powiadomień (na później: rest timer, streaki) | A2 | Permission flow zgodny z App Store guidelines |
| 29 | Wstępna analiza wymagań HealthKit (purpose strings, zakres danych) — dokument, nie kod | — | Lista dokładnie tego, co będzie czytane/zapisywane (wymóg Apple z sekcji 15) |

**Ryzyko do pilnowania:** to jedyny agent z realnie pustym backlogiem w Fazie 0–1 (HealthKit to Faza 2+). Nie dawaj mu zadań "na wyrost" tylko po to, żeby był zajęty — niech A2 przejmie tymczasowo jego rolę frontendową.

---

## A6 — QA

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 30 | Test plan bazowy: co testujemy na każdej warstwie (tabela z sekcji 17) | A0 (PRD) | Dokument mapujący funkcje MVP → warstwy testowe |
| 31 | Skonfigurować Vitest/Jest w CI | A2 (repo) | CI failuje przy failing unit test |
| 32 | Skonfigurować RLS security tests (pozytywne/negatywne) | A3 (#19) | Test wykrywa próbę dostępu do cudzych danych |
| 33 | Zdefiniować "Definition of Done" jako checklistę PR (sekcja 23) | A0 | Szablon PR wymusza checklistę |

**Ryzyko do pilnowania:** QA wchodzące dopiero pod koniec fazy to fikcja jakości. Zadania 30–33 muszą ruszyć równolegle z A2/A3, nie po nich.

---

## A7 — DevOps / Security

| # | Zadanie | Zależy od | Kryterium odbioru |
|---|---|---|---|
| 34 | Pipeline CI (typecheck + lint + unit) (#15) | A2 (repo) | Każdy PR ma zielony/czerwony status przed merge |
| 35 | Zarządzanie sekretami (zero kluczy AI w repo/bundle/CI logs — wymóg z sekcji 13/18) | A3, A4 | Skan sekretów w CI (np. gitleaks) blokuje merge |
| 36 | Observability: structured logs, error tracking, audit trail dla zapisów AI | A3 | Log zawiera kto/co/kiedy dla każdego zapisu AI, bez surowych danych zdrowotnych |
| 37 | Backup i disaster recovery dla Supabase | A3 (#17) | Udokumentowana procedura + test przywrócenia |

**Ryzyko do pilnowania:** sekcja 13 jest wprost — żaden sekret providera AI nie może trafić do kodu klienckiego. To zadanie #35 jest blokujące dla całej Fazy 5, warto zrobić je wcześniej niż "kiedyś".

---

## Kolejność krytyczna (co blokuje co)

```
A0 (PRD, zakres) 
  → A1 (tokens, wireframe) 
    → A2 (repo, AppShell) ⇄ A3 (schema, RLS, auth)
        → A6 (testy równolegle z A2/A3, nie po)
        → A7 (CI/sekrety równolegle z A2/A3)
      → A4 (interfejs AI — projektowany równolegle z A3, nie po)
      → A5 (dołącza realnie w Fazie 2+)
```

**Główna uwaga mentorska:** największym ryzykiem tego planu nie jest technologia — jest sekwencyjne myślenie o QA i DevOps jako "coś na koniec". Dokument sam mówi w sekcji 18 "no merge without passing unit + typecheck + lint" — to zdanie jest bez znaczenia, jeśli A6/A7 nie mają CI gotowego, zanim A2 wypchnie pierwszy PR. Ustaw A6 i A7 na start równolegle z A2/A3, nie po nich.
