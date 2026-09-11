import { useState, useEffect } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { exName, mkId, formatDuration } from "../lib/utils";
import type { ActiveWorkout, Exercise, Workout } from "../types";

type Props = {
  active: ActiveWorkout;
  onUpdate: (w: ActiveWorkout) => void;
  onFinish: () => void;
  exercises: Exercise[];
};

export default function WorkoutLogger({ active, onUpdate, onFinish, exercises }: Props) {
  const { t } = useI18n();
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - active.startedAt) / 60000));
  const [timer, setTimer] = useState<{ running: boolean; remaining: number; duration: number }>({
    running: false,
    remaining: 90,
    duration: 90,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<Workout | null>(null);

  useEffect(() => {
    const i = setInterval(() => setElapsed(Math.floor((Date.now() - active.startedAt) / 60000)), 10000);
    return () => clearInterval(i);
  }, [active.startedAt]);

  useEffect(() => {
    if (!timer.running) return;
    const i = setInterval(() => {
      setTimer((prev) => {
        if (prev.remaining <= 1) {
          clearInterval(i);
          return { ...prev, running: false, remaining: 0 };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
    return () => clearInterval(i);
  }, [timer.running]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        toggleRestTimer();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalDone = active.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);

  function toggleSet(ei: number, si: number) {
    const n = structuredClone(active);
    n.exercises[ei].sets[si].done = !n.exercises[ei].sets[si].done;
    onUpdate(n);
  }

  function updateField(ei: number, si: number, field: "weight" | "reps" | "rpe", val: string) {
    const n = structuredClone(active);
    n.exercises[ei].sets[si][field] = val;
    onUpdate(n);
  }

  function addSet(ei: number) {
    const n = structuredClone(active);
    const prev = n.exercises[ei].sets.at(-1);
    n.exercises[ei].sets.push({ weight: prev?.weight ?? "", reps: prev?.reps ?? "10", rpe: "", done: false });
    onUpdate(n);
  }

  function removeSet(ei: number, si: number) {
    const n = structuredClone(active);
    n.exercises[ei].sets.splice(si, 1);
    onUpdate(n);
  }

  function toggleRestTimer() {
    setTimer((prev) => {
      if (prev.running) return { ...prev, running: false };
      return { ...prev, running: true, remaining: prev.duration };
    });
  }

  function setRestDuration(d: number) {
    setTimer((prev) => ({ ...prev, duration: d, remaining: d }));
  }

  function handleFinish() {
    const aw = active;
    const w: Workout = {
      id: mkId(),
      routineId: aw.routineId,
      routineName: aw.routineName,
      date: new Date().toISOString().slice(0, 10),
      duration: Math.max(1, Math.floor((Date.now() - aw.startedAt) / 60000)),
      exercises: aw.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.filter((s) => s.done).map((s) => ({
          id: mkId(),
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          rpe: s.rpe ? Number(s.rpe) : null,
          done: true,
        })),
      })),
    };
    setSummaryData(w);
    setShowSummary(true);
  }

  function confirmFinish() {
    onFinish();
  }

  if (showSummary && summaryData) {
    const totalVolume = summaryData.exercises.reduce(
      (s, e) => s + e.sets.reduce((a, set) => a + set.weight * set.reps, 0),
      0
    );
    const totalSetsCount = summaryData.exercises.reduce((s, e) => s + e.sets.length, 0);

    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
          <div className="text-center mb-6 md:mb-8 slide-up">
            <div className="font-display font-black text-3xl md:text-6xl tracking-tight mb-2" style={{ color: C.orange }}>
              {t("workout.finished")}
            </div>
            <div className="font-mono text-xs md:text-sm" style={{ color: C.muted }}>
              {t("workout.greatJob")}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
            {[
              { label: t("workout.time"), val: formatDuration(summaryData.duration) },
              { label: t("workout.sets"), val: String(totalSetsCount) },
              { label: t("workout.volume"), val: `${(totalVolume / 1000).toFixed(1)}k kg` },
            ].map(({ label, val }) => (
              <div key={label} className="p-3 md:p-5 text-center" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
                <div className="font-display font-bold text-[9px] md:text-xs tracking-widest mb-1" style={{ color: C.muted }}>{label}</div>
                <div className="font-mono font-bold text-lg md:text-2xl" style={{ color: C.text }}>{val}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
            {summaryData.exercises.map((e, i) => (
              <div key={i} className="p-3 md:p-4" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
                <div className="font-display font-bold text-xs md:text-sm tracking-wide" style={{ color: C.text }}>
                  {exName(e.exerciseId, exercises)}
                </div>
                <div className="font-mono text-[10px] md:text-xs mt-1 break-all" style={{ color: C.muted }}>
                  {e.sets.map((s, si) => `${s.weight}x${s.reps}`).join(" · ")}
                </div>
              </div>
            ))}
          </div>

          <button onClick={confirmFinish}
            className="w-full font-display font-black text-xs md:text-sm tracking-widest py-3.5 md:py-4 transition-all"
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ff7730")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.orange)}>
            {t("workout.saveAndFinish")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 md:mb-6 gap-3">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-[10px] md:text-xs mb-1 flex items-center gap-2" style={{ color: C.cyan }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: C.cyan }} />
              {t("workout.active")}
            </div>
            <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight truncate" style={{ color: C.text }}>
              {active.routineName.toUpperCase()}
            </h1>
            <div className="font-mono text-[10px] md:text-sm mt-1" style={{ color: C.muted }}>
              {formatDuration(elapsed)} · {totalDone} {t("common.setsShort")}
            </div>
          </div>
          <button onClick={handleFinish}
            className="font-display font-black text-[10px] md:text-xs tracking-widest px-4 md:px-6 py-2.5 md:py-3 transition-all shrink-0"
            style={{ background: C.orange, color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ff7730")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.orange)}>
            {t("workout.finish")}
          </button>
        </div>

        {/* Rest timer */}
        <div className="mb-5 md:mb-6 p-3 md:p-4 flex items-center justify-between gap-3"
          style={{ background: timer.running ? C.cyan + "11" : C.card, border: `1px solid ${timer.running ? C.cyan : C.border}` }}>
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={toggleRestTimer}
              className="font-display font-black text-lg md:text-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all shrink-0"
              style={{ background: timer.running ? C.cyan : C.orange, color: "#fff" }}>
              {timer.running ? "||" : "►"}
            </button>
            <div>
              <div className="font-mono font-bold text-2xl md:text-3xl" style={{ color: timer.running ? C.cyan : C.text }}>
                {Math.floor(timer.remaining / 60)}:{String(timer.remaining % 60).padStart(2, "0")}
              </div>
              <div className="font-display font-bold text-[9px] md:text-xs tracking-widest" style={{ color: C.muted }}>
                {timer.running ? t("workout.rest") : t("workout.timer")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[60, 90, 120, 180].map((d) => (
              <button key={d} onClick={() => setRestDuration(d)}
                className="font-mono text-[10px] md:text-xs px-1.5 md:px-2 py-1 transition-all"
                style={{
                  background: timer.duration === d ? C.orange : "transparent",
                  color: timer.duration === d ? "#fff" : C.muted,
                  border: `1px solid ${timer.duration === d ? C.orange : C.dim}`,
                }}>
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-4 md:space-y-5">
          {active.exercises.map((ex, ei) => (
            <div key={ei} className="p-3 md:p-5" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
              <div className="font-display font-bold text-sm md:text-lg tracking-wide mb-3 md:mb-4" style={{ color: C.text }}>
                {exName(ex.exerciseId, exercises).toUpperCase()}
              </div>

              <div className="space-y-1.5 md:space-y-2">
                {/* Column headers */}
                <div className="hidden md:grid grid-cols-[24px_1fr_1fr_1fr_32px_28px] gap-2 font-display font-bold text-xs tracking-widest px-1 mb-1"
                  style={{ color: C.muted }}>
                  <span>#</span><span>KG</span><span>POWT.</span><span>RPE</span><span /><span />
                </div>

                {ex.sets.map((s, si) => (
                  <div key={si} className={`flex items-center gap-1.5 md:grid md:grid-cols-[24px_1fr_1fr_1fr_32px_28px] md:gap-2 transition-opacity ${s.done ? "opacity-50" : ""}`}>
                    <span className="font-mono text-[10px] md:text-xs text-center w-5 md:w-6 shrink-0" style={{ color: C.muted }}>{si + 1}</span>
                    {(["weight", "reps", "rpe"] as const).map((field) => (
                      <input key={field} type="number" value={s[field]}
                        onChange={(e) => updateField(ei, si, field, e.target.value)}
                        placeholder={field === "rpe" ? "-" : "0"}
                        className="px-1.5 md:px-2 py-1.5 md:py-1.5 font-mono text-xs md:text-sm text-center outline-none transition-all flex-1 md:flex-none min-w-0"
                        style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                        onFocus={(e) => (e.target.style.borderColor = C.violet)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    ))}
                    <button onClick={() => toggleSet(ei, si)}
                      className="w-8 h-8 flex items-center justify-center font-mono text-xs transition-all shrink-0"
                      style={{
                        background: s.done ? C.orange : "transparent",
                        border: `1px solid ${s.done ? C.orange : C.border}`,
                        color: s.done ? "#fff" : C.muted,
                      }}>
                      {s.done ? "✓" : "○"}
                    </button>
                    <button onClick={() => removeSet(ei, si)}
                      className="w-7 h-7 flex items-center justify-center font-mono text-xs shrink-0"
                      style={{ color: C.muted }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                      x
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => addSet(ei)} className="mt-2.5 md:mt-3 font-display font-bold text-[10px] md:text-xs tracking-widest transition-all"
                style={{ color: C.muted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.violet)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                {t("workout.addSet")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
