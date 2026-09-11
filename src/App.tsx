import { useState, useEffect, useCallback } from "react";
import { EXERCISES, SEED_ROUTINES, SEED_WORKOUTS, DEFAULT_SETTINGS } from "./data/seed";
import type { Exercise, Routine, Workout, ActiveWorkout, Settings, View } from "./types";
import { mkId } from "./lib/utils";
import { C } from "./lib/constants";
import { I18nProvider, useI18n } from "./i18n";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

import Login from "./features/Login";
import AppShell from "./AppShell";
import Dashboard from "./features/Dashboard";
import ExerciseLibrary from "./features/ExerciseLibrary";
import RoutineBuilder from "./features/RoutineBuilder";
import WorkoutLogger from "./features/WorkoutLogger";
import CalendarView from "./features/CalendarView";
import Progress from "./features/Progress";
import AiPanel from "./features/AiPanel";
import SettingsView from "./features/SettingsView";

type AppState = {
  user: { email: string; id: string } | null;
  routines: Routine[];
  workouts: Workout[];
  exercises: Exercise[];
  activeWorkout: ActiveWorkout | null;
  settings: Settings;
};

const STORAGE_KEY = "gym-progress-state";

function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

function saveState(state: AppState) {
  try {
    // Only save non-user data to localStorage
    const { user, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // ignore
  }
}

const initialState: AppState = {
  user: null,
  routines: SEED_ROUTINES,
  workouts: SEED_WORKOUTS,
  exercises: EXERCISES,
  activeWorkout: null,
  settings: DEFAULT_SETTINGS,
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setStateRaw] = useState<AppState>(() => {
    const saved = loadState();
    if (saved) {
      return { ...initialState, ...saved, user: null };
    }
    return initialState;
  });

  const authed = !!session;

  // Listen for Supabase auth changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }

    supabase?.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        setStateRaw((prev) => ({
          ...prev,
          user: { email: s.user.email ?? "", id: s.user.id },
        }));
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        if (s?.user) {
          setStateRaw((prev) => ({
            ...prev,
            user: { email: s.user.email ?? "", id: s.user.id },
          }));
        } else {
          setStateRaw((prev) => ({ ...prev, user: null }));
        }
        setAuthLoading(false);
      }
    ) ?? { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, []);

  function setState(fn: (s: AppState) => AppState) {
    setStateRaw((s) => {
      const next = fn(s);
      saveState(next);
      return next;
    });
  }

  // Save active workout to state
  useEffect(() => {
    if (state.activeWorkout) {
      saveState(state);
    }
  }, [state.activeWorkout]);

  function startWorkout(r: Routine) {
    setState((s) => ({
      ...s,
      activeWorkout: {
        routineId: r.id,
        routineName: r.name,
        startedAt: Date.now(),
        exercises: r.exercises.map((re) => ({
          exerciseId: re.exerciseId,
          sets: Array.from({ length: re.targetSets }, () => ({
            weight: "", reps: String(re.targetReps), rpe: "", done: false,
          })),
        })),
      },
    }));
    setView("workout");
  }

  function startEmptyWorkout() {
    setState((s) => ({
      ...s,
      activeWorkout: {
        routineId: null,
        routineName: "Wolny Trening",
        startedAt: Date.now(),
        exercises: [],
      },
    }));
    setView("workout");
  }

  function finishWorkout() {
    const aw = state.activeWorkout;
    if (!aw) return;
    const w: Workout = {
      id: mkId(),
      routineId: aw.routineId,
      routineName: aw.routineName,
      date: new Date().toISOString().slice(0, 10),
      duration: Math.max(1, Math.floor((Date.now() - aw.startedAt) / 60000)),
      exercises: aw.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.filter((s) => s.done).map((s) => ({
          id: mkId(), weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0, rpe: s.rpe ? Number(s.rpe) : null, done: true,
        })),
      })),
    };
    setState((s) => ({ ...s, activeWorkout: null, workouts: [w, ...s.workouts] }));
    setView("dashboard");
  }

  const handleLogout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { authService } = await import("./services/auth");
      await authService.signOut();
    }
    setSession(null);
    setState((s) => ({ ...s, user: null, activeWorkout: null }));
  }, [setState]);

  return (
    <I18nProvider settings={state.settings}>
      <AppContent
        state={state}
        setState={setState}
        view={view}
        setView={setView}
        authed={authed}
        authLoading={authLoading}
        onLogin={(email) => {
          // Session listener handles setting user
          if (!isSupabaseConfigured()) {
            setStateRaw((s) => ({ ...s, user: { email, id: "local-user" } }));
          }
        }}
        onLogout={handleLogout}
        startWorkout={startWorkout}
        finishWorkout={finishWorkout}
      />
    </I18nProvider>
  );
}

function AppContent({
  state,
  setState,
  view,
  setView,
  authed,
  authLoading,
  onLogin,
  onLogout,
  startWorkout,
  finishWorkout,
}: {
  state: AppState;
  setState: (fn: (s: AppState) => AppState) => void;
  view: View;
  setView: (v: View) => void;
  authed: boolean;
  authLoading: boolean;
  onLogin: (email: string) => void;
  onLogout: () => void;
  startWorkout: (r: Routine) => void;
  finishWorkout: () => void;
}) {
  const { t } = useI18n();

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: C.orange, borderTopColor: "transparent" }} />
          <p className="font-mono text-xs" style={{ color: C.muted }}>LADOWANIE...</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <Login onLogin={onLogin} />;
  }

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <AppShell view={view} setView={setView} hasActive={!!state.activeWorkout}
        onLogout={onLogout}>
        {view === "dashboard" && (
          <Dashboard state={state} onStart={startWorkout} setView={setView} />
        )}
        {view === "exercises" && (
          <ExerciseLibrary exercises={state.exercises}
            setExercises={(fn) => setState((s) => ({ ...s, exercises: fn(s.exercises) }))} />
        )}
        {view === "routines" && (
          <RoutineBuilder routines={state.routines}
            setRoutines={(fn) => setState((s) => ({ ...s, routines: fn(s.routines) }))}
            exercises={state.exercises} onStart={startWorkout} canStart={!!state.activeWorkout} />
        )}
        {view === "calendar" && (
          <CalendarView workouts={state.workouts} routines={state.routines} />
        )}
        {view === "workout" && state.activeWorkout ? (
          <WorkoutLogger active={state.activeWorkout} exercises={state.exercises}
            onUpdate={(w) => setState((s) => ({ ...s, activeWorkout: w }))}
            onFinish={finishWorkout} />
        ) : view === "workout" ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-sm mb-4" style={{ color: C.muted }}>{t("workout.noActive")}</p>
              <button onClick={() => setView("dashboard")}
                className="font-display font-bold text-xs tracking-widest px-6 py-3 transition-all"
                style={{ background: C.orange, color: "#fff" }}>
                {t("workout.backToDashboard")}
              </button>
            </div>
          </div>
        ) : null}
        {view === "progress" && (
          <Progress exercises={state.exercises} workouts={state.workouts} />
        )}
        {view === "ai" && <AiView />}
        {view === "settings" && (
          <SettingsView settings={state.settings} userEmail={state.user?.email ?? ""}
            onUpdate={(fn) => setState((s) => ({ ...s, settings: fn(s.settings) }))}
            onLogout={onLogout} />
        )}
      </AppShell>

      {authed && (
        <AiPanel exercises={state.exercises}
          setExercises={(fn) => setState((s) => ({ ...s, exercises: fn(s.exercises) }))}
          routines={state.routines}
          setRoutines={(fn) => setState((s) => ({ ...s, routines: fn(s.routines) }))}
          setView={setView} />
      )}
    </div>
  );
}

function AiView() {
  const { t } = useI18n();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display font-black text-4xl tracking-tight mb-4" style={{ color: C.text }}>
          {t("ai.title")}
        </h1>
        <p className="font-mono text-xs mb-6" style={{ color: C.muted }}>
          {t("ai.description")}
        </p>

        <div className="p-5 mb-6" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
          <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.violet }}>
            {t("ai.availableCommands")}
          </div>
          <div className="space-y-2 font-mono text-xs" style={{ color: C.muted }}>
            <div><span style={{ color: C.orange }}>dodaj cwiczenie</span> [nazwa] [push|pull|legs|core]</div>
            <div><span style={{ color: C.orange }}>nowy trening</span> [nazwa rutyny]</div>
            <div><span style={{ color: C.orange }}>dodaj serie</span> [kg]x[reps]</div>
            <div><span style={{ color: C.orange }}>zakoncz trening</span></div>
            <div><span style={{ color: C.orange }}>nowa rutyne</span> [nazwa]</div>
            <div><span style={{ color: C.orange }}>pokaz progres</span></div>
            <div><span style={{ color: C.orange }}>kalendarz | rutyny | dashboard | cwiczenia | ustawienia</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
