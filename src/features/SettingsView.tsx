import { C } from "../lib/constants";
import type { Settings } from "../types";

type Props = {
  settings: Settings;
  userEmail: string;
  onUpdate: (fn: (s: Settings) => Settings) => void;
  onLogout: () => void;
};

export default function SettingsView({ settings, userEmail, onUpdate, onLogout }: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="font-display font-black text-4xl tracking-tight mb-8" style={{ color: C.text }}>
          USTAWIENIA
        </h1>

        <div className="space-y-6">
          {/* Language */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              Jezyk interfejsu
            </div>
            <div className="flex gap-2">
              {(["pl", "en"] as const).map((lang) => (
                <button key={lang} onClick={() => onUpdate((s) => ({ ...s, language: lang }))}
                  className="font-display font-bold text-sm tracking-widest px-6 py-2 transition-all"
                  style={{
                    background: settings.language === lang ? C.orange : C.surface,
                    color: settings.language === lang ? "#fff" : C.muted,
                    border: `1px solid ${settings.language === lang ? C.orange : C.border}`,
                  }}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${C.violet}` }}>
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              Motyw
            </div>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((theme) => (
                <button key={theme} onClick={() => onUpdate((s) => ({ ...s, theme }))}
                  className="font-display font-bold text-sm tracking-widest px-6 py-2 transition-all"
                  style={{
                    background: settings.theme === theme ? C.violet : C.surface,
                    color: settings.theme === theme ? "#fff" : C.muted,
                    border: `1px solid ${settings.theme === theme ? C.violet : C.border}`,
                  }}>
                  {theme === "dark" ? "CIEMNY" : "JASNY"}
                </button>
              ))}
            </div>
          </div>

          {/* Rest timer default */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${C.cyan}` }}>
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              Domyslny czas odpoczynku
            </div>
            <div className="flex gap-2">
              {[30, 60, 90, 120, 180, 300].map((d) => (
                <button key={d} onClick={() => onUpdate((s) => ({ ...s, restTimerDefault: d }))}
                  className="font-mono text-sm px-4 py-2 transition-all"
                  style={{
                    background: settings.restTimerDefault === d ? C.cyan : C.surface,
                    color: settings.restTimerDefault === d ? "#000" : C.muted,
                    border: `1px solid ${settings.restTimerDefault === d ? C.cyan : C.border}`,
                  }}>
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${C.green}` }}>
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              Konto
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.dim}` }}>
                <span className="font-mono text-xs" style={{ color: C.muted }}>Email</span>
                <span className="font-mono text-sm" style={{ color: C.text }}>{userEmail || "demo@gymapp.io"}</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.dim}` }}>
                <span className="font-mono text-xs" style={{ color: C.muted }}>Tryb</span>
                <span className="font-mono text-sm" style={{ color: C.green }}>Aktywny</span>
              </div>
            </div>
          </div>

          {/* Data export */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid ${C.muted}` }}>
            <div className="font-display font-bold text-xs tracking-widest mb-3" style={{ color: C.muted }}>
              Eksport danych
            </div>
            <button className="font-display font-bold text-xs tracking-widest px-4 py-2 transition-all"
              style={{ background: C.dim, color: C.text, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
              POBIERZ JSON
            </button>
            <p className="font-mono text-xs mt-2" style={{ color: C.muted }}>
              Pobierz wszystkie dane treningowe w formacie JSON.
            </p>
          </div>

          {/* Logout */}
          <div className="p-5" style={{ background: C.card, borderTop: `2px solid #ef4444` }}>
            <button onClick={onLogout}
              className="w-full font-display font-bold text-xs tracking-widest py-3 transition-all"
              style={{ background: "transparent", color: "#ef4444", border: `1px solid #ef4444` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
              WYLOGUJ SIE
            </button>
          </div>

          {/* About */}
          <div className="p-5 text-center" style={{ background: C.card, borderTop: `1px solid ${C.dim}` }}>
            <div className="font-display font-black text-2xl tracking-tight mb-1" style={{ color: C.text }}>
              GYM <span style={{ color: C.orange }}>PROGRESS</span>
            </div>
            <div className="font-mono text-xs" style={{ color: C.muted }}>Wersja 1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
