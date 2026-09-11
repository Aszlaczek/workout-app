import { describe, it, expect } from "vitest";

interface WorkoutSet {
  weight: number;
  reps: number;
  date: string;
}

interface PersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  estimated1RM: number;
  date: string;
}

/**
 * Calculate estimated 1RM using Epley formula
 */
function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Detect if a new set is a personal record
 */
function isPersonalRecord(
  newSet: WorkoutSet,
  existingPR: PersonalRecord | null
): boolean {
  if (!existingPR) return true;
  const new1RM = calculate1RM(newSet.weight, newSet.reps);
  return new1RM > existingPR.estimated1RM;
}

/**
 * Find all personal records from a list of sets
 */
function findPersonalRecords(sets: WorkoutSet[]): PersonalRecord[] {
  if (sets.length === 0) return [];

  const sorted = [...sets].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentPR: PersonalRecord | null = null;
  const records: PersonalRecord[] = [];

  for (const set of sorted) {
    if (isPersonalRecord(set, currentPR)) {
      currentPR = {
        exerciseId: "",
        weight: set.weight,
        reps: set.reps,
        estimated1RM: calculate1RM(set.weight, set.reps),
        date: set.date,
      };
      records.push(currentPR);
    }
  }

  return records;
}

describe("PR Detection", () => {
  describe("isPersonalRecord", () => {
    it("returns true when no existing PR", () => {
      expect(
        isPersonalRecord({ weight: 80, reps: 5, date: "2026-09-01" }, null)
      ).toBe(true);
    });

    it("returns true when new 1RM is higher", () => {
      const existingPR: PersonalRecord = {
        exerciseId: "bench",
        weight: 80,
        reps: 5,
        estimated1RM: 93.3,
        date: "2026-08-01",
      };
      expect(
        isPersonalRecord(
          { weight: 85, reps: 5, date: "2026-09-01" },
          existingPR
        )
      ).toBe(true);
    });

    it("returns false when new 1RM is lower", () => {
      const existingPR: PersonalRecord = {
        exerciseId: "bench",
        weight: 85,
        reps: 5,
        estimated1RM: 99.2,
        date: "2026-08-01",
      };
      expect(
        isPersonalRecord(
          { weight: 80, reps: 5, date: "2026-09-01" },
          existingPR
        )
      ).toBe(false);
    });

    it("returns false when new 1RM is equal", () => {
      const existingPR: PersonalRecord = {
        exerciseId: "bench",
        weight: 80,
        reps: 5,
        estimated1RM: 93.3,
        date: "2026-08-01",
      };
      expect(
        isPersonalRecord(
          { weight: 80, reps: 5, date: "2026-09-01" },
          existingPR
        )
      ).toBe(false);
    });

    it("considers weight at same reps", () => {
      const existingPR: PersonalRecord = {
        exerciseId: "bench",
        weight: 80,
        reps: 5,
        estimated1RM: 93.3,
        date: "2026-08-01",
      };
      // 82.5 × (1 + 5/30) = 96.25 > 93.3
      expect(
        isPersonalRecord(
          { weight: 82.5, reps: 5, date: "2026-09-01" },
          existingPR
        )
      ).toBe(true);
    });
  });

  describe("findPersonalRecords", () => {
    it("returns empty array for empty sets", () => {
      expect(findPersonalRecords([])).toEqual([]);
    });

    it("finds PR for single set", () => {
      const sets: WorkoutSet[] = [
        { weight: 80, reps: 5, date: "2026-09-01" },
      ];
      const records = findPersonalRecords(sets);
      expect(records).toHaveLength(1);
      expect(records[0].weight).toBe(80);
    });

    it("tracks PR progression over time", () => {
      const sets: WorkoutSet[] = [
        { weight: 80, reps: 5, date: "2026-09-01" },
        { weight: 82.5, reps: 5, date: "2026-09-08" },
        { weight: 85, reps: 5, date: "2026-09-15" },
      ];
      const records = findPersonalRecords(sets);
      expect(records).toHaveLength(3);
      expect(records.map((r) => r.weight)).toEqual([80, 82.5, 85]);
    });

    it("ignores non-PR sets", () => {
      const sets: WorkoutSet[] = [
        { weight: 80, reps: 5, date: "2026-09-01" },
        { weight: 75, reps: 5, date: "2026-09-08" }, // Not a PR
        { weight: 85, reps: 5, date: "2026-09-15" },
      ];
      const records = findPersonalRecords(sets);
      expect(records).toHaveLength(2);
      expect(records.map((r) => r.weight)).toEqual([80, 85]);
    });

    it("handles reps variation (higher reps at same weight)", () => {
      const sets: WorkoutSet[] = [
        { weight: 80, reps: 5, date: "2026-09-01" },
        { weight: 80, reps: 8, date: "2026-09-08" }, // Higher 1RM due to more reps
      ];
      const records = findPersonalRecords(sets);
      expect(records).toHaveLength(2);
      // 80×(1+5/30) = 93.3, 80×(1+8/30) = 101.3
      expect(records[0].estimated1RM).toBe(93.3);
      expect(records[1].estimated1RM).toBe(101.3);
    });

    it("sorts by date regardless of input order", () => {
      const sets: WorkoutSet[] = [
        { weight: 85, reps: 5, date: "2026-09-15" },
        { weight: 80, reps: 5, date: "2026-09-01" },
        { weight: 82.5, reps: 5, date: "2026-09-08" },
      ];
      const records = findPersonalRecords(sets);
      expect(records).toHaveLength(3);
      expect(records.map((r) => r.weight)).toEqual([80, 82.5, 85]);
    });
  });
});
