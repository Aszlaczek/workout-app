import { C } from "../lib/constants";
import type { View } from "../types";

const NAV_LINKS: { label: string; v: View }[] = [
  { label: "DASHBOARD", v: "dashboard" },
  { label: "CWICZENIA", v: "exercises" },
  { label: "RUTYNY", v: "routines" },
  { label: "KALENDARZ", v: "calendar" },
  { label: "PROGRES", v: "progress" },
  { label: "AI", v: "ai" },
  { label: "USTAWIENIA", v: "settings" },
];

export default function Nav({ view, setView, hasActive, onLogout }: {
  view: View;
  setView: (v: View) => void;
  hasActive: boolean;
  onLogout: () => void;
}) {
  return (
    <header className="flex items-center px-5 h-12 shrink-0 gap-1"
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
      <span className="font-display font-black text-lg tracking-widest mr-4 select-none"
        style={{ color: C.orange }}>GP</span>

      <div className="flex items-center gap-0.5 overflow-x-auto">
        {NAV_LINKS.map(({ label, v }) => (
          <button key={v} onClick={() => setView(v)}
            className="font-display font-bold text-xs tracking-widest px-3 py-1 transition-all whitespace-nowrap"
            style={{
              color: view === v ? C.orange : C.muted,
              borderBottom: view === v ? `2px solid ${C.orange}` : "2px solid transparent",
            }}>
            {label}
          </button>
        ))}

        {hasActive && (
          <button onClick={() => setView("workout")}
            className="flex items-center gap-1.5 font-display font-bold text-xs tracking-widest px-3 py-1 transition-all whitespace-nowrap"
            style={{
              color: view === "workout" ? C.cyan : C.muted,
              borderBottom: view === "workout" ? `2px solid ${C.cyan}` : "2px solid transparent",
            }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: C.cyan }} />
            TRENING
          </button>
        )}
      </div>

      <button onClick={onLogout} className="ml-auto font-mono text-xs transition-all shrink-0"
        style={{ color: C.muted }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
        WYLOGUJ
      </button>
    </header>
  );
}
