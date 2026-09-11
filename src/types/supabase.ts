export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          locale: string;
          units: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          units?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          units?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          category: string;
          muscle: string;
          equipment: string | null;
          instructions: string[] | null;
          difficulty: string;
          is_custom: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          category: string;
          muscle: string;
          equipment?: string | null;
          instructions?: string[] | null;
          difficulty?: string;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          name?: string;
          category?: string;
          muscle?: string;
          equipment?: string | null;
          instructions?: string[] | null;
          difficulty?: string;
          is_custom?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercise_media: {
        Row: {
          id: string;
          exercise_id: string;
          type: string;
          url: string;
          thumbnail_url: string | null;
          attribution: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          exercise_id: string;
          type: string;
          url: string;
          thumbnail_url?: string | null;
          attribution?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exercise_id?: string;
          type?: string;
          url?: string;
          thumbnail_url?: string | null;
          attribution?: string | null;
          source?: string | null;
          created_at?: string;
        };
      };
      routines: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          template: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          template?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          template?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      routine_exercises: {
        Row: {
          id: string;
          routine_id: string;
          exercise_id: string;
          position: number;
          target_sets: number;
          target_reps: number;
          target_load: number | null;
          target_rpe: number | null;
          superset: boolean;
          superset_group: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          routine_id: string;
          exercise_id: string;
          position: number;
          target_sets?: number;
          target_reps?: number;
          target_load?: number | null;
          target_rpe?: number | null;
          superset?: boolean;
          superset_group?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          routine_id?: string;
          exercise_id?: string;
          position?: number;
          target_sets?: number;
          target_reps?: number;
          target_load?: number | null;
          target_rpe?: number | null;
          superset?: boolean;
          superset_group?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          owner_id: string;
          routine_id: string | null;
          routine_name: string | null;
          started_at: string;
          finished_at: string | null;
          duration: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          routine_id?: string | null;
          routine_name?: string | null;
          started_at: string;
          finished_at?: string | null;
          duration?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          routine_id?: string | null;
          routine_name?: string | null;
          started_at?: string;
          finished_at?: string | null;
          duration?: number | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          position?: number;
          created_at?: string;
        };
      };
      sets: {
        Row: {
          id: string;
          workout_exercise_id: string;
          set_number: number;
          weight: number;
          reps: number;
          unit: string;
          rpe: number | null;
          set_type: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_exercise_id: string;
          set_number: number;
          weight?: number;
          reps?: number;
          unit?: string;
          rpe?: number | null;
          set_type?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_exercise_id?: string;
          set_number?: number;
          weight?: number;
          reps?: number;
          unit?: string;
          rpe?: number | null;
          set_type?: string;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      measurements: {
        Row: {
          id: string;
          owner_id: string;
          type: string;
          value: number;
          unit: string;
          measured_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: string;
          value: number;
          unit: string;
          measured_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          type?: string;
          value?: number;
          unit?: string;
          measured_at?: string;
          created_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          owner_id: string;
          url: string;
          thumbnail_url: string | null;
          body_part: string | null;
          taken_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          url: string;
          thumbnail_url?: string | null;
          body_part?: string | null;
          taken_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          url?: string;
          thumbnail_url?: string | null;
          body_part?: string | null;
          taken_at?: string;
          created_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          owner_id: string;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          tool_calls: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          tool_calls?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: string;
          content?: string;
          tool_calls?: Json | null;
          created_at?: string;
        };
      };
      ai_generations: {
        Row: {
          id: string;
          owner_id: string;
          type: string;
          draft: Json;
          status: string;
          source_model: string | null;
          provider: string | null;
          schema_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: string;
          draft: Json;
          status?: string;
          source_model?: string | null;
          provider?: string | null;
          schema_version?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          type?: string;
          draft?: Json;
          status?: string;
          source_model?: string | null;
          provider?: string | null;
          schema_version?: string | null;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_exercise_pr: {
        Args: { p_user_id: string; p_exercise_id: string };
        Returns: {
          max_weight: number;
          max_reps: number;
          estimated_1rm: number;
          last_performed: string;
        }[];
      };
      get_weekly_stats: {
        Args: { p_user_id: string; p_week_start?: string };
        Returns: {
          workout_count: number;
          total_sets: number;
          total_volume: number;
          total_minutes: number;
        }[];
      };
    };
  };
}
