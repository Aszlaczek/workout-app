import type { ReactNode } from "react";
import { C } from "./lib/constants";
import type { View } from "./types";
import { useI18n } from "./i18n";

const NAV_KEYS: { key: string; view: View; icon: string }[] = [
  { key: "nav.dashboard", view: "dashboard", icon: "⌂" },
  { key: "nav.exercises", view: "exercises", icon: "◈" },
  { key: "nav.routines", view: "routines", icon: "☰" },
  { key: "nav.calendar", view: "calendar", icon: "▦" },
  { key: "nav.progress", view: "progress", icon: "▲" },
  { key: "nav.ai", view: "ai", icon: "✦" },
  { key: "nav.settings", view: "settings", icon: "⚙" },
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
    <div className="flex-1 min-h-0 flex flex-col md:flex-row" style={{ background: C.bg }}>
      {/* Desktop sidebar - hidden on mobile */}
      <aside
        className="hidden md:flex w-56 shrink-0 flex-col"
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

      {/* Main content */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </main>

      {/* Mobile bottom tab bar - hidden on desktop */}
      <nav
        className="md:hidden shrink-0 flex items-stretch border-t safe-area-bottom"
        style={{ background: C.surface, borderColor: C.border }}
      >
        {NAV_KEYS.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-all"
            style={{
              color: view === item.view ? C.orange : C.muted,
              minHeight: "60px",
            }}
          >
            <span className="text-lg leading-none mb-1">{item.icon}</span>
            <span className="font-display font-bold text-[9px] tracking-widest leading-none">
              {t(item.key).length > 8 ? t(item.key).slice(0, 7) + "." : t(item.key)}
            </span>
            {view === item.view && (
              <span className="w-1 h-1 rounded-full mt-1" style={{ background: C.orange }} />
            )}
          </button>
        ))}
        {hasActive && (
          <button
            onClick={() => setView("workout")}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-all relative"
            style={{
              color: view === "workout" ? C.cyan : C.muted,
              minHeight: "60px",
            }}
          >
            <span className="w-2 h-2 rounded-full pulse-dot mb-1" style={{ background: C.cyan }} />
            <span className="font-display font-bold text-[9px] tracking-widest leading-none">
              {t("nav.workout")}
            </span>
          </button>
        )}
      </nav>
    </div>
  );
}
