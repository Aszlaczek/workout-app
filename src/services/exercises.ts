import type { Exercise } from "../types";
import { storage } from "./storage";
import { EXERCISES } from "../data/seed";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const STORAGE_KEY = "exercises";

async function listLocal(): Promise<Exercise[]> {
  return storage.get<Exercise[]>(STORAGE_KEY) ?? EXERCISES;
}

async function listRemote(): Promise<Exercise[]> {
  if (!supabase) return listLocal();
  
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  let query = supabase
    .from("exercises")
    .select("*");

  if (userId) {
    query = query.or(`owner_id.eq.${userId},owner_id.is.null`);
  } else {
    query = query.eq("owner_id", null); // Only show global exercises if not logged in
  }

  const { data, error } = await query.order("name");
  if (error) throw error;
  return (data ?? []).map((e: Record<string, unknown>) => ({
    id: e.id as string,
    name: e.name as string,
    category: e.category as Exercise["category"],
    muscle: e.muscle as string,
    equipment: (e.equipment as string) ?? "",
    instructions: (e.instructions as string[]) ?? [],
    difficulty: e.difficulty as Exercise["difficulty"],
    isCustom: e.is_custom as boolean,
  }));
}

export const exerciseService = {
  async list(): Promise<Exercise[]> {
    if (isSupabaseConfigured()) return listRemote();
    return listLocal();
  },

  async getById(id: string): Promise<Exercise | undefined> {
    const list = await this.list();
    return list.find((e) => e.id === id);
  },

  async create(exercise: Exercise): Promise<Exercise[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("exercises").insert({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        instructions: exercise.instructions,
        difficulty: exercise.difficulty,
        is_custom: exercise.isCustom ?? false,
        user_id: user?.id ?? null,
      });
      if (error) throw error;
      return this.list();
    }
    const list = [...(await listLocal()), exercise];
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async update(id: string, updates: Partial<Exercise>): Promise<Exercise[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from("exercises")
        .update({
          name: updates.name,
          category: updates.category,
          muscle: updates.muscle,
          equipment: updates.equipment,
          instructions: updates.instructions,
          difficulty: updates.difficulty,
        })
        .eq("id", id);
      if (error) throw error;
      return this.list();
    }
    const list = (await listLocal()).map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async remove(id: string): Promise<Exercise[]> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("exercises").delete().eq("id", id);
      if (error) throw error;
      return this.list();
    }
    const list = (await listLocal()).filter((e) => e.id !== id);
    storage.set(STORAGE_KEY, list);
    return list;
  },

  async search(query: string): Promise<Exercise[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      let request = supabase
        .from("exercises")
        .select("*")
        .or(`name.ilike.%${query}%,muscle.ilike.%${query}%`);

      if (userId) {
        request = request.or(`user_id.eq.${userId},user_id.is.null`);
      } else {
        request = request.eq("user_id", null);
      }

      const { data, error } = await request.order("name");
      if (error) throw error;
      return (data ?? []).map((e: Record<string, unknown>) => ({
        id: e.id as string,
        name: e.name as string,
        category: e.category as Exercise["category"],
        muscle: e.muscle as string,
        equipment: (e.equipment as string) ?? "",
        instructions: (e.instructions as string[]) ?? [],
        difficulty: e.difficulty as Exercise["difficulty"],
        isCustom: e.is_custom as boolean,
      }));
    }
    const q = query.toLowerCase();
    const all = await listLocal();
    return all.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q)
    );
  },
};
