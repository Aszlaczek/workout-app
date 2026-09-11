import type { Routine } from "../types";
import { storage } from "./storage";
import { SEED_ROUTINES } from "../data/seed";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "routines";

async function listLocal(): Promise<Routine[]> {
  return storage.get<Routine[]>(STORAGE_KEY) ?? SEED_ROUTINES;
}

async function listRemote(): Promise<Routine[]> {
  if (!supabase) return listLocal();
  const { data, error } = await supabase
    .from("routines")
    .select("*, routine_exercises(*)")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((r: Record<string, unknown>) => {
    const exercises = (r.routine_exercises as Record<string, unknown>[]) ?? [];
    return {
      id: r.id as string,
      name: r.name as string,
      template: r.template as boolean,
      exercises: exercises
        .sort((a, b) => (a.position as number) - (b.position as number))
        .map((re) => ({
          exerciseId: re.exercise_id as string,
          targetSets: re.target_sets as number,
          targetReps: re.target_reps as number,
          targetLoad: (re.target_load as number) ?? undefined,
          targetRpe: (re.target_rpe as number) ?? undefined,
          superset: re.superset as boolean,
          notes: (re.notes as string) ?? undefined,
        })),
    };
  });
}

export const routineService = {
  async list(): Promise<Routine[]> {
    if (isSupabaseConfigured()) return listRemote();
    return listLocal();
  },

  async getById(id: string): Promise<Routine | undefined> {
    const list = await this.list();
    return list.find((r) => r.id === id);
  },

  async create(routine: Routine): Promise<Routine[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error: routineError } = await supabase.from("routines").insert({
        id: routine.id,
        name: routine.name,
        template: routine.template ?? false,
      });
      if (routineError) throw routineError;

      if (routine.exercises.length > 0) {
        const { error: exError } = await supabase
          .from("routine_exercises")
          .insert(
            routine.exercises.map((re, i) => ({
              routine_id: routine.id,
              exercise_id: re.exerciseId,
              position: i,
              target_sets: re.targetSets,
              target_reps: re.targetReps,
              target_load: re.targetLoad ?? null,
              target_rpe: re.targetRpe ?? null,
              superset: re.superset ?? false,
              notes: re.notes ?? null,
            }))
          );
        if (exError) throw exError;
      }
      return this.list();
    }
    const list = [...(await listLocal()), routine];
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async update(id: string, updates: Partial<Routine>): Promise<Routine[]> {
    if (isSupabaseConfigured() && supabase) {
      if (updates.name !== undefined || updates.template !== undefined) {
        const { error } = await supabase
          .from("routines")
          .update({ name: updates.name, template: updates.template })
          .eq("id", id);
        if (error) throw error;
      }
      if (updates.exercises) {
        await supabase.from("routine_exercises").delete().eq("routine_id", id);
        if (updates.exercises.length > 0) {
          const { error } = await supabase
            .from("routine_exercises")
            .insert(
              updates.exercises.map((re, i) => ({
                routine_id: id,
                exercise_id: re.exerciseId,
                position: i,
                target_sets: re.targetSets,
                target_reps: re.targetReps,
                target_load: re.targetLoad ?? null,
                target_rpe: re.targetRpe ?? null,
                superset: re.superset ?? false,
                notes: re.notes ?? null,
              }))
            );
          if (error) throw error;
        }
      }
      return this.list();
    }
    const list = (await listLocal()).map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async remove(id: string): Promise<Routine[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("routines").delete().eq("id", id);
      if (error) throw error;
      return this.list();
    }
    const list = (await listLocal()).filter((r) => r.id !== id);
    storage.set(STORAGE_KEY, list);
    return list;
  },
};
