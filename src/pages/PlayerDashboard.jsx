import { useState, useEffect } from "react";
import { getPlayer, fetchAllWellnessReport } from "../api/authApi";
import {
  Users, User, Stethoscope, Dumbbell, Apple, ArrowLeft, ClipboardList,
  ChevronRight, AlertTriangle, CheckCircle2, Send, Activity, Heart, Zap,
  Moon, Target, MessageSquare, Shield, Gauge as GaugeIcon, FileText,
} from "lucide-react";
import DailyReportForm from "../components/DailyReportForm";
import {
  C, COND, SEMI, Card, SectionHero, StatCard, StatGrid, SegTabs, List, ListRow,
  LeadBadge, Bar, Ring, Pill, CardHead, Note,
} from "../components/ui";
import {
  BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, Radar,
} from "recharts";

const V = { INFO: "info", TEAM: "team", INJURIES: "injuries", INJ_DETAIL: "inj_detail", DAILY_PROGRESS: "daily_progress" };
const TABS = ["Overview", "NFTC Score", "Physio Findings"];

// blue-unified chart palette (no purple/pink/green)
const SERIES = {
  Sleep: "#2f9be0", Fatigue: "#13409c", Soreness: "#6fb7e8", Motivation: "#0d2a63", RPE: "#c79a2f",
};

const BackLink = ({ label, onClick }) => (
  <button onClick={onClick} className="row-hl" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none",
    color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 18, padding: "4px 0" }}
    onMouseEnter={e => (e.currentTarget.style.color = C.skyDark)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
    <ArrowLeft size={16} /> {label}
  </button>
);

// ── WELLNESS CHART ──────────────────────────────────────────────────────────
const WellnessChart = ({ data }) => {
  const [chartType, setChartType] = useState(0);
  const TYPES = ["Bar", "Line", "Radar"];

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#bbb" }}>
        <Activity size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
        <div style={{ fontSize: 14, fontWeight: 600, color: C.muted }}>No wellness data yet</div>
        <div style={{ fontSize: 12, marginTop: 4, color: C.muted2 }}>Submit your first daily report to see charts here.</div>
      </div>
    );
  }

  const formatted = data.map((d, i) => ({
    date: new Date(d.date || d.createdAt || Date.now() - i * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    Fatigue: d.fatigue ?? 0, Sleep: d.sleep ?? 0, Soreness: d.soreness ?? 0, Motivation: d.motivation ?? 0, RPE: d.rpe ?? 0,
  }));
  const latest = data[data.length - 1] || {};
  const avg = (key) => data.length ? (data.reduce((s, d) => s + (d[key] ?? 0), 0) / data.length).toFixed(1) : 0;
  const radarData = ["fatigue", "sleep", "soreness", "motivation", "rpe"].map(k => ({
    metric: k.charAt(0).toUpperCase() + k.slice(1), Today: latest[k] ?? 0, Avg: parseFloat(avg(k)),
  }));

  const metrics = [
    { icon: Moon, label: "Sleep", value: latest.sleep ?? "–" },
    { icon: Zap, label: "RPE", value: latest.rpe ?? "–" },
    { icon: Heart, label: "Fatigue", value: latest.fatigue ?? "–" },
    { icon: Activity, label: "Soreness", value: latest.soreness ?? "–" },
    { icon: Target, label: "Motivation", value: latest.motivation ?? "–" },
  ];

  return (
    <div>
      <StatGrid min={120}>
        {metrics.map(m => <StatCard key={m.label} icon={m.icon} value={m.value} label={m.label} />)}
      </StatGrid>

      <div style={{ display: "flex", gap: 8, margin: "20px 0 14px" }}>
        {TYPES.map((t, i) => (
          <button key={t} onClick={() => setChartType(i)} style={{ padding: "6px 16px", borderRadius: 999,
            border: `1.5px solid ${chartType === i ? C.sky : C.line}`, background: chartType === i ? C.skyTint : "#fff",
            color: chartType === i ? C.skyDark : C.muted, fontWeight: 700, fontSize: 12.5, cursor: "pointer", fontFamily: SEMI }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ height: 270, width: "100%" }}>
        {chartType === 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formatted} margin={{ top: 10, right: 6, left: -22, bottom: 4 }} barGap={2} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip cursor={{ fill: "rgba(47,155,224,.06)" }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />
              {Object.entries(SERIES).map(([k, c]) => <RBar key={k} dataKey={k} fill={c} radius={[4, 4, 0, 0]} maxBarSize={14} />)}
            </BarChart>
          </ResponsiveContainer>
        )}
        {chartType === 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted} margin={{ top: 10, right: 6, left: -22, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />
              {Object.entries(SERIES).map(([k, c]) => <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />)}
            </LineChart>
          </ResponsiveContainer>
        )}
        {chartType === 2 && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e8edf3" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="Today" dataKey="Today" stroke={C.sky} fill={C.sky} fillOpacity={0.4} />
              <Radar name="Average" dataKey="Avg" stroke={C.navy} fill={C.navy} fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: SEMI, fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Recent Reports</div>
        <List>
          {[...data].reverse().slice(0, 5).map((d, i, arr) => (
            <ListRow key={i} last={i === arr.length - 1}
              lead={<LeadBadge>{new Date(d.date || d.createdAt).getDate() || "–"}</LeadBadge>}
              title={new Date(d.date || d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              meta={`Sleep ${d.sleep ?? "–"} · RPE ${d.rpe ?? "–"} · Fatigue ${d.fatigue ?? "–"} · Soreness ${d.soreness ?? "–"}`}
              right={<Pill tone={d.injury ? "danger" : "ok"}>{d.injury ? "Injured" : "OK"}</Pill>} />
          ))}
        </List>
      </div>
    </div>
  );
};

// ── NFTC SCORE ──────────────────────────────────────────────────────────────
const NFTCScore = () => {
  const scores = [
    { label: "Neuromuscular", value: 78, desc: "Reaction time & coordination within optimal range" },
    { label: "Functional Movement", value: 85, desc: "FMS composite score — no asymmetry flags" },
    { label: "Thermal Load", value: 62, desc: "Core temp management — monitor hydration" },
    { label: "Cardiac Readiness", value: 91, desc: "Resting HR 58bpm · HRV 72ms" },
  ];
  const overall = Math.round(scores.reduce((s, x) => s + x.value, 0) / scores.length);
  const verdict = overall >= 85 ? ["Excellent", "ok"] : overall >= 70 ? ["Good", "sky"] : ["Needs Attention", "danger"];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22, flexWrap: "wrap",
        background: `linear-gradient(135deg, ${C.navy2}, ${C.navy})`, borderRadius: 16, padding: 22, color: "#fff" }}>
        <Ring value={overall} size={120} color={C.sky} sub="Overall" />
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 24, textTransform: "uppercase" }}>NFTC Composite</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.66)", marginTop: 4 }}>Neuro-Functional Training Capacity</div>
          <div style={{ marginTop: 12 }}><Pill tone={verdict[1]}>{verdict[0]}</Pill></div>
        </div>
      </div>
      <Card pad="20px">
        {scores.map((s, i) => <Bar key={i} label={s.label} valueText={s.value} pct={s.value} note={s.desc} />)}
        <div style={{ height: 0 }} />
      </Card>
    </div>
  );
};

// ── PHYSIO FINDINGS ──────────────────────────────────────────────────────────
const InfoKV = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.line2}`, fontSize: 13.5 }}>
    <span style={{ color: C.muted }}>{k}</span><span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
  </div>
);
const PhysioFindings = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Card>
      <CardHead icon={FileText} title="Master Medical History" />
      <div style={{ padding: "6px 18px 14px" }}>
        {[["Any Illness", "N/A"], ["Any Surgery", "N/A"], ["Blood Test Date", "N/A"], ["Cardiac", "N/A"], ["Pulmonary", "N/A"],
          ["SCAT 6 (Baseline)", "N/A"], ["Previous Concussion", "N/A"], ["Vaccination", "N/A"], ["Medications", "N/A"]].map(([k, v]) => <InfoKV key={k} k={k} v={v} />)}
      </div>
    </Card>
    <Card>
      <CardHead icon={Stethoscope} title="Master Physio Findings" sub="MSK findings · 2026-05-13 · Pinkesh Barot" />
      <div style={{ padding: 18 }}>
        <Note tone="sky"><strong>Findings:</strong> LLD: Negative · Foot position: Rt Rear foot pronated · Restricted mobility: Rt Hip IR, B/L Hip ER Rt&gt;Lt, Rt Thoracic Rotation · Tightness: B/L rectus femoris · GIRD: −ve · Special Tests: −ve</Note>
        <div style={{ marginTop: 12 }}>
          <InfoKV k="Contraindications" v="N/A" /><InfoKV k="Sessions Missed" v="N/A" />
        </div>
      </div>
    </Card>
  </div>
);

// ── CONSULT MODAL ─────────────────────────────────────────────────────────────
const ConsultModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [chosen, setChosen] = useState(null);
  const options = [
    { id: "trainer", label: "Trainer", icon: Dumbbell, name: "Rahul Singh", time: "Tomorrow 9:00 AM" },
    { id: "physio", label: "Physiotherapist", icon: Stethoscope, name: "Dr. Arun Kumar", time: "Today 4:00 PM" },
    { id: "nutritionist", label: "Nutritionist", icon: Apple, name: "Anjali Nair", time: "Tomorrow 11:00 AM" },
  ];
  const handleChoose = (opt) => { setChosen(opt); setTimeout(() => setStep(2), 180); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,74,.55)", backdropFilter: "blur(3px)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: "18px 18px 0 0", padding: 24, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -10px 40px rgba(11,31,74,.25)", animation: "fadeIn .25s ease" }}>
        <div style={{ width: 40, height: 4, background: C.line, borderRadius: 2, margin: "0 auto 18px" }} />
        {step === 1 ? (
          <>
            <div style={{ fontFamily: COND, fontSize: 22, fontWeight: 700, textTransform: "uppercase", color: C.text }}>Book a Consultation</div>
            <div style={{ fontSize: 13, color: C.muted, margin: "4px 0 18px" }}>Who would you like to consult with?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {options.map(opt => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => handleChoose(opt)} className="lift"
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: C.skyTint, display: "grid", placeItems: "center" }}><Icon size={19} style={{ color: C.skyDark }} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{opt.label}</div>
                      <div style={{ fontSize: 12.5, color: C.muted }}>{opt.name}</div>
                    </div>
                    <Pill tone="sky">{opt.time}</Pill>
                  </button>
                );
              })}
            </div>
            <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", background: C.skyTint, display: "grid", placeItems: "center", margin: "0 auto 16px" }}><CheckCircle2 size={34} style={{ color: C.skyDark }} /></div>
            <div style={{ fontFamily: COND, fontSize: 24, fontWeight: 700, textTransform: "uppercase", color: C.text, marginBottom: 8 }}>Consultation Booked</div>
            <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
              Your session with <strong style={{ color: C.skyDark }}>{chosen.name}</strong> ({chosen.label}) is confirmed for <strong>{chosen.time}</strong>.
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: 13, borderRadius: 10, background: C.sky, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: SEMI }}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
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
      } catch (err) { console.error("Failed to fetch data", err); }
    };
    if (playerId) fetchAll();
  }, [playerId]);

  const requestClearance = (injId) => {
    if (!reqNote.trim()) { alert("Please describe your current condition."); return; }
    const entry = { note: reqNote, date: new Date().toLocaleDateString("en-IN") };
    setInjuries(prev => prev.map(inj => inj.id === injId ? { ...inj, status: "ClearanceRequested", clearanceRequest: entry } : inj));
    setReqNote("");
    setActiveInj(prev => ({ ...prev, status: "ClearanceRequested", clearanceRequest: entry }));
  };
  const openInjury = (inj) => { setActiveInj(inj); setView(V.INJ_DETAIL); };

  // ── INJURY DETAIL ──
  if (view === V.INJ_DETAIL && activeInj) {
    const inj = injuries.find(i => i.id === activeInj.id) || activeInj;
    return (
      <div className="page-wrap" style={{ maxWidth: 720 }}>
        <BackLink label="My Injuries" onClick={() => setView(V.INJURIES)} />
        <Card style={{ borderLeft: `4px solid ${C.danger}`, marginBottom: 20 }} pad="24px">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: COND, fontSize: 26, fontWeight: 700, textTransform: "uppercase", margin: "0 0 6px" }}>{inj.type}</h2>
              <p style={{ color: C.muted, margin: 0, fontSize: 13.5 }}>{inj.bodyPart} · Reported {inj.dateReported}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}><Pill tone="warn">{inj.severity}</Pill><Pill tone="danger">Active</Pill></div>
          </div>
          {inj.description && <div style={{ marginTop: 16, padding: 14, background: C.paper, borderRadius: 10, borderLeft: `4px solid ${C.sky}`, fontSize: 13.5, color: C.text }}>{inj.description}</div>}
        </Card>
        <Card pad="24px">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Send size={20} style={{ color: C.sky }} />
            <h3 style={{ margin: 0, fontFamily: SEMI, fontSize: 17, fontWeight: 600 }}>Request Clearance for Playing</h3>
          </div>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>Describe your current condition and why you feel ready to return. This goes to your Physio and Management.</p>
          <textarea value={reqNote} onChange={e => setReqNote(e.target.value)} className="input"
            placeholder="e.g. Shoulder feels much better, no pain during light throwing. Ready to resume." rows={4} style={{ resize: "vertical", marginBottom: 18 }} />
          <button onClick={() => requestClearance(inj.id)} className="btn btn-primary" style={{ width: "100%" }}><Send size={18} /> Send Clearance Request</button>
        </Card>
      </div>
    );
  }

  // ── INJURIES LIST ──
  if (view === V.INJURIES) {
    return (
      <div className="page-wrap" style={{ maxWidth: 820 }}>
        <BackLink label="Dashboard" onClick={() => setView(V.INFO)} />
        <SectionHero icon={Shield} eyebrow="Medical Record" title="My Injuries" sub="Track your injury status and request playing clearance" />
        {injuries.length === 0 ? (
          <Card pad="60px" style={{ textAlign: "center" }}>
            <CheckCircle2 size={42} style={{ color: C.ok }} />
            <p style={{ marginTop: 14, fontSize: 16, fontWeight: 700 }}>No active injuries — you're cleared to play.</p>
          </Card>
        ) : (
          <List>
            {injuries.map((inj, i, arr) => (
              <ListRow key={inj.id} last={i === arr.length - 1} onClick={() => openInjury(inj)} accent={C.danger}
                lead={<LeadBadge accent={C.danger}><Shield size={18} /></LeadBadge>}
                title={inj.type} meta={`${inj.bodyPart} · ${inj.dateReported}`} right={<Pill tone="danger">Active</Pill>} />
            ))}
          </List>
        )}
      </div>
    );
  }

  // ── TEAM ──
  if (view === V.TEAM) {
    const teamMembers = [
      { number: "01", name: "Arjun Menon", role: "Batsman" },
      { number: "02", name: "Rahul Das", role: "Bowler" },
      { number: "03", name: "Vivek Pillai", role: "All-rounder" },
      { number: "04", name: "Nikhil K", role: "Wicket-keeper" },
    ];
    return (
      <div className="page-wrap" style={{ maxWidth: 820 }}>
        <BackLink label="Dashboard" onClick={() => setView(V.INFO)} />
        <SectionHero icon={Users} eyebrow="Kerala Cricket Academy" title="Team Members" sub={`${teamMembers.length} players in the squad`} />
        <List>
          {teamMembers.map((m, i, arr) => (
            <ListRow key={i} last={i === arr.length - 1} onClick={() => {}}
              lead={<LeadBadge tone="filled">{m.number}</LeadBadge>} title={m.name} meta={m.role} />
          ))}
        </List>
      </div>
    );
  }

  if (view === V.DAILY_PROGRESS) return <DailyReportForm onBack={() => setView(V.INFO)} />;

  if (!player) return <div className="page-wrap" style={{ textAlign: "center", color: C.muted, paddingTop: 80 }}>Loading player information…</div>;

  const activeInjuriesCount = injuries.filter(i => i.status !== "Cleared").length;
  const team = player.team || {};
  const stats = [
    { label: "Age", value: player.age || "23 yrs" },
    { label: "Height", value: player.height || "178 cm" },
    { label: "Weight", value: player.weight || "72 kg" },
    { label: "Blood", value: player.bloodGroup || "B+" },
    { label: "Hand", value: player.battingHand || "Right" },
  ];

  // ── MAIN DASHBOARD ──
  return (
    <div className="page-wrap">
      {/* Profile hero */}
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, marginBottom: 20, color: "#fff",
        background: `linear-gradient(135deg, ${C.navy2} 0%, ${C.navy} 58%, ${C.ink} 100%)`, boxShadow: "0 18px 40px -24px rgba(13,42,99,.5)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px, transparent 1px, transparent 58px)", opacity: .5 }} />
        <div style={{ position: "absolute", right: -50, top: -70, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.sky}33, transparent 62%)` }} />
        <div style={{ position: "relative", padding: "24px 26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", display: "grid", placeItems: "center", flex: "0 0 auto",
              background: "rgba(255,255,255,.08)", border: `2px solid ${C.sky}`, boxShadow: `0 0 0 4px rgba(47,155,224,.18)` }}>
              <User size={28} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: COND, fontSize: 30, fontWeight: 700, textTransform: "uppercase", margin: 0, lineHeight: 1 }}>{player.name}</h1>
                <Pill tone="ok"><span style={{ width: 6, height: 6, borderRadius: 99, background: C.ok, display: "inline-block" }} />Active</Pill>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 6 }}>#01 · {player.position || "Batsman"} · {team.name || "Kerala Cricket Academy"}</div>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 20, flexWrap: "wrap", gap: 0, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 4 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ flex: "1 1 90px", padding: "12px 8px", textAlign: "center", borderLeft: i ? "1px solid rgba(255,255,255,.08)" : "none" }}>
                <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 20 }}>{s.value}</div>
                <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Injury alert */}
      {activeInjuriesCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.dangerTint, border: `1px solid #f3c9c5`, borderLeft: `4px solid ${C.danger}`, borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "grid", placeItems: "center", color: C.danger, flexShrink: 0 }}><AlertTriangle size={18} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#9c2f29", fontSize: 14.5 }}>{activeInjuriesCount} active injur{activeInjuriesCount > 1 ? "ies" : "y"} on record</div>
              <div style={{ fontSize: 12.5, color: "#b15048", marginTop: 1 }}>Tap to view recovery and request clearance.</div>
            </div>
            <button onClick={() => setView(V.INJURIES)} style={{ background: "none", border: "none", color: C.danger, fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: SEMI, whiteSpace: "nowrap" }}>View <ChevronRight size={15} /></button>
          </div>
        </div>
      )}

      {/* Tabs + content */}
      <SegTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === 0 && <Card pad="20px" style={{ marginBottom: 20 }}><WellnessChart data={wellnessData} /></Card>}
      {activeTab === 1 && <div style={{ marginBottom: 20 }}><NFTCScore /></div>}
      {activeTab === 2 && <div style={{ marginBottom: 20 }}><PhysioFindings /></div>}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button onClick={() => setView(V.TEAM)} className="btn btn-ghost"><Users size={16} /> View Team</button>
        <button onClick={() => setView(V.INJURIES)} className="btn" style={{ background: C.dangerTint, color: C.danger }}><AlertTriangle size={16} /> My Injuries</button>
        <button onClick={() => setView(V.DAILY_PROGRESS)} className="btn btn-primary"><ClipboardList size={16} /> Daily Wellness</button>
      </div>

      <button onClick={() => setShowConsult(true)} className="btn lift" style={{ width: "100%", background: C.navy, color: "#fff", padding: 15, fontSize: 15 }}>
        <MessageSquare size={17} /> Book a Consultation
      </button>

      {showConsult && <ConsultModal onClose={() => setShowConsult(false)} />}
    </div>
  );
}
