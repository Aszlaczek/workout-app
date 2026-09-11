import { useState } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { exName, mkId } from "../lib/utils";
import type { Routine, RoutineExercise, Exercise } from "../types";

type Props = {
  routines: Routine[];
  setRoutines: (fn: (r: Routine[]) => Routine[]) => void;
  exercises: Exercise[];
  onStart: (r: Routine) => void;
  canStart: boolean;
};

export default function RoutineBuilder({ routines, setRoutines, exercises, onStart, canStart }: Props) {
  const { t } = useI18n();
  const [selId, setSelId] = useState<string | null>(routines[0]?.id ?? null);
  const [creating, setCreating] = useState(false);
  const [editName, setEditName] = useState("");
  const [editExercises, setEditExercises] = useState<RoutineExercise[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const routine = routines.find((r) => r.id === selId) ?? null;

  function startCreate() {
    setCreating(true);
    setEditingId(null);
    setEditName("");
    setEditExercises([]);
  }

  function startEdit(r: Routine) {
    setCreating(true);
    setEditingId(r.id);
    setEditName(r.name);
    setEditExercises([...r.exercises.map((e) => ({ ...e }))]);
  }

  function addExerciseToRoutine() {
    setEditExercises((prev) => [
      ...prev,
      { exerciseId: exercises[0]?.id ?? "", targetSets: 3, targetReps: 10 },
    ]);
  }

  function updateRoutineExercise(index: number, field: keyof RoutineExercise, value: number | string | boolean) {
    setEditExercises((prev) => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  }

  function moveExercise(index: number, dir: -1 | 1) {
    setEditExercises((prev) => {
      const arr = [...prev];
      const target = index + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  }

  function removeExercise(index: number) {
    setEditExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function saveRoutine() {
    if (!editName.trim()) return;
    if (editingId) {
      setRoutines((prev) => prev.map((r) => r.id === editingId ? { ...r, name: editName.trim(), exercises: editExercises } : r));
      setSelId(editingId);
    } else {
      const r: Routine = { id: mkId(), name: editName.trim(), exercises: editExercises };
      setRoutines((prev) => [...prev, r]);
      setSelId(r.id);
    }
    setCreating(false);
    setEditingId(null);
  }

  function deleteRoutine(id: string) {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    if (selId === id) setSelId(null);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight" style={{ color: C.text }}>
            {t("routines.title")}
          </h1>
          <button onClick={startCreate}
            className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 md:px-4 py-2 transition-all"
            style={{ background: C.orange, color: "#fff" }}>
            {t("routines.new")}
          </button>
        </div>

        {/* Mobile: horizontal scrollable routine list */}
        <div className="md:hidden mb-4 -mx-4 px-4 overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex gap-2">
            {routines.map((r) => (
              <button key={r.id} onClick={() => { setSelId(r.id); setCreating(false); }}
                className="shrink-0 font-display font-bold text-[10px] tracking-widest px-4 py-2.5 transition-all"
                style={{
                  background: selId === r.id && !creating ? C.orange : C.card,
                  color: selId === r.id && !creating ? "#fff" : C.muted,
                  border: `1px solid ${selId === r.id && !creating ? C.orange : C.border}`,
                }}>
                {r.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: 4-col grid with sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Desktop sidebar - hidden on mobile */}
          <div className="hidden md:block space-y-1">
            {routines.map((r) => (
              <div key={r.id} className="flex items-center">
                <button onClick={() => { setSelId(r.id); setCreating(false); }}
                  className="flex-1 text-left font-display font-bold text-sm tracking-widest px-4 py-3 transition-all"
                  style={{
                    background: selId === r.id && !creating ? C.orange : C.card,
                    color: selId === r.id && !creating ? "#fff" : C.muted,
                    borderLeft: selId === r.id && !creating ? `3px solid ${C.orange}` : "3px solid transparent",
                  }}>
                  {r.name.toUpperCase()}
                </button>
                <button onClick={() => deleteRoutine(r.id)}
                  className="px-2 py-3 font-mono text-xs transition-all"
                  style={{ color: C.muted }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
                  x
                </button>
              </div>
            ))}
          </div>

          {/* Detail / Edit */}
          <div className="md:col-span-3 slide-up" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
            {creating ? (
              /* Create/Edit form */
              <div className="p-4 md:p-6">
                <div className="font-display font-bold text-xs md:text-sm tracking-widest mb-3 md:mb-4" style={{ color: C.violet }}>
                  {editingId ? t("routines.editTitle") : t("routines.newRoutineTitle")}
                </div>
                <div className="mb-4">
                  <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("routines.name")}</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 font-mono text-sm outline-none"
                    style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                    onFocus={(e) => (e.target.style.borderColor = C.orange)}
                    onBlur={(e) => (e.target.style.borderColor = C.border)} />
                </div>

                <div className="space-y-3 mb-4">
                  {editExercises.map((re, i) => (
                    <div key={i} className="p-3 flex flex-wrap items-center gap-2"
                      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveExercise(i, -1)} disabled={i === 0}
                          className="font-mono text-xs px-1.5 py-1 disabled:opacity-30" style={{ color: C.muted }}>&#9650;</button>
                        <button onClick={() => moveExercise(i, 1)} disabled={i === editExercises.length - 1}
                          className="font-mono text-xs px-1.5 py-1 disabled:opacity-30" style={{ color: C.muted }}>&#9660;</button>
                      </div>
                      <select value={re.exerciseId} onChange={(e) => updateRoutineExercise(i, "exerciseId", e.target.value)}
                        className="flex-1 min-w-0 px-2 py-2 font-mono text-xs outline-none"
                        style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }}>
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>{ex.name}</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1">
                        <span className="font-display text-xs" style={{ color: C.muted }}>x</span>
                        <input type="number" value={re.targetSets} min={1} max={10}
                          onChange={(e) => updateRoutineExercise(i, "targetSets", Number(e.target.value))}
                          className="w-12 px-2 py-1.5 font-mono text-xs text-center outline-none"
                          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.orange }} />
                        <span className="font-display text-xs" style={{ color: C.muted }}>x</span>
                        <input type="number" value={re.targetReps} min={1} max={100}
                          onChange={(e) => updateRoutineExercise(i, "targetReps", Number(e.target.value))}
                          className="w-12 px-2 py-1.5 font-mono text-xs text-center outline-none"
                          style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text }} />
                      </div>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={!!re.superset}
                          onChange={(e) => updateRoutineExercise(i, "superset", e.target.checked)}
                          className="accent-[#7c3aed]" />
                        <span className="font-display text-xs" style={{ color: C.muted }}>SS</span>
                      </label>
                      <button onClick={() => removeExercise(i)}
                        className="font-mono text-xs px-1.5 py-1" style={{ color: C.red }}>x</button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <button onClick={addExerciseToRoutine}
                    className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 md:px-4 py-2 transition-all"
                    style={{ background: C.dim, color: C.muted, border: `1px solid ${C.border}` }}>
                    {t("routines.addExercise")}
                  </button>
                  <button onClick={saveRoutine}
                    className="font-display font-bold text-[10px] md:text-xs tracking-widest px-5 md:px-6 py-2 transition-all"
                    style={{ background: C.orange, color: "#fff" }}>
                    {t("routines.save")}
                  </button>
                  <button onClick={() => { setCreating(false); setEditingId(null); }}
                    className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 md:px-4 py-2 transition-all"
                    style={{ color: C.muted }}>
                    {t("routines.cancel")}
                  </button>
                </div>
              </div>
            ) : routine ? (
              /* View mode */
              <div className="p-4 md:p-6">
                <div className="flex items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
                  <h2 className="font-display font-black text-xl md:text-3xl tracking-tight" style={{ color: C.text }}>
                    {routine.name.toUpperCase()}
                  </h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(routine)}
                      className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 md:px-4 py-2 transition-all"
                      style={{ background: C.violet, color: "#fff" }}>
                      {t("routines.edit")}
                    </button>
                    <button onClick={() => onStart(routine)} disabled={canStart}
                      className="font-display font-black text-[10px] md:text-xs tracking-widest px-4 md:px-5 py-2.5 transition-all disabled:opacity-40"
                      style={{ background: C.orange, color: "#fff" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#ff7730")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = C.orange)}>
                      {t("routines.start")}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {routine.exercises.map((re, i) => {
                    const ex = exercises.find((x) => x.id === re.exerciseId);
                    return (
                      <div key={i} className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3"
                        style={{ background: re.superset ? C.violet + "11" : C.surface, borderLeft: `3px solid ${re.superset ? C.violet : C.dim}` }}>
                        <span className="font-mono text-[10px] md:text-xs w-5 md:w-6 shrink-0" style={{ color: C.muted }}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs md:text-sm truncate" style={{ color: C.text }}>
                            {exName(re.exerciseId, exercises)}
                          </div>
                          <div className="font-mono text-[10px] md:text-xs mt-0.5 truncate" style={{ color: C.muted }}>
                            {ex?.muscle ?? "—"}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-bold text-sm md:text-base" style={{ color: C.orange }}>{re.targetSets}</span>
                          <span className="font-mono text-[10px] md:text-xs mx-0.5" style={{ color: C.muted }}>x</span>
                          <span className="font-mono text-xs md:text-sm" style={{ color: C.text }}>{re.targetReps}</span>
                        </div>
                        {re.superset && (
                          <span className="font-display text-[10px] md:text-xs font-bold px-2 py-0.5 shrink-0" style={{ background: C.violet + "22", color: C.violet }}>SS</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 md:mt-4 font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>
                  {routine.exercises.length} {t("common.exercisesShort")} · {routine.exercises.reduce((s, e) => s + e.targetSets, 0)} {t("common.setsShort")}
                </div>

                {/* Mobile delete button */}
                <button onClick={() => deleteRoutine(routine.id)}
                  className="md:hidden mt-4 w-full font-display font-bold text-[10px] tracking-widest py-2.5 transition-all"
                  style={{ color: C.red, border: `1px solid ${C.red}` }}>
                  {t("routines.delete")}
                </button>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-center h-40">
                <p className="font-mono text-xs md:text-sm" style={{ color: C.muted }}>{t("routines.empty")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
