# HealthKit Data Mapping

## Overview

This document specifies all HealthKit data types read and written by the Gym Progress Platform iOS app. HealthKit integration is **Phase 2+** — not an MVP dependency.

## Apple Requirements

- Granular authorization per data type
- Clear purpose strings in Info.plist
- Request ONLY data necessary for the feature being used
- Do NOT use HealthKit data for advertising or behavioral profiling
- Provide a way to revoke access

## Data Read (Phase 2+)

### Active Energy Burned

| Property | Value |
|----------|-------|
| HKQuantityType | `HKQuantityType.activeEnergyBurned` |
| Unit | `HKUnit.kilocalorie()` |
| Purpose | Correlate energy expenditure with workout intensity |
| Frequency | Read on workout completion |
| Example | User finishes 60min strength session → read active energy for that time range |

### Heart Rate

| Property | Value |
|----------|-------|
| HKQuantityType | `HKQuantityType.heartRate` |
| Unit | `HKUnit.count().unitDivided(by: .minute())` |
| Purpose | Recovery tracking, workout intensity zones |
| Frequency | Read during/after workouts |
| Example | Read heart rate samples during workout to calculate average/max HR |

### Body Mass

| Property | Value |
|----------|-------|
| HKQuantityType | `HKQuantityType.bodyMass` |
| Unit | `HKUnit.gramUnit(with: .kilo)` |
| Purpose | Progress tracking context for body measurements |
| Frequency | Read daily or on-demand |
| Example | Sync body weight measurements for trend analysis |

## Data Write (Phase 2+)

### Workout

| Property | Value |
|----------|-------|
| HKWorkoutType | `HKWorkoutType.traditionalStrengthTraining` |
| Purpose | Sync completed workouts to Apple Health |
| Data Written | Duration, calories burned, exercises |
| Frequency | On workout completion |
| Example | User finishes push day → write workout with duration and estimated calories |

### Active Energy (Complementary)

| Property | Value |
|----------|-------|
| HKQuantityType | `HKQuantityType.activeEnergyBurned` |
| Unit | `HKUnit.kilocalorie()` |
| Purpose | Write estimated energy from workout for unified view |
| Frequency | On workout completion |
| Example | Calculate estimated calories from workout duration and intensity → write to HealthKit |

## Data NOT Read

The following data is intentionally NOT accessed:

| Data Type | Reason |
|-----------|--------|
| Steps | Not relevant to strength training analytics |
| Flights Climbed | Not relevant |
| Dietary Energy | Out of scope (nutrition tracking not in MVP) |
| Sleep Analysis | Phase 3+ feature |
| Mindful Session | Out of scope |
| Reproductive Health | Out of scope |
| Clinical Records | Out of scope |

## Authorization Flow

```
1. Check authorization status for each data type
2. Request READ authorization (activeEnergy, heartRate, bodyMass)
3. Request WRITE authorization (workout, activeEnergy)
4. If denied → show explanation screen
5. If restricted → disable HealthKit features gracefully
6. Store authorization state locally
```

## Error Handling

| Error | Handling |
|-------|----------|
| Authorization denied | Disable HealthKit features, show link to Settings |
| Data unavailable | Show placeholder, retry on next app launch |
| Write failed | Queue for retry, notify user |
| HealthKit not available | Disable features silently (iPad, older iOS) |

## Privacy

- All HealthKit data processed on-device when possible
- No HealthKit data sent to external servers
- User can revoke access at any time via Settings
- Data deletion request honored within 24 hours

## Testing Checklist

- [ ] Request authorization on first launch
- [ ] Read active energy after workout
- [ ] Write workout to HealthKit
- [ ] Handle authorization denial gracefully
- [ ] Handle HealthKit unavailable (simulator)
- [ ] Verify no data leaks to analytics
- [ ] Test with HealthKit data reset
- [ ] Verify background delivery works
