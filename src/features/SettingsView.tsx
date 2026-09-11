import { useState } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { authService } from "../services/auth";
import type { Settings } from "../types";

type Props = {
  settings: Settings;
  userEmail: string;
  onUpdate: (fn: (s: Settings) => Settings) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export default function SettingsView({ settings, userEmail, onUpdate, onLogout, onDeleteAccount }: Props) {
  const { t } = useI18n();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await authService.deleteAccount();
      onDeleteAccount();
    } catch {
      onDeleteAccount();
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-24 md:pb-8">
        <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight mb-5 md:mb-8" style={{ color: C.text }}>
          {t("settings.title")}
        </h1>

        <div className="space-y-4 md:space-y-6">
          {/* Language */}
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.orange}` }}>
            <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2.5 md:mb-3" style={{ color: C.muted }}>
              {t("settings.language")}
            </div>
            <div className="flex gap-2">
              {(["pl", "en"] as const).map((lang) => (
                <button key={lang} onClick={() => onUpdate((s) => ({ ...s, language: lang }))}
                  className="font-display font-bold text-xs md:text-sm tracking-widest px-5 md:px-6 py-2 transition-all"
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
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.violet}` }}>
            <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2.5 md:mb-3" style={{ color: C.muted }}>
              {t("settings.theme")}
            </div>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map((theme) => (
                <button key={theme} onClick={() => onUpdate((s) => ({ ...s, theme }))}
                  className="font-display font-bold text-xs md:text-sm tracking-widest px-5 md:px-6 py-2 transition-all"
                  style={{
                    background: settings.theme === theme ? C.violet : C.surface,
                    color: settings.theme === theme ? "#fff" : C.muted,
                    border: `1px solid ${settings.theme === theme ? C.violet : C.border}`,
                  }}>
                  {theme === "dark" ? "Dark" : "Light"}
                </button>
              ))}
            </div>
          </div>

          {/* Rest timer default */}
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.cyan}` }}>
            <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2.5 md:mb-3" style={{ color: C.muted }}>
              {t("settings.restTimer")}
            </div>
            <div className="flex flex-wrap gap-2">
              {[30, 60, 90, 120, 180, 300].map((d) => (
                <button key={d} onClick={() => onUpdate((s) => ({ ...s, restTimerDefault: d }))}
                  className="font-mono text-xs md:text-sm px-3 md:px-4 py-2 transition-all"
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
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.green}` }}>
            <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2.5 md:mb-3" style={{ color: C.muted }}>
              {t("settings.account")}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.dim}` }}>
                <span className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>{t("settings.email")}</span>
                <span className="font-mono text-xs md:text-sm truncate ml-4" style={{ color: C.text }}>{userEmail || "demo@gymapp.io"}</span>
              </div>
              <div className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${C.dim}` }}>
                <span className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>{t("settings.mode")}</span>
                <span className="font-mono text-xs md:text-sm" style={{ color: C.green }}>{t("settings.active")}</span>
              </div>
            </div>
          </div>

          {/* Data export */}
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid ${C.muted}` }}>
            <div className="font-display font-bold text-[10px] md:text-xs tracking-widest mb-2.5 md:mb-3" style={{ color: C.muted }}>
              {t("settings.export")}
            </div>
            <button className="font-display font-bold text-[10px] md:text-xs tracking-widest px-4 py-2.5 transition-all"
              style={{ background: C.dim, color: C.text, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}>
              {t("settings.exportButton")}
            </button>
            <p className="font-mono text-[10px] md:text-xs mt-2" style={{ color: C.muted }}>
              {t("settings.exportDescription")}
            </p>
          </div>

          {/* Logout */}
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `1px solid ${C.border}` }}>
            <button onClick={onLogout}
              className="w-full font-display font-bold text-[10px] md:text-xs tracking-widest py-3 transition-all"
              style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}>
              {t("settings.logout")}
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 md:p-5" style={{ background: C.card, borderTop: `2px solid #ef4444` }}>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="w-full font-display font-bold text-[10px] md:text-xs tracking-widest py-3 transition-all"
                style={{ background: "transparent", color: "#ef4444", border: `1px solid #ef4444` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                {t("settings.deleteAccount")}
              </button>
            ) : (
              <div className="slide-up">
                <p className="font-mono text-[10px] md:text-xs mb-2" style={{ color: "#ef4444" }}>
                  {t("settings.deleteAccountWarning")}
                </p>
                <p className="font-mono text-[10px] md:text-xs mb-4" style={{ color: C.muted }}>
                  {t("settings.deleteAccountConfirm")}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 font-display font-bold text-[10px] md:text-xs tracking-widest py-2.5 transition-all"
                    style={{ background: C.dim, color: C.muted, border: `1px solid ${C.border}` }}>
                    {t("settings.deleteAccountCancel")}
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 font-display font-bold text-[10px] md:text-xs tracking-widest py-2.5 transition-all disabled:opacity-50"
                    style={{ background: "#ef4444", color: "#fff" }}>
                    {deleting ? "..." : t("settings.deleteAccountConfirmButton")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* About */}
          <div className="p-4 md:p-5 text-center" style={{ background: C.card, borderTop: `1px solid ${C.dim}` }}>
            <div className="font-display font-black text-xl md:text-2xl tracking-tight mb-1" style={{ color: C.text }}>
              GYM <span style={{ color: C.orange }}>PROGRESS</span>
            </div>
            <div className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>{t("settings.about")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
