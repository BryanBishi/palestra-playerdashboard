import { useState, useEffect } from "react";
import { getPlayer, fetchAllWellnessReport } from "../api/authApi";
import {
  Users, User, Stethoscope, Dumbbell, Apple, ShieldCheck,
  ArrowLeft, ClipboardList, ChevronRight, AlertTriangle,
  CheckCircle2, Send, Activity, Heart, Zap, Moon,
  Target, MessageSquare,
} from "lucide-react";
import DailyReportForm from "../components/DailyReportForm";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";

// ─── EXACT PHYSIO STYLES ─────────────────────────────────────────────────
const card = (extra = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...extra,
});

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "20px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", marginBottom: "2px" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#ec5a4d", borderRadius: "2px", marginTop: "4px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: "6px",
      background: "none", border: "none", color: "#888",
      fontSize: "13px", fontWeight: "600", cursor: "pointer",
      marginBottom: "18px", padding: "0",
    }}
    onMouseEnter={e => (e.currentTarget.style.color = "#ec5a4d")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  >
    <ArrowLeft size={16} style={{ color: "inherit" }} /> {label}
  </button>
);

const OBtn = ({ children, onClick, style = {}, variant = "primary" }) => (
  <button onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: "7px",
      padding: "9px 20px", backgroundColor: variant === "danger" ? "#cc3333" : "#ec5a4d",
      color: "#fff", border: "none", borderRadius: "8px",
      fontSize: "13px", fontWeight: "700", cursor: "pointer",
      boxShadow: "0 2px 8px rgba(236,90,77,0.28)", ...style,
    }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = variant === "danger" ? "#b22a2a" : "#d6443a")}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = variant === "danger" ? "#cc3333" : "#ec5a4d")}
  >
    {children}
  </button>
);

// ─── VIEWS ───────────────────────────────────────────────────────────────
const V = { INFO: "info", TEAM: "team", INJURIES: "injuries", INJ_DETAIL: "inj_detail", DAILY_PROGRESS: "daily_progress" };

const TABS = ["Overview", "NFTC Score", "Physio Findings"];

// ─── STAT CHIP ───────────────────────────────────────────────────────────
const StatChip = ({ icon: Icon, label, value, color = "#ec5a4d" }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 8px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8", flex: 1 }}>
    <Icon size={14} style={{ color, marginBottom: "4px" }} />
    <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>{value}</div>
    <div style={{ fontSize: "10px", color: "#999", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>
  </div>
);

// ─── WELLNESS CHART ───────────────────────────────────────────────────────
// ─── WELLNESS CHART (Single Player Optimized) ─────────────────────────────
const WellnessChart = ({ data }) => {
  const [chartType, setChartType] = useState("bar");

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
        <Activity size={32} style={{ marginBottom: "10px", opacity: 0.4 }} />
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#888" }}>No wellness data yet</div>
        <div style={{ fontSize: "12px", marginTop: "4px", color: "#aaa" }}>Submit your first daily report to see charts here.</div>
      </div>
    );
  }

  // Format data for single player (use date)
  const formatted = data.map((d, i) => ({
    date: new Date(d.date || d.createdAt || Date.now() - i * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    Fatigue:    d.fatigue    ?? 0,
    Sleep:      d.sleep      ?? 0,
    Soreness:   d.soreness   ?? 0,
    Motivation: d.motivation ?? 0,
    RPE:        d.rpe        ?? 0,
  }));

  const latest = data[data.length - 1] || {};

  const avg = (key) =>
    data.length ? (data.reduce((s, d) => s + (d[key] ?? 0), 0) / data.length).toFixed(1) : 0;

  const COLORS = {
    Fatigue:    "#ec5a4d",
    Sleep:      "#4f9cf9",
    Soreness:   "#f94f7c",
    Motivation: "#22c55e",
    RPE:        "#a855f7",
  };

  const radarData = ["fatigue", "sleep", "soreness", "motivation", "rpe"].map(k => ({
    metric: k.charAt(0).toUpperCase() + k.slice(1),
    Today: latest[k] ?? 0,
    Avg:   parseFloat(avg(k)),
  }));

  return (
    <div>
      {/* Latest metric chips */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
        {[
          { icon: Moon,     label: "Sleep",      value: latest.sleep      ?? "–", color: "#4f9cf9" },
          { icon: Zap,      label: "RPE",        value: latest.rpe        ?? "–", color: "#a855f7" },
          { icon: Heart,    label: "Fatigue",    value: latest.fatigue    ?? "–", color: "#ec5a4d" },
          { icon: Activity, label: "Soreness",   value: latest.soreness   ?? "–", color: "#f94f7c" },
          { icon: Target,   label: "Motivation", value: latest.motivation ?? "–", color: "#22c55e" },
        ].map(s => <StatChip key={s.label} {...s} />)}
      </div>

      {/* Chart Type Toggle */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
        {["bar", "line", "radar"].map(t => (
          <button
            key={t}
            onClick={() => setChartType(t)}
            style={{
              padding: "5px 14px", borderRadius: "20px",
              border: `1.5px solid ${chartType === t ? "#ec5a4d" : "#e8e8e8"}`,
              background: chartType === t ? "#fff5ed" : "#fff",
              color: chartType === t ? "#ec5a4d" : "#888",
              fontWeight: "600", fontSize: "12px", cursor: "pointer",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ height: "260px", width: "100%" }}>
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#666" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e8e8e8", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {Object.entries(COLORS).map(([k, c]) => (
                <Bar key={k} dataKey={k} fill={c} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#666" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#666" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e8e8e8", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {Object.entries(COLORS).map(([k, c]) => (
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "radar" && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#666" }} />
              <Radar name="Today" dataKey="Today" stroke="#ec5a4d" fill="#ec5a4d" fillOpacity={0.35} />
              <Radar name="Average" dataKey="Avg" stroke="#4f9cf9" fill="#4f9cf9" fillOpacity={0.25} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e8e8e8", fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Reports */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>Recent Reports</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {[...data].reverse().slice(0, 5).map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8" }}>
              <div style={{ fontWeight: "600", fontSize: "13px", color: "#222" }}>
                {new Date(d.date || d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#555" }}>
                <span>Sleep <b>{d.sleep ?? "–"}</b></span>
                <span>RPE <b>{d.rpe ?? "–"}</b></span>
                <span>Fatigue <b>{d.fatigue ?? "–"}</b></span>
                <span>Soreness <b>{d.soreness ?? "–"}</b></span>
                <span style={{ 
                  padding: "1px 8px", 
                  borderRadius: "6px", 
                  background: d.injury ? "#fff0f0" : "#f0fff4", 
                  color: d.injury ? "#cc3333" : "#22c55e", 
                  fontWeight: "700",
                  fontSize: "11px"
                }}>
                  {d.injury ? "Injured" : "OK"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── NFTC SCORE ───────────────────────────────────────────────────────────
const NFTCScore = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const scores = [
    { label: "Neuromuscular", value: 78, color: "#ec5a4d", desc: "Reaction time & coordination within optimal range" },
    { label: "Functional Movement", value: 85, color: "#4f9cf9", desc: "FMS composite score — no asymmetry flags" },
    { label: "Thermal Load", value: 62, color: "#f94f7c", desc: "Core temp management — monitor hydration" },
    { label: "Cardiac Readiness", value: 91, color: "#22c55e", desc: "Resting HR 58bpm · HRV 72ms" },
  ];
  const overall = Math.round(scores.reduce((s, x) => s + x.value, 0) / scores.length);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "18px", background: "#fff8f2", borderRadius: "10px", border: "1px solid #e8e8e8" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width="88" height="88" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#f5e8da" strokeWidth="8" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="#ec5a4d" strokeWidth="8"
              strokeDasharray="251" strokeDashoffset={visible ? 251 - (251 * overall / 100) : 251}
              strokeLinecap="round" transform="rotate(-90 48 48)"
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#ec5a4d" }}>{overall}</div>
            <div style={{ fontSize: "9px", fontWeight: "600", color: "#bbb", textTransform: "uppercase" }}>Overall</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#222" }}>NFTC Composite</div>
          <div style={{ fontSize: "13px", color: "#888", marginTop: "3px" }}>Neuro-Functional Training Capacity</div>
          <div style={{ marginTop: "8px", padding: "4px 12px", background: "#fff3e0", borderRadius: "6px", display: "inline-block" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#ec5a4d" }}>
              {overall >= 85 ? "✅ Excellent" : overall >= 70 ? "🟡 Good" : "🔴 Needs Attention"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {scores.map((s, i) => (
          <div key={i} style={{ padding: "14px 16px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontWeight: "600", fontSize: "13px", color: "#333" }}>{s.label}</div>
              <div style={{ fontWeight: "700", fontSize: "15px", color: s.color }}>{s.value}</div>
            </div>
            <div style={{ height: "5px", background: "#ebebeb", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "3px", background: s.color, width: visible ? `${s.value}%` : "0%", transition: `width 0.9s ease ${i * 0.1}s` }} />
            </div>
            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "5px" }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── PHYSIO FINDINGS ─────────────────────────────────────────────────────
const PhysioFindings = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
    <div>
      <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "12px", textAlign: "center" }}>Master Medical History</div>
      {[
        ["Any Illness", "N/A"], ["Any Surgery", "N/A"], ["Blood Test Date", "N/A"],
        ["Cardiac", "N/A"], ["Pulmonary", "N/A"], ["SCAT 6 (Baseline)", "N/A"],
        ["Any Previous Concussion", "N/A"], ["Vaccination", "N/A"], ["Medications", "N/A"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}>
          <span style={{ color: "#555" }}>{k}:</span>
          <span style={{ color: "#888", fontWeight: "500" }}>{v}</span>
        </div>
      ))}
    </div>

    <div style={{ height: "1px", background: "#e8e8e8" }} />

    <div>
      <div style={{ fontSize: "14px", fontWeight: "700", color: "#555", marginBottom: "12px", textAlign: "center" }}>Master Physio Findings</div>
      <div style={{ fontSize: "12px", color: "#4f9cf9", fontWeight: "600", marginBottom: "10px" }}>
        MSK findings: <span style={{ textDecoration: "underline", cursor: "pointer" }}>2026-05-13</span> - Pinkesh Barot
      </div>
      <div style={{ padding: "10px 12px", background: "#f9f9f9", borderRadius: "6px", fontSize: "12px", color: "#555", lineHeight: "1.7", marginBottom: "10px", borderLeft: "3px solid #4f9cf9" }}>
        <strong>Findings:</strong> LLD: Negative Foot position: Rt Rear foot pronated Restricted mobility: Rt Hip IR, B/L Hip ER Rt&gt;Lt, Rt Thoracic Rotation Tightness: B/L rectus femoris GIRD: -ve Special Tests: -ve
      </div>
      {[
        ["Contraindications", "N/A"], ["Sessions Missed", "N/A"],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}>
          <span style={{ color: "#555" }}>{k}:</span>
          <span style={{ color: "#888" }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─── CONSULT MODAL ───────────────────────────────────────────────────────
const ConsultModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState(null);

  const options = [
    { id: "trainer", label: "Trainer", icon: Dumbbell, color: "#ec5a4d", name: "Rahul Singh", time: "Tomorrow 9:00 AM" },
    { id: "physio", label: "Physiotherapist", icon: Stethoscope, color: "#ec5a4d", name: "Dr. Arun Kumar", time: "Today 4:00 PM" },
    { id: "nutritionist", label: "Nutritionist", icon: Apple, color: "#ec5a4d", name: "Anjali Nair", time: "Tomorrow 11:00 AM" },
  ];

  const handleChoose = (opt) => { setChosen(opt); setTimeout(() => setStep(2), 200); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: "12px 12px 0 0", padding: "24px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ width: "36px", height: "4px", background: "#e0e0e0", borderRadius: "2px", margin: "0 auto 18px" }} />

        {step === 1 ? (
          <>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#222", marginBottom: "4px" }}>Book a Consultation</div>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Who would you like to consult with?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {options.map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => handleChoose(opt)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "8px", border: "1px solid #e8e8e8", background: "#fff", cursor: "pointer", textAlign: "left" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#ec5a4d"; e.currentTarget.style.background = "#fff8f2"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.background = "#fff"; }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#fdecea", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} style={{ color: "#ec5a4d" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{opt.label}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{opt.name}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#ec5a4d", fontWeight: "600" }}>{opt.time}</div>
                  </button>
                );
              })}
            </div>
            <button onClick={onClose} style={{ marginTop: "16px", width: "100%", padding: "11px", borderRadius: "8px", border: "1px solid #e8e8e8", background: "#fff", color: "#888", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
              Cancel
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fdecea", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={34} style={{ color: "#ec5a4d" }} />
            </div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#222", marginBottom: "8px" }}>Consultation Booked!</div>
            <div style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", marginBottom: "4px" }}>
              Your consultation with <strong style={{ color: "#ec5a4d" }}>{chosen.name}</strong>
            </div>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
              ({chosen.label}) is confirmed for <strong>{chosen.time}</strong>.
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: "8px", backgroundColor: "#ec5a4d", border: "none", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN PLAYERS COMPONENT ───────────────────────────────────────────────
export default function Players() {
  const [view, setView] = useState(V.INFO);
  const [player, setPlayer] = useState(null);
  const [injuries, setInjuries] = useState([]);
  const [activeInj, setActiveInj] = useState(null);
  const [reqNote, setReqNote] = useState("");
  const [wellnessData, setWellnessData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showConsult, setShowConsult] = useState(false);

  const playerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const wRes = await fetchAllWellnessReport(playerId);
        const raw = wRes?.data;
        if (Array.isArray(raw)) setWellnessData(raw);
        else if (Array.isArray(raw?.data)) setWellnessData(raw.data);

        const pRes = await getPlayer(playerId);
        setPlayer(pRes.data);
        if (pRes.data?.injuries?.length > 0) setInjuries(pRes.data.injuries);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    if (playerId) fetchAll();
  }, [playerId]);

  const requestClearance = (injId) => {
    if (!reqNote.trim()) { alert("Please describe your current condition."); return; }
    const entry = { note: reqNote, date: new Date().toLocaleDateString("en-IN") };
    setInjuries(prev => prev.map(inj =>
      inj.id === injId ? { ...inj, status: "ClearanceRequested", clearanceRequest: entry } : inj
    ));
    setReqNote("");
    setActiveInj(prev => ({ ...prev, status: "ClearanceRequested", clearanceRequest: entry }));
  };

  const openInjury = (inj) => { setActiveInj(inj); setView(V.INJ_DETAIL); };

  // ── INJURY DETAIL ─────────────────────────────────────────────────────
  if (view === V.INJ_DETAIL && activeInj) {
    const inj = injuries.find(i => i.id === activeInj.id) || activeInj;
    return (
      <div style={{ padding: "28px", maxWidth: "700px", margin: "0 auto" }}>
        <BackBtn label="My Injuries" onClick={() => setView(V.INJURIES)} />
        <div style={card({ padding: "24px", marginBottom: "20px", borderLeft: "5px solid #ec5a4d" })}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: "800", margin: "0 0 6px 0" }}>{inj.type}</h2>
              <p style={{ color: "#666", margin: 0 }}>{inj.bodyPart} · Reported {inj.dateReported}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "#fff8e1", color: "#f9a825" }}>{inj.severity}</span>
              <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: "#fff0f0", color: "#cc3333" }}>Active Injury</span>
            </div>
          </div>
          {inj.description && (
            <div style={{ marginTop: "16px", padding: "14px", background: "#f9f9f9", borderRadius: "8px", borderLeft: "4px solid #ec5a4d" }}>{inj.description}</div>
          )}
        </div>

        <div style={card({ padding: "24px" })}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Send size={20} style={{ color: "#ec5a4d" }} />
            <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700" }}>Request Clearance for Playing</h3>
          </div>
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "16px" }}>
            Describe your current condition and why you feel ready to return to play. This request will be sent to your Physio and Management.
          </p>
          <textarea
            value={reqNote} onChange={e => setReqNote(e.target.value)}
            placeholder="e.g. Shoulder feels much better, no pain during light throwing. Ready to resume."
            rows={4}
            style={{ width: "100%", padding: "14px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", resize: "vertical", marginBottom: "20px" }}
          />
          <OBtn onClick={() => requestClearance(inj.id)} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
            <Send size={18} /> Send Clearance Request
          </OBtn>
        </div>
      </div>
    );
  }

  // ── INJURIES LIST ─────────────────────────────────────────────────────
  if (view === V.INJURIES) {
    return (
      <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
        <BackBtn label="Player Info" onClick={() => setView(V.INFO)} />
        <Heading title="My Injuries" sub="Track your injury status and request playing clearance" />
        {injuries.length === 0 ? (
          <div style={card({ padding: "60px", textAlign: "center" })}>
            <CheckCircle2 size={40} style={{ color: "#4ade80" }} />
            <p style={{ marginTop: "16px", fontSize: "16px", fontWeight: "600" }}>No active injuries</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {injuries.map(inj => (
              <div key={inj.id} onClick={() => openInjury(inj)} style={card({ padding: "18px 20px", cursor: "pointer" })}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>{inj.type}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>{inj.bodyPart} · {inj.dateReported}</div>
                  </div>
                  <ChevronRight size={20} style={{ color: "#999" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── TEAM VIEW ─────────────────────────────────────────────────────────
  if (view === V.TEAM) {
    const teamMembers = [
      { number: "01", name: "Arjun Menon", role: "Batsman" },
      { number: "02", name: "Rahul Das", role: "Bowler" },
      { number: "03", name: "Vivek Pillai", role: "All-rounder" },
      { number: "04", name: "Nikhil K", role: "Wicket-keeper" },
    ];
    return (
      <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
        <BackBtn label="Player Info" onClick={() => setView(V.INFO)} />
        <Heading title="Team Members" />
        <div style={card({ overflow: "hidden" })}>
          <div style={{ padding: "14px 22px", borderBottom: "1px solid #f0f0f0", fontWeight: "700", color: "#333" }}>
            {teamMembers.length} Players
          </div>
          {teamMembers.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", padding: "15px 22px", borderBottom: i < teamMembers.length - 1 ? "1px solid #f5f5f5" : "none", gap: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#fdecea", border: "2px solid #ffd8b0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#ec5a4d" }}>
                {m.number}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700" }}>{m.name}</div>
                <div style={{ fontSize: "13px", color: "#666" }}>{m.role}</div>
              </div>
              <ChevronRight size={18} style={{ color: "#ccc" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === V.DAILY_PROGRESS) {
    return <DailyReportForm onBack={() => setView(V.INFO)} />;
  }

  if (!player) return <div style={{ padding: "50px", textAlign: "center" }}>Loading player information...</div>;

  const activeInjuriesCount = injuries.filter(i => i.status !== "Cleared").length;
  const team = player.team || {};

  // ── MAIN DASHBOARD ─────────────────────────────────────────────────────
  return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Player Profile */}
      <div style={card({ padding: "20px 24px", marginBottom: "20px", position: "relative" })}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: "radial-gradient(circle, rgba(236,90,77,0.06) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "58px", height: "58px", borderRadius: "50%", backgroundColor: "#fdecea", border: "1.5px solid #ffd8b0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={26} style={{ color: "#ec5a4d" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#222", margin: 0 }}>{player.name}</h1>
              <span style={{ padding: "2px 10px", borderRadius: "20px", background: "#dcfce7", color: "#16a34a", fontSize: "11px", fontWeight: "700", border: "1px solid #bbf7d0" }}>Active</span>
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>
              #01 · {player.position || "Batsman"} · {team.name || "Kerala Cricket Academy"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          {[
            { label: "Age", value: player.age || "23 yrs" },
            { label: "Height", value: player.height || "178 cm" },
            { label: "Weight", value: player.weight || "72 kg" },
            { label: "Blood", value: player.bloodGroup || "B+" },
            { label: "Hand", value: player.battingHand || "Right" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, padding: "9px 6px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #e8e8e8", textAlign: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{s.value}</div>
              <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "600", marginTop: "1px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Injuries Banner */}
      {activeInjuriesCount > 0 && (
        <div style={{ ...card({ padding: "14px 20px", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={18} style={{ color: "#cc3333" }} />
            <span style={{ fontWeight: "700", color: "#cc3333" }}>
              {activeInjuriesCount} active injur{activeInjuriesCount > 1 ? "ies" : "y"} on record
            </span>
          </div>
          <button onClick={() => setView(V.INJURIES)} style={{ color: "#ec5a4d", fontWeight: "700", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
            View & Request Clearance →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", marginBottom: "16px", background: "#f5f5f5", borderRadius: "8px", padding: "3px" }}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            style={{
              flex: 1, padding: "9px", borderRadius: "6px", border: "none", cursor: "pointer",
              backgroundColor: activeTab === i ? "#fff" : "transparent",
              color: activeTab === i ? "#ec5a4d" : "#888",
              fontWeight: activeTab === i ? "700" : "500",
              fontSize: "13px",
              boxShadow: activeTab === i ? "0 1px 4px rgba(0,0,0,0.07)" : "none",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={card({ padding: "20px", marginBottom: "20px" })}>
        {activeTab === 0 && <WellnessChart data={wellnessData} />}
        {activeTab === 1 && <NFTCScore />}
        {activeTab === 2 && <PhysioFindings />}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
        <button onClick={() => setView(V.TEAM)}
          style={{ padding: "11px 22px", background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#ec5a4d"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}
        >
          <Users size={16} /> View Team
        </button>

        <OBtn onClick={() => setView(V.INJURIES)} variant="danger">
          <AlertTriangle size={16} /> My Injuries
        </OBtn>

        <OBtn onClick={() => setView(V.DAILY_PROGRESS)}>
          <ClipboardList size={16} /> Daily Wellness
        </OBtn>
      </div>

      {/* Book Consultation */}
      <button onClick={() => setShowConsult(true)}
        style={{
          width: "100%", padding: "14px", borderRadius: "8px",
          backgroundColor: "#222", border: "none",
          color: "#fff", fontWeight: "700", fontSize: "14px",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#333"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#222"}
      >
        <MessageSquare size={17} /> Book a Consultation
      </button>

      {showConsult && <ConsultModal onClose={() => setShowConsult(false)} />}
    </div>
  );
}