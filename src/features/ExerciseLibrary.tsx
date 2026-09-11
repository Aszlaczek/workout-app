import { useState } from "react";
import { C } from "../lib/constants";
import { exName, mkId } from "../lib/utils";
import type { Exercise } from "../types";

type Props = {
  exercises: Exercise[];
  setExercises: (fn: (e: Exercise[]) => Exercise[]) => void;
};

const CATEGORIES = ["all", "push", "pull", "legs", "core"] as const;
const CATEGORY_LABELS: Record<string, string> = { all: "Wszystkie", push: "Push", pull: "Pull", legs: "Legs", core: "Core" };
const EQUIPMENT_OPTIONS = ["all", "Sztanga", "Wyciąg", "Poręcze", "Drazek", "Maszyna", "Wlasne cialo", "Kolko do brzuszkow"];

export default function ExerciseLibrary({ exercises, setExercises }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [eqFilter, setEqFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState<Exercise["category"]>("push");
  const [newMuscle, setNewMuscle] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newInstructions, setNewInstructions] = useState("");

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.muscle.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || e.category === catFilter;
    const matchEq = eqFilter === "all" || e.equipment === eqFilter;
    return matchSearch && matchCat && matchEq;
  });

  function createExercise() {
    if (!newName.trim()) return;
    const ex: Exercise = {
      id: mkId(),
      name: newName.trim(),
      category: newCat,
      muscle: newMuscle || "—",
      equipment: newEquipment || "—",
      instructions: newInstructions.split("\n").filter(Boolean),
      difficulty: "intermediate",
      isCustom: true,
    };
    setExercises((prev) => [...prev, ex]);
    setNewName("");
    setNewMuscle("");
    setNewEquipment("");
    setNewInstructions("");
    setShowCreate(false);
  }

  const diffColors: Record<string, string> = {
    beginner: C.green,
    intermediate: C.orange,
    advanced: C.red,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-black text-4xl tracking-tight" style={{ color: C.text }}>
            CWICZENIA
          </h1>
          <button onClick={() => setShowCreate(!showCreate)}
            className="font-display font-bold text-xs tracking-widest px-4 py-2 transition-all"
            style={{ background: C.violet, color: "#fff" }}>
            {showCreate ? "ANULUJ" : "+ STWORZ"}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="mb-6 p-5 slide-up" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
            <div className="font-display font-bold text-sm tracking-widest mb-4" style={{ color: C.violet }}>
              NOWE CWICZENIE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-display text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>NAZWA</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>KATEGORIA</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value as Exercise["category"])}
                  className="w-full px-3 py-2 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
                  <option value="push">Push</option>
                  <option value="pull">Pull</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                </select>
              </div>
              <div>
                <label className="block font-display text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>MIESNIE</label>
                <input value={newMuscle} onChange={(e) => setNewMuscle(e.target.value)}
                  className="w-full px-3 py-2 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>SPRZET</label>
                <input value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)}
                  className="w-full px-3 py-2 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block font-display text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>INSTRUKCJE (po 1 na linie)</label>
              <textarea value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)}
                rows={3} className="w-full px-3 py-2 font-mono text-sm outline-none resize-none"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                onFocus={(e) => (e.target.style.borderColor = C.violet)}
                onBlur={(e) => (e.target.style.borderColor = C.border)} />
            </div>
            <button onClick={createExercise}
              className="mt-3 font-display font-bold text-xs tracking-widest px-6 py-2 transition-all"
              style={{ background: C.violet, color: "#fff" }}>
              DODAJ CWICZENIE
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj cwiczenia..."
            className="w-full px-4 py-3 font-mono text-sm outline-none"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
            onFocus={(e) => (e.target.style.borderColor = C.orange)}
            onBlur={(e) => (e.target.style.borderColor = C.border)} />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className="font-display font-bold text-xs tracking-widest px-3 py-1.5 transition-all"
              style={{
                background: catFilter === cat ? C.orange : C.card,
                color: catFilter === cat ? "#fff" : C.muted,
                border: `1px solid ${catFilter === cat ? C.orange : C.border}`,
              }}>
              {CATEGORY_LABELS[cat].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Equipment filter */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <button key={eq} onClick={() => setEqFilter(eq)}
              className="font-display font-bold text-xs tracking-widest px-3 py-1 transition-all"
              style={{
                background: eqFilter === eq ? C.violet : "transparent",
                color: eqFilter === eq ? "#fff" : C.muted,
                border: `1px solid ${eqFilter === eq ? C.violet : C.dim}`,
              }}>
              {eq === "all" ? "Wszystkie sprzet" : eq.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exercise cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((ex) => (
            <button key={ex.id} onClick={() => setSelected(ex)}
              className="p-4 text-left transition-all"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${ex.category === "push" ? C.orange : ex.category === "pull" ? C.violet : ex.category === "legs" ? C.cyan : C.green}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-display font-bold text-base tracking-wide" style={{ color: C.text }}>
                  {ex.name}
                </div>
                <span className="font-display text-xs font-bold px-2 py-0.5 shrink-0 ml-2"
                  style={{ background: C.dim, color: C.muted }}>
                  {ex.category.toUpperCase()}
                </span>
              </div>
              <div className="font-mono text-xs" style={{ color: C.muted }}>
                {ex.muscle} · {ex.equipment}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-xs px-2 py-0.5"
                  style={{ color: diffColors[ex.difficulty], background: diffColors[ex.difficulty] + "15" }}>
                  {ex.difficulty.toUpperCase()}
                </span>
                {ex.isCustom && (
                  <span className="font-mono text-xs px-2 py-0.5" style={{ color: C.violet, background: C.violet + "15" }}>
                    CUSTOM
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-sm" style={{ color: C.muted }}>Brak cwiczen pasujacych do filtrów.</p>
          </div>
        )}

        {/* Detail modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fade-in"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setSelected(null)}>
            <div className="w-full max-w-lg p-6 slide-up" onClick={(e) => e.stopPropagation()}
              style={{ background: C.card, borderTop: `3px solid ${C.orange}` }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-black text-2xl tracking-tight" style={{ color: C.text }}>
                  {selected.name}
                </h2>
                <button onClick={() => setSelected(null)} className="font-mono text-lg" style={{ color: C.muted }}>x</button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-display text-xs font-bold px-2 py-1"
                  style={{ background: C.orange + "22", color: C.orange }}>
                  {selected.category.toUpperCase()}
                </span>
                <span className="font-mono text-xs px-2 py-1" style={{ background: C.dim, color: C.muted }}>
                  {selected.muscle}
                </span>
                <span className="font-mono text-xs px-2 py-1" style={{ background: C.dim, color: C.muted }}>
                  {selected.equipment}
                </span>
              </div>

              {selected.instructions.length > 0 && (
                <div className="mb-4">
                  <div className="font-display font-bold text-xs tracking-widest mb-2" style={{ color: C.muted }}>
                    INSTRUKCJE
                  </div>
                  <ol className="space-y-1.5">
                    {selected.instructions.map((inst, i) => (
                      <li key={i} className="font-mono text-xs leading-relaxed flex gap-2"
                        style={{ color: C.text }}>
                        <span style={{ color: C.orange }}>{i + 1}.</span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: `1px solid ${C.dim}` }}>
                <div>
                  <div className="font-display font-bold text-xs tracking-widest" style={{ color: C.muted }}>TRUDNOSC</div>
                  <div className="font-mono text-sm mt-1" style={{ color: diffColors[selected.difficulty] }}>
                    {selected.difficulty.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xs tracking-widest" style={{ color: C.muted }}>SPRZET</div>
                  <div className="font-mono text-sm mt-1" style={{ color: C.text }}>
                    {selected.equipment}
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xs tracking-widest" style={{ color: C.muted }}>TYP</div>
                  <div className="font-mono text-sm mt-1" style={{ color: C.text }}>
                    {selected.isCustom ? "CUSTOM" : "BIBLIOTEKA"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
