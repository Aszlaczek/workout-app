# Notification Infrastructure Plan

## Overview

This document specifies the notification infrastructure for the Gym Progress Platform iOS app. Notifications will support rest timer alerts, workout streak reminders, PR achievements, and weekly summaries.

## Use Cases

### Rest Timer (Phase 1)

- Alert when rest period between sets is complete
- Vibration + sound
- In-app notification only (no push)

### Workout Streak Reminders (Phase 2)

- Daily reminder if no workout logged
- Customizable time
- Push notification

### PR Achievements (Phase 2)

- Alert when personal record is achieved
- In-app + push notification
- Shareable achievement card

### Weekly Summary (Phase 3)

- Weekly training summary
- Push notification with stats
- Deep link to progress view

## Permission Flow (App Store Compliant)

### When to Request

- **NOT on first app launch**
- Request only when user enables a feature that needs notifications
- Show explanation before requesting

### Flow

```
1. User enables rest timer notification
2. Show explanation screen:
   "We'll notify you when your rest period is complete.
    This helps you maintain consistent rest between sets."
3. User taps "Enable"
4. Check current permission status
5. If .notDetermined → Request permission
6. If .denied → Show link to Settings
7. If .authorized → Enable feature
```

### Code Pattern

```typescript
import * as Notifications from "expo-notifications";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function requestNotificationPermission(feature: string): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  
  if (existing === "granted") return true;
  
  if (existing === "denied") {
    // Show explanation before directing to Settings
    showExplanationScreen(feature);
    return false;
  }
  
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}
```

## Notification Types

### Rest Timer Complete

```typescript
interface RestTimerNotification {
  type: "rest_complete";
  workoutId: string;
  exerciseName: string;
  setNumber: number;
  nextSetTarget: string;
}

// Schedule
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Rest Complete",
    body: `Time for your next set of ${exerciseName}`,
    data: { type: "rest_complete", workoutId },
    sound: true,
  },
  trigger: { seconds: restDuration },
});
```

### Workout Streak Reminder

```typescript
interface StreakReminderNotification {
  type: "streak_reminder";
  currentStreak: number;
  message: string;
}

// Daily schedule
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Don't break your streak!",
    body: `You've trained ${streak} days in a row. Keep it going!`,
    data: { type: "streak_reminder" },
  },
  trigger: {
    hour: preferredHour,
    minute: preferredMinute,
    repeats: true,
  },
});
```

### PR Achievement

```typescript
interface PRAchievementNotification {
  type: "pr_achievement";
  exerciseName: string;
  previousPR: { weight: number; reps: number };
  newPR: { weight: number; reps: number };
}

// Immediate
await Notifications.scheduleNotificationAsync({
  content: {
    title: "New Personal Record!",
    body: `${exerciseName}: ${newPR.weight}kg x ${newPR.reps}`,
    data: { type: "pr_achievement", exerciseId },
    sound: true,
  },
  trigger: null, // Immediate
});
```

## In-App Notifications

### Toast Style

```
┌─────────────────────────────────┐
│ ✅ Rest Complete                 │
│ Time for your next set          │
│ of Bench Press                  │
└─────────────────────────────────┘
```

### Banner Style

```
┌─────────────────────────────────┐
│ 🏆 New PR!                      │
│ Bench Press: 100kg x 5         │
│ [View] [Dismiss]                │
└─────────────────────────────────┘
```

## Settings Screen

### Notification Preferences

```
┌─────────────────────────────────┐
│ Notifications                   │
├─────────────────────────────────┤
│ Rest Timer          [ON]       │
│   Sound: [Vibrate ▾]           │
│   Duration: [90s ▾]            │
│                                 │
│ Streak Reminders    [OFF]      │
│   Time: [18:00]                │
│                                 │
│ PR Achievements     [ON]       │
│   Sound: [ON]                  │
│   Vibrate: [ON]                │
│                                 │
│ Weekly Summary      [OFF]      │
│   Day: [Sunday ▾]              │
└─────────────────────────────────┘
```

## Data Storage

### Preferences

```typescript
interface NotificationPreferences {
  restTimer: {
    enabled: boolean;
    sound: "vibrate" | "sound" | "both" | "none";
    duration: number; // seconds
  };
  streakReminder: {
    enabled: boolean;
    time: string; // "HH:MM"
  };
  prAchievement: {
    enabled: boolean;
    sound: boolean;
    vibrate: boolean;
  };
  weeklySummary: {
    enabled: boolean;
    day: string; // "monday" | "tuesday" | ...
  };
}
```

### Storage Location

```typescript
// AsyncStorage
await AsyncStorage.setItem("notification_prefs", JSON.stringify(prefs));
```

## Background Delivery

### For Rest Timer

- Use `setTimeout` in JavaScript (foreground only)
- For background: use Expo TaskManager
- Alternative: local notification with `trigger: { seconds: duration }`

### For Streak Reminders

- Use repeating daily notification
- `trigger: { hour, minute, repeats: true }`

## Error Handling

| Error | Handling |
|-------|----------|
| Permission denied | Disable feature, show Settings link |
| Notification failed | Log error, retry once |
| Sound not available | Use vibration only |
| Background delivery failed | Fall back to foreground only |

## Privacy

- No notification content sent to servers
- All scheduling done locally
- User can disable any notification type
- No tracking of notification interactions

## Testing Checklist

- [ ] Permission request flow works
- [ ] Denied permission handled gracefully
- [ ] Rest timer notification fires correctly
- [ ] Streak reminder fires at correct time
- [ ] PR achievement shows immediately
- [ ] Sound/vibration settings respected
- [ ] Notifications clear when tapped
- [ ] Settings persist across app restart
- [ ] Works in foreground and background
- [ ] Works when app is killed
