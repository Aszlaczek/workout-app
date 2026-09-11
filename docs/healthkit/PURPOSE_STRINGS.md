# HealthKit Purpose Strings

## Overview

Apple requires clear, specific purpose strings for each HealthKit data type. These strings must be added to `Info.plist` and explain exactly why the app needs access to each type of health data.

## Required Info.plist Entries

### HealthKit Sharing (Read Access)

```xml
<key>NSHealthShareUsageDescription</key>
<string>We need access to your health data to display workout analytics, track your fitness progress, and correlate your training with energy expenditure and heart rate data.</string>
```

### HealthKit Updates (Write Access)

```xml
<key>NSHealthUpdateUsageDescription</key>
<string>We save your completed workouts to Apple Health to provide a unified fitness overview across all your health apps.</string>
```

## Purpose String Guidelines

### Apple Requirements

1. **Specific** — Must explain exactly what data is accessed and why
2. **Clear** — No technical jargon, understandable by all users
3. **Honest** — Must match actual data usage
4. **Complete** — Cover all data types accessed

### What NOT to Do

- ❌ "We need access to your health data" (too vague)
- ❌ "For analytics" (doesn't explain why)
- ❌ "To improve our service" (not specific enough)
- ✅ "To display workout analytics and track your fitness progress" (specific)

## Per-Data-Type Strings

### Active Energy Burned

**Read:**
> We read your active energy data to correlate your workout intensity with calories burned, helping you understand the effectiveness of your training sessions.

**Write:**
> We save estimated calories burned during your workouts to Apple Health for a complete view of your daily energy expenditure.

### Heart Rate

**Read:**
> We read your heart rate data during workouts to track your training intensity zones and monitor recovery between sets.

### Body Mass

**Read:**
> We read your body weight measurements to provide context for your strength progress and help you track body composition changes over time.

### Workout

**Write:**
> We save your completed strength training workouts to Apple Health, including duration and estimated calories, so you can see all your fitness activities in one place.

## Localization

Purpose strings should be localized for all supported languages:

### English (en)
```
NSHealthShareUsageDescription = "We need access to your health data to display workout analytics, track your fitness progress, and correlate your training with energy expenditure and heart rate data.";
NSHealthUpdateUsageDescription = "We save your completed workouts to Apple Health to provide a unified fitness overview across all your health apps.";
```

### Polish (pl)
```
NSHealthShareUsageDescription = "Potrzebujemy dostępu do danych zdrowotnych, aby wyświetlać analizy treningowe, śledzić postępy fitness i korelować trening z wydatkiem energetycznym i danymi tętna.";
NSHealthUpdateUsageDescription = "Zapisujemy ukończone treningi do Apple Health, aby zapewnić jednolity przegląd_fitness we wszystkich aplikacjach zdrowotnych.";
```

## App Store Review Notes

Include these notes in App Store Connect review:

```
This app integrates with Apple HealthKit to:
1. Read active energy burned to correlate with workout intensity
2. Read heart rate to track training zones and recovery
3. Read body mass for progress tracking context
4. Write completed workouts for unified fitness overview

All HealthKit data is processed on-device. No health data is shared with third parties.
Users can revoke access at any time via Settings > Privacy > Health.
```

## Testing

- [ ] Purpose strings appear on first HealthKit authorization prompt
- [ ] Strings are accurate and match actual data usage
- [ ] Localized strings display correctly per locale
- [ ] No hardcoded strings in code (all from Info.plist)
- [ ] App Store review notes are complete and accurate

## References

- Apple HealthKit Documentation: https://developer.apple.com/healthkit/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/healthkit
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/#health-and-health-research
