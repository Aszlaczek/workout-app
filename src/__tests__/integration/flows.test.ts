import { describe, it, expect, beforeEach } from "vitest";
import { exerciseService } from "../../services/exercises";
import { routineService } from "../../services/routines";
import { workoutService } from "../../services/workouts";
import { settingsService } from "../../services/settings";
import type { Exercise, Routine, Workout } from "../../types";

function testUuid() {
  return crypto.randomUUID();
}

describe("Exercise CRUD Integration", () => {
  it("creates, reads, updates, and deletes exercise", async () => {
    const id = testUuid();
    const mockExercise: Exercise = {
      id,
      name: "Integration Test Exercise",
      category: "push",
      muscle: "Chest",
      equipment: "Barbell",
      instructions: ["Step 1", "Step 2"],
      difficulty: "intermediate",
    };

    // Create
    const afterCreate = await exerciseService.create(mockExercise);
    expect(afterCreate.find((e) => e.id === id)).toBeDefined();

    // Read
    const found = await exerciseService.getById(id);
    expect(found?.name).toBe("Integration Test Exercise");

    // Update
    const afterUpdate = await exerciseService.update(id, { name: "Updated Exercise" });
    expect(afterUpdate.find((e) => e.id === id)?.name).toBe("Updated Exercise");

    // Delete
    const afterDelete = await exerciseService.remove(id);
    expect(afterDelete.find((e) => e.id === id)).toBeUndefined();
  });
});

describe("Routine Flow Integration", () => {
  it("creates routine with exercises", async () => {
    const id = testUuid();
    const mockRoutine: Routine = {
      id,
      name: "Integration Test Routine",
      exercises: [
        { exerciseId: "bench", targetSets: 3, targetReps: 10 },
        { exerciseId: "ohp", targetSets: 3, targetReps: 8 },
      ],
    };

    const afterCreate = await routineService.create(mockRoutine);
    const routine = afterCreate.find((r) => r.id === id);
    expect(routine).toBeDefined();
    expect(routine?.exercises).toHaveLength(2);
    expect(routine?.exercises[0].exerciseId).toBe("bench");
    await routineService.remove(id);
  });

  it("updates routine name", async () => {
    const id = testUuid();
    await routineService.create({ id, name: "Test", exercises: [] });
    const afterUpdate = await routineService.update(id, { name: "Updated Routine" });
    expect(afterUpdate.find((r) => r.id === id)?.name).toBe("Updated Routine");
    await routineService.remove(id);
  });

  it("deletes routine", async () => {
    const id = testUuid();
    await routineService.create({ id, name: "Test", exercises: [] });
    const afterDelete = await routineService.remove(id);
    expect(afterDelete.find((r) => r.id === id)).toBeUndefined();
  });
});

describe("Workout Flow Integration", () => {
  it("creates workout and reads it back", async () => {
    const id = testUuid();
    const mockWorkout: Workout = {
      id,
      routineId: null,
      routineName: "Free Workout",
      date: "2026-09-11",
      duration: 45,
      exercises: [
        {
          exerciseId: "bench",
          sets: [
            { id: testUuid(), weight: 80, reps: 5, rpe: 7, done: true },
            { id: testUuid(), weight: 80, reps: 5, rpe: 8, done: true },
          ],
        },
      ],
    };

    await workoutService.create(mockWorkout);
    const workouts = await workoutService.list();
    const found = workouts.find((w) => w.id === id);
    expect(found).toBeDefined();
    expect(found?.routineName).toBe("Free Workout");
    expect(found?.duration).toBe(45);
    expect(found?.exercises).toHaveLength(1);
    expect(found?.exercises[0].sets).toHaveLength(2);
    await workoutService.remove(id);
  });

  it("gets workouts by date range", async () => {
    const id = testUuid();
    const mockWorkout: Workout = {
      id,
      routineId: null,
      routineName: "Free Workout",
      date: "2026-09-11",
      duration: 45,
      exercises: [],
    };

    await workoutService.create(mockWorkout);
    const filtered = await workoutService.getByDateRange("2026-09-10", "2026-09-12");
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    await workoutService.remove(id);
  });

  it("returns empty for non-matching date range", async () => {
    const id = testUuid();
    const mockWorkout: Workout = {
      id,
      routineId: null,
      routineName: "Free Workout",
      date: "2026-09-11",
      duration: 45,
      exercises: [],
    };

    await workoutService.create(mockWorkout);
    const filtered = await workoutService.getByDateRange("2026-01-01", "2026-01-02");
    expect(filtered).toHaveLength(0);
    await workoutService.remove(id);
  });
});

describe("Settings Flow Integration", () => {
  it("gets default settings", async () => {
    const settings = await settingsService.get();
    expect(settings.language).toBe("pl");
    expect(settings.theme).toBe("dark");
    expect(settings.restTimerDefault).toBe(90);
  });

  it("updates and persists settings", async () => {
    await settingsService.update({ language: "en" });
    const settings = await settingsService.get();
    expect(settings.language).toBe("en");
    await settingsService.update({ language: "pl" });
  });

  it("preserves other settings when updating one", async () => {
    await settingsService.update({ language: "en" });
    await settingsService.update({ theme: "light" });
    const settings = await settingsService.get();
    expect(settings.language).toBe("en");
    expect(settings.theme).toBe("light");
    await settingsService.update({ language: "pl", theme: "dark" });
  });
});
