import { useMemo } from "react";
import { C } from "../lib/constants";
import { exName, formatDuration, formatDate } from "../lib/utils";
import type { Routine, Workout, Exercise, ActiveWorkout } from "../types";

export default function Dashboard({ state, onStart, setView }: {
  state: { workouts: Workout[]; routines: Routine[]; exercises: Exercise[]; activeWorkout: ActiveWorkout | null };
  onStart: (r: Routine) => void;
  setView: (v: "dashboard" | "exercises" | "routines" | "calendar" | "workout" | "progress" | "ai" | "settings") => void;
}) {
  const { workouts, routines } = state;
  const recent = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
  const totalSets = workouts.reduce((n, w) => n + w.exercises.reduce((m, e) => m + e.sets.filter((s) => s.done).length, 0), 0);
  const totalMin = workouts.reduce((n, w) => n + w.duration, 0);

  // Weekly volume (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekWorkouts = workouts.filter((w) => new Date(w.date) >= weekAgo);
  const weekVolume = weekWorkouts.reduce((n, w) => n + w.exercises.reduce((m, e) => m + e.sets.filter((s) => s.done).reduce((a, s) => a + (Number(s.weight) * s.reps), 0), 0), 0);

  // Streak
  const streak = useMemo(() => {
    const dates = [...new Set(workouts.map((w) => w.date))].sort().reverse();
    let count = 0;
    const today = new Date().toISOString().slice(0, 10);
    const d = new Date();
    for (let i = 0; i < 60; i++) {
      const iso = d.toISOString().slice(0, 10);
      if (dates.includes(iso)) {
        count++;
      } else if (iso !== today && count > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [workouts]);

  // Recent PRs
  const prs = useMemo(() => {
    const byEx: Record<string, { max: number; date: string }[]> = {};
    workouts.forEach((w) => {
      w.exercises.forEach((e) => {
        const maxSet = e.sets.filter((s) => s.done).reduce((best, s) => s.weight > best ? s.weight : best, 0);
        if (!byEx[e.exerciseId]) byEx[e.exerciseId] = [];
        byEx[e.exerciseId].push({ max: maxSet, date: w.date });
      });
    });
    const result: { name: string; weight: number; date: string }[] = [];
    Object.entries(byEx).forEach(([id, sessions]) => {
      sessions.sort((a, b) => (a.date > b.date ? 1 : -1));
      for (let i = 1; i < sessions.length; i++) {
        if (sessions[i].max > sessions[i - 1].max) {
          result.push({ name: exName(id, state.exercises), weight: sessions[i].max, date: sessions[i].date });
        }
      }
    });
    return result.slice(0, 3);
  }, [workouts, state.exercises]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Headline */}
        <div className="mb-8 flex items-end gap-6">
          <div>
            <p className="font-mono text-xs mb-1" style={{ color: C.muted }}>
              {new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
            </p>
            <h1 className="font-display font-black text-5xl tracking-tight leading-none" style={{ color: C.text }}>
              DZIEN<br /><span style={{ color: C.orange }}>ROBOCZY</span>
            </h1>
          </div>
          <div className="ml-auto text-right">
            {state.activeWorkout && (
              <button onClick={() => setView("workout")}
                className="flex items-center gap-2 font-display font-bold text-sm tracking-widest px-4 py-2"
                style={{ background: C.cyan + "22", color: C.cyan, border: `1px solid ${C.cyan}` }}>
                <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: C.cyan }} />
                TRENING W TOKU
              </button>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "TRENINGI", val: workouts.length, color: C.orange },
            { label: "SERIE", val: totalSets, color: C.violet },
            { label: "MINUTY", val: totalMin, color: C.cyan },
            { label: "SERIA", val: streak, color: C.green },
          ].map(({ label, val, color }) => (
            <div key={label} className="p-4 relative overflow-hidden"
              style={{ background: C.card, borderLeft: `3px solid ${color}` }}>
              <div className="font-mono text-3xl font-bold" style={{ color: C.text }}>{val}</div>
              <div className="font-display font-bold text-xs tracking-widest mt-1" style={{ color: C.muted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Weekly volume */}
        <div className="mb-8 p-4" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
          <div className="font-display font-bold text-xs tracking-widest" style={{ color: C.muted }}>OBJETOSC TYGODNIA</div>
          <div className="font-mono text-2xl font-bold mt-1" style={{ color: C.text }}>
            {weekVolume > 0 ? `${(weekVolume / 1000).toFixed(1)}k kg` : "0 kg"}
          </div>
          <div className="font-mono text-xs mt-1" style={{ color: C.muted }}>
            {weekWorkouts.length} treningow w tym tygodniu
          </div>
        </div>

        {/* Quick start */}
        <div className="mb-8">
          <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
            SZYBKI START
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {routines.map((r) => (
              <button key={r.id} onClick={() => onStart(r)}
                disabled={!!state.activeWorkout}
                className="p-4 text-left group transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => { if (!state.activeWorkout) e.currentTarget.style.borderColor = C.orange; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}>
                <div className="font-display font-black text-2xl tracking-tight" style={{ color: C.text }}>
                  {r.name}
                </div>
                <div className="font-mono text-xs mt-1" style={{ color: C.muted }}>
                  {r.exercises.length} cw. · {r.exercises.reduce((s, e) => s + e.targetSets, 0)} serii
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start empty workout */}
        <div className="mb-8">
          <button onClick={() => setView("workout")}
            className="w-full p-4 text-left transition-all flex items-center justify-center gap-2 font-display font-bold text-sm tracking-widest"
            style={{ background: C.dim, border: `1px dashed ${C.border}`, color: C.muted }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}>
            + NOWY TRENING (PUSTY)
          </button>
        </div>

        {/* Recent PRs */}
        {prs.length > 0 && (
          <div className="mb-8">
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              REKORDY (PR)
            </div>
            <div className="space-y-2">
              {prs.map((pr, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3"
                  style={{ background: C.card, borderLeft: `2px solid ${C.cyan}` }}>
                  <div className="font-display font-bold text-base tracking-wide flex-1" style={{ color: C.text }}>
                    {pr.name}
                  </div>
                  <div className="font-mono font-bold text-xl" style={{ color: C.cyan }}>
                    {pr.weight} kg
                  </div>
                  <div className="font-mono text-xs" style={{ color: C.muted }}>
                    {formatDate(pr.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent workouts */}
        <div>
          <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
            HISTORIA
          </div>
          <div className="space-y-2">
            {recent.map((w, i) => {
              const setsCount = w.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);
              return (
                <div key={w.id} className="flex items-center gap-4 px-4 py-3"
                  style={{ background: i === 0 ? C.card : C.surface, borderLeft: `2px solid ${i === 0 ? C.orange : C.dim}` }}>
                  <div className="font-mono text-xs w-20 shrink-0" style={{ color: C.muted }}>
                    {formatDate(w.date)}
                  </div>
                  <div className="font-display font-bold text-base tracking-wide flex-1" style={{ color: C.text }}>
                    {w.routineName}
                  </div>
                  <div className="font-mono text-xs text-right" style={{ color: C.muted }}>
                    {setsCount} serii · {formatDuration(w.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
