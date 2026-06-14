import { useState } from "react";
import {
  Apple, Droplets, Flame, Clock, ChevronDown, ChevronUp,
  CheckCircle2, ArrowLeft, Target, Coffee, Sun, Sunset, Moon,
  AlertCircle, TrendingUp,
} from "lucide-react";

// ── SHARED STYLES (same as Players.jsx) ────────────────────────────────────
const card = (extra = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...extra,
});

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "20px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", marginBottom: "2px" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#22c55e", borderRadius: "2px", marginTop: "4px" }} />
  </div>
);

const Badge = ({ label, color = "#22c55e", bg = "#f0fff4" }) => (
  <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", color, background: bg, border: `1px solid ${color}33` }}>
    {label}
  </span>
);

// ── MACRO RING ──────────────────────────────────────────────────────────────
const MacroRing = ({ label, value, max, color, unit = "g" }) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{ position: "relative", width: "70px", height: "70px" }}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
          <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ} strokeDashoffset={circ - (circ * pct / 100)}
            strokeLinecap="round" transform="rotate(-90 35 35)"
            style={{ transition: "stroke-dashoffset 0.9s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{value}</span>
          <span style={{ fontSize: "9px", color: "#aaa", fontWeight: "600" }}>{unit}</span>
        </div>
      </div>
      <span style={{ fontSize: "11px", fontWeight: "600", color: "#555" }}>{label}</span>
    </div>
  );
};

// ── MEAL CARD ───────────────────────────────────────────────────────────────
const MealCard = ({ meal }) => {
  const [open, setOpen] = useState(false);
  const icons = { Breakfast: Sun, "Pre-Training": Coffee, Lunch: Sun, "Post-Training": TrendingUp, Dinner: Sunset, Snack: Moon };
  const Icon = icons[meal.name] || Coffee;

  return (
    <div style={card({ overflow: "hidden", marginBottom: "10px" })}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", cursor: "pointer" }}
      >
        <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: meal.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={17} style={{ color: meal.color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{meal.name}</div>
          <div style={{ fontSize: "11px", color: "#aaa" }}>{meal.time} · {meal.calories} kcal</div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <Badge label={meal.status === "done" ? "Logged" : "Pending"} color={meal.status === "done" ? "#22c55e" : "#f9a825"} bg={meal.status === "done" ? "#f0fff4" : "#fffbea"} />
          {open ? <ChevronUp size={16} style={{ color: "#aaa" }} /> : <ChevronDown size={16} style={{ color: "#aaa" }} />}
        </div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid #f5f5f5" }}>
          <div style={{ display: "flex", gap: "10px", margin: "12px 0" }}>
            {[
              { label: "Protein", value: meal.protein + "g", color: "#2f9be0" },
              { label: "Carbs", value: meal.carbs + "g", color: "#4f9cf9" },
              { label: "Fats", value: meal.fats + "g", color: "#f94f7c" },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, padding: "8px", background: "#fafafa", borderRadius: "8px", border: "1px solid #e8e8e8", textAlign: "center" }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: m.color }}>{m.value}</div>
                <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "600" }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#333", marginBottom: "6px" }}>Foods</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {meal.foods.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", padding: "4px 0", borderBottom: i < meal.foods.length - 1 ? "1px dashed #f0f0f0" : "none" }}>
                <span>{f.name}</span>
                <span style={{ color: "#888" }}>{f.qty}</span>
              </div>
            ))}
          </div>
          {meal.notes && (
            <div style={{ marginTop: "10px", padding: "8px 12px", background: "#fff8f2", borderRadius: "6px", borderLeft: "3px solid #2f9be0", fontSize: "11px", color: "#666" }}>
              <strong>Note:</strong> {meal.notes}
            </div>
          )}
        </div>
      )}
    </div>
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

const totalCals = MEALS.reduce((s, m) => s + m.calories, 0);
const totalProtein = MEALS.reduce((s, m) => s + m.protein, 0);
const totalCarbs = MEALS.reduce((s, m) => s + m.carbs, 0);
const totalFats = MEALS.reduce((s, m) => s + m.fats, 0);

// ── MAIN ────────────────────────────────────────────────────────────────────
export default function Nutritionist() {
  const [tab, setTab] = useState(0);
  const tabs = ["Diet Plan", "Supplements", "Hydration"];

  return (
    <div style={{ padding: "clamp(16px, 4vw, 32px)", maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div style={card({ padding: "18px 20px", marginBottom: "20px", background: "linear-gradient(135deg, #f0fff4 0%, #fff 100%)", borderLeft: "4px solid #22c55e" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#22c55e22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Apple size={22} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#222" }}>Nutritionist Portal</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Anjali Nair · Sports Nutritionist · KCA</div>
          </div>
          <Badge label="Active Plan" color="#22c55e" bg="#f0fff4" />
        </div>
      </div>

      {/* Daily Summary */}
      <div style={card({ padding: "18px 20px", marginBottom: "20px" })}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#333", marginBottom: "14px" }}>Today's Macro Goals</div>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "800", color: "#2f9be0" }}>{totalCals}</div>
            <div style={{ fontSize: "11px", color: "#aaa", fontWeight: "600" }}>Total kcal</div>
          </div>
          <MacroRing label="Protein" value={totalProtein} max={200} color="#2f9be0" />
          <MacroRing label="Carbs" value={totalCarbs} max={350} color="#4f9cf9" />
          <MacroRing label="Fats" value={totalFats} max={80} color="#f94f7c" />
          <div style={{ textAlign: "center" }}>
            <Droplets size={24} style={{ color: "#4f9cf9", marginBottom: "4px" }} />
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>3.5L</div>
            <div style={{ fontSize: "11px", color: "#aaa", fontWeight: "600" }}>Water Goal</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0", marginBottom: "16px", background: "#f5f5f5", borderRadius: "8px", padding: "3px" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ flex: 1, padding: "9px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: tab === i ? "#fff" : "transparent", color: tab === i ? "#22c55e" : "#888", fontWeight: tab === i ? "700" : "500", fontSize: "13px", boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Diet Plan */}
      {tab === 0 && (
        <div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px", padding: "10px 14px", background: "#fffbea", borderRadius: "8px", border: "1px solid #fde68a", display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <AlertCircle size={14} style={{ color: "#f9a825", flexShrink: 0, marginTop: "1px" }} />
            <span>Tap any meal to see full breakdown. Plan tailored for match training load.</span>
          </div>
          {MEALS.map((m, i) => <MealCard key={i} meal={m} />)}
        </div>
      )}

      {/* Supplements */}
      {tab === 1 && (
        <div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "14px" }}>Prescribed supplement stack for current training phase.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {SUPPLEMENTS.map((s, i) => (
              <div key={i} style={card({ padding: "14px 16px", display: "flex", alignItems: "center", gap: "14px" })}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "13px", color: "#222" }}>{s.name}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{s.timing}</div>
                </div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: s.color }}>{s.dose}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px", padding: "12px 14px", background: "#fff8f2", borderRadius: "8px", border: "1px solid #ffd8b0", fontSize: "12px", color: "#666" }}>
            <strong style={{ color: "#2f9be0" }}>Reminder:</strong> All supplements should be taken as prescribed. Do not self-medicate or add without nutritionist approval.
          </div>
        </div>
      )}

      {/* Hydration */}
      {tab === 2 && (
        <div>
          <div style={card({ padding: "20px", marginBottom: "12px", textAlign: "center" })}>
            <Droplets size={32} style={{ color: "#4f9cf9", marginBottom: "8px" }} />
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#4f9cf9" }}>3.5 L</div>
            <div style={{ fontSize: "13px", color: "#888" }}>Daily Water Target</div>
            <div style={{ marginTop: "14px", height: "10px", background: "#e8e8e8", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "60%", background: "linear-gradient(90deg, #4f9cf9, #7ec8fa)", borderRadius: "10px", transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>2.1L consumed today (60%)</div>
          </div>
          {[
            { time: "Wake-up", amount: "500ml", note: "Before breakfast, room temperature" },
            { time: "Pre-training", amount: "500ml", note: "45 min before session" },
            { time: "During training", amount: "750ml", note: "150-200ml every 20 min" },
            { time: "Post-training", amount: "750ml", note: "To replace sweat loss" },
            { time: "With meals", amount: "500ml", note: "Spread across lunch & dinner" },
            { time: "Evening", amount: "500ml", note: "Not too close to bedtime" },
          ].map((h, i) => (
            <div key={i} style={card({ padding: "12px 16px", marginBottom: "8px", display: "flex", gap: "12px", alignItems: "center" })}>
              <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: "#e8f4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={16} style={{ color: "#4f9cf9" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "700", fontSize: "12px", color: "#222" }}>{h.time}</div>
                <div style={{ fontSize: "11px", color: "#aaa" }}>{h.note}</div>
              </div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#4f9cf9" }}>{h.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}