import type { Settings } from "../types";
import { DEFAULT_SETTINGS } from "../data/seed";
import { storage } from "./storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "settings";

async function getLocal(): Promise<Settings> {
  return storage.get<Settings>(STORAGE_KEY) ?? DEFAULT_SETTINGS;
}

async function getRemote(): Promise<Settings> {
  if (!supabase) return getLocal();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return getLocal();

  const { data, error } = await supabase
    .from("profiles")
    .select("locale, units, preferences")
    .eq("id", user.id)
    .single();
  if (error || !data) return getLocal();

  const profile = data as Record<string, unknown>;
  const prefs = (profile.preferences as Record<string, unknown>) ?? {};

  return {
    language: (profile.locale as Settings["language"]) ?? DEFAULT_SETTINGS.language,
    theme:
      (prefs.theme as Settings["theme"]) ??
      DEFAULT_SETTINGS.theme,
    restTimerDefault:
      (prefs.restTimerDefault as number) ??
      DEFAULT_SETTINGS.restTimerDefault,
  };
}

export const settingsService = {
  async get(): Promise<Settings> {
    if (isSupabaseConfigured()) return getRemote();
    return getLocal();
  },

  async update(updates: Partial<Settings>): Promise<Settings> {
    if (isSupabaseConfigured() && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const current = await this.get();
        const merged = { ...current, ...updates };
        const { error } = await supabase
          .from("profiles")
          .update({
            locale: merged.language,
            preferences: {
              theme: merged.theme,
              restTimerDefault: merged.restTimerDefault,
            },
          })
          .eq("id", user.id);
        if (error) throw error;
        return merged;
      }
    }
    const current = await getLocal();
    const merged = { ...current, ...updates };
    storage.set(STORAGE_KEY, merged);
    return merged;
  },
};
