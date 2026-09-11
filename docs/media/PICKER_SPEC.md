# Media Picker Specification

## Overview

The media picker allows users to add photos and videos to exercises and progress tracking. This document specifies the iOS implementation requirements.

## Features

### Photo Library Access

- Use `PHPickerViewController` (iOS 14+) for photo selection
- No full library access needed — user selects specific items
- Support single and multiple selection
- Filter by photos, videos, or both

### Camera Access

- Live photo capture for exercise demonstrations
- Video recording (max 30 seconds for exercise demos)
- Front/rear camera toggle
- Flash control

### Video Recording

- Max duration: 30 seconds
- Max file size: 50MB
- Auto-trim to max duration
- Thumbnail generation from first frame

## Permission Flow

### Photo Library

```
1. Check PHPhotoLibrary.authorizationStatus()
   - .notDetermined → Request access
   - .denied → Show explanation + link to Settings
   - .restricted → Disable feature
   - .authorized → Open picker
2. On iOS 14+: Use PHPickerViewController
3. On iOS 13 and below: Use UIImagePickerController (deprecated but necessary)
```

### Camera

```
1. Check AVCaptureDevice.authorizationStatus(for: .video)
   - .notDetermined → Request access
   - .denied → Show explanation + link to Settings
   - .restricted → Disable feature
   - .authorized → Open camera
2. Check AVAudioSession permission for video recording
```

## UI Components

### Exercise Media Tab

```
┌─────────────────────────────┐
│ Photos & Videos             │
├─────────────────────────────┤
│ [📷 Add Photo] [🎥 Record]  │
├─────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │     │ │     │ │     │   │
│ │     │ │     │ │     │   │
│ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐           │
│ │     │ │     │           │
│ │  ▶  │ │     │           │
│ └─────┘ └─────┘           │
└─────────────────────────────┘
```

### Picker Modal

```
┌─────────────────────────────┐
│ [Cancel]     Select Media   │
├─────────────────────────────┤
│                             │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │  1  │ │     │ │  3  │  │
│  │     │ │     │ │     │  │
│  └─────┘ └─────┘ └─────┘  │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │     │ │     │ │     │  │
│  │     │ │     │ │     │  │
│  └─────┘ └─────┘ └─────┘  │
│                             │
├─────────────────────────────┤
│ [Add Selected (3)]          │
└─────────────────────────────┘
```

## File Handling

### Image Processing

1. Resize to max 2048px on longest side
2. Compress to JPEG (quality 0.8)
3. Generate 200px thumbnail
4. Store original + thumbnail locally
5. Upload to Supabase Storage when online

### Video Processing

1. Check file size (max 50MB)
2. Compress to H.264
3. Generate thumbnail from first frame
4. Store locally
5. Upload to Supabase Storage when online

### Storage Locations

| Type | Local | Remote |
|------|-------|--------|
| Original Image | `NSDocumentsDirectory/media/` | `exercise-media` bucket |
| Thumbnail | `NSDocumentsDirectory/thumbs/` | `exercise-media/thumbs/` |
| Original Video | `NSDocumentsDirectory/media/` | `exercise-media` bucket |
| Video Thumbnail | `NSDocumentsDirectory/thumbs/` | `exercise-media/thumbs/` |

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Permission denied | "Camera access needed" | Link to Settings |
| Photo library denied | "Photo access needed" | Link to Settings |
| File too large | "File exceeds 50MB limit" | Show size limit |
| Upload failed | "Upload failed. Will retry when online." | Queue for retry |
| Storage full | "Storage full. Please free up space." | Show storage info |

## Performance

- Thumbnail generation: background thread, show placeholder until ready
- Upload: background task, show progress indicator
- Lazy loading: only load visible thumbnails
- Cache: LRU cache for thumbnails (max 100MB)

## Accessibility

- VoiceOver labels for all buttons
- Dynamic Type support
- High contrast mode support
- Keyboard navigation for picker

## Testing Checklist

- [ ] Photo library permission flow
- [ ] Camera permission flow
- [ ] Single photo selection
- [ ] Multiple photo selection
- [ ] Video recording (30s limit)
- [ ] Video file size limit (50MB)
- [ ] Thumbnail generation
- [ ] Offline queue behavior
- [ ] Upload retry logic
- [ ] Error messages display correctly
- [ ] VoiceOver labels present
- [ ] Dynamic Type works
