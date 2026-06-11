import { useState } from "react";
import {
  Users, Target, TrendingUp, Calendar, MessageSquare,
  CheckCircle2, Clock, Award, BarChart2, Star, AlertCircle,
  ChevronRight, Mic,
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

const SkillBar = ({ label, value, color }) => (
  <div style={{ marginBottom: "12px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
      <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{label}</span>
      <span style={{ fontSize: "12px", fontWeight: "700", color }}>{value}/10</span>
    </div>
    <div style={{ height: "6px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value * 10}%`, background: color, borderRadius: "4px", transition: "width 0.9s ease" }} />
    </div>
  </div>
);

// ── DATA ────────────────────────────────────────────────────────────────────
const SCHEDULE = [
  { day: "Mon", time: "9:00 AM", session: "Batting Nets", type: "Technical", status: "completed" },
  { day: "Tue", time: "9:00 AM", session: "Fielding Drills", type: "Physical", status: "completed" },
  { day: "Wed", time: "10:00 AM", session: "Match Simulation", type: "Tactical", status: "upcoming" },
  { day: "Thu", time: "9:30 AM", session: "Video Analysis + Review", type: "Analysis", status: "upcoming" },
  { day: "Fri", time: "9:00 AM", session: "Nets + Fitness", type: "Combined", status: "upcoming" },
  { day: "Sat", time: "8:00 AM", session: "Practice Match", type: "Match", status: "upcoming" },
];

const OBJECTIVES = [
  { goal: "Improve strike rate to 140+ in T20", progress: 72, color: "#ec5a4d" },
  { goal: "Reduce wide balls per over to <0.5", progress: 55, color: "#4f9cf9" },
  { goal: "Maintain fielding fitness score 85+", progress: 88, color: "#22c55e" },
  { goal: "Master pull shot off short pitched", progress: 40, color: "#f94f7c" },
];

const SKILLS = [
  { label: "Batting Technique", value: 8.2, color: "#ec5a4d" },
  { label: "Running Between Wickets", value: 7.5, color: "#4f9cf9" },
  { label: "Fielding", value: 8.8, color: "#22c55e" },
  { label: "Mental Composure", value: 7.0, color: "#a855f7" },
  { label: "Shot Selection", value: 7.8, color: "#f94f7c" },
  { label: "Fitness & Endurance", value: 8.5, color: "#f9a825" },
];

const FEEDBACK = [
  {
    date: "19 May 2026", session: "Batting Nets",
    text: "Excellent footwork in the nets today. Your drive through covers was clean. Still need to work on playing late — tendency to play too early on slower deliveries.",
    rating: 4,
  },
  {
    date: "16 May 2026", session: "Fielding Practice",
    text: "Brilliant reaction catch in the deep. Ground fielding improved significantly. Keep pushing your dive-and-recover speed.",
    rating: 5,
  },
  {
    date: "14 May 2026", session: "Match Simulation",
    text: "Good under pressure but need to communicate better with batting partners at the crease.",
    rating: 3,
  },
];

const TYPE_COLORS = {
  Technical: { color: "#ec5a4d", bg: "#fff8f2" },
  Physical: { color: "#4f9cf9", bg: "#eff8ff" },
  Tactical: { color: "#a855f7", bg: "#f5f0ff" },
  Analysis: { color: "#f9a825", bg: "#fffbea" },
  Combined: { color: "#f94f7c", bg: "#fff0f8" },
  Match: { color: "#22c55e", bg: "#f0fff4" },
};

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Coach() {
  const [tab, setTab] = useState(0);
  const tabs = ["Schedule", "Objectives", "Performance", "Feedback"];

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "860px", margin: "0 auto" }}>

      {/* Header */}
      <div style={card({ padding: "18px 20px", marginBottom: "20px", background: "linear-gradient(135deg, #eff8ff 0%, #fff 100%)", borderLeft: "4px solid #4f9cf9" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#4f9cf922", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Users size={22} style={{ color: "#4f9cf9" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#222" }}>Coach Portal</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Sanjay Verma · Head Coach · KCA</div>
          </div>
          <Badge label="Batting Specialist" color="#4f9cf9" bg="#eff8ff" />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {[
          { icon: Award, label: "Current Form", value: "Good", color: "#22c55e", bg: "#f0fff4" },
          { icon: Target, label: "Team Rank", value: "#3", color: "#ec5a4d", bg: "#fff8f2" },
          { icon: BarChart2, label: "Avg Score", value: "8.1/10", color: "#4f9cf9", bg: "#eff8ff" },
          { icon: Star, label: "Coach Rating", value: "4.2★", color: "#f9a825", bg: "#fffbea" },
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
            style={{ flex: 1, padding: "9px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: tab === i ? "#fff" : "transparent", color: tab === i ? "#4f9cf9" : "#888", fontWeight: tab === i ? "700" : "500", fontSize: "12px", boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Schedule */}
      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>This week's training schedule — KCA Ground</div>
          {SCHEDULE.map((s, i) => {
            const tc = TYPE_COLORS[s.type] || { color: "#888", bg: "#f5f5f5" };
            return (
              <div key={i} style={card({ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" })}>
                <div style={{ textAlign: "center", minWidth: "34px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "700", color: "#888" }}>{s.day}</div>
                </div>
                <div style={{ width: "1px", height: "36px", background: "#e8e8e8" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{s.session}</div>
                  <div style={{ fontSize: "11px", color: "#aaa" }}>{s.time}</div>
                </div>
                <Badge label={s.type} color={tc.color} bg={tc.bg} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.status === "completed" ? "#22c55e" : "#e8e8e8", flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Objectives */}
      {tab === 1 && (
        <div style={card({ padding: "20px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "4px" }}>Season Objectives</div>
          <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "18px" }}>Progress tracked by Coach Sanjay Verma</div>
          {OBJECTIVES.map((o, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{o.goal}</span>
                <span style={{ fontSize: "12px", fontWeight: "700", color: o.color }}>{o.progress}%</span>
              </div>
              <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${o.progress}%`, background: o.color, borderRadius: "4px", transition: "width 0.9s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: "16px", padding: "12px 14px", background: "#fff8f2", borderRadius: "8px", border: "1px solid #ffd8b0", fontSize: "12px", color: "#666" }}>
            <AlertCircle size={13} style={{ color: "#ec5a4d", display: "inline", marginRight: "6px" }} />
            <strong style={{ color: "#ec5a4d" }}>Focus area:</strong> Pull shot development needs priority in next 3 sessions.
          </div>
        </div>
      )}

      {/* Performance */}
      {tab === 2 && (
        <div style={card({ padding: "20px" })}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "16px" }}>Player Skill Assessment</div>
          {SKILLS.map((s, i) => <SkillBar key={i} {...s} />)}
          <div style={{ marginTop: "16px", padding: "14px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>Overall Assessment</div>
            <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7" }}>
              Strong technical base with above-average fielding. Consistency in shot selection is the key differentiator to work on. Mental game improving — composure under pressure has been a notable improvement this season.
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {tab === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {FEEDBACK.map((f, i) => (
            <div key={i} style={card({ padding: "16px 18px" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{f.session}</div>
                  <div style={{ fontSize: "11px", color: "#aaa" }}>{f.date}</div>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={12} fill={s <= f.rating ? "#f9a825" : "none"} style={{ color: s <= f.rating ? "#f9a825" : "#ddd" }} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "#555", lineHeight: "1.7", borderLeft: "3px solid #4f9cf9", paddingLeft: "10px" }}>
                {f.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}