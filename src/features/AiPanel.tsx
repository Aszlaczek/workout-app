import { useState, useRef, useEffect } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { mkId } from "../lib/utils";
import type { Exercise, Routine, RoutineExercise, View } from "../types";

type AiMsg = { role: "user" | "system"; text: string };

type Props = {
  exercises: Exercise[];
  setExercises: (fn: (e: Exercise[]) => Exercise[]) => void;
  routines: Routine[];
  setRoutines: (fn: (r: Routine[]) => Routine[]) => void;
  setView: (v: View) => void;
};

function parseCommand(
  raw: string,
  exercises: Exercise[],
  setExercises: (fn: (e: Exercise[]) => Exercise[]) => void,
  routines: Routine[],
  setRoutines: (fn: (r: Routine[]) => Routine[]) => void,
  setView: (v: View) => void,
): string {
  const cmd = raw.trim().toLowerCase();

  const addEx = cmd.match(/^dodaj [ćc]wiczenie (.+)/);
  if (addEx) {
    const parts = addEx[1].split(" ");
    const cats = ["push", "pull", "legs", "core"];
    const cat = cats.find((c) => parts.includes(c)) ?? "push";
    const name = parts.filter((p) => !cats.includes(p)).join(" ");
    const id = name.toLowerCase().replace(/\s+/g, "-");
    if (exercises.find((e) => e.id === id)) return `Cwiczenie "${name}" juz istnieje.`;
    const ex: Exercise = {
      id, name: name.charAt(0).toUpperCase() + name.slice(1),
      category: cat as Exercise["category"],
      muscle: cat === "push" ? "Klatka/Triceps" : cat === "pull" ? "Plecy/Biceps" : cat === "legs" ? "Nogi" : "Core",
      equipment: "Wlasne cialo", instructions: [], difficulty: "intermediate", isCustom: true,
    };
    setExercises((prev) => [...prev, ex]);
    return `Dodano cwiczenie: ${ex.name} (${cat})`;
  }

  const newW = cmd.match(/^nowy trening(?: (.+))?/);
  if (newW) {
    const query = newW[1]?.trim() ?? "";
    const routine = routines.find((r) => r.name.toLowerCase().includes(query)) ?? routines[0];
    if (!routine) return "Brak rutyn — najpierw utworz rutyne.";
    setView("workout");
    return `Rozpoczeto: ${routine.name}`;
  }

  const addSet = cmd.match(/^dodaj seri[eę] (\d+(?:[.,]\d+)?)[x\s×](\d+)/);
  if (addSet) {
    return `Dodano serie: ${addSet[1]}kg x ${addSet[2]} pow.`;
  }

  if (cmd.startsWith("zakoncz") || cmd.startsWith("koniec") || cmd === "finish") {
    return "Trening zakonczony.";
  }

  if (cmd.startsWith("pokaz") || cmd.startsWith("pokaż")) {
    setView("progress");
    return "Przelaczam na progres.";
  }

  if (cmd === "kalendarz") { setView("calendar"); return "Kalendarz"; }
  if (cmd === "rutyny") { setView("routines"); return "Rutyny"; }
  if (cmd === "dashboard") { setView("dashboard"); return "Dashboard"; }
  if (cmd === "cwiczenia") { setView("exercises"); return "Cwiczenia"; }
  if (cmd === "ustawienia") { setView("settings"); return "Ustawienia"; }

  const newRoutine = cmd.match(/^nowa rutyne(?: (.+))?/);
  if (newRoutine) {
    const name = newRoutine[1]?.trim() ?? "Nowa Rutyne";
    const r: Routine = { id: mkId(), name, exercises: [] };
    setRoutines((prev) => [...prev, r]);
    setView("routines");
    return `Utworzono rutyne: ${name}`;
  }

  return [
    "Dostepne komendy:",
    "  dodaj ćwiczenie [nazwa] [push|pull|legs|core]",
    "  nowy trening [nazwa rutyny]",
    "  dodaj serie [kg]x[reps]",
    "  zakoncz trening",
    "  nowa rutyne [nazwa]",
    "  pokaz [progres]",
    "  kalendarz | rutyny | dashboard | cwiczenia | ustawienia",
  ].join("\n");
}

export default function AiPanel({ exercises, setExercises, routines, setRoutines, setView }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [log, setLog] = useState<AiMsg[]>([
    { role: "system", text: t("ai.initialMessage") },
  ]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setLog((l) => [...l, { role: "user", text: userMsg }]);
    setInput("");
    const reply = parseCommand(userMsg, exercises, setExercises, routines, setRoutines, setView);
    setTimeout(() => setLog((l) => [...l, { role: "system", text: reply }]), 120);
  }

  return (
    <div className="shrink-0" style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
      {open && (
        <div ref={logRef} className="px-3 md:px-4 py-2 max-h-32 md:max-h-40 overflow-y-auto slide-up">
          {log.map((m, i) => (
            <div key={i} className="font-mono text-[10px] md:text-xs leading-relaxed whitespace-pre-wrap"
              style={{ color: m.role === "user" ? C.cyan : C.muted }}>
              {m.role === "user" ? `> ${m.text}` : m.text}
            </div>
          ))}
        </div>
      )}
      <form onSubmit={submit} className="flex items-center gap-2 px-3 md:px-4 h-10 md:h-11">
        <button type="button" onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="font-mono text-[10px] md:text-xs shrink-0 transition-all"
          style={{ color: C.orange }}>
          {open ? "▼" : "▲"} AI
        </button>
        <span className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>$</span>
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t("ai.placeholder")}
          className="flex-1 bg-transparent font-mono text-[10px] md:text-xs outline-none min-w-0"
          style={{ color: C.text }}
        />
        <button type="submit" className="font-mono text-[10px] md:text-xs px-2 py-0.5 shrink-0"
          style={{ background: C.orange, color: "#fff" }}>&#8629;</button>
      </form>
    </div>
  );
}
