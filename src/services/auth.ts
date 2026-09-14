import { supabase, isSupabaseConfigured } from "../lib/supabase";

export type AuthUser = {
  id: string;
  email: string;
};

export const authService = {
  async signUp(email: string, password: string): Promise<AuthUser> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error("No user returned");
      return { id: data.user.id, email: data.user.email ?? email };
    }
    return { id: "local-user", email };
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error("No user returned");
      return { id: data.user.id, email: data.user.email ?? email };
    }
    return { id: "local-user", email };
  },

  async signInWithApple(): Promise<AuthUser> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
      });
      if (error) throw error;
      throw new Error("OAuth redirect in progress");
    }
    return { id: "local-user", email: "demo@example.com" };
  },

  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return;
    }
    // Local mode — simulate success
  },

  async updatePassword(newPassword: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return;
    }
    // Local mode — simulate success
  },

  async deleteAccount(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete user data from all tables
      const tables = [
        "ai_generations", "ai_messages", "ai_conversations",
        "progress_photos", "measurements", "sets",
        "workout_exercises", "workouts",
        "routine_exercises", "routines",
        "exercise_media", "exercises", "profiles",
      ];
      for (const table of tables) {
        await supabase.from(table).delete().eq("user_id", user.id);
      }

      // Call Edge Function to delete the auth user securely
      const { error } = await supabase.functions.invoke("delete-user");
      if (error) {
        console.error("Server-side deletion failed:", error.message);
      }

      await supabase.auth.signOut();
      return;
    }
    // Local mode — clear localStorage
    localStorage.removeItem("gym-progress-state");
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  async getUser(): Promise<AuthUser | null> {
    if (isSupabaseConfigured() && supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      return { id: user.id, email: user.email ?? "" };
    }
    return null;
  },

  async getSession() {
    if (isSupabaseConfigured() && supabase) {
      const { data } = await supabase.auth.getSession();
      return data.session;
    }
    return null;
  },
};
