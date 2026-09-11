import { describe, it, expect } from "vitest";

/**
 * Calculate estimated 1RM using Epley formula
 * 1RM = weight × (1 + reps / 30)
 */
function calculateOneRMEpley(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * Calculate estimated 1RM using Brzycki formula
 * 1RM = weight × (36 / (37 - reps))
 */
function calculateOneRMBrzycki(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  if (reps >= 37) return weight; // Formula breaks down
  return Math.round(weight * (36 / (37 - reps)) * 10) / 10;
}

describe("1RM Calculation", () => {
  describe("Epley Formula", () => {
    it("returns weight when reps is 1", () => {
      expect(calculateOneRMEpley(100, 1)).toBe(100);
    });

    it("calculates 1RM for 5 reps at 80kg", () => {
      // 80 × (1 + 5/30) = 80 × 1.1667 = 93.3
      expect(calculateOneRMEpley(80, 5)).toBe(93.3);
    });

    it("calculates 1RM for 10 reps at 60kg", () => {
      // 60 × (1 + 10/30) = 60 × 1.333 = 80
      expect(calculateOneRMEpley(60, 10)).toBe(80);
    });

    it("returns 0 for 0 reps", () => {
      expect(calculateOneRMEpley(80, 0)).toBe(0);
    });

    it("returns 0 for 0 weight", () => {
      expect(calculateOneRMEpley(0, 5)).toBe(0);
    });

    it("handles high reps (20 reps at 50kg)", () => {
      // 50 × (1 + 20/30) = 50 × 1.667 = 83.3
      expect(calculateOneRMEpley(50, 20)).toBe(83.3);
    });
  });

  describe("Brzycki Formula", () => {
    it("returns weight when reps is 1", () => {
      expect(calculateOneRMBrzycki(100, 1)).toBe(100);
    });

    it("calculates 1RM for 5 reps at 80kg", () => {
      // 80 × (36 / (37 - 5)) = 80 × 1.125 = 90
      expect(calculateOneRMBrzycki(80, 5)).toBe(90);
    });

    it("calculates 1RM for 10 reps at 60kg", () => {
      // 60 × (36 / (37 - 10)) = 60 × 1.333 = 80
      expect(calculateOneRMBrzycki(60, 10)).toBe(80);
    });

    it("returns 0 for 0 reps", () => {
      expect(calculateOneRMBrzycki(80, 0)).toBe(0);
    });

    it("returns 0 for 0 weight", () => {
      expect(calculateOneRMBrzycki(0, 5)).toBe(0);
    });

    it("handles 36 reps (near formula limit)", () => {
      // 50 × (36 / (37 - 36)) = 50 × 36 = 1800
      expect(calculateOneRMBrzycki(50, 36)).toBe(1800);
    });

    it("caps at weight for reps >= 37", () => {
      expect(calculateOneRMBrzycki(50, 37)).toBe(50);
      expect(calculateOneRMBrzycki(50, 100)).toBe(50);
    });
  });
});
