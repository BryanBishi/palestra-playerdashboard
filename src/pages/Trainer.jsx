import { useState } from "react";
import {
  Dumbbell, Zap, Flame, Timer, TrendingUp, CheckCircle2,
  RotateCcw, Activity, Heart, AlertCircle, Calendar, Award,
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

// ── WORKOUT EXERCISE ────────────────────────────────────────────────────────
const WorkoutExercise = ({ ex, idx }) => {
  const [sets, setSets] = useState(Array(ex.sets).fill(false));
  const done = sets.filter(Boolean).length;
  const allDone = done === ex.sets;

  return (
    <div style={card({ padding: "14px 16px", marginBottom: "8px", opacity: allDone ? 0.65 : 1, transition: "opacity 0.2s" })}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: allDone ? "#f0fff4" : "#fff3e8",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: "700", fontSize: "13px",
          color: allDone ? "#22c55e" : "#e87722",
        }}>
          {allDone ? <CheckCircle2 size={16} style={{ color: "#22c55e" }} /> : idx + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#222", textDecoration: allDone ? "line-through" : "none" }}>{ex.name}</div>
          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "1px" }}>{ex.load} · {ex.rest} rest · {ex.focus}</div>
          {/* Set tracker */}
          <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
            {sets.map((s, i) => (
              <button key={i} onClick={() => setSets(prev => prev.map((v, j) => j === i ? !v : v))}
                style={{
                  width: "28px", height: "28px", borderRadius: "6px",
                  border: `1.5px solid ${s ? "#22c55e" : "#e8e8e8"}`,
                  background: s ? "#f0fff4" : "#fff",
                  color: s ? "#22c55e" : "#bbb",
                  fontWeight: "700", fontSize: "11px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {s ? "✓" : i + 1}
              </button>
            ))}
            <span style={{ fontSize: "11px", color: "#aaa", alignSelf: "center" }}>{done}/{ex.sets} sets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── FITNESS TEST GAUGE ──────────────────────────────────────────────────────
const FitnessGauge = ({ label, value, max, unit, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ padding: "12px 14px", background: "#fafafa", borderRadius: "9px", border: "1px solid #e8e8e8", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color }}>{value} <span style={{ fontSize: "11px", color: "#aaa" }}>{unit}</span></span>
      </div>
      <div style={{ height: "6px", background: "#e8e8e8", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: "4px", transition: "width 0.9s ease" }} />
      </div>
    </div>
  );
};

// ── DATA ────────────────────────────────────────────────────────────────────
const TODAY_WORKOUT = [
  { name: "Barbell Back Squat", sets: 4, load: "70kg × 8 reps", rest: "90 sec", focus: "Quad + Posterior chain" },
  { name: "Romanian Deadlift", sets: 3, load: "60kg × 10 reps", rest: "90 sec", focus: "Hamstrings + Glutes" },
  { name: "Bulgarian Split Squat", sets: 3, load: "BW + 10kg × 8 each", rest: "60 sec", focus: "Single-leg strength" },
  { name: "Box Jumps", sets: 4, load: "Height 50cm × 5 reps", rest: "60 sec", focus: "Explosive power" },
  { name: "Lateral Band Walks", sets: 3, load: "Band × 15 each side", rest: "45 sec", focus: "Hip abductors" },
  { name: "Plank Variations", sets: 3, load: "45 sec each", rest: "30 sec", focus: "Core stability" },
];

const FITNESS_TESTS = [
  { label: "VO2 Max", value: 54, max: 65, unit: "ml/kg/min", color: "#e87722" },
  { label: "Sprint Speed (30m)", value: 3.8, max: 4.5, unit: "sec", color: "#4f9cf9" },
  { label: "Vertical Jump", value: 62, max: 80, unit: "cm", color: "#a855f7" },
  { label: "Broad Jump", value: 2.35, max: 3, unit: "m", color: "#22c55e" },
  { label: "Grip Strength (R)", value: 52, max: 70, unit: "kg", color: "#f94f7c" },
  { label: "Beep Test Level", value: 11, max: 15, unit: "/ 15", color: "#f9a825" },
];

const TRAINING_HISTORY = [
  { date: "19 May", session: "Lower Body Power", load: "High", duration: "65 min", rpe: 8 },
  { date: "17 May", session: "Upper Body Strength", load: "Moderate", duration: "55 min", rpe: 7 },
  { date: "16 May", session: "Speed & Agility", load: "High", duration: "50 min", rpe: 9 },
  { date: "15 May", session: "Active Recovery", load: "Low", duration: "30 min", rpe: 4 },
  { date: "14 May", session: "Full Body Circuit", load: "Moderate", duration: "60 min", rpe: 7 },
];

const LOAD_COLORS = { High: { color: "#cc3333", bg: "#fff0f0" }, Moderate: { color: "#f9a825", bg: "#fffbea" }, Low: { color: "#22c55e", bg: "#f0fff4" } };

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Trainer() {
  const [tab, setTab] = useState(0);
  const tabs = ["Today's Workout", "Fitness Tests", "History"];
  const totalSets = TODAY_WORKOUT.reduce((s, e) => s + e.sets, 0);

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "860px", margin: "0 auto" }}>

      {/* Header */}
      <div style={card({ padding: "18px 20px", marginBottom: "20px", background: "linear-gradient(135deg, #f5f0ff 0%, #fff 100%)", borderLeft: "4px solid #a855f7" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#a855f722", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Dumbbell size={22} style={{ color: "#a855f7" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#222" }}>Strength & Conditioning</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Rahul Singh · S&C Coach · KCA</div>
          </div>
          <Badge label="Phase 2" color="#a855f7" bg="#f5f0ff" />
        </div>
      </div>

      {/* Chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {[
          { icon: Flame, label: "Today's Load", value: "High", color: "#cc3333", bg: "#fff0f0" },
          { icon: Timer, label: "Duration", value: "70 min", color: "#e87722", bg: "#fff8f2" },
          { icon: Dumbbell, label: "Total Sets", value: String(totalSets), color: "#a855f7", bg: "#f5f0ff" },
          { icon: Heart, label: "Target RPE", value: "7–8", color: "#f94f7c", bg: "#fff0f8" },
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
      <div style={{ display: "flex", marginBottom: "16px", background: "#f5f5f5", borderRadius: "8px", padding: "3px" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ flex: 1, padding: "9px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: tab === i ? "#fff" : "transparent", color: tab === i ? "#a855f7" : "#888", fontWeight: tab === i ? "700" : "500", fontSize: "12px", boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Today's Workout */}
      {tab === 0 && (
        <div>
          <div style={{ padding: "10px 14px", background: "#fff8f2", borderRadius: "8px", border: "1px solid #ffd8b0", marginBottom: "14px", fontSize: "12px", color: "#666", display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <AlertCircle size={14} style={{ color: "#e87722", flexShrink: 0, marginTop: "1px" }} />
            <span><strong style={{ color: "#e87722" }}>Lower Body Power Day.</strong> Complete warm-up before starting. Tap set circles to track progress.</span>
          </div>
          {TODAY_WORKOUT.map((ex, i) => <WorkoutExercise key={i} ex={ex} idx={i} />)}
          <div style={{ marginTop: "14px", padding: "12px 16px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8", fontSize: "12px", color: "#555" }}>
            <strong>Cool-down:</strong> 10 min foam rolling (quads, hamstrings, IT band) + static stretching. Log your RPE after session completion.
          </div>
        </div>
      )}

      {/* Fitness Tests */}
      {tab === 1 && (
        <div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>Last fitness assessment: 12 May 2026 · Rahul Singh</div>
          {FITNESS_TESTS.map((f, i) => <FitnessGauge key={i} {...f} />)}
          <div style={{ marginTop: "14px", padding: "12px 14px", background: "#f5f0ff", borderRadius: "8px", border: "1px solid #d8b4fe", fontSize: "12px", color: "#555" }}>
            <strong style={{ color: "#a855f7" }}>Trainer's Note:</strong> VO2 max is above average for cricket. Sprint speed needs improvement — focus on acceleration drills in coming weeks. Overall fitness grade: <strong>B+</strong>
          </div>
        </div>
      )}

      {/* History */}
      {tab === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {TRAINING_HISTORY.map((h, i) => {
            const lc = LOAD_COLORS[h.load] || { color: "#888", bg: "#f5f5f5" };
            return (
              <div key={i} style={card({ padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" })}>
                <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: "#f5f0ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Dumbbell size={16} style={{ color: "#a855f7" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{h.session}</div>
                  <div style={{ fontSize: "11px", color: "#aaa" }}>{h.date} · {h.duration}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <Badge label={h.load} color={lc.color} bg={lc.bg} />
                  <span style={{ fontSize: "11px", color: "#aaa" }}>RPE {h.rpe}/10</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}