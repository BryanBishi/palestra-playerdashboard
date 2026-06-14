import { useState } from "react";
import {
  Stethoscope, Activity, AlertTriangle, CheckCircle2,
  Clock, ChevronDown, ChevronUp, Calendar, FileText,
  TrendingUp, Zap, Shield, RotateCcw,
} from "lucide-react";
import {
  C, COND, SEMI, Card, SectionHero, StatCard, StatGrid, SegTabs,
  List, ListRow, LeadBadge, Bar, Pill, CardHead, Note,
} from "../components/ui.jsx";

// ── EXERCISE ROW ────────────────────────────────────────────────────────────
const ExerciseRow = ({ ex, last }) => {
  const [done, setDone] = useState(false);
  return (
    <ListRow
      last={last}
      accent={done ? C.ok : C.sky}
      lead={
        <LeadBadge accent={done ? C.ok : C.sky} tone={done ? "filled" : "tint"}>
          {done ? <CheckCircle2 size={18} /> : <Activity size={18} />}
        </LeadBadge>
      }
      title={
        <span style={{ textDecoration: done ? "line-through" : "none", color: done ? C.muted : C.text }}>
          {ex.name}
        </span>
      }
      meta={`${ex.sets} · ${ex.focus}`}
      right={
        done ? (
          <Pill tone="ok" style={{ cursor: "pointer" }}>
            <span onClick={() => setDone(false)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={13} /> Done ✓
            </span>
          </Pill>
        ) : (
          <button
            onClick={() => setDone(true)}
            style={{
              appearance: "none", cursor: "pointer", fontFamily: SEMI, fontWeight: 600,
              fontSize: 11.5, letterSpacing: ".02em", padding: "6px 13px", borderRadius: 999,
              border: `1px solid ${C.line}`, background: C.card, color: C.skyDark,
            }}
          >
            Mark Done
          </button>
        )
      }
    />
  );
};

// ── INJURY TIMELINE ─────────────────────────────────────────────────────────
const TimelineItem = ({ item, isLast }) => {
  const done = item.color !== "#aaa";
  const dot = done ? C.sky : C.muted2;
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 3,
          background: done ? dot : C.card, border: `2.5px solid ${dot}`,
          boxShadow: done ? `0 0 0 4px ${C.sky}1f` : "none",
        }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: done ? C.sky : C.line, margin: "5px 0", opacity: done ? .45 : 1 }} />}
      </div>
      <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text }}>{item.event}</div>
        <div style={{ fontFamily: SEMI, fontSize: 11.5, letterSpacing: ".04em", textTransform: "uppercase", color: C.skyDark, marginTop: 3 }}>{item.date}</div>
        {item.note && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>{item.note}</div>}
      </div>
    </div>
  );
};

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
  { label: "Thoracic Rotation (R)", value: 65, color: "#2f9be0", note: "Significant restriction — priority rehab" },
  { label: "Hip External Rotation (B/L)", value: 58, color: "#f9a825", note: "Left slightly better than right" },
  { label: "Calf Flexibility (R)", value: 80, color: "#22c55e", note: "Within acceptable range" },
  { label: "Postural Correction", value: 70, color: "#4f9cf9", note: "Rear foot pronation improving with orthotics" },
];

const TIMELINE = [
  { event: "Initial MSK Screening", date: "13 May 2026", note: "Physio: Pinkesh Barot — Full MSK assessment completed", color: "#4f9cf9" },
  { event: "Rear Foot Pronation Flagged", date: "13 May 2026", note: "Right foot pronation — orthotics recommended", color: "#f9a825" },
  { event: "Rehab Plan Initiated", date: "14 May 2026", note: "Hip & thoracic mobility focus — 6-week plan", color: "#2f9be0" },
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
    <div className="page-wrap">

      {/* Header */}
      <SectionHero
        icon={Stethoscope}
        eyebrow="MSc (Sports Physio) · KCA"
        title="Physiotherapy Portal"
        sub="Dr. Arun Kumar"
        right={<Pill tone="sky">Active Rehab</Pill>}
      />

      {/* Quick status chips */}
      <div style={{ marginBottom: 22 }}>
        <StatGrid min={130}>
          <StatCard icon={Shield} value="Pending" label="Clearance" tone="warn" />
          <StatCard icon={TrendingUp} value="Good" label="Progress" tone="ok" />
          <StatCard icon={Zap} value="9" label="Sessions Left" />
          <StatCard icon={RotateCcw} value="2 / 6" label="Week" />
        </StatGrid>
      </div>

      {/* Tabs */}
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Rehab Plan */}
      {tab === 0 && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <Note tone="sky" icon={Activity}>
              <strong>Today's Rehab Protocol —</strong> Focus: Hip Mobility + Thoracic Rotation. Complete all exercises in order.
            </Note>
          </div>
          <List>
            {REHAB_EXERCISES.map((ex, i) => (
              <ExerciseRow key={i} ex={ex} last={i === REHAB_EXERCISES.length - 1} />
            ))}
          </List>
        </div>
      )}

      {/* Assessments */}
      {tab === 1 && (
        <Card>
          <CardHead icon={Activity} title="MSK Mobility Scores" sub="Last assessed: 13 May 2026 · Pinkesh Barot" />
          <div style={{ padding: "18px 20px 8px" }}>
            {ASSESSMENTS.map((a, i) => (
              <Bar key={i} label={a.label} valueText={`${a.value}%`} pct={a.value} note={a.note} />
            ))}
            <Note tone="sky" icon={FileText}>
              <strong>Physio Notes —</strong> LLD: Negative · Foot position: Rt Rear foot pronated · Restricted mobility: Rt Hip IR, B/L Hip ER Rt&gt;Lt, Rt Thoracic Rotation · Tightness: B/L rectus femoris · GIRD: -ve · Special Tests: -ve
            </Note>
          </div>
        </Card>
      )}

      {/* Sessions */}
      {tab === 2 && (
        <List>
          {SESSIONS.map((s, i) => {
            const up = s.status === "upcoming";
            return (
              <ListRow
                key={i}
                last={i === SESSIONS.length - 1}
                accent={up ? C.sky : C.ok}
                lead={
                  <LeadBadge accent={up ? C.sky : C.ok}>
                    <Calendar size={17} />
                  </LeadBadge>
                }
                title={s.type}
                meta={`${s.date} · ${s.duration}`}
                right={<Pill tone={up ? "sky" : "ok"}>{up ? "Upcoming" : "Completed"}</Pill>}
              />
            );
          })}
        </List>
      )}

      {/* Timeline */}
      {tab === 3 && (
        <Card>
          <CardHead icon={Clock} title="Injury & Rehab Timeline" sub="Recovery milestones" />
          <div style={{ padding: "20px 20px 4px" }}>
            {TIMELINE.map((t, i) => (
              <TimelineItem key={i} item={t} isLast={i === TIMELINE.length - 1} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
