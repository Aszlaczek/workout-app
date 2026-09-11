import type { Workout } from "../types";
import { storage } from "./storage";
import { SEED_WORKOUTS } from "../data/seed";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "workouts";

async function listLocal(): Promise<Workout[]> {
  return storage.get<Workout[]>(STORAGE_KEY) ?? SEED_WORKOUTS;
}

async function listRemote(): Promise<Workout[]> {
  if (!supabase) return listLocal();
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, sets(*))")
    .order("started_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((w: Record<string, unknown>) => {
    const weData = (w.workout_exercises as Record<string, unknown>[]) ?? [];
    return {
      id: w.id as string,
      routineId: w.routine_id as string | null,
      routineName: (w.routine_name as string) ?? "",
      date: (w.started_at as string).slice(0, 10),
      duration: (w.duration as number) ?? 0,
      exercises: weData
        .sort((a, b) => (a.position as number) - (b.position as number))
        .map((we) => {
          const setsData = (we.sets as Record<string, unknown>[]) ?? [];
          return {
            exerciseId: we.exercise_id as string,
            sets: setsData
              .sort((a, b) => (a.set_number as number) - (b.set_number as number))
              .map((s) => ({
                id: s.id as string,
                weight: s.weight as number,
                reps: s.reps as number,
                rpe: s.rpe as number | null,
                done: s.completed_at !== null,
              })),
          };
        }),
    };
  });
}

export const workoutService = {
  async list(): Promise<Workout[]> {
    if (isSupabaseConfigured()) return listRemote();
    return listLocal();
  },

  async getById(id: string): Promise<Workout | undefined> {
    const list = await this.list();
    return list.find((w) => w.id === id);
  },

  async create(workout: Workout): Promise<Workout[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data: workoutData, error: wError } = await supabase
        .from("workouts")
        .insert({
          id: workout.id,
          routine_id: workout.routineId,
          routine_name: workout.routineName,
          started_at: new Date(
            Date.now() - workout.duration * 60000
          ).toISOString(),
          finished_at: new Date().toISOString(),
          duration: workout.duration,
        })
        .select()
        .single();
      if (wError) throw wError;

      for (let i = 0; i < workout.exercises.length; i++) {
        const we = workout.exercises[i];
        const { data: weData, error: weError } = await supabase
          .from("workout_exercises")
          .insert({
            workout_id: (workoutData as Record<string, unknown>).id as string,
            exercise_id: we.exerciseId,
            position: i,
          })
          .select()
          .single();
        if (weError) throw weError;

        if (we.sets.length > 0) {
          const { error: sError } = await supabase.from("sets").insert(
            we.sets.map((s, si) => ({
              workout_exercise_id: (weData as Record<string, unknown>).id as string,
              set_number: si + 1,
              weight: s.weight,
              reps: s.reps,
              rpe: s.rpe,
              completed_at: s.done ? new Date().toISOString() : null,
            }))
          );
          if (sError) throw sError;
        }
      }
      return this.list();
    }
    const list = [workout, ...(await listLocal())];
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async update(id: string, updates: Partial<Workout>): Promise<Workout[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from("workouts")
        .update({
          routine_name: updates.routineName,
          duration: updates.duration,
          notes: updates.notes,
        })
        .eq("id", id);
      if (error) throw error;
      return this.list();
    }
    const list = (await listLocal()).map((w) =>
      w.id === id ? { ...w, ...updates } : w
    );
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async remove(id: string): Promise<Workout[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
      return this.list();
    }
    const list = (await listLocal()).filter((w) => w.id !== id);
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async getByDateRange(from: string, to: string): Promise<Workout[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("workouts")
        .select("*, workout_exercises(*, sets(*))")
        .gte("started_at", from)
        .lte("started_at", to + "T23:59:59")
        .order("started_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((w: Record<string, unknown>) => {
        const weData = (w.workout_exercises as Record<string, unknown>[]) ?? [];
        return {
          id: w.id as string,
          routineId: w.routine_id as string | null,
          routineName: (w.routine_name as string) ?? "",
          date: (w.started_at as string).slice(0, 10),
          duration: (w.duration as number) ?? 0,
          exercises: weData.map((we) => {
            const setsData = (we.sets as Record<string, unknown>[]) ?? [];
            return {
              exerciseId: we.exercise_id as string,
              sets: setsData.map((s) => ({
                id: s.id as string,
                weight: s.weight as number,
                reps: s.reps as number,
                rpe: s.rpe as number | null,
                done: s.completed_at !== null,
              })),
            };
          }),
        };
      });
    }
    const all = await listLocal();
    return all.filter((w) => w.date >= from && w.date <= to);
  },
};
