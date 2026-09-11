import { describe, it, expect } from "vitest";

/**
 * Calculate current streak from workout dates
 */
function calculateStreak(workoutDates: string[]): number {
  if (workoutDates.length === 0) return 0;

  const uniqueDates = [...new Set(workoutDates)]
    .map((d) => new Date(d).toISOString().slice(0, 10))
    .sort()
    .reverse();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak must include today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]).getTime();
    const next = new Date(uniqueDates[i + 1]).getTime();
    const diffDays = (current - next) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

describe("Streak Calculation", () => {
  it("returns 0 for empty dates", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it("returns 1 for single workout today", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(calculateStreak([today])).toBe(1);
  });

  it("returns 1 for single workout yesterday", () => {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    expect(calculateStreak([yesterday])).toBe(1);
  });

  it("returns 0 for workout older than yesterday", () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
      .toISOString()
      .slice(0, 10);
    expect(calculateStreak([twoDaysAgo])).toBe(0);
  });

  it("calculates streak for consecutive days", () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
      .toISOString()
      .slice(0, 10);

    expect(calculateStreak([today, yesterday, twoDaysAgo])).toBe(3);
  });

  it("handles duplicate dates", () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    expect(calculateStreak([today, today, yesterday])).toBe(2);
  });

  it("breaks streak on gap day", () => {
    const today = new Date().toISOString().slice(0, 10);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000)
      .toISOString()
      .slice(0, 10);

    // Gap: today, (no yesterday), twoDaysAgo
    expect(calculateStreak([today, twoDaysAgo])).toBe(1);
  });

  it("handles multiple workouts same day", () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    expect(
      calculateStreak([today, today, yesterday, yesterday])
    ).toBe(2);
  });

  it("works with ISO datetime format", () => {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();

    expect(calculateStreak([today, yesterday])).toBe(2);
  });
});
