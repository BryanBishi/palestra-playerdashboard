import { useState } from "react";
import {
  Users, Target, Award, BarChart2, Star, AlertCircle,
  CheckCircle2, Calendar, TrendingUp, MessageSquare, ClipboardList,
} from "lucide-react";
import {
  C, COND, SEMI, Card, SectionHero, StatCard, StatGrid, SegTabs, List, ListRow,
  LeadBadge, Bar, Pill, CardHead, Note,
} from "../components/ui";

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
  { goal: "Improve strike rate to 140+ in T20", progress: 72, color: "#2f9be0" },
  { goal: "Reduce wide balls per over to <0.5", progress: 55, color: "#4f9cf9" },
  { goal: "Maintain fielding fitness score 85+", progress: 88, color: "#22c55e" },
  { goal: "Master pull shot off short pitched", progress: 40, color: "#f94f7c" },
];

const SKILLS = [
  { label: "Batting Technique", value: 8.2, color: "#2f9be0" },
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
  Technical: { color: "#2f9be0", bg: "#fff8f2" },
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
    <div className="page-wrap">

      {/* Header */}
      <SectionHero
        icon={Users}
        eyebrow="Head Coach · KCA"
        title="Coach Portal"
        sub="Sanjay Verma"
        right={<Pill tone="sky">Batting Specialist</Pill>}
      />

      {/* Stat chips */}
      <div style={{ marginBottom: 18 }}>
        <StatGrid min={140}>
          <StatCard icon={Award} value="Good" label="Current Form" tone="ok" />
          <StatCard icon={Target} value="#3" label="Team Rank" />
          <StatCard icon={BarChart2} value="8.1" unit="/10" label="Avg Score" />
          <StatCard icon={Star} value="4.2" unit="★" label="Coach Rating" />
        </StatGrid>
      </div>

      {/* Tabs */}
      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Schedule */}
      {tab === 0 && (
        <List>
          <CardHead
            icon={Calendar}
            title="Weekly Training Schedule"
            sub="This week — KCA Ground"
          />
          {SCHEDULE.map((s, i) => {
            const done = s.status === "completed";
            return (
              <ListRow
                key={i}
                last={i === SCHEDULE.length - 1}
                lead={<LeadBadge>{s.day}</LeadBadge>}
                title={s.session}
                meta={s.time}
                right={
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Pill tone={done ? "neutral" : "sky"}>{s.type}</Pill>
                    <span
                      title={done ? "Completed" : "Upcoming"}
                      style={{
                        width: 9, height: 9, borderRadius: "50%", flexShrink: 0,
                        background: done ? C.ok : C.line,
                        boxShadow: done ? `0 0 0 3px ${C.okTint}` : "none",
                      }}
                    />
                  </div>
                }
              />
            );
          })}
        </List>
      )}

      {/* Objectives */}
      {tab === 1 && (
        <Card>
          <CardHead
            icon={Target}
            title="Season Objectives"
            sub="Progress tracked by Coach Sanjay Verma"
          />
          <div style={{ padding: "18px 18px 6px" }}>
            {OBJECTIVES.map((o, i) => (
              <Bar
                key={i}
                label={o.goal}
                valueText={`${o.progress}%`}
                pct={o.progress}
              />
            ))}
            <div style={{ marginTop: 6 }}>
              <Note tone="sky" icon={AlertCircle}>
                <strong>Focus area:</strong> Pull shot development needs priority in next 3 sessions.
              </Note>
            </div>
          </div>
        </Card>
      )}

      {/* Performance */}
      {tab === 2 && (
        <Card>
          <CardHead
            icon={TrendingUp}
            title="Player Skill Assessment"
            sub="Coach-graded competency scores"
          />
          <div style={{ padding: "18px 18px 6px" }}>
            {SKILLS.map((s, i) => (
              <Bar
                key={i}
                label={s.label}
                valueText={`${s.value}/10`}
                pct={s.value * 10}
              />
            ))}
            <div style={{ marginTop: 6, marginBottom: 14 }}>
              <Note tone="sky" icon={ClipboardList}>
                <strong>Overall assessment:</strong> Strong technical base with above-average fielding.
                Consistency in shot selection is the key differentiator to work on. Mental game improving —
                composure under pressure has been a notable improvement this season.
              </Note>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      {tab === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FEEDBACK.map((f, i) => (
            <Card key={i} className="lift" pad="18px 20px">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, flex: "0 0 auto", display: "grid", placeItems: "center", background: `${C.sky}16`, color: C.sky }}>
                    <MessageSquare size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SEMI, fontWeight: 600, fontSize: 15.5, color: C.text }}>{f.session}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{f.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= f.rating ? C.gold : "none"}
                      style={{ color: s <= f.rating ? C.gold : C.line }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.65, borderLeft: `3px solid ${C.sky}`, paddingLeft: 14, background: C.skyTint, borderRadius: "0 8px 8px 0", padding: "11px 14px" }}>
                {f.text}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
