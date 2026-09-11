import { useState, useEffect } from "react";
import { C } from "../lib/constants";
import { useI18n } from "../i18n";
import { authService } from "../services/auth";

type AuthMode = "login" | "register" | "forgot" | "recovery";

export default function Login({ onLogin, recoveryMode }: { onLogin: (email: string) => void; recoveryMode?: boolean }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<AuthMode>(recoveryMode ? "recovery" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (recoveryMode) setMode("recovery");
  }, [recoveryMode]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "forgot") {
      if (!email) {
        setError(t("login.emailRequired"));
        return;
      }
      setLoading(true);
      try {
        await authService.resetPassword(email);
        setSuccess(t("login.forgotSuccess"));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Wystapil blad.";
        setError(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "recovery") {
      if (!newPassword || !confirmPassword) {
        setError(t("login.passwordRequired"));
        return;
      }
      if (newPassword.length < 6) {
        setError(t("login.passwordTooShort"));
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t("login.passwordsDoNotMatch"));
        return;
      }
      setLoading(true);
      try {
        await authService.updatePassword(newPassword);
        setSuccess(t("login.recoverySuccess"));
        setMode("login");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Wystapil blad.";
        setError(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    // login or register
    if (!email || !password) {
      setError(t("login.passwordRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("login.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await authService.signUp(email, password);
        setSuccess(t("login.registerSuccess"));
        setMode("login");
      } else {
        const user = await authService.signIn(email, password);
        onLogin(user.email);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Wystapil blad.";
      if (msg.includes("Invalid login credentials")) {
        setError(t("login.invalidCredentials"));
      } else if (msg.includes("already registered")) {
        setError(t("login.alreadyRegistered"));
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center px-4" style={{ background: C.bg }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full opacity-10 float-orb"
          style={{ background: `radial-gradient(circle, ${C.orange}, transparent 70%)` }} />
        <div className="absolute -bottom-40 -right-10 w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full opacity-8 float-orb-delay"
          style={{ background: `radial-gradient(circle, ${C.violet}, transparent 70%)` }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 md:mb-10">
          <div className="font-display text-4xl md:text-6xl font-black tracking-tight leading-none mb-2 md:mb-3"
            style={{ color: C.text }}>
            GYM<br />
            <span style={{ color: C.orange }}>PROGRESS</span>
          </div>
          <p className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>
            {mode === "recovery" ? t("login.recoveryTitle") : t("login.subtitle")}
          </p>
        </div>

        {/* Mode toggle — hidden in forgot/recovery modes */}
        {mode !== "forgot" && mode !== "recovery" && (
          <div className="flex gap-1 p-1 mb-5 md:mb-6" style={{ background: C.surface }}>
            {(["login", "register"] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className="flex-1 font-display font-bold text-[10px] md:text-xs tracking-widest py-2.5 transition-all"
                style={{
                  background: mode === m ? C.orange : "transparent",
                  color: mode === m ? "#fff" : C.muted,
                }}>
                {m === "login" ? t("login.loginMode") : t("login.registerMode")}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3">
          {/* Forgot password — email only */}
          {mode === "forgot" && (
            <>
              <p className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>
                {t("login.forgotDescription")}
              </p>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1.5"
                  style={{ color: C.muted }}>{t("login.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </>
          )}

          {/* Recovery — new password */}
          {mode === "recovery" && (
            <>
              <p className="font-mono text-[10px] md:text-xs" style={{ color: C.muted }}>
                {t("login.recoveryDescription")}
              </p>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1.5"
                  style={{ color: C.muted }}>{t("login.newPassword")}</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1.5"
                  style={{ color: C.muted }}>{t("login.confirmPassword")}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </>
          )}

          {/* Login / Register — email + password */}
          {(mode === "login" || mode === "register") && (
            <>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1.5"
                  style={{ color: C.muted }}>{t("login.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label className="block font-display text-[10px] md:text-xs font-bold tracking-widest mb-1.5"
                  style={{ color: C.muted }}>{t("login.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
                  onFocus={(e) => (e.target.style.borderColor = C.orange)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </>
          )}

          {error && (
            <div className="px-4 py-3 text-center font-mono text-[10px] md:text-xs"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 text-center font-mono text-[10px] md:text-xs"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full font-display font-black text-xs md:text-sm tracking-widest py-3.5 transition-all mt-2 disabled:opacity-50"
            style={{ background: C.orange, color: "#fff" }}>
            {loading ? "..."
              : mode === "forgot" ? t("login.forgotSubmit")
              : mode === "recovery" ? t("login.recoverySubmit")
              : mode === "login" ? t("login.submit")
              : t("login.register")}
          </button>
        </form>

        {/* Back to login from forgot/recovery */}
        {(mode === "forgot" || mode === "recovery") && (
          <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className="w-full text-center font-mono text-[10px] md:text-xs mt-4 transition-all"
            style={{ color: C.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
            ← {t("login.backToLogin")}
          </button>
        )}

        {/* Forgot password link — only on login */}
        {mode === "login" && (
          <button onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
            className="w-full text-center font-mono text-[10px] md:text-xs mt-4 transition-all"
            style={{ color: C.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.orange)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}>
            {t("login.forgotPassword")}
          </button>
        )}

        <p className="font-mono text-[10px] md:text-xs text-center mt-5 md:mt-6" style={{ color: C.dim }}>
          Kazdy uzytkownik widzi tylko swoje dane.
        </p>
      </div>
    </div>
  );
}
