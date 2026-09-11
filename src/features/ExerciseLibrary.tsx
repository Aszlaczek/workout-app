import { useState } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { exName, mkId } from "../lib/utils";
import type { Exercise } from "../types";

type Props = {
  exercises: Exercise[];
  setExercises: (fn: (e: Exercise[]) => Exercise[]) => void;
};

const CATEGORIES = ["all", "push", "pull", "legs", "core"] as const;

export default function ExerciseLibrary({ exercises, setExercises }: Props) {
  const { t } = useI18n();
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

  const EQUIPMENT_OPTIONS = ["all", "Sztanga", "Wyciąg", "Poręcze", "Drazek", "Maszyna", "Wlasne cialo", "Kolko do brzuszkow"];

  const CATEGORY_LABELS: Record<string, string> = { all: t("common.all"), push: "Push", pull: "Pull", legs: "Legs", core: "Core" };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
        <div className="flex items-center justify-between mb-5 md:mb-8">
          <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight" style={{ color: C.text }}>
            {t("exercises.title")}
          </h1>
          <button onClick={() => setShowCreate(!showCreate)}
            className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 md:px-4 py-2 transition-all"
            style={{ background: C.violet, color: "#fff" }}>
            {showCreate ? t("exercises.cancel") : t("exercises.create")}
          </button>
        </div>

        {/* Create form */}
        {showCreate && (
          <div className="mb-5 md:mb-6 p-4 md:p-5 slide-up" style={{ background: C.card, borderLeft: `3px solid ${C.violet}` }}>
            <div className="font-display font-bold text-xs md:text-sm tracking-widest mb-3 md:mb-4" style={{ color: C.violet }}>
              {t("exercises.newTitle")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("exercises.name")}</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("exercises.category")}</label>
                <select value={newCat} onChange={(e) => setNewCat(e.target.value as Exercise["category"])}
                  className="w-full px-3 py-2.5 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
                  <option value="push">Push</option>
                  <option value="pull">Pull</option>
                  <option value="legs">Legs</option>
                  <option value="core">Core</option>
                </select>
              </div>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("exercises.muscle")}</label>
                <input value={newMuscle} onChange={(e) => setNewMuscle(e.target.value)}
                  className="w-full px-3 py-2.5 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("exercises.equipment")}</label>
                <input value={newEquipment} onChange={(e) => setNewEquipment(e.target.value)}
                  className="w-full px-3 py-2.5 font-mono text-sm outline-none"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.violet)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </div>
            <div className="mt-3">
              <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1" style={{ color: C.muted }}>{t("exercises.instructions")}</label>
              <textarea value={newInstructions} onChange={(e) => setNewInstructions(e.target.value)}
                rows={3} className="w-full px-3 py-2.5 font-mono text-sm outline-none resize-none"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                onFocus={(e) => (e.target.style.borderColor = C.violet)}
                onBlur={(e) => (e.target.style.borderColor = C.border)} />
            </div>
            <button onClick={createExercise}
              className="mt-3 font-display font-bold text-xs tracking-widest px-6 py-2.5 transition-all"
              style={{ background: C.violet, color: "#fff" }}>
              {t("exercises.add")}
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-3 md:mb-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("exercises.search")}
            className="w-full px-4 py-3 font-mono text-sm outline-none"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
            onFocus={(e) => (e.target.style.borderColor = C.orange)}
            onBlur={(e) => (e.target.style.borderColor = C.border)} />
        </div>

        {/* Category filter - horizontal scroll on mobile */}
        <div className="flex gap-1.5 mb-3 md:mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" style={{ WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 py-1.5 transition-all shrink-0"
              style={{
                background: catFilter === cat ? C.orange : C.card,
                color: catFilter === cat ? "#fff" : C.muted,
                border: `1px solid ${catFilter === cat ? C.orange : C.border}`,
              }}>
              {CATEGORY_LABELS[cat].toUpperCase()}
            </button>
          ))}
        </div>

        {/* Equipment filter - horizontal scroll on mobile */}
        <div className="flex gap-1.5 mb-5 md:mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap" style={{ WebkitOverflowScrolling: "touch" }}>
          {EQUIPMENT_OPTIONS.map((eq) => (
            <button key={eq} onClick={() => setEqFilter(eq)}
              className="font-display font-bold text-[10px] md:text-xs tracking-widest px-3 py-1 transition-all shrink-0"
              style={{
                background: eqFilter === eq ? C.violet : "transparent",
                color: eqFilter === eq ? "#fff" : C.muted,
                border: `1px solid ${eqFilter === eq ? C.violet : C.dim}`,
              }}>
              {eq === "all" ? t("exercises.allEquipment") : eq.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exercise cards - single column mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {filtered.map((ex) => (
            <button key={ex.id} onClick={() => setSelected(ex)}
              className="p-3 md:p-4 text-left transition-all"
              style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${ex.category === "push" ? C.orange : ex.category === "pull" ? C.violet : ex.category === "legs" ? C.cyan : C.green}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
              <div className="flex items-start justify-between mb-1.5 md:mb-2">
                <div className="font-display font-bold text-sm md:text-base tracking-wide min-w-0 flex-1 truncate mr-2" style={{ color: C.text }}>
                  {ex.name}
                </div>
                <span className="font-display text-[10px] md:text-xs font-bold px-2 py-0.5 shrink-0"
                  style={{ background: C.dim, color: C.muted }}>
                  {ex.category.toUpperCase()}
                </span>
              </div>
              <div className="font-mono text-[10px] md:text-xs truncate" style={{ color: C.muted }}>
                {ex.muscle} · {ex.equipment}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[10px] md:text-xs px-2 py-0.5"
                  style={{ color: diffColors[ex.difficulty], background: diffColors[ex.difficulty] + "15" }}>
                  {ex.difficulty.toUpperCase()}
                </span>
                {ex.isCustom && (
                  <span className="font-mono text-[10px] md:text-xs px-2 py-0.5" style={{ color: C.violet, background: C.violet + "15" }}>
                    {t("exercises.custom")}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 md:py-12">
            <p className="font-mono text-xs md:text-sm" style={{ color: C.muted }}>{t("exercises.empty")}</p>
          </div>
        )}

        {/* Detail modal - fullscreen on mobile */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 fade-in"
            style={{ background: "var(--color-overlay)" }}
            onClick={() => setSelected(null)}>
            <div className="w-full md:max-w-lg md:p-6 slide-up rounded-t-xl md:rounded-none" onClick={(e) => e.stopPropagation()}
              style={{ background: C.card, borderTop: `3px solid ${C.orange}`, maxHeight: "90vh", overflowY: "auto" }}>
              <div className="p-4 md:p-0 md:mb-4">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h2 className="font-display font-black text-xl md:text-2xl tracking-tight" style={{ color: C.text }}>
                    {selected.name}
                  </h2>
                  <button onClick={() => setSelected(null)} className="font-mono text-lg w-10 h-10 flex items-center justify-center" style={{ color: C.muted }}>x</button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-display text-[10px] md:text-xs font-bold px-2 py-1"
                    style={{ background: C.orange + "22", color: C.orange }}>
                    {selected.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] md:text-xs px-2 py-1" style={{ background: C.dim, color: C.muted }}>
                    {selected.muscle}
                  </span>
                  <span className="font-mono text-[10px] md:text-xs px-2 py-1" style={{ background: C.dim, color: C.muted }}>
                    {selected.equipment}
                  </span>
                </div>
              </div>

              <div className="px-4 md:px-0 pb-4 md:pb-0">
                {selected.instructions.length > 0 && (
                  <div className="mb-4">
                    <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2" style={{ color: C.muted }}>
                      {t("exercises.instructionsLabel")}
                    </div>
                    <ol className="space-y-1.5">
                      {selected.instructions.map((inst, i) => (
                        <li key={i} className="font-mono text-[10px] md:text-xs leading-relaxed flex gap-2"
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
                    <div className="font-display font-bold text-[9px] md:text-xs tracking-widest" style={{ color: C.muted }}>{t("exercises.difficulty")}</div>
                    <div className="font-mono text-xs md:text-sm mt-1" style={{ color: diffColors[selected.difficulty] }}>
                      {selected.difficulty.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[9px] md:text-xs tracking-widest" style={{ color: C.muted }}>{t("exercises.equipmentLabel")}</div>
                    <div className="font-mono text-xs md:text-sm mt-1" style={{ color: C.text }}>
                      {selected.equipment}
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[9px] md:text-xs tracking-widest" style={{ color: C.muted }}>{t("exercises.type")}</div>
                    <div className="font-mono text-xs md:text-sm mt-1" style={{ color: C.text }}>
                      {selected.isCustom ? t("exercises.custom") : t("exercises.library")}
                    </div>
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
