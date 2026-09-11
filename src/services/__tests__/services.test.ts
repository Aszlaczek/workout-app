import { describe, it, expect } from "vitest";
import { exerciseService } from "../exercises";
import { routineService } from "../routines";
import { workoutService } from "../workouts";
import { settingsService } from "../settings";
import { mkId, exName, formatDate, formatDuration } from "../../lib/utils";
import type { Exercise } from "../../types";

const mockExercise: Exercise = {
  id: "test-ex",
  name: "Test Exercise",
  category: "push",
  muscle: "Chest",
  equipment: "Barbell",
  instructions: ["Step 1"],
  difficulty: "beginner",
};

describe("exerciseService", () => {
  it("returns seed exercises when storage is empty", async () => {
    const exercises = await exerciseService.list();
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises[0]).toHaveProperty("id");
    expect(exercises[0]).toHaveProperty("name");
  });

  it("creates a new exercise", async () => {
    const list = await exerciseService.create(mockExercise);
    expect(list.find((e) => e.id === "test-ex")).toBeDefined();
  });

  it("gets exercise by id", async () => {
    await exerciseService.create(mockExercise);
    const found = await exerciseService.getById("test-ex");
    expect(found?.name).toBe("Test Exercise");
  });

  it("updates an exercise", async () => {
    await exerciseService.create(mockExercise);
    const list = await exerciseService.update("test-ex", { name: "Updated" });
    expect(list.find((e) => e.id === "test-ex")?.name).toBe("Updated");
  });

  it("removes an exercise", async () => {
    await exerciseService.create(mockExercise);
    const list = await exerciseService.remove("test-ex");
    expect(list.find((e) => e.id === "test-ex")).toBeUndefined();
  });

  it("searches exercises by name", async () => {
    await exerciseService.create(mockExercise);
    const results = await exerciseService.search("Test");
    expect(results.length).toBe(1);
    expect(results[0].id).toBe("test-ex");
  });

  it("searches exercises by muscle", async () => {
    await exerciseService.create(mockExercise);
    const results = await exerciseService.search("Chest");
    expect(results.length).toBe(1);
  });
});

describe("routineService", () => {
  it("returns seed routines when storage is empty", async () => {
    const routines = await routineService.list();
    expect(routines.length).toBeGreaterThan(0);
  });

  it("creates a routine", async () => {
    const routine = {
      id: "test-r",
      name: "Test Routine",
      exercises: [{ exerciseId: "bench", targetSets: 3, targetReps: 5 }],
    };
    const list = await routineService.create(routine);
    expect(list.find((r) => r.id === "test-r")).toBeDefined();
  });

  it("updates a routine", async () => {
    const routine = { id: "test-r", name: "Test", exercises: [] };
    await routineService.create(routine);
    const list = await routineService.update("test-r", { name: "Updated Routine" });
    expect(list.find((r) => r.id === "test-r")?.name).toBe("Updated Routine");
  });

  it("removes a routine", async () => {
    const routine = { id: "test-r", name: "Test", exercises: [] };
    await routineService.create(routine);
    const list = await routineService.remove("test-r");
    expect(list.find((r) => r.id === "test-r")).toBeUndefined();
  });
});

describe("workoutService", () => {
  it("returns seed workouts when storage is empty", async () => {
    const workouts = await workoutService.list();
    expect(workouts.length).toBeGreaterThan(0);
  });

  it("creates a workout", async () => {
    const workout = {
      id: "test-w",
      routineId: null,
      routineName: "Free",
      date: "2026-09-11",
      duration: 45,
      exercises: [],
    };
    const list = await workoutService.create(workout);
    expect(list.find((w) => w.id === "test-w")).toBeDefined();
  });

  it("gets workouts by date range", async () => {
    const all = await workoutService.list();
    if (all.length > 0) {
      const first = all[0];
      const filtered = await workoutService.getByDateRange(first.date, first.date);
      expect(filtered.length).toBeGreaterThanOrEqual(1);
    }
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
  });
});

describe("utils", () => {
  it("mkId generates unique ids", () => {
    const id1 = mkId();
    const id2 = mkId();
    expect(id1).not.toBe(id2);
    expect(id1.length).toBeGreaterThan(0);
  });

  it("exName finds exercise name by id", async () => {
    const exercises = await exerciseService.list();
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
