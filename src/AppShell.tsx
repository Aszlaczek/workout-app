import type { ReactNode } from "react";
import { C } from "./lib/constants";
import type { View } from "./types";
import { useI18n } from "./i18n";

const NAV_KEYS: { key: string; view: View }[] = [
  { key: "nav.dashboard", view: "dashboard" },
  { key: "nav.exercises", view: "exercises" },
  { key: "nav.routines", view: "routines" },
  { key: "nav.calendar", view: "calendar" },
  { key: "nav.progress", view: "progress" },
  { key: "nav.ai", view: "ai" },
  { key: "nav.settings", view: "settings" },
];

export default function AppShell({
  children,
  view,
  setView,
  hasActive,
  onLogout,
}: {
  children: ReactNode;
  view: View;
  setView: (v: View) => void;
  hasActive: boolean;
  onLogout: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="h-full flex" style={{ background: C.bg }}>
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ background: C.surface, borderRight: `1px solid ${C.border}` }}
      >
        <div className="px-4 py-3">
          <span className="font-display font-black text-xl tracking-widest" style={{ color: C.orange }}>
            GP
          </span>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {NAV_KEYS.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className="w-full text-left font-display font-bold text-xs tracking-widest px-3 py-2.5 rounded transition-all"
              style={{
                background: view === item.view ? C.orange : "transparent",
                color: view === item.view ? "#fff" : C.muted,
              }}
            >
              {t(item.key)}
            </button>
          ))}
          {hasActive && (
            <button
              onClick={() => setView("workout")}
              className="w-full text-left font-display font-bold text-xs tracking-widest px-3 py-2.5 rounded transition-all flex items-center gap-2"
              style={{
                background: view === "workout" ? C.cyan : "transparent",
                color: view === "workout" ? "#fff" : C.muted,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: C.cyan }} />
              {t("nav.workout")}
            </button>
          )}
        </nav>
        <button
          onClick={onLogout}
          className="px-4 py-3 font-mono text-xs transition-all"
          style={{ color: C.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
        >
          {t("nav.logout")}
        </button>
      </aside>
      <main className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
