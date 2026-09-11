import { describe, it, expect, beforeEach } from "vitest";
import { exerciseService } from "../../services/exercises";
import { routineService } from "../../services/routines";
import { workoutService } from "../../services/workouts";
import { settingsService } from "../../services/settings";
import type { Exercise, Routine, Workout } from "../../types";

describe("Exercise CRUD Integration", () => {
  const mockExercise: Exercise = {
    id: "int-test-ex",
    name: "Integration Test Exercise",
    category: "push",
    muscle: "Chest",
    equipment: "Barbell",
    instructions: ["Step 1", "Step 2"],
    difficulty: "intermediate",
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("creates, reads, updates, and deletes exercise", async () => {
    // Create
    const afterCreate = await exerciseService.create(mockExercise);
    expect(afterCreate.find((e) => e.id === "int-test-ex")).toBeDefined();

    // Read
    const found = await exerciseService.getById("int-test-ex");
    expect(found?.name).toBe("Integration Test Exercise");

    // Update
    const afterUpdate = await exerciseService.update("int-test-ex", {
      name: "Updated Exercise",
    });
    expect(afterUpdate.find((e) => e.id === "int-test-ex")?.name).toBe(
      "Updated Exercise"
    );

    // Delete
    const afterDelete = await exerciseService.remove("int-test-ex");
    expect(afterDelete.find((e) => e.id === "int-test-ex")).toBeUndefined();
  });
});

describe("Routine Flow Integration", () => {
  const mockRoutine: Routine = {
    id: "int-test-routine",
    name: "Integration Test Routine",
    exercises: [
      { exerciseId: "bench", targetSets: 3, targetReps: 10 },
      { exerciseId: "ohp", targetSets: 3, targetReps: 8 },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("creates routine with exercises", async () => {
    const afterCreate = await routineService.create(mockRoutine);
    const routine = afterCreate.find((r) => r.id === "int-test-routine");
    expect(routine).toBeDefined();
    expect(routine?.exercises).toHaveLength(2);
    expect(routine?.exercises[0].exerciseId).toBe("bench");
  });

  it("updates routine name", async () => {
    await routineService.create(mockRoutine);
    const afterUpdate = await routineService.update("int-test-routine", {
      name: "Updated Routine",
    });
    expect(
      afterUpdate.find((r) => r.id === "int-test-routine")?.name
    ).toBe("Updated Routine");
  });

  it("deletes routine", async () => {
    await routineService.create(mockRoutine);
    const afterDelete = await routineService.remove("int-test-routine");
    expect(
      afterDelete.find((r) => r.id === "int-test-routine")
    ).toBeUndefined();
  });
});

describe("Workout Flow Integration", () => {
  const mockWorkout: Workout = {
    id: "int-test-workout",
    routineId: null,
    routineName: "Free Workout",
    date: "2026-09-11",
    duration: 45,
    exercises: [
      {
        exerciseId: "bench",
        sets: [
          { id: "s1", weight: 80, reps: 5, rpe: 7, done: true },
          { id: "s2", weight: 80, reps: 5, rpe: 8, done: true },
        ],
      },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("creates workout and reads it back", async () => {
    await workoutService.create(mockWorkout);
    const workouts = await workoutService.list();
    const found = workouts.find((w) => w.id === "int-test-workout");
    expect(found).toBeDefined();
    expect(found?.routineName).toBe("Free Workout");
    expect(found?.duration).toBe(45);
    expect(found?.exercises).toHaveLength(1);
    expect(found?.exercises[0].sets).toHaveLength(2);
  });

  it("gets workouts by date range", async () => {
    await workoutService.create(mockWorkout);
    const filtered = await workoutService.getByDateRange(
      "2026-09-10",
      "2026-09-12"
    );
    expect(filtered.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty for non-matching date range", async () => {
    await workoutService.create(mockWorkout);
    const filtered = await workoutService.getByDateRange(
      "2026-01-01",
      "2026-01-02"
    );
    expect(filtered).toHaveLength(0);
  });
});

describe("Settings Flow Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

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
  });

  it("preserves other settings when updating one", async () => {
    await settingsService.update({ language: "en" });
    await settingsService.update({ theme: "light" });
    const settings = await settingsService.get();
    expect(settings.language).toBe("en");
    expect(settings.theme).toBe("light");
  });
});
