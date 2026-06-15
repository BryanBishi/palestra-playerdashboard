// ui.jsx — premium "performance instrument panel" kit (presentation only).
// Navy chrome + sky-blue accent + Barlow. Compose these across the player sections.
import { ChevronRight } from "lucide-react";

export const C = {
  navy: "#0d2a63", navy2: "#123577", ink: "#0b1f4a",
  sky: "#2f9be0", skyDark: "#2380c2", skyTint: "#e8f3fb",
  paper: "#f3f4f6", card: "#ffffff", line: "#e6e7eb", line2: "#eef0f3",
  text: "#171a1f", muted: "#6b7280", muted2: "#9aa0aa",
  ok: "#1f9d57", okTint: "#e7f6ed", warn: "#d98a0b", warnTint: "#fdf2dd",
  danger: "#cc3333", dangerTint: "#fdecec", gold: "#c79a2f", goldSoft: "#e7cf8e",
};
export const COND = "'Barlow Condensed', sans-serif";
export const SEMI = "'Barlow Semi Condensed', sans-serif";

const SHADOW = "0 1px 2px rgba(13,42,99,.05), 0 18px 40px -24px rgba(13,42,99,.28)";

export function Card({ children, style = {}, pad, className = "", ...rest }) {
  return (
    <div className={className} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, boxShadow: SHADOW, ...(pad ? { padding: pad } : {}), ...style }} {...rest}>
      {children}
    </div>
  );
}

// Dark navy hero panel with pitch-line texture + sky glow.
export function SectionHero({ icon: Icon, eyebrow, title, sub, right, accent = C.sky }) {
  return (
    <div className="sec-hero" style={{ position: "relative", overflow: "hidden", borderRadius: 18, marginBottom: 22, color: "#fff",
      background: `linear-gradient(135deg, ${C.navy2} 0%, ${C.navy} 55%, ${C.ink} 100%)`,
      border: "1px solid rgba(255,255,255,0.06)", boxShadow: SHADOW }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0, rgba(255,255,255,.05) 1px, transparent 1px, transparent 58px)", opacity: .5 }} />
      <div style={{ position: "absolute", right: -60, top: -80, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${accent}38, transparent 62%)` }} />
      <div className="sec-hero-inner" style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, padding: "26px 28px", flexWrap: "wrap" }}>
        {Icon && (
          <div className="sec-hero-icon" style={{ width: 56, height: 56, borderRadius: 15, flex: "0 0 auto", display: "grid", placeItems: "center",
            background: `linear-gradient(160deg, ${accent}, ${C.skyDark})`, boxShadow: `0 10px 24px -8px ${accent}88` }}>
            <Icon size={26} color="#fff" />
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          {eyebrow && <div style={{ fontFamily: SEMI, fontWeight: 600, letterSpacing: ".18em", fontSize: 11.5, textTransform: "uppercase", color: accent, marginBottom: 6 }}>{eyebrow}</div>}
          <h1 style={{ fontFamily: COND, fontWeight: 700, fontSize: 30, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: ".01em", margin: 0 }}>{title}</h1>
          {sub && <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.66)", marginTop: 7 }}>{sub}</div>}
        </div>
        {right && <div style={{ flex: "0 0 auto" }}>{right}</div>}
      </div>
    </div>
  );
}

export function Pill({ children, tone = "sky", style = {} }) {
  const map = {
    sky: [C.skyTint, C.skyDark], ok: [C.okTint, C.ok], warn: [C.warnTint, C.warn],
    danger: [C.dangerTint, C.danger], neutral: [C.paper, C.muted], gold: ["#faf3df", "#a9801f"],
    glass: ["rgba(255,255,255,.16)", "#fff"],
  };
  const [bg, fg] = map[tone] || map.sky;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: bg, color: fg, fontWeight: 700, fontSize: 11.5, letterSpacing: ".02em", padding: "5px 11px", borderRadius: 999, fontFamily: SEMI, ...style }}>{children}</span>;
}

// Stat tile: top accent rail, tinted icon, big condensed number.
export function StatCard({ icon: Icon, value, unit, label, accent = C.sky, tone }) {
  const ac = tone === "ok" ? C.ok : tone === "warn" ? C.warn : tone === "danger" ? C.danger : accent;
  return (
    <div className="lift" style={{ position: "relative", background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 16px 14px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${ac}, ${C.skyDark})` }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {Icon && <div style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: `${ac}18`, color: ac }}><Icon size={18} /></div>}
      </div>
      <div style={{ fontFamily: COND, fontWeight: 700, fontSize: 30, lineHeight: 1, marginTop: 12, color: C.text }}>
        {value}{unit && <span style={{ fontSize: 14, color: C.muted2, fontFamily: "Barlow", fontWeight: 600, marginLeft: 3 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, fontWeight: 700, marginTop: 6 }}>{label}</div>
    </div>
  );
}

export function StatGrid({ children, min = 130 }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 12 }}>{children}</div>;
}

// Underline segmented tabs.
export function SegTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.line}`, marginBottom: 18, overflowX: "auto" }}>
      {tabs.map((t, i) => {
        const on = active === i;
        return (
          <button key={i} onClick={() => onChange(i)} style={{ appearance: "none", background: "none", border: "none", cursor: "pointer",
            fontFamily: SEMI, fontWeight: 600, fontSize: 14.5, letterSpacing: ".01em", textTransform: "uppercase",
            color: on ? C.skyDark : C.muted, padding: "11px 14px", borderBottom: `2.5px solid ${on ? C.sky : "transparent"}`, marginBottom: -1, whiteSpace: "nowrap", transition: ".15s" }}>
            {t}
          </button>
        );
      })}
    </div>
  );
}

// A list shell — rows separated by hairlines inside one card (no stacked boxes).
export function List({ children, style = {} }) {
  return <Card style={{ overflow: "hidden", ...style }}><div>{children}</div></Card>;
}

export function ListRow({ lead, title, meta, right, onClick, accent = C.sky, last = false }) {
  return (
    <div onClick={onClick} className={onClick ? "row-hl" : ""} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px",
      borderBottom: last ? "none" : `1px solid ${C.line2}`, cursor: onClick ? "pointer" : "default", position: "relative", transition: ".12s" }}>
      <span style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 3, borderRadius: 3, background: accent, opacity: .0 }} className="rail" />
      {lead}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {meta && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{meta}</div>}
      </div>
      {right}
      {onClick && <ChevronRight size={18} style={{ color: C.muted2, flexShrink: 0 }} />}
    </div>
  );
}

// Leading index/day badge for rows.
export function LeadBadge({ children, accent = C.sky, tone = "tint" }) {
  const filled = tone === "filled";
  return (
    <div style={{ width: 40, height: 40, borderRadius: 11, flex: "0 0 auto", display: "grid", placeItems: "center",
      background: filled ? `linear-gradient(160deg, ${accent}, ${C.skyDark})` : `${accent}16`,
      color: filled ? "#fff" : accent, fontFamily: COND, fontWeight: 700, fontSize: 15 }}>
      {children}
    </div>
  );
}

// Labeled gradient progress bar.
export function Bar({ label, valueText, pct, color = C.sky, note }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{label}</span>
        <span style={{ fontFamily: COND, fontWeight: 700, fontSize: 16, color }}>{valueText}</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "#edf0f4", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${p}%`, borderRadius: 99, background: `linear-gradient(90deg, ${color}, ${C.skyDark})`, transition: "width .9s cubic-bezier(.2,.8,.2,1)" }} />
      </div>
      {note && <div style={{ fontSize: 12, color: C.muted2, marginTop: 6 }}>{note}</div>}
    </div>
  );
}

// SVG ring.
export function Ring({ value, max = 100, size = 132, stroke = 11, color = C.sky, label, sub, suffix = "" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8edf3" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ - circ * pct} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: COND, fontWeight: 700, fontSize: size * 0.3, lineHeight: 1, color: C.text }}>{value}{suffix}</div>
            {sub && <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: C.muted, marginTop: 3 }}>{sub}</div>}
          </div>
        </div>
      </div>
      {label && <div style={{ textAlign: "center", marginTop: 8, fontSize: 12.5, fontWeight: 600, color: C.text }}>{label}</div>}
    </div>
  );
}

// Section title row inside content.
export function CardHead({ icon: Icon, title, sub, right, accent = C.sky }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: `1px solid ${C.line2}` }}>
      {Icon && <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: `${accent}16`, color: accent }}><Icon size={18} /></div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: SEMI, fontSize: 16.5, fontWeight: 600, color: C.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// Info alert strip (e.g. injury / protocol note).
export function Note({ tone = "sky", icon: Icon, children }) {
  const map = { sky: [C.skyTint, "#1d5e8a", C.sky], warn: [C.warnTint, "#8a5b08", C.warn], danger: ["#fdeeee", "#9c3329", C.danger] };
  const [bg, fg, rail] = map[tone] || map.sky;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: bg, borderRadius: 12, borderLeft: `3px solid ${rail}`, padding: "13px 16px", color: fg, fontSize: 13.5, lineHeight: 1.45 }}>
      {Icon && <Icon size={18} style={{ flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
