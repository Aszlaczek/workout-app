import { describe, it, expect } from "vitest";

interface SetLog {
  weight: number;
  reps: number;
}

interface WorkoutExercise {
  sets: SetLog[];
}

interface Workout {
  exercises: WorkoutExercise[];
}

/**
 * Calculate total volume for a single set
 */
function setVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Calculate total volume for a workout
 */
function workoutVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((setTotal, set) => {
        return setTotal + setVolume(set.weight, set.reps);
      }, 0)
    );
  }, 0);
}

/**
 * Calculate total volume for multiple workouts
 */
function totalVolume(workouts: Workout[]): number {
  return workouts.reduce((total, w) => total + workoutVolume(w), 0);
}

/**
 * Calculate average volume per workout
 */
function averageVolume(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  return totalVolume(workouts) / workouts.length;
}

describe("Volume Calculation", () => {
  describe("setVolume", () => {
    it("calculates volume for a single set", () => {
      expect(setVolume(80, 5)).toBe(400);
    });

    it("returns 0 for 0 weight", () => {
      expect(setVolume(0, 10)).toBe(0);
    });

    it("returns 0 for 0 reps", () => {
      expect(setVolume(80, 0)).toBe(0);
    });

    it("handles bodyweight exercises (0kg, 10 reps)", () => {
      expect(setVolume(0, 10)).toBe(0);
    });

    it("handles weighted dips (20kg, 10 reps)", () => {
      expect(setVolume(20, 10)).toBe(200);
    });
  });

  describe("workoutVolume", () => {
    it("calculates volume for a single exercise", () => {
      const workout: Workout = {
        exercises: [
          {
            sets: [
              { weight: 80, reps: 5 },
              { weight: 80, reps: 5 },
              { weight: 80, reps: 4 },
            ],
          },
        ],
      };
      // 80×5 + 80×5 + 80×4 = 400 + 400 + 320 = 1120
      expect(workoutVolume(workout)).toBe(1120);
    });

    it("calculates volume for multiple exercises", () => {
      const workout: Workout = {
        exercises: [
          {
            sets: [
              { weight: 80, reps: 5 },
              { weight: 80, reps: 5 },
            ],
          },
          {
            sets: [
              { weight: 50, reps: 8 },
              { weight: 50, reps: 7 },
            ],
          },
        ],
      };
      // (80×5 + 80×5) + (50×8 + 50×7) = 800 + 750 = 1550
      expect(workoutVolume(workout)).toBe(1550);
    });

    it("returns 0 for empty workout", () => {
      expect(workoutVolume({ exercises: [] })).toBe(0);
    });

    it("returns 0 for exercise with no sets", () => {
      expect(workoutVolume({ exercises: [{ sets: [] }] })).toBe(0);
    });
  });

  describe("totalVolume", () => {
    it("sums volume across workouts", () => {
      const workouts: Workout[] = [
        { exercises: [{ sets: [{ weight: 80, reps: 5 }] }] },
        { exercises: [{ sets: [{ weight: 60, reps: 10 }] }] },
      ];
      // 400 + 600 = 1000
      expect(totalVolume(workouts)).toBe(1000);
    });

    it("returns 0 for empty array", () => {
      expect(totalVolume([])).toBe(0);
    });
  });

  describe("averageVolume", () => {
    it("calculates average across workouts", () => {
      const workouts: Workout[] = [
        { exercises: [{ sets: [{ weight: 80, reps: 5 }] }] },
        { exercises: [{ sets: [{ weight: 60, reps: 10 }] }] },
      ];
      // (400 + 600) / 2 = 500
      expect(averageVolume(workouts)).toBe(500);
    });

    it("returns 0 for empty array", () => {
      expect(averageVolume([])).toBe(0);
    });
  });
});
