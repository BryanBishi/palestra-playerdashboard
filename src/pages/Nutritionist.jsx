import { useState } from "react";
import {
  Apple, Droplets, Flame, Clock, ChevronDown, ChevronUp,
  Coffee, Sun, Sunset, Moon, AlertCircle, TrendingUp, Pill as PillIcon,
} from "lucide-react";
import {
  C, COND, Card, SectionHero, SegTabs, List, ListRow, LeadBadge,
  Bar, Ring, Pill, Note,
} from "../components/ui";

// ── MEAL CARD ───────────────────────────────────────────────────────────────
const MealCard = ({ meal }) => {
  const [open, setOpen] = useState(false);
  const icons = { Breakfast: Sun, "Pre-Training": Coffee, Lunch: Sun, "Post-Training": TrendingUp, Dinner: Sunset, Snack: Moon };
  const Icon = icons[meal.name] || Coffee;
  const done = meal.status === "done";

  return (
    <Card style={{ overflow: "hidden", marginBottom: 10 }}>
      <ListRow
        onClick={() => setOpen(!open)}
        lead={<LeadBadge>{<Icon size={18} />}</LeadBadge>}
        title={meal.name}
        meta={`${meal.time} · ${meal.calories} kcal`}
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Pill tone={done ? "ok" : "warn"}>{done ? "Logged" : "Pending"}</Pill>
            {open ? <ChevronUp size={16} style={{ color: C.muted2 }} /> : <ChevronDown size={16} style={{ color: C.muted2 }} />}
          </div>
        }
        last
      />

      {open && (
        <div style={{ padding: "0 18px 16px", borderTop: `1px solid ${C.line2}` }}>
          <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
            {[
              { label: "Protein", value: meal.protein + "g" },
              { label: "Carbs", value: meal.carbs + "g" },
              { label: "Fats", value: meal.fats + "g" },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, padding: "10px 8px", background: C.skyTint, borderRadius: 10, border: `1px solid ${C.line}`, textAlign: "center" }}>
                <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 18, color: C.skyDark, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 700, marginTop: 5 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, color: C.muted, marginBottom: 8 }}>Foods</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {meal.foods.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.text, padding: "7px 0", borderBottom: i < meal.foods.length - 1 ? `1px dashed ${C.line2}` : "none" }}>
                <span>{f.name}</span>
                <span style={{ color: C.muted }}>{f.qty}</span>
              </div>
            ))}
          </div>
          {meal.notes && (
            <div style={{ marginTop: 12 }}>
              <Note tone="sky" icon={AlertCircle}><strong>Note:</strong> {meal.notes}</Note>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// ── DATA ────────────────────────────────────────────────────────────────────
const MEALS = [
  {
    name: "Breakfast", time: "7:00 AM", calories: 520, protein: 32, carbs: 68, fats: 12, status: "done", color: "#f9a825",
    foods: [{ name: "Oats with banana", qty: "1 bowl (80g)" }, { name: "Boiled eggs", qty: "3 whole" }, { name: "Low-fat milk", qty: "200ml" }],
    notes: "High-carb morning to fuel morning training session.",
  },
  {
    name: "Pre-Training", time: "9:30 AM", calories: 220, protein: 15, carbs: 30, fats: 4, status: "done", color: "#4f9cf9",
    foods: [{ name: "Banana", qty: "1 large" }, { name: "Whey protein shake", qty: "1 scoop (30g)" }, { name: "Water", qty: "500ml" }],
    notes: "Light snack 45 min before training.",
  },
  {
    name: "Post-Training", time: "12:30 PM", calories: 480, protein: 45, carbs: 52, fats: 8, status: "done", color: "#22c55e",
    foods: [{ name: "Grilled chicken breast", qty: "150g" }, { name: "Brown rice", qty: "1 cup cooked" }, { name: "Cucumber salad", qty: "1 bowl" }],
    notes: "Prioritize protein within 30 min of training completion.",
  },
  {
    name: "Lunch", time: "2:00 PM", calories: 650, protein: 40, carbs: 80, fats: 15, status: "pending", color: "#2f9be0",
    foods: [{ name: "Dal rice", qty: "2 cups" }, { name: "Sabzi (seasonal veg)", qty: "1 bowl" }, { name: "Curd", qty: "100g" }, { name: "Roti (whole wheat)", qty: "2 nos" }],
  },
  {
    name: "Snack", time: "5:30 PM", calories: 180, protein: 12, carbs: 20, fats: 5, status: "pending", color: "#a855f7",
    foods: [{ name: "Mixed dry fruits", qty: "30g" }, { name: "Green tea", qty: "1 cup" }],
  },
  {
    name: "Dinner", time: "8:30 PM", calories: 550, protein: 38, carbs: 55, fats: 14, status: "pending", color: "#f94f7c",
    foods: [{ name: "Fish curry (rohu)", qty: "150g" }, { name: "Brown rice / roti", qty: "2 roti" }, { name: "Mixed vegetable stir-fry", qty: "1 cup" }, { name: "Curd", qty: "100g" }],
    notes: "Avoid simple carbs post 8 PM.",
  },
];

const SUPPLEMENTS = [
  { name: "Whey Protein", dose: "30g", timing: "Post workout", color: "#2f9be0" },
  { name: "Creatine Monohydrate", dose: "5g", timing: "Morning", color: "#4f9cf9" },
  { name: "Vitamin D3", dose: "2000 IU", timing: "With lunch", color: "#f9a825" },
  { name: "Omega-3", dose: "1g", timing: "With dinner", color: "#22c55e" },
  { name: "Magnesium", dose: "200mg", timing: "Before bed", color: "#a855f7" },
];

const HYDRATION = [
  { time: "Wake-up", amount: "500ml", note: "Before breakfast, room temperature" },
  { time: "Pre-training", amount: "500ml", note: "45 min before session" },
  { time: "During training", amount: "750ml", note: "150-200ml every 20 min" },
  { time: "Post-training", amount: "750ml", note: "To replace sweat loss" },
  { time: "With meals", amount: "500ml", note: "Spread across lunch & dinner" },
  { time: "Evening", amount: "500ml", note: "Not too close to bedtime" },
];

const totalCals = MEALS.reduce((s, m) => s + m.calories, 0);
const totalProtein = MEALS.reduce((s, m) => s + m.protein, 0);
const totalCarbs = MEALS.reduce((s, m) => s + m.carbs, 0);
const totalFats = MEALS.reduce((s, m) => s + m.fats, 0);

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Nutritionist() {
  const [tab, setTab] = useState(0);
  const tabs = ["Diet Plan", "Supplements", "Hydration"];

  return (
    <div className="page-wrap">
      <SectionHero
        icon={Apple}
        eyebrow="Sports Nutritionist · KCA"
        title="Nutritionist Portal"
        sub="Anjali Nair"
        right={<Pill tone="sky">Active Plan</Pill>}
      />

      {/* Daily Macro Summary */}
      <Card pad="20px 22px" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 18, textTransform: "uppercase", letterSpacing: ".02em", color: C.text, marginBottom: 16 }}>
          Today's Macro Goals
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Flame size={22} style={{ color: C.sky }} />
              <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 46, lineHeight: 1, color: C.text }}>{totalCals}</div>
            </div>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 700, marginTop: 6 }}>Total kcal</div>
          </div>
          <Ring value={totalProtein} max={200} size={104} sub="g" label="Protein" />
          <Ring value={totalCarbs} max={350} size={104} sub="g" label="Carbs" />
          <Ring value={totalFats} max={80} size={104} sub="g" label="Fats" />
          <div style={{ textAlign: "center" }}>
            <Droplets size={28} style={{ color: C.sky, marginBottom: 6 }} />
            <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 28, lineHeight: 1, color: C.text }}>3.5L</div>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 700, marginTop: 6 }}>Water Goal</div>
          </div>
        </div>
      </Card>

      <SegTabs tabs={tabs} active={tab} onChange={setTab} />

      {/* Diet Plan */}
      {tab === 0 && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <Note tone="warn" icon={AlertCircle}>
              Tap any meal to see full breakdown. Plan tailored for match training load.
            </Note>
          </div>
          {MEALS.map((m, i) => <MealCard key={i} meal={m} />)}
        </div>
      )}

      {/* Supplements */}
      {tab === 1 && (
        <div>
          <div style={{ fontSize: 13.5, color: C.muted, marginBottom: 14 }}>Prescribed supplement stack for current training phase.</div>
          <List style={{ marginBottom: 16 }}>
            {SUPPLEMENTS.map((s, i) => (
              <ListRow
                key={i}
                lead={<LeadBadge><PillIcon size={17} /></LeadBadge>}
                title={s.name}
                meta={s.timing}
                right={<span style={{ fontFamily: COND, fontWeight: 700, fontSize: 18, color: C.skyDark }}>{s.dose}</span>}
                last={i === SUPPLEMENTS.length - 1}
              />
            ))}
          </List>
          <Note tone="sky" icon={AlertCircle}>
            <strong>Reminder:</strong> All supplements should be taken as prescribed. Do not self-medicate or add without nutritionist approval.
          </Note>
        </div>
      )}

      {/* Hydration */}
      {tab === 2 && (
        <div>
          <Card pad="22px" style={{ marginBottom: 12, textAlign: "center" }}>
            <Droplets size={34} style={{ color: C.sky, marginBottom: 8 }} />
            <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 48, lineHeight: 1, color: C.text }}>3.5 L</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>Daily Water Target</div>
            <Bar label="Consumed today" valueText="2.1L" pct={60} note="2.1L consumed today (60%)" />
          </Card>
          <List>
            {HYDRATION.map((h, i) => (
              <ListRow
                key={i}
                lead={<LeadBadge><Clock size={17} /></LeadBadge>}
                title={h.time}
                meta={h.note}
                right={<span style={{ fontFamily: COND, fontWeight: 700, fontSize: 18, color: C.skyDark }}>{h.amount}</span>}
                last={i === HYDRATION.length - 1}
              />
            ))}
          </List>
        </div>
      )}
    </div>
  );
}
