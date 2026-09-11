import { describe, it, expect } from "vitest";
import pl from "../../../i18n/pl.json";
import en from "../../../i18n/en.json";

describe("i18n Keys", () => {
  it("PL and EN have the same keys", () => {
    const plKeys = Object.keys(pl).sort();
    const enKeys = Object.keys(en).sort();
    expect(plKeys).toEqual(enKeys);
  });

  it("has required app keys", () => {
    expect(pl).toHaveProperty("app.title");
    expect(pl).toHaveProperty("app.subtitle");
    expect(pl).toHaveProperty("app.version");
  });

  it("has required login keys", () => {
    expect(pl).toHaveProperty("login.email");
    expect(pl).toHaveProperty("login.password");
    expect(pl).toHaveProperty("login.submit");
  });

  it("has required nav keys", () => {
    expect(pl).toHaveProperty("nav.dashboard");
    expect(pl).toHaveProperty("nav.exercises");
    expect(pl).toHaveProperty("nav.routines");
    expect(pl).toHaveProperty("nav.calendar");
    expect(pl).toHaveProperty("nav.progress");
    expect(pl).toHaveProperty("nav.ai");
    expect(pl).toHaveProperty("nav.settings");
    expect(pl).toHaveProperty("nav.workout");
    expect(pl).toHaveProperty("nav.logout");
  });

  it("has required dashboard keys", () => {
    expect(pl).toHaveProperty("dashboard.title");
    expect(pl).toHaveProperty("dashboard.titleAccent");
    expect(pl).toHaveProperty("dashboard.activeWorkout");
    expect(pl).toHaveProperty("dashboard.stats.trainings");
    expect(pl).toHaveProperty("dashboard.stats.sets");
    expect(pl).toHaveProperty("dashboard.stats.minutes");
    expect(pl).toHaveProperty("dashboard.stats.streak");
  });

  it("has required exercises keys", () => {
    expect(pl).toHaveProperty("exercises.title");
    expect(pl).toHaveProperty("exercises.create");
    expect(pl).toHaveProperty("exercises.search");
  });

  it("has required routines keys", () => {
    expect(pl).toHaveProperty("routines.title");
    expect(pl).toHaveProperty("routines.new");
    expect(pl).toHaveProperty("routines.save");
  });

  it("has required workout keys", () => {
    expect(pl).toHaveProperty("workout.active");
    expect(pl).toHaveProperty("workout.finish");
    expect(pl).toHaveProperty("workout.rest");
    expect(pl).toHaveProperty("workout.noActive");
  });

  it("has required progress keys", () => {
    expect(pl).toHaveProperty("progress.title");
    expect(pl).toHaveProperty("progress.pr");
    expect(pl).toHaveProperty("progress.avg");
  });

  it("has required ai keys", () => {
    expect(pl).toHaveProperty("ai.title");
    expect(pl).toHaveProperty("ai.description");
    expect(pl).toHaveProperty("ai.availableCommands");
  });

  it("has required settings keys", () => {
    expect(pl).toHaveProperty("settings.title");
    expect(pl).toHaveProperty("settings.language");
    expect(pl).toHaveProperty("settings.theme");
  });

  it("has required common keys", () => {
    expect(pl).toHaveProperty("common.all");
    expect(pl).toHaveProperty("common.custom");
    expect(pl).toHaveProperty("common.yes");
    expect(pl).toHaveProperty("common.no");
  });

  it("no empty values in PL", () => {
    Object.entries(pl).forEach(([key, value]) => {
      expect(value).not.toBe("");
      expect(typeof value).toBe("string");
    });
  });

  it("no empty values in EN", () => {
    Object.entries(en).forEach(([key, value]) => {
      expect(value).not.toBe("");
      expect(typeof value).toBe("string");
    });
  });
});
