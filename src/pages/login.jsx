import { useState } from "react";
import { loginUser } from "../api/authApi";
import logo from "../assets/company-logo.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      onLogin(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { fontSize: "12px", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(135deg,#16181d 0%,#0c0d10 100%)" }}>
      <div style={{ width: "100%", maxWidth: "410px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "22px", textAlign: "center" }}>
          <img src={logo} alt="Palaestra" style={{ height: "56px", width: "auto" }} />
          <div className="semicond" style={{ color: "var(--muted-2)", fontSize: "12px", letterSpacing: ".18em", textTransform: "uppercase", marginTop: "14px" }}>Player Performance Portal</div>
        </div>

        <form onSubmit={submit} className="card" style={{ padding: "28px" }}>
          <div className="semicond" style={{ fontSize: "19px", fontWeight: 600, marginBottom: "4px" }}>Player Sign-in</div>
          <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>Enter your credentials to continue</div>

          <label style={labelStyle}>Email</label>
          <input className="input" style={{ margin: "6px 0 16px" }} type="email" placeholder="you@palaestra.in" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />

          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", margin: "6px 0 8px" }}>
            <input className="input" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" style={{ paddingRight: "54px" }} />
            <button type="button" onClick={() => setShowPw((v) => !v)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted-2)", fontSize: "11px", fontWeight: 700, letterSpacing: ".04em" }}>{showPw ? "HIDE" : "SHOW"}</button>
          </div>

          {error && <div style={{ color: "var(--danger)", fontSize: "13px", margin: "8px 0 0" }}>{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "16px" }}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <div style={{ textAlign: "center", fontSize: "12.5px", color: "var(--muted-2)", marginTop: "16px" }}>Forgot password? Contact your academy admin.</div>
        </form>

        <div style={{ textAlign: "center", color: "var(--muted-2)", fontSize: "12px", marginTop: "18px" }}>
          Powered by <span style={{ color: "var(--gold-soft)" }}>Palaestra</span>
        </div>
      </div>
    </div>
  );
}
