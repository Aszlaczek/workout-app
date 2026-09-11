export type Exercise = {
  id: string;
  name: string;
  category: "push" | "pull" | "legs" | "core";
  muscle: string;
  equipment: string;
  instructions: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  isCustom?: boolean;
};

export type SetLog = {
  id: string;
  weight: number;
  reps: number;
  rpe: number | null;
  done: boolean;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: SetLog[];
};

export type Workout = {
  id: string;
  routineId: string | null;
  routineName: string;
  date: string;
  duration: number;
  exercises: WorkoutExercise[];
  notes?: string;
};

export type RoutineExercise = {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetLoad?: number;
  targetRpe?: number;
  superset?: boolean;
  notes?: string;
};

export type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  template?: boolean;
};

export type RestTimerState = {
  duration: number;
  isRunning: boolean;
  remaining: number;
};

export type Settings = {
  language: "en" | "pl";
  theme: "dark" | "light";
  restTimerDefault: number;
};

export type ActiveSet = { weight: string; reps: string; rpe: string; done: boolean };
export type ActiveExercise = { exerciseId: string; sets: ActiveSet[] };
export type ActiveWorkout = {
  routineId: string | null;
  routineName: string;
  startedAt: number;
  exercises: ActiveExercise[];
};

export type View = "dashboard" | "exercises" | "routines" | "calendar" | "workout" | "progress" | "ai" | "settings";
