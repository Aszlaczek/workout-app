import { useState } from "react";
import { C } from "../lib/constants";
import { authService } from "../services/auth";

type AuthMode = "login" | "register";

export default function Login({ onLogin }: { onLogin: (email: string) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email i haslo sa wymagane.");
      return;
    }
    if (password.length < 6) {
      setError("Haslo musi miec co najmniej 6 znakow.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "register") {
        await authService.signUp(email, password);
        setSuccess("Konto utworzone! Sprawdz email aby potwierdzic, potem sie zaloguj.");
        setMode("login");
      } else {
        const user = await authService.signIn(email, password);
        onLogin(user.email);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Wystapil blad.";
      if (msg.includes("Invalid login credentials")) {
        setError("Nieprawidlowy email lub haslo.");
      } else if (msg.includes("already registered")) {
        setError("Ten email jest juz zarejestrowany. Zaloguj sie.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center" style={{ background: C.bg }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full opacity-10 float-orb"
          style={{ background: `radial-gradient(circle, ${C.orange}, transparent 70%)` }} />
        <div className="absolute -bottom-40 -right-10 w-[400px] h-[400px] rounded-full opacity-8 float-orb-delay"
          style={{ background: `radial-gradient(circle, ${C.violet}, transparent 70%)` }} />
      </div>

      <div className="relative w-full max-w-sm px-6">
        <div className="mb-10">
          <div className="font-display text-6xl font-black tracking-tight leading-none mb-3"
            style={{ color: C.text }}>
            GYM<br />
            <span style={{ color: C.orange }}>PROGRESS</span>
          </div>
          <p className="font-mono text-xs" style={{ color: C.muted }}>TWOJ TRENING, TWOJE DANE</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 mb-6" style={{ background: C.surface }}>
          {(["login", "register"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              className="flex-1 font-display font-bold text-xs tracking-widest py-2.5 transition-all"
              style={{
                background: mode === m ? C.orange : "transparent",
                color: mode === m ? "#fff" : C.muted,
              }}>
              {m === "login" ? "LOGOWANIE" : "REJESTRACJA"}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-3">
          <div>
            <label className="block font-display text-xs font-bold tracking-widest mb-1.5"
              style={{ color: C.muted }}>E-MAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
              onFocus={(e) => (e.target.style.borderColor = C.orange)}
              onBlur={(e) => (e.target.style.borderColor = C.border)} />
          </div>
          <div>
            <label className="block font-display text-xs font-bold tracking-widest mb-1.5"
              style={{ color: C.muted }}>HASLO</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 font-mono text-sm outline-none transition-all"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
              onFocus={(e) => (e.target.style.borderColor = C.orange)}
              onBlur={(e) => (e.target.style.borderColor = C.border)} />
          </div>

          {error && (
            <div className="px-4 py-3 text-center font-mono text-xs"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 text-center font-mono text-xs"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
              {success}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full font-display font-black text-sm tracking-widest py-3.5 transition-all mt-2 disabled:opacity-50"
            style={{ background: C.orange, color: "#fff" }}>
            {loading ? "..." : mode === "login" ? "ZALOGUJ SIE" : "UTWORZ KONTO"}
          </button>
        </form>

        <p className="font-mono text-xs text-center mt-6" style={{ color: C.dim }}>
          Kazdy uzytkownik widzi tylko swoje dane.
        </p>
      </div>
    </div>
  );
}
