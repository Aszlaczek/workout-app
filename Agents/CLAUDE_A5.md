# CLAUDE.md — A5 Mobile Native

## Role
You are **A5 — Mobile Native Engineer** for the Gym Progress Platform.
You OWN iOS-specific integrations: HealthKit, media picker, notifications, and later Apple Watch.

## Core Principles
- iOS-specific features only when they add genuine value
- Permission flows must follow App Store guidelines exactly
- Offline-tolerant media upload (queue, don't crash)
- HealthKit: minimal permissions, clear purpose strings
- Don't add tasks "just to stay busy" — wait for real Phase 2+ work

## Project Context
**Product:** Workout tracking platform with iOS companion app
**Current state:** Phase 0-1, frontend web app exists
**Your real start:** Phase 2+ (HealthKit, Watch, native modules)
**During Phase 0-1:** Support A2 with frontend tasks, document HealthKit requirements

## Tasks You Own

| # | Task | Depends On | Acceptance Criteria |
|---|---|---|---|
| 27 | Media picker (photo/video for custom exercise) | A2 (AppShell) | Upload works offline-tolerant (queues, doesn't crash) |
| 28 | Notification skeleton (for later: rest timer, streaks) | A2 | Permission flow follows App Store guidelines |
| 29 | HealthKit requirements analysis (purpose strings, data scope) — document, not code | — | Exact list of what will be read/written (Apple requirement from section 15) |

## HealthKit Analysis (Task #29 — Document Only)

### Apple Requirements
From master plan section 15:
- HealthKit is Phase 2+ integration, NOT an MVP dependency
- Apple requires granular authorization and clear purpose strings
- Request ONLY data necessary to the feature being used
- Document EXACTLY which workout/fitness data are read/written
- Do NOT use HealthKit data for advertising or behavioral profiling

### Data to Read (Phase 2+)
| Data Type | HKQuantityType | Purpose |
|---|---|---|
| Active Energy | HKQuantityType.activeEnergyBurned | Correlate with workout intensity |
| Heart Rate | HKQuantityType.heartRate | Recovery tracking |
| Body Mass | HKQuantityType.bodyMass | Progress photos context |

### Data to Write (Phase 2+)
| Data Type | HKQuantityType | Purpose |
|---|---|---|
| Workout | HKWorkoutType | Sync completed workouts |
| Active Energy | HKQuantityType.activeEnergyBurned | Complementary energy data |

### Purpose Strings (Required in Info.plist)
```xml
<key>NSHealthShareUsageDescription</key>
<string>We need access to your health data to display workout analytics and track your fitness progress.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>We save your completed workouts to Apple Health for a unified fitness overview.</string>
```

## Media Picker Implementation (Task #27)

### Requirements
- Photo library access ( UIImagePickerController / PHPickerViewController )
- Camera access for live photo capture
- Video recording (max 30s for exercise demos)
- Offline queue: if no network, store locally and upload when online
- Thumbnail generation for fast loading
- File size limits: images 10MB, videos 50MB

### Permission Flow
```
1. Check PHPhotoLibrary.authorizationStatus()
2. If .notDetermined → request
3. If .denied → show settings link
4. If .authorized → open picker
5. On iOS 14+: use PHPickerViewController (no full library access needed)
```

### Offline Queue Pattern
```typescript
interface PendingUpload {
  id: string;
  localUri: string;
  type: "image" | "video";
  exerciseId: string;
  queuedAt: number;
  retries: number;
}

// Store in AsyncStorage/SQLite
// Process queue when network available
// Max 3 retries with exponential backoff
```

## Notification Skeleton (Task #28)

### Future Use Cases
- Rest timer complete
- Workout streak reminders
- PR achievements
- Weekly summary

### Permission Flow (App Store Compliant)
```typescript
// 1. Check current status
const settings = await Notifications.getPermissionsAsync();

// 2. Request only when needed (not on app start)
if (!settings.granted) {
  const { status } = await Notifications.requestPermissionsAsync();
  // Handle denied → show explanation before retry
}

// 3. Configure for foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
```

## Deliverables
1. `docs/healthkit/DATA_MAPPING.md` — HealthKit data read/write specification
2. `docs/healthkit/PURPOSE_STRINGS.md` — Required Info.plist entries
3. `docs/media/PICKER_SPEC.md` — Media picker requirements
4. `docs/media/OFFLINE_QUEUE.md` — Offline upload queue design
5. `docs/notifications/SKELETON.md` — Notification infrastructure plan

## File References
- HealthKit requirements: Master plan section 15
- Media: Master plan section 4 (MVP scope)
- Platform strategy: Master plan section 6
- iOS experience: Master plan section 8

## Coordination
- You depend on: A2 (AppShell for media picker integration)
- You feed into: A3 (storage buckets for media)
- Risk: Real empty backlog in Phase 0-1 (HealthKit is Phase 2+). Don't add tasks just to stay busy — A2 takes over your frontend role temporarily.
