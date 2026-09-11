# Offline Upload Queue Design

## Overview

Media uploads must be offline-tolerant. When network is unavailable, uploads are queued locally and processed when connectivity is restored. This ensures no data loss and a smooth user experience.

## Architecture

```
User selects media
    ↓
Generate thumbnail (local)
    ↓
Store original + thumbnail locally
    ↓
Add to upload queue
    ↓
Check network availability
    ↓
[Online]  → Upload immediately → Remove from queue
[Offline] → Keep in queue → Retry when online
```

## Data Model

### PendingUpload

```typescript
interface PendingUpload {
  id: string;                    // UUID
  localUri: string;              // Local file path
  type: "image" | "video";      // Media type
  exerciseId: string;            // Associated exercise
  bucket: string;                // Supabase storage bucket
  remotePath: string;            // Target path in bucket
  queuedAt: number;              // Timestamp when queued
  retries: number;               // Attempt count
  maxRetries: number;            // Max attempts (default: 3)
  lastError?: string;            // Last error message
  nextRetryAt: number;           // Next retry timestamp
  status: "pending" | "uploading" | "failed" | "completed";
}
```

### Queue State

```typescript
interface UploadQueueState {
  pending: PendingUpload[];
  isProcessing: boolean;
  lastProcessedAt?: number;
}
```

## Storage

### Local Storage (AsyncStorage/SQLite)

```typescript
const QUEUE_KEY = "upload_queue";

// Save queue
await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

// Load queue
const raw = await AsyncStorage.getItem(QUEUE_KEY);
const queue: UploadQueueState = raw ? JSON.parse(raw) : { pending: [], isProcessing: false };
```

### File Storage

```
Documents/
├── media/
│   ├── {uuid}.jpg
│   ├── {uuid}.mp4
│   └── ...
├── thumbs/
│   ├── {uuid}_thumb.jpg
│   ├── {uuid}_thumb.jpg
│   └── ...
└── queue.json
```

## Upload Process

### 1. Enqueue Upload

```typescript
async function enqueueUpload(upload: Omit<PendingUpload, "id" | "queuedAt" | "retries" | "nextRetryAt" | "status">): Promise<PendingUpload> {
  const queue = await loadQueue();
  const item: PendingUpload = {
    ...upload,
    id: uuid(),
    queuedAt: Date.now(),
    retries: 0,
    nextRetryAt: Date.now(),
    status: "pending",
  };
  queue.pending.push(item);
  await saveQueue(queue);
  return item;
}
```

### 2. Process Queue

```typescript
async function processQueue(): Promise<void> {
  const queue = await loadQueue();
  if (queue.isProcessing) return;
  
  queue.isProcessing = true;
  await saveQueue(queue);
  
  const now = Date.now();
  const readyItems = queue.pending.filter(
    item => item.status === "pending" && item.nextRetryAt <= now
  );
  
  for (const item of readyItems) {
    try {
      item.status = "uploading";
      await saveQueue(queue);
      
      await uploadFile(item);
      
      item.status = "completed";
      queue.pending = queue.pending.filter(p => p.id !== item.id);
    } catch (error) {
      item.retries++;
      item.lastError = error.message;
      
      if (item.retries >= item.maxRetries) {
        item.status = "failed";
      } else {
        item.nextRetryAt = now + exponentialBackoff(item.retries);
      }
    }
    
    await saveQueue(queue);
  }
  
  queue.isProcessing = false;
  queue.lastProcessedAt = now;
  await saveQueue(queue);
}
```

### 3. Upload to Supabase

```typescript
async function uploadFile(item: PendingUpload): Promise<void> {
  const file = await readFile(item.localUri);
  
  const { error } = await supabase.storage
    .from(item.bucket)
    .upload(item.remotePath, file, {
      contentType: item.type === "image" ? "image/jpeg" : "video/mp4",
      upsert: false,
    });
  
  if (error) throw error;
  
  // Generate signed URL for immediate access
  const { data: urlData } = await supabase.storage
    .from(item.bucket)
    .createSignedUrl(item.remotePath, 3600);
  
  // Save URL to exercise_media table
  if (urlData) {
    await supabase.from("exercise_media").insert({
      exercise_id: item.exerciseId,
      type: item.type,
      url: urlData.signedUrl,
      thumbnail_url: `${item.remotePath}_thumb`,
    });
  }
}
```

## Retry Logic

### Exponential Backoff

```typescript
function exponentialBackoff(retryCount: number): number {
  // Base: 5 seconds, doubles each retry
  // Max: 5 minutes
  const base = 5000;
  const max = 300000;
  return Math.min(base * Math.pow(2, retryCount), max);
}
```

### Retry Schedule

| Attempt | Delay | Total Wait |
|---------|-------|------------|
| 1 | 5s | 5s |
| 2 | 10s | 15s |
| 3 | 20s | 35s |
| 4 (failed) | — | — |

## Network Monitoring

```typescript
import NetInfo from "@react-native-community/netinfo";

// Subscribe to network changes
const unsubscribe = NetInfo.addEventListener(state => {
  if (state.isConnected && !wasConnected) {
    // Network restored — process queue
    processQueue();
  }
});

// Check on app foreground
AppState.addEventListener("change", nextAppState => {
  if (nextAppState === "active") {
    processQueue();
  }
});
```

## User Experience

### Upload Progress

```
┌─────────────────────────────────┐
│ Exercise: Bench Press           │
├─────────────────────────────────┤
│ ┌─────┐ Uploading... 2/3       │
│ │     │ ████████░░░░ 67%        │
│ └─────┘                         │
├─────────────────────────────────┤
│ Queued: 1 remaining            │
└─────────────────────────────────┘
```

### Failed Upload

```
┌─────────────────────────────────┐
│ Upload Failed                   │
├─────────────────────────────────┤
│ The video could not be uploaded │
│ due to network issues.          │
│                                 │
│ [Retry Now]  [Delete]           │
└─────────────────────────────────┘
```

### Queue Status Badge

```
┌─────────────────────────────────┐
│ 📷 Media (3)  ⏳ 1 queued      │
└─────────────────────────────────┘
```

## Cleanup

### On Successful Upload
1. Delete local original file
2. Delete local thumbnail
3. Remove from queue

### On Max Retries Exceeded
1. Keep local files
2. Mark as failed in queue
3. Show user notification
4. Allow manual retry or delete

### On App Uninstall
- Local files will be lost
- Already-uploaded files remain in Supabase
- Queue is lost (acceptable for Phase 1)

## Testing Checklist

- [ ] Enqueue upload when offline
- [ ] Process queue when network restored
- [ ] Exponential backoff on failures
- [ ] Max retry limit enforced
- [ ] Local files cleaned up after upload
- [ ] Queue persists across app restarts
- [ ] Multiple uploads process correctly
- [ ] Large files (50MB) handle correctly
- [ ] Network loss during upload handled gracefully
- [ ] App background/foreground transitions work
