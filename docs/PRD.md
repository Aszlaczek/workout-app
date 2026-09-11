# Product Requirements Document — Gym Progress Platform

**Version:** 1.0
**Date:** 2026-09-11
**Author:** A0 — Product Manager
**Status:** Active

---

## 1. Product Vision

A personal strength-training operating system: define exercises, compose routines, run workouts, record sets/reps/load/RPE/notes, review progress, and understand consistency over weeks and months.

**Primary promise:** "Log a workout in seconds, understand your progress in minutes."

## 2. Target Users

| Persona | Description | Primary Need |
|---|---|---|
| **Strength Hobbyist** | Self-created or coach-created program, trains 3-5x/week | Fast logging, progress visibility, personal exercise library |
| **Beginner** | Wants structured history without autonomous coach | Simple workout recording, basic analytics |
| **Power User** | Hundreds of logged sessions | Advanced charts, PR history, exercise notes, data export |

## 3. User Stories

### 3.1 Authentication

#### US-001: Email/Password Registration
**As a** new user
**I want to** create an account with my email and password
**So that** I can save my workout data securely

**Acceptance Criteria:**
- [ ] Registration form with email + password + confirm password
- [ ] Password minimum 8 characters
- [ ] Email verification sent after registration
- [ ] Validation errors displayed inline
- [ ] Redirect to onboarding after successful registration

#### US-002: Email/Password Login
**As a** returning user
**I want to** log in with my email and password
**So that** I can access my workout data

**Acceptance Criteria:**
- [ ] Login form with email + password
- [ ] "Remember me" option persists session
- [ ] Error message for invalid credentials
- [ ] Redirect to dashboard after successful login
- [ ] Session persists across browser restarts

#### US-003: Sign in with Apple
**As an** iOS user
**I want to** sign in using my Apple ID
**So that** I can quickly access the app without creating a new password

**Acceptance Criteria:**
- [ ] "Sign in with Apple" button on login screen
- [ ] Apple authentication flow completes successfully
- [ ] Account created automatically on first Apple sign-in
- [ ] Works on both web and iOS
- [ ] User can link Apple ID to existing email account

#### US-004: Session Persistence
**As a** logged-in user
**I want my** session to persist across app restarts
**So that** I don't have to log in every time I open the app

**Acceptance Criteria:**
- [ ] Session token stored securely
- [ ] Session survives app restart
- [ ] Session survives browser restart (web)
- [ ] Automatic token refresh before expiry
- [ ] Logout clears all stored session data

#### US-005: Account Deletion
**As a** user
**I want to** delete my account and all associated data
**So that** I can exercise my right to data removal

**Acceptance Criteria:**
- [ ] Delete option in Settings > Account
- [ ] Confirmation dialog warns about permanent deletion
- [ ] All user data deleted within 30 days
- [ ] Confirmation email sent after deletion request
- [ ] Session terminated immediately

---

### 3.2 Exercise Library

#### US-006: Browse Exercise Library
**As a** user
**I want to** browse a list of available exercises
**So that** I can find exercises for my workouts

**Acceptance Criteria:**
- [ ] List shows exercise name, category, muscle group, equipment
- [ ] System exercises pre-populated (15+ exercises)
- [ ] Custom exercises appear in same list
- [ ] Click exercise opens detail view
- [ ] Loading state shown while fetching

#### US-007: Search Exercises
**As a** user
**I want to** search exercises by name or muscle group
**So that** I can quickly find specific exercises

**Acceptance Criteria:**
- [ ] Search input at top of exercise library
- [ ] Real-time filtering as user types
- [ ] Search matches name, muscle group, and equipment
- [ ] Case-insensitive search
- [ ] Empty state shown when no results match

#### US-008: Filter Exercises
**As a** user
**I want to** filter exercises by category, muscle group, and equipment
**So that** I can narrow down to relevant exercises

**Acceptance Criteria:**
- [ ] Category filter: All, Push, Pull, Legs, Core
- [ ] Equipment filter: All, Barbell, Cable, Machine, Bodyweight, etc.
- [ ] Filters can be combined
- [ ] Active filters visually indicated
- [ ] "Clear all" button resets filters

#### US-009: View Exercise Detail
**As a** user
**I want to** view detailed information about an exercise
**So that** I can learn proper form and track my history with it

**Acceptance Criteria:**
- [ ] Shows: name, category, primary/secondary muscles, equipment, difficulty
- [ ] Shows: step-by-step instructions
- [ ] Shows: exercise media (image/video placeholder)
- [ ] Shows: personal history (past workouts with this exercise)
- [ ] Shows: personal records (PR) for this exercise

#### US-010: Create Custom Exercise
**As a** user
**I want to** create my own custom exercise
**So that** I can log exercises not in the system library

**Acceptance Criteria:**
- [ ] Form with: name, category, muscle, equipment, instructions, difficulty
- [ ] All required fields validated before save
- [ ] Custom exercise appears in library immediately after creation
- [ ] Custom exercises marked with "Custom" badge
- [ ] User can edit/delete their custom exercises

#### US-011: Upload Exercise Media
**As a** user
**I want to** upload an image or video for my custom exercise
**So that** I can visually reference the exercise form

**Acceptance Criteria:**
- [ ] Upload button on exercise detail/edit screen
- [ ] Supports image (JPG, PNG) up to 10MB
- [ ] Supports video (MP4) up to 50MB, max 30 seconds
- [ ] Thumbnail auto-generated for videos
- [ ] Media stored in private bucket with signed URLs

---

### 3.3 Routine Builder

#### US-012: View Routines
**As a** user
**I want to** see a list of my saved routines
**So that** I can quickly start a workout from a template

**Acceptance Criteria:**
- [ ] List shows routine name, exercise count, total sets
- [ ] 3 seed routines pre-populated (Push A, Pull A, Legs A)
- [ ] Click routine shows detail view
- [ ] "Start" button on each routine
- [ ] Empty state when no routines exist

#### US-013: Create Routine
**As a** user
**I want to** create a new workout routine
**So that** I can save my preferred workout structure

**Acceptance Criteria:**
- [ ] Form with routine name (required)
- [ ] Add exercises from library to routine
- [ ] Set target sets and reps per exercise
- [ ] Optional: target load, RPE, rest time, notes
- [ ] Save button creates routine and returns to list

#### US-014: Edit Routine
**As a** user
**I want to** edit an existing routine
**So that** I can adjust my workout plan over time

**Acceptance Criteria:**
- [ ] Edit button on routine detail view
- [ ] All fields editable (name, exercises, targets)
- [ ] Changes saved on button click
- [ ] Can cancel without saving changes
- [ ] Edit history not tracked (current version only)

#### US-015: Reorder Exercises in Routine
**As a** user
**I want to** reorder exercises within a routine
**So that** I can control the workout flow

**Acceptance Criteria:**
- [ ] Move up/down buttons per exercise
- [ ] Order persisted after save
- [ ] Visual feedback during reorder
- [ ] First exercise = first in workout
- [ ] Maximum 10 exercises per routine

#### US-016: Superset Grouping
**As a** user
**I want to** group exercises into supersets
**So that** I can perform paired exercises with minimal rest

**Acceptance Criteria:**
- [ ] Superset toggle per exercise
- [ ] Supersets visually grouped (colored border)
- [ ] Superset exercises marked with "SS" badge
- [ ] Supersets work correctly in workout logger
- [ ] Maximum 2 exercises per superset group

#### US-017: Delete Routine
**As a** user
**I want to** delete a routine I no longer need
**So that** my routine list stays clean

**Acceptance Criteria:**
- [ ] Delete button on routine detail/edit
- [ ] Confirmation dialog before deletion
- [ ] Routine removed from list immediately
- [ ] Does not affect past workouts from this routine
- [ ] Cannot delete the last remaining routine

---

### 3.4 Workout Logger

#### US-018: Start Workout from Routine
**As a** user
**I want to** start a workout from a saved routine
**So that** I can quickly begin my planned session

**Acceptance Criteria:**
- [ ] "Start" button on routine detail and quick-start
- [ ] Workout created with routine's exercises pre-loaded
- [ ] Target sets/reps pre-filled in input fields
- [ ] Previous workout values shown for reference
- [ ] Timer starts counting from workout start

#### US-019: Start Empty Workout
**As a** user
**I want to** start a workout without a routine
**So that** I can log ad-hoc training sessions

**Acceptance Criteria:**
- [ ] "Start Empty Workout" option on dashboard
- [ ] Empty workout created with no exercises
- [ ] Can add exercises from library during workout
- [ ] Workout named "Free Training" by default
- [ ] Same timer and logging features as routine workout

#### US-020: Log Sets
**As a** user
**I want to** log my sets with weight, reps, and RPE
**So that** I can track my training load accurately

**Acceptance Criteria:**
- [ ] Input fields: weight (kg), reps, RPE (1-10)
- [ ] Set number displayed (#1, #2, etc.)
- [ ] Check-off button marks set as completed
- [ ] Completed sets shown with reduced opacity
- [ ] Can edit completed sets

#### US-021: Add/Remove Sets
**As a** user
**I want to** add or remove sets during a workout
**So that** I can adjust volume on the fly

**Acceptance Criteria:**
- [ ] "+ Add Set" button below each exercise
- [ ] Remove button per set (with confirmation)
- [ ] New set pre-filled with previous set values
- [ ] Minimum 1 set per exercise
- [ ] Changes reflected immediately

#### US-022: Rest Timer
**As a** user
**I want to** use a rest timer between sets
**So that** I maintain consistent rest periods

**Acceptance Criteria:**
- [ ] Timer displays countdown (MM:SS)
- [ ] Preset durations: 60s, 90s, 120s, 180s
- [ ] Start/pause/reset controls
- [ ] Visual alert when timer reaches zero
- [ ] Keyboard shortcut: Space to toggle timer
- [ ] Timer persists when switching between exercises

#### US-023: Finish Workout
**As a** user
**I want to** finish and save my workout
**So that** my progress is recorded

**Acceptance Criteria:**
- [ ] "Finish" button in workout header
- [ ] Confirmation dialog shows workout summary
- [ ] Summary: duration, total sets, total volume
- [ ] Summary: per-exercise breakdown
- [ ] "Save" confirms and returns to dashboard
- [ ] Workout appears in history immediately

#### US-024: Workout History
**As a** user
**I want to** see my past workouts
**So that** I can review my training history

**Acceptance Criteria:**
- [ ] List sorted by date (newest first)
- [ ] Shows: date, routine name, duration, set count
- [ ] Click workout shows full detail
- [ ] Can filter by routine, date range
- [ ] Empty state when no history

---

### 3.5 Calendar

#### US-025: View Monthly Calendar
**As a** user
**I want to** see my workouts on a monthly calendar
**So that** I can visualize my training consistency

**Acceptance Criteria:**
- [ ] Month grid with day cells
- [ ] Workout days marked with colored dots
- [ ] Dots color-coded by routine type (Push/Pull/Legs)
- [ ] Today highlighted with border
- [ ] Navigation arrows for previous/next month

#### US-026: View Day Detail
**As a** user
**I want to** tap a day to see workout details
**So that** I can review what I did on a specific day

**Acceptance Criteria:**
- [ ] Click/tap day cell shows detail panel
- [ ] Shows: routine name, duration, exercises, sets
- [ ] Shows: weight/reps per set
- [ ] Multiple workouts on same day all shown
- [ ] Close button dismisses detail panel

#### US-027: Weekly View
**As a** user
**I want to** see a weekly view of my workouts
**So that** I can plan my training week

**Acceptance Criteria:**
- [ ] Toggle between month and week view
- [ ] Week shows 7 days with workout cards
- [ ] Same detail drill-down as month view
- [ ] Current week highlighted by default
- [ ] Week starts on Monday

---

### 3.6 Progress Analytics

#### US-028: View Exercise Progress Chart
**As a** user
**I want to** see my progress for a specific exercise over time
**So that** I can track my strength gains

**Acceptance Criteria:**
- [ ] Exercise selector at top
- [ ] Line chart showing max load per session
- [ ] X-axis: dates, Y-axis: weight (kg)
- [ ] PR line shown as reference
- [ ] Tooltip shows exact values on hover

#### US-029: View Volume Chart
**As a** user
**I want to** see my training volume over time
**So that** I can track my workload

**Acceptance Criteria:**
- [ ] Bar chart showing total volume per session
- [ ] Volume = sum(weight × reps) for all sets
- [ ] Toggle between load and volume views
- [ ] Date range selector (week/month/3 months/year/all)
- [ ] Empty state when no data

#### US-030: View Estimated 1RM
**As a** user
**I want to** see my estimated one-rep max over time
**So that** I can track my strength potential

**Acceptance Criteria:**
- [ ] Line chart using Epley formula: weight × (1 + reps/30)
- [ ] Shows estimated 1RM per session
- [ ] PR reference line
- [ ] Can compare with actual max if logged
- [ ] Accurate calculation verified by unit tests

#### US-031: View PR Detection
**As a** user
**I want to** see when I set new personal records
**So that** I can celebrate my progress

**Acceptance Criteria:**
- [ ] PRs detected automatically from workout data
- [ ] PRs shown on dashboard (recent 3)
- [ ] PRs shown on exercise detail view
- [ ] PR reference line on progress charts
- [ ] PR detection handles ties (same weight = not new PR)

#### US-032: View Muscle Group Volume
**As a** user
**I want to** see volume breakdown by muscle group
**So that** I can ensure balanced training

**Acceptance Criteria:**
- [ ] Horizontal bar chart showing volume per muscle group
- [ ] Top 6 muscle groups displayed
- [ ] Volume calculated from all workouts
- [ ] Bars proportional to max muscle group
- [ ] Sorted by volume (highest first)

#### US-033: View Training Frequency
**As a** user
**I want to** see my training frequency stats
**So that** I can track my consistency

**Acceptance Criteria:**
- [ ] Shows: workouts this week, this month, all time
- [ ] Streak counter (consecutive days/weeks)
- [ ] Streak resets on missed day
- [ ] Stats update after each completed workout
- [ ] Displayed on dashboard

---

### 3.7 AI Assistant

#### US-034: Use AI Command Bar
**As a** user
**I want to** use natural language commands
**So that** I can quickly perform actions

**Acceptance Criteria:**
- [ ] Collapsible AI panel at bottom of screen
- [ ] Input field with send button
- [ ] Command history shown in log
- [ ] System responses formatted clearly
- [ ] Available commands listed in panel

#### US-035: AI Creates Exercise via Command
**As a** user
**I want to** create an exercise using AI command
**So that** I can quickly add exercises without forms

**Acceptance Criteria:**
- [ ] Command: "dodaj ćwiczenie [name] [category]"
- [ ] AI generates structured exercise draft
- [ ] Draft shown for review before saving
- [ ] User can edit fields before confirming
- [ ] Exercise saved to library after confirmation

#### US-036: AI Navigation Commands
**As a** user
**I want to** navigate using AI commands
**So that** I can switch views without clicking

**Acceptance Criteria:**
- [ ] Commands: "kalendarz", "rutyny", "dashboard", "ćwiczenia", "ustawienia"
- [ ] Navigation happens immediately
- [ ] Confirmation message shown
- [ ] Works from any view
- [ ] Case-insensitive matching

---

### 3.8 Settings

#### US-037: Change Language
**As a** user
**I want to** switch between Polish and English
**So that** I can use the app in my preferred language

**Acceptance Criteria:**
- [ ] Language toggle in Settings (PL/EN)
- [ ] All UI text updates immediately
- [ ] Preference persisted across sessions
- [ ] Default language: Polish
- [ ] Zero hard-coded strings in codebase

#### US-038: Change Theme
**As a** user
**I want to** switch between dark and light mode
**So that** I can use the app in my preferred visual style

**Acceptance Criteria:**
- [ ] Theme toggle in Settings (Dark/Light)
- [ ] All colors update immediately
- [ ] Dark mode is default
- [ ] Preference persisted across sessions
- [ ] Both themes meet WCAG AA contrast

#### US-039: Configure Rest Timer Default
**As a** user
**I want to** set my default rest timer duration
**So that** I don't have to change it every workout

**Acceptance Criteria:**
- [ ] Duration options: 30s, 60s, 90s, 120s, 180s, 300s
- [ ] Default: 90 seconds
- [ ] Selection persisted
- [ ] Applied to new workouts automatically
- [ ] Can still override per-workout

#### US-040: Export Data
**As a** user
**I want to** export my workout data as JSON
**So that** I have a backup or can migrate to another app

**Acceptance Criteria:**
- [ ] "Download JSON" button in Settings
- [ ] Export includes: exercises, routines, workouts, settings
- [ ] File named: gym-progress-export-YYYY-MM-DD.json
- [ ] Download triggers browser download
- [ ] Data formatted readably (not minified)

---

### 3.9 Localization

#### US-041: Polish Interface
**As a** Polish-speaking user
**I want to** see all UI text in Polish
**So that** I can use the app comfortably in my language

**Acceptance Criteria:**
- [ ] All navigation labels in Polish
- [ ] All button text in Polish
- [ ] All form labels in Polish
- [ ] All messages/error text in Polish
- [ ] Date format: DD.MM.YYYY

#### US-042: English Interface
**As an** English-speaking user
**I want to** see all UI text in English
**So that** I can use the app in English

**Acceptance Criteria:**
- [ ] All text available in English
- [ ] Toggle switches language immediately
- [ ] No mixed-language screens
- [ ] Date format: MM/DD/YYYY or DD/MM/YYYY
- [ ] Number formatting follows locale

---

### 3.10 Offline

#### US-043: Log Workout Offline
**As a** user
**I want to** log my workout even without internet
**So that** I never lose training data at the gym

**Acceptance Criteria:**
- [ ] Workout logging works without network
- [ ] All set data saved locally
- [ ] Visual indicator shows offline status
- [ ] No errors or crashes when offline
- [ ] Timer works offline

#### US-044: Sync When Online
**As a** user
**I want** my offline workouts to sync when I regain connectivity
**So that** my data is always backed up

**Acceptance Criteria:**
- [ ] Automatic sync when network restored
- [ ] Sync indicator shows progress
- [ ] Conflicts resolved (latest wins)
- [ ] No data loss during sync
- [ ] Manual sync option available

---

## 4. Non-Functional Requirements

### Performance
- Workout screen input latency < 100ms
- Chart rendering with 1000+ sessions < 2 seconds
- Cold start < 3 seconds on modern devices

### Security
- All data encrypted in transit (HTTPS)
- RLS on every user-owned table
- No secrets in client code
- Signed URLs for media access

### Accessibility
- WCAG AA contrast ratios
- Minimum tap target 44×44px
- VoiceOver labels on all interactive elements
- Keyboard navigation on web

### Usability
- Log a set in < 3 taps
- Start a workout in < 3 taps
- Find an exercise in < 5 seconds

---

## 5. Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Activation | 80% of signups complete first workout within 24h | Analytics |
| Logging speed | Median < 30s to log a full set | Timing |
| Retention | 40% weekly active users after 4 weeks | Analytics |
| Progress engagement | 30% of active users open Progress weekly | Analytics |
| Routine reuse | 60% of workouts started from saved routine | Analytics |
| AI quality | 70% of AI drafts accepted with minor/no edits | AI logs |
| Reliability | 99% crash-free sessions | Crash reporting |
