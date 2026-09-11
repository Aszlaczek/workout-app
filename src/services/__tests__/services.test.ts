import { describe, it, expect } from "vitest";
import { exerciseService } from "../exercises";
import { routineService } from "../routines";
import { workoutService } from "../workouts";
import { settingsService } from "../settings";
import { mkId, exName, formatDate, formatDuration } from "../../lib/utils";
import type { Exercise, Routine, Workout } from "../../types";
import { isSupabaseConfigured } from "../../lib/supabase";

const useRemote = isSupabaseConfigured();

function testUuid() {
  return crypto.randomUUID();
}

const mockExercise: Exercise = {
  id: testUuid(),
  name: "Test Exercise",
  category: "push",
  muscle: "Chest",
  equipment: "Barbell",
  instructions: ["Step 1"],
  difficulty: "beginner",
};

describe("exerciseService", () => {
  it("returns exercises list", async () => {
    const exercises = await exerciseService.list();
    expect(Array.isArray(exercises)).toBe(true);
  });

  it("creates a new exercise", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    const list = await exerciseService.create(ex);
    expect(list.find((e) => e.id === ex.id)).toBeDefined();
    // cleanup
    await exerciseService.remove(ex.id);
  });

  it("gets exercise by id", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    await exerciseService.create(ex);
    const found = await exerciseService.getById(ex.id);
    expect(found?.name).toBe("Test Exercise");
    await exerciseService.remove(ex.id);
  });

  it("updates an exercise", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    await exerciseService.create(ex);
    const list = await exerciseService.update(ex.id, { name: "Updated" });
    expect(list.find((e) => e.id === ex.id)?.name).toBe("Updated");
    await exerciseService.remove(ex.id);
  });

  it("removes an exercise", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    await exerciseService.create(ex);
    const list = await exerciseService.remove(ex.id);
    expect(list.find((e) => e.id === ex.id)).toBeUndefined();
  });

  it("searches exercises by name", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    await exerciseService.create(ex);
    const results = await exerciseService.search("Test");
    expect(results.some((r) => r.id === ex.id)).toBe(true);
    await exerciseService.remove(ex.id);
  });

  it("searches exercises by muscle", async () => {
    const ex: Exercise = { ...mockExercise, id: testUuid() };
    await exerciseService.create(ex);
    const results = await exerciseService.search("Chest");
    expect(results.some((r) => r.id === ex.id)).toBe(true);
    await exerciseService.remove(ex.id);
  });
});

describe("routineService", () => {
  it("returns routines list", async () => {
    const routines = await routineService.list();
    expect(Array.isArray(routines)).toBe(true);
  });

  it("creates a routine", async () => {
    const routine: Routine = {
      id: testUuid(),
      name: "Test Routine",
      exercises: [{ exerciseId: "bench", targetSets: 3, targetReps: 5 }],
    };
    const list = await routineService.create(routine);
    expect(list.find((r) => r.id === routine.id)).toBeDefined();
    await routineService.remove(routine.id);
  });

  it("updates a routine", async () => {
    const routine: Routine = { id: testUuid(), name: "Test", exercises: [] };
    await routineService.create(routine);
    const list = await routineService.update(routine.id, { name: "Updated Routine" });
    expect(list.find((r) => r.id === routine.id)?.name).toBe("Updated Routine");
    await routineService.remove(routine.id);
  });

  it("removes a routine", async () => {
    const routine: Routine = { id: testUuid(), name: "Test", exercises: [] };
    await routineService.create(routine);
    const list = await routineService.remove(routine.id);
    expect(list.find((r) => r.id === routine.id)).toBeUndefined();
  });
});

describe("workoutService", () => {
  it("returns workouts list", async () => {
    const workouts = await workoutService.list();
    expect(Array.isArray(workouts)).toBe(true);
  });

  it("creates a workout", async () => {
    const workout: Workout = {
      id: testUuid(),
      routineId: null,
      routineName: "Free",
      date: "2026-09-11",
      duration: 45,
      exercises: [],
    };
    const list = await workoutService.create(workout);
    expect(list.find((w) => w.id === workout.id)).toBeDefined();
    await workoutService.remove(workout.id);
  });

  it("gets workouts by date range", async () => {
    const workout: Workout = {
      id: testUuid(),
      routineId: null,
      routineName: "Free",
      date: "2026-09-11",
      duration: 45,
      exercises: [],
    };
    await workoutService.create(workout);
    const filtered = await workoutService.getByDateRange("2026-09-11", "2026-09-11");
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    await workoutService.remove(workout.id);
  });
});

describe("settingsService", () => {
  it("returns default settings when storage is empty", async () => {
    const settings = await settingsService.get();
    expect(settings.language).toBe("pl");
    expect(settings.theme).toBe("dark");
  });

  it("updates settings", async () => {
    const updated = await settingsService.update({ language: "en" });
    expect(updated.language).toBe("en");
    expect(updated.theme).toBe("dark");
    // restore
    await settingsService.update({ language: "pl" });
  });
});

describe("utils", () => {
  it("mkId generates unique ids", () => {
    const id1 = mkId();
    const id2 = mkId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });

  it("exName finds exercise name by id", () => {
    const exercises: Exercise[] = [
      { id: "bench", name: "Bench Press", category: "push", muscle: "Chest", equipment: "", instructions: [], difficulty: "beginner" },
    ];
    const name = exName("bench", exercises);
    expect(name).toBe("Bench Press");
  });

  it("exName returns id when not found", () => {
    const name = exName("nonexistent", []);
    expect(name).toBe("nonexistent");
  });

  it("formatDate returns formatted date string", () => {
    const result = formatDate("2026-09-11");
    expect(result).toContain("11");
    expect(result).toContain("09");
  });

  it("formatDuration formats minutes correctly", () => {
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(90)).toBe("1h 30min");
    expect(formatDuration(0)).toBe("0 min");
  });
});
