import { useState } from "react";
import {
  Stethoscope, Activity, AlertTriangle, CheckCircle2,
  Clock, ChevronDown, ChevronUp, Calendar, FileText,
  TrendingUp, Zap, Shield, RotateCcw,
} from "lucide-react";

const card = (extra = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...extra,
});

const Badge = ({ label, color, bg }) => (
  <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", color, background: bg, border: `1px solid ${color}33` }}>
    {label}
  </span>
);

// ── PROGRESS BAR ────────────────────────────────────────────────────────────
const ProgressBar = ({ label, value, color = "#f94f7c", note }) => (
  <div style={{ marginBottom: "14px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
      <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{label}</span>
      <span style={{ fontSize: "12px", fontWeight: "700", color }}>{value}%</span>
    </div>
    <div style={{ height: "7px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "4px", transition: "width 0.9s ease" }} />
    </div>
    {note && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "3px" }}>{note}</div>}
  </div>
);

// ── EXERCISE CARD ───────────────────────────────────────────────────────────
const ExerciseCard = ({ ex }) => {
  const [done, setDone] = useState(false);
  return (
    <div style={card({ padding: "12px 16px", marginBottom: "8px", display: "flex", gap: "12px", alignItems: "center", opacity: done ? 0.6 : 1, transition: "opacity 0.2s" })}>
      <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: done ? "#f0fff4" : "#fff8f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {done ? <CheckCircle2 size={17} style={{ color: "#22c55e" }} /> : <Activity size={17} style={{ color: "#f94f7c" }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: "700", fontSize: "13px", color: "#222", textDecoration: done ? "line-through" : "none" }}>{ex.name}</div>
        <div style={{ fontSize: "11px", color: "#aaa" }}>{ex.sets} · {ex.focus}</div>
      </div>
      <button onClick={() => setDone(!done)}
        style={{ padding: "5px 12px", borderRadius: "7px", border: `1px solid ${done ? "#22c55e" : "#e8e8e8"}`, background: done ? "#f0fff4" : "#fff", color: done ? "#22c55e" : "#888", fontWeight: "600", fontSize: "11px", cursor: "pointer" }}>
        {done ? "Done ✓" : "Mark Done"}
      </button>
    </div>
  );
};

// ── INJURY TIMELINE ─────────────────────────────────────────────────────────
const TimelineItem = ({ item, isLast }) => (
  <div style={{ display: "flex", gap: "14px" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0, marginTop: "3px" }} />
      {!isLast && <div style={{ width: "2px", flex: 1, background: "#e8e8e8", margin: "4px 0" }} />}
    </div>
    <div style={{ paddingBottom: "16px" }}>
      <div style={{ fontSize: "12px", fontWeight: "700", color: "#222" }}>{item.event}</div>
      <div style={{ fontSize: "11px", color: "#aaa" }}>{item.date}</div>
      {item.note && <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>{item.note}</div>}
    </div>
  </div>
);

// ── DATA ────────────────────────────────────────────────────────────────────
const REHAB_EXERCISES = [
  { name: "Hip IR Mobility Drill", sets: "3×10 reps", focus: "Right hip internal rotation" },
  { name: "Thoracic Rotation Stretch", sets: "3×30 sec hold", focus: "Bilateral thoracic spine" },
  { name: "Calf Raises (Eccentric)", sets: "3×15 reps slow", focus: "Achilles loading" },
  { name: "Glute Bridge (Single Leg)", sets: "3×12 reps each", focus: "Posterior chain stability" },
  { name: "Hip ER Banded Clams", sets: "3×15 reps", focus: "Bilateral hip external rotation" },
  { name: "Foot Arch Strengthening", sets: "2×20 reps", focus: "Right pronation correction" },
];

const ASSESSMENTS = [
  { label: "Hip Internal Rotation (R)", value: 72, color: "#f94f7c", note: "Target: >80° — improving" },
  { label: "Thoracic Rotation (R)", value: 65, color: "#e87722", note: "Significant restriction — priority rehab" },
  { label: "Hip External Rotation (B/L)", value: 58, color: "#f9a825", note: "Left slightly better than right" },
  { label: "Calf Flexibility (R)", value: 80, color: "#22c55e", note: "Within acceptable range" },
  { label: "Postural Correction", value: 70, color: "#4f9cf9", note: "Rear foot pronation improving with orthotics" },
];

const TIMELINE = [
  { event: "Initial MSK Screening", date: "13 May 2026", note: "Physio: Pinkesh Barot — Full MSK assessment completed", color: "#4f9cf9" },
  { event: "Rear Foot Pronation Flagged", date: "13 May 2026", note: "Right foot pronation — orthotics recommended", color: "#f9a825" },
  { event: "Rehab Plan Initiated", date: "14 May 2026", note: "Hip & thoracic mobility focus — 6-week plan", color: "#e87722" },
  { event: "Week 1 Review", date: "20 May 2026", note: "Good compliance. Hip IR improved by 5°", color: "#22c55e" },
  { event: "Next Assessment", date: "27 May 2026", color: "#aaa" },
];

const SESSIONS = [
  { date: "Today, 3:30 PM", type: "Mobility + Soft Tissue", duration: "45 min", status: "upcoming" },
  { date: "Thu 22 May", type: "Strengthening Protocol", duration: "50 min", status: "upcoming" },
  { date: "Mon 19 May", type: "Assessment + Mobility", duration: "40 min", status: "completed" },
  { date: "Fri 16 May", type: "Rehab Intro Session", duration: "35 min", status: "completed" },
];

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Physiotherapist() {
  const [tab, setTab] = useState(0);
  const tabs = ["Rehab Plan", "Assessments", "Sessions", "Timeline"];

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "860px", margin: "0 auto" }}>

      {/* Header */}
      <div style={card({ padding: "18px 20px", marginBottom: "20px", background: "linear-gradient(135deg, #fff0f8 0%, #fff 100%)", borderLeft: "4px solid #f94f7c" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f94f7c22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Stethoscope size={22} style={{ color: "#f94f7c" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#222" }}>Physiotherapy Portal</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Dr. Arun Kumar · MSc (Sports Physio) · KCA</div>
          </div>
          <Badge label="Active Rehab" color="#f94f7c" bg="#fff0f8" />
        </div>
      </div>

      {/* Quick status chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {[
          { icon: Shield, label: "Clearance", value: "Pending", color: "#f9a825", bg: "#fffbea" },
          { icon: TrendingUp, label: "Progress", value: "Good", color: "#22c55e", bg: "#f0fff4" },
          { icon: Zap, label: "Sessions Left", value: "9", color: "#4f9cf9", bg: "#eff8ff" },
          { icon: RotateCcw, label: "Week", value: "2 / 6", color: "#f94f7c", bg: "#fff0f8" },
        ].map(chip => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} style={{ flex: "1 0 calc(25% - 6px)", minWidth: "100px", padding: "10px 8px", background: chip.bg, borderRadius: "9px", border: `1px solid ${chip.color}33`, textAlign: "center" }}>
              <Icon size={14} style={{ color: chip.color, marginBottom: "3px" }} />
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{chip.value}</div>
              <div style={{ fontSize: "10px", color: chip.color, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.4px" }}>{chip.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", marginBottom: "16px", background: "#f5f5f5", borderRadius: "8px", padding: "3px" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ flex: 1, padding: "9px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: tab === i ? "#fff" : "transparent", color: tab === i ? "#f94f7c" : "#888", fontWeight: tab === i ? "700" : "500", fontSize: "12px", boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Rehab Plan */}
      {tab === 0 && (
        <div>
          <div style={{ padding: "12px 16px", background: "#fff8f2", borderRadius: "8px", border: "1px solid #ffd8b0", marginBottom: "14px", fontSize: "12px", color: "#666" }}>
            <strong style={{ color: "#e87722" }}>Today's Rehab Protocol —</strong> Focus: Hip Mobility + Thoracic Rotation. Complete all exercises in order.
          </div>
          {REHAB_EXERCISES.map((ex, i) => <ExerciseCard key={i} ex={ex} />)}
        </div>
      )}

      {/* Assessments */}
      {tab === 1 && (
        <div style={card({ padding: "20px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "4px" }}>MSK Mobility Scores</div>
          <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "16px" }}>Last assessed: 13 May 2026 · Pinkesh Barot</div>
          {ASSESSMENTS.map((a, i) => <ProgressBar key={i} {...a} />)}
          <div style={{ padding: "12px 14px", background: "#f9f9f9", borderRadius: "8px", borderLeft: "3px solid #4f9cf9", marginTop: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#333", marginBottom: "4px" }}>Physio Notes</div>
            <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
              LLD: Negative · Foot position: Rt Rear foot pronated · Restricted mobility: Rt Hip IR, B/L Hip ER Rt&gt;Lt, Rt Thoracic Rotation · Tightness: B/L rectus femoris · GIRD: -ve · Special Tests: -ve
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {tab === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SESSIONS.map((s, i) => (
            <div key={i} style={card({ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" })}>
              <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: s.status === "upcoming" ? "#fff0f8" : "#f0fff4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Calendar size={16} style={{ color: s.status === "upcoming" ? "#f94f7c" : "#22c55e" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{s.type}</div>
                <div style={{ fontSize: "11px", color: "#aaa" }}>{s.date} · {s.duration}</div>
              </div>
              <Badge
                label={s.status === "upcoming" ? "Upcoming" : "Completed"}
                color={s.status === "upcoming" ? "#f94f7c" : "#22c55e"}
                bg={s.status === "upcoming" ? "#fff0f8" : "#f0fff4"}
              />
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      {tab === 3 && (
        <div style={card({ padding: "20px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "16px" }}>Injury & Rehab Timeline</div>
          {TIMELINE.map((t, i) => (
            <TimelineItem key={i} item={t} isLast={i === TIMELINE.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}