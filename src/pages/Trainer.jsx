import { useState } from "react";
import {
  Dumbbell, Flame, Timer, CheckCircle2,
  Heart, AlertCircle, Activity,
} from "lucide-react";
import {
  C, COND, SEMI, Card, SectionHero, StatCard, StatGrid, SegTabs,
  List, ListRow, LeadBadge, Bar, Pill, Note,
} from "../components/ui.jsx";

// ── WORKOUT EXERCISE ────────────────────────────────────────────────────────
const WorkoutExercise = ({ ex, idx, last }) => {
  const [sets, setSets] = useState(Array(ex.sets).fill(false));
  const done = sets.filter(Boolean).length;
  const allDone = done === ex.sets;

  const tracker = (
    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
      {sets.map((s, i) => (
        <button key={i} onClick={() => setSets(prev => prev.map((v, j) => j === i ? !v : v))}
          style={{
            width: "30px", height: "30px", borderRadius: "8px",
            border: `1.5px solid ${s ? C.sky : C.line}`,
            background: s ? `linear-gradient(160deg, ${C.sky}, ${C.skyDark})` : "#fff",
            color: s ? "#fff" : C.muted2,
            fontWeight: "700", fontSize: "12px", cursor: "pointer", fontFamily: COND,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: s ? `0 6px 14px -6px ${C.sky}99` : "none", transition: ".15s",
          }}
        >
          {s ? "✓" : i + 1}
        </button>
      ))}
      <span style={{ fontSize: "11.5px", color: allDone ? C.sky : C.muted, fontWeight: 700, alignSelf: "center", marginLeft: 2 }}>
        {done}/{ex.sets} sets
      </span>
    </div>
  );

  return (
    <ListRow
      last={last}
      accent={C.sky}
      lead={
        allDone
          ? <LeadBadge tone="filled">{<CheckCircle2 size={18} />}</LeadBadge>
          : <LeadBadge tone="filled">{idx + 1}</LeadBadge>
      }
      title={
        <span style={{ textDecoration: allDone ? "line-through" : "none", opacity: allDone ? 0.6 : 1, transition: ".2s" }}>
          {ex.name}
        </span>
      }
      meta={`${ex.load} · ${ex.rest} rest · ${ex.focus}`}
      right={tracker}
    />
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
  { label: "VO2 Max", value: 54, max: 65, unit: "ml/kg/min", color: "#2f9be0" },
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

const LOAD_TONE = { High: "danger", Moderate: "warn", Low: "ok" };

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Trainer() {
  const [tab, setTab] = useState(0);
  const tabs = ["Today's Workout", "Fitness Tests", "History"];
  const totalSets = TODAY_WORKOUT.reduce((s, e) => s + e.sets, 0);

  return (
    <div className="page-wrap">

      {/* Header */}
      <SectionHero
        icon={Dumbbell}
        eyebrow="S&C Coach · KCA"
        title="Strength & Conditioning"
        sub="Rahul Singh"
        right={<Pill tone="sky">Phase 2</Pill>}
      />

      {/* Quick stats */}
      <StatGrid>
        <StatCard icon={Flame} value="High" label="Today's Load" tone="danger" />
        <StatCard icon={Timer} value="70" unit="min" label="Duration" />
        <StatCard icon={Dumbbell} value={totalSets} label="Total Sets" />
        <StatCard icon={Heart} value="7–8" label="Target RPE" tone="warn" />
      </StatGrid>

      <div style={{ height: 18 }} />

      {/* Tabs */}
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Today's Workout */}
      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Note tone="sky" icon={AlertCircle}>
            <strong>Lower Body Power Day.</strong> Complete warm-up before starting. Tap set circles to track progress.
          </Note>
          <List>
            {TODAY_WORKOUT.map((ex, i) => (
              <WorkoutExercise key={i} ex={ex} idx={i} last={i === TODAY_WORKOUT.length - 1} />
            ))}
          </List>
          <Note tone="sky" icon={Activity}>
            <strong>Cool-down:</strong> 10 min foam rolling (quads, hamstrings, IT band) + static stretching. Log your RPE after session completion.
          </Note>
        </div>
      )}

      {/* Fitness Tests */}
      {tab === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12.5, color: C.muted }}>Last fitness assessment: 12 May 2026 · Rahul Singh</div>
          <Card pad="20px 22px">
            {FITNESS_TESTS.map((f, i) => (
              <Bar
                key={i}
                label={f.label}
                valueText={`${f.value} ${f.unit}`}
                pct={Math.min((f.value / f.max) * 100, 100)}
                color={C.sky}
              />
            ))}
          </Card>
          <Note tone="sky">
            <strong>Trainer's Note:</strong> VO2 max is above average for cricket. Sprint speed needs improvement — focus on acceleration drills in coming weeks. Overall fitness grade: <strong>B+</strong>
          </Note>
        </div>
      )}

      {/* History */}
      {tab === 2 && (
        <List>
          {TRAINING_HISTORY.map((h, i) => (
            <ListRow
              key={i}
              last={i === TRAINING_HISTORY.length - 1}
              lead={<LeadBadge tone="tint"><Dumbbell size={18} /></LeadBadge>}
              title={h.session}
              meta={`${h.date} · ${h.duration}`}
              right={
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                  <Pill tone={LOAD_TONE[h.load] || "neutral"}>{h.load}</Pill>
                  <span style={{ fontSize: 11.5, color: C.muted2, fontWeight: 700 }}>RPE {h.rpe}/10</span>
                </div>
              }
            />
          ))}
        </List>
      )}
    </div>
  );
}
