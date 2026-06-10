import { useState } from "react";
import Icon from "../components/Icon";
import { submitDailyReport } from "../api/authApi";

const URINE = [
  { label: "Pale Straw", color: "#f3e9a8" },
  { label: "Translucent", color: "#e8d24b" },
  { label: "Dark Yellow", color: "#d4ad1f" },
  { label: "Amber", color: "#b67e16" },
  { label: "Brown", color: "#7a5410" },
];
const TRAINING = ["Strength", "Conditioning", "Bowling", "Fielding", "Batting", "Match", "Rest"];
const todayLong = () =>
  new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function Scale({ value, onChange, left, right }) {
  return (
    <>
      <div className="scale-ends"><span>{left}</span><span>{right}</span></div>
      <div className="scale">
        {Array.from({ length: 11 }, (_, n) => (
          <button key={n} className={value === n ? "sel" : ""} onClick={() => onChange(n)}>{n}</button>
        ))}
      </div>
    </>
  );
}

export default function DailyCheckin({ player, nav }) {
  const [soreness, setSoreness] = useState(3);
  const [fatigue, setFatigue] = useState(2);
  const [sleep, setSleep] = useState("7.5");
  const [motivation, setMotivation] = useState(8);
  const [urine, setUrine] = useState(0);
  const [pain, setPain] = useState("no");
  const [rpe, setRpe] = useState(6);
  const [balls, setBalls] = useState("0");
  const [training, setTraining] = useState(["Bowling", "Batting"]);
  const [status, setStatus] = useState("idle"); // idle | saving | done | error

  const toggle = (t) => setTraining((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const submit = async () => {
    setStatus("saving");
    const payload = {
      player: localStorage.getItem("userId"),
      name: player?.name || "",
      urineColour: URINE[urine].label,
      soreness,
      fatigue,
      sleep: Number(sleep),
      injury: pain === "yes",
      motivation,
      ballsBowled: balls,
      rpe,
      training,
      note: "",
      reportDate: new Date().toISOString().split("T")[0],
    };
    try {
      await submitDailyReport(payload);
      setStatus("done");
      setTimeout(() => nav("dashboard"), 1400);
    } catch (e) {
      console.error("submitDailyReport failed", e);
      setStatus("error");
    }
  };

  return (
    <>
      <div className="banner"><div className="banner-inner">
        <div>
          <a className="back-link" onClick={() => nav("dashboard")}><Icon name="back" />Back to Dashboard</a>
          <div className="eyebrow">{todayLong()}</div>
          <h1>Daily Check-in</h1>
          <div className="sub">Takes ~60 seconds · Helps your coaches manage your training load</div>
        </div>
        <span className="chip chip-ok" style={{ fontSize: "13px", padding: "7px 14px" }}>6-day streak 🔥</span>
      </div></div>

      <div className="wrap" style={{ maxWidth: "920px" }}>
        <div className="form-grid">
          {/* Wellness */}
          <div className="card card-pad" style={{ gridColumn: "1/-1" }}>
            <span className="section-label">Wellness</span>
            <div className="form-grid">
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <div className="field-label">Soreness Level<span className="yest">Yesterday: 4</span></div>
                <Scale value={soreness} onChange={setSoreness} left="No soreness" right="Extreme" />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <div className="field-label">Fatigue Level<span className="yest">Yesterday: 3</span></div>
                <Scale value={fatigue} onChange={setFatigue} left="Energetic" right="Exhausted" />
              </div>
              <div className="field">
                <div className="field-label">Sleep Hours<span className="hint">last night</span></div>
                <input className="input" type="number" value={sleep} step="0.5" min="0" max="14" onChange={(e) => setSleep(e.target.value)} />
              </div>
              <div className="field">
                <div className="field-label">Motivation<span className="yest">Yesterday: 8</span></div>
                <Scale value={motivation} onChange={setMotivation} left="Low" right="High" />
              </div>
              <div className="field" style={{ gridColumn: "1/-1" }}>
                <div className="field-label">Hydration — Urine Colour<span className="hint">tap closest match</span></div>
                <div className="swatches">
                  {URINE.map((u, i) => (
                    <div className={`swatch ${urine === i ? "sel" : ""}`} key={i} onClick={() => setUrine(i)}>
                      <div className="sw" style={{ background: u.color }} /><span className="sl">{u.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pain */}
          <div className="card card-pad">
            <span className="section-label" style={{ background: "var(--navy)" }}>Pain &amp; Niggles</span>
            <div className="field">
              <div className="field-label">Experiencing aches or pain?</div>
              <div className="choice-row">
                <button className={`choice ${pain === "no" ? "sel" : ""}`} onClick={() => setPain("no")}>No</button>
                <button className={`choice ${pain === "yes" ? "sel" : ""}`} onClick={() => setPain("yes")}>Yes</button>
              </div>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">RPE — Perceived Exertion<span className="hint">today's session</span></div>
              <Scale value={rpe} onChange={setRpe} left="No effort" right="Max effort" />
            </div>
          </div>

          {/* Load */}
          <div className="card card-pad">
            <span className="section-label" style={{ background: "var(--gold)", color: "#3a2c05" }}>Training Load</span>
            <div className="field">
              <div className="field-label">Balls Bowled<span className="hint">if applicable</span></div>
              <input className="input" type="number" value={balls} min="0" onChange={(e) => setBalls(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <div className="field-label">Sessions Completed</div>
              <div className="chip-grid">
                {TRAINING.map((t) => (
                  <button key={t} className={`toggle-chip ${training.includes(t) ? "sel" : ""}`} onClick={() => toggle(t)}>
                    <span className="tc-check"><Icon name="check" /></span>{t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="card" style={{ gridColumn: "1/-1", padding: "22px" }}>
            <div className="form-footer">
              <div className="form-progress">
                {status === "done" ? (
                  <b style={{ color: "var(--ok)" }}>✓ Check-in submitted</b>
                ) : status === "error" ? (
                  <b style={{ color: "var(--danger)" }}>Could not submit — please try again</b>
                ) : (
                  <>All sections complete · <b>Ready to submit</b></>
                )}
              </div>
              <button className="btn btn-primary" onClick={submit} disabled={status === "saving"}>
                <Icon name="check" />
                {status === "saving" ? "Submitting…" : status === "done" ? "Submitted" : "Submit Check-in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
