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
