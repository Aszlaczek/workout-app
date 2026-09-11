import { useState, useMemo } from "react";
import { C } from "../lib/constants";
import { formatDateFull } from "../lib/utils";
import type { Workout, Routine } from "../types";

type Props = {
  workouts: Workout[];
  routines: Routine[];
};

export default function CalendarView({ workouts, routines }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tip, setTip] = useState<{ date: string; w: Workout[] } | null>(null);

  const workoutMap = useMemo(() => {
    const m: Record<string, Workout[]> = {};
    workouts.forEach((w) => { (m[w.date] = m[w.date] ?? []).push(w); });
    return m;
  }, [workouts]);

  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) => i < offset ? null : i - offset + 1);
  const monthName = new Date(year, month).toLocaleDateString("pl-PL", { month: "long", year: "numeric" }).toUpperCase();

  function isoDate(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // Color coding by routine type
  function routineColor(routineId: string | null): string {
    if (!routineId) return C.muted;
    const r = routines.find((x) => x.id === routineId);
    if (!r) return C.muted;
    if (r.name.toLowerCase().includes("push")) return C.orange;
    if (r.name.toLowerCase().includes("pull")) return C.violet;
    if (r.name.toLowerCase().includes("leg")) return C.cyan;
    return C.orange;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-black text-4xl tracking-tight" style={{ color: C.text }}>
            KALENDARZ
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); }}
              className="font-mono text-sm px-3 py-1 transition-all"
              style={{ background: C.card, color: C.muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
              &#9664;
            </button>
            <span className="font-display font-bold text-sm tracking-widest w-40 text-center" style={{ color: C.text }}>
              {monthName}
            </span>
            <button onClick={() => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); }}
              className="font-mono text-sm px-3 py-1 transition-all"
              style={{ background: C.card, color: C.muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
              &#9654;
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {["Pn", "Wt", "Sr", "Cz", "Pt", "So", "Nd"].map((d) => (
            <div key={d} className="font-display font-bold text-xs tracking-widest text-center py-2"
              style={{ color: C.muted }}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const iso = isoDate(day);
            const ws = workoutMap[iso] ?? [];
            const isToday = iso === today.toISOString().slice(0, 10);
            return (
              <button key={i} onClick={() => setTip(ws.length ? { date: iso, w: ws } : null)}
                className="aspect-square flex flex-col items-center justify-center relative transition-all"
                style={{
                  background: ws.length ? C.card : "transparent",
                  border: isToday ? `2px solid ${C.orange}` : `1px solid ${ws.length ? C.border : "transparent"}`,
                }}
                onMouseEnter={(e) => { if (ws.length) e.currentTarget.style.borderColor = C.orange; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ws.length ? C.border : "transparent"; if (isToday) e.currentTarget.style.borderColor = C.orange; }}>
                <span className="font-mono text-xs" style={{ color: isToday ? C.orange : ws.length ? C.text : C.muted }}>
                  {day}
                </span>
                {ws.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {ws.slice(0, 3).map((w, j) => (
                      <span key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: routineColor(w.routineId) }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Popup detail */}
        {tip && (
          <div className="mt-6 p-5 slide-up" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-display font-black text-xl tracking-tight" style={{ color: C.text }}>
                {formatDateFull(tip.date)}
              </div>
              <button onClick={() => setTip(null)} className="font-mono text-xs" style={{ color: C.muted }}>x</button>
            </div>
            {tip.w.map((w) => {
              const setsCount = w.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);
              return (
                <div key={w.id} className="py-3" style={{ borderBottom: `1px solid ${C.dim}` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: routineColor(w.routineId) }} />
                    <div className="font-display font-bold text-sm tracking-wide" style={{ color: C.text }}>{w.routineName}</div>
                  </div>
                  <div className="font-mono text-xs mt-1 ml-4" style={{ color: C.muted }}>
                    {w.duration} min · {setsCount} serii
                  </div>
                  <div className="ml-4 mt-1">
                    {w.exercises.map((e, i) => (
                      <div key={i} className="font-mono text-xs" style={{ color: C.muted }}>
                        {e.exerciseId}: {e.sets.filter((s) => s.done).map((s) => `${s.weight}x${s.reps}`).join(", ")}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: C.orange }} />
            <span className="font-mono text-xs" style={{ color: C.muted }}>Push</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: C.violet }} />
            <span className="font-mono text-xs" style={{ color: C.muted }}>Pull</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: C.cyan }} />
            <span className="font-mono text-xs" style={{ color: C.muted }}>Legs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4" style={{ border: `2px solid ${C.orange}` }} />
            <span className="font-mono text-xs" style={{ color: C.muted }}>Dzis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
