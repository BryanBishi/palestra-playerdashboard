import { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  ChevronLeft,
  ClipboardList,
  HeartPulse,
  Droplets,
  Activity,
  Dumbbell,
  StickyNote,
  Check,
} from "lucide-react";
import { submitDailyReport } from "../api/authApi";
import { C, COND, SEMI, Card, SectionHero, CardHead, Note } from "./ui";

/* ── Urine colour options ── */
const URINE_COLOURS = [
  { label: "Pale Straw", hex: "#f5e97a" },
  { label: "Translucent Yellow", hex: "#f0c93a" },
  { label: "Dark Yellow", hex: "#d4a017" },
  { label: "Amber", hex: "#c47d0e" },
  { label: "Brown", hex: "#8b5e15" },
];

const TRAINING_OPTIONS = [
  "Strength",
  "Conditioning",
  "Bowling",
  "Fielding",
  "Batting",
  "Match",
  "Rest",
];

/* ── Reusable 0–10 scale row (sky-blue selected, slight lift) ── */
const ScaleRow = ({ value, onChange, min = 0, max = 10 }) => {
  const count = max - min + 1;
  return (
    <div className="scale" style={{ flexWrap: "wrap", gap: 7 }}>
      {Array.from({ length: count }, (_, i) => i + min).map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={active ? "sel" : ""}
            style={{ flex: "1 1 0", minWidth: 38, maxWidth: 56 }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
};

/* ── Field wrapper ── */
const Field = ({ label, hint, children, style = {} }) => (
  <div style={{ marginBottom: 24, ...style }}>
    <div
      style={{
        fontSize: 14.5,
        fontWeight: 600,
        color: C.text,
        fontFamily: SEMI,
        marginBottom: hint ? 6 : 12,
      }}
    >
      {label}
    </div>
    {hint && (
      <div className="scale-ends" style={{ marginBottom: 10 }}>
        <span>{hint[0]}</span>
        <span>{hint[1]}</span>
      </div>
    )}
    {children}
  </div>
);

/* ── Format Date Function ── */
const formatDate = (date) => {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/* ── Main form ── */
const DailyReportForm = ({ onBack }) => {
  const [name, setName] = useState("");
  const [urineColour, setUrineColour] = useState(null);
  const [soreness, setSoreness] = useState(0);
  const [fatigue, setFatigue] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [injury, setInjury] = useState(null);
  const [injuryFile, setInjuryFile] = useState(null);
  const [motivation, setMotivation] = useState(0);
  const [ballsBowled, setBallsBowled] = useState("");
  const [rpe, setRpe] = useState(0);
  const [training, setTraining] = useState([]);
  const [note, setNote] = useState("");
  const fileRef = useRef();

  const today = new Date();

  const toggleTraining = (t) =>
    setTraining((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setInjuryFile(f);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        player: localStorage.getItem("userId"),
        name,
        urineColour,
        soreness,
        fatigue,
        sleep,
        injury,
        motivation,
        ballsBowled,
        rpe,
        training,
        note,
        reportDate: today.toISOString().split("T")[0], // Optional: send date to backend
      };

      const res = await submitDailyReport(payload);
      console.log(res.data);

      setTimeout(() => {
        if (onBack) onBack();
      }, 1200);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── Completion indicator (derived from existing state — no new required logic) ── */
  const checks = [
    name.trim() !== "",
    urineColour !== null,
    soreness > 0,
    fatigue > 0,
    sleep > 0,
    injury !== null,
    motivation > 0,
    String(ballsBowled).trim() !== "",
    rpe > 0,
    training.length > 0,
  ];
  const totalFields = checks.length;
  const answered = checks.filter(Boolean).length;
  const pct = Math.round((answered / totalFields) * 100);

  return (
    <div style={{ background: C.paper, minHeight: "100vh" }}>
      <div className="page-wrap" style={{ maxWidth: 820 }}>
        {/* Back link */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              marginBottom: 14,
              fontFamily: SEMI,
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}

        {/* Hero */}
        <SectionHero
          icon={ClipboardList}
          eyebrow={formatDate(today)}
          title="Daily Wellness"
          sub="Log how your body feels and today's training load."
        />

        {/* ── Player ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={ClipboardList}
            title="Player"
            sub="Who's checking in today"
          />
          <div style={{ padding: "18px 18px 8px" }}>
            <Field label="Name">
              <input
                type="text"
                className="input"
                placeholder="Enter player name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* ── Wellness ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={HeartPulse}
            title="Wellness"
            sub="Rate each from 0 to 10"
          />
          <div style={{ padding: "20px 18px 6px" }}>
            <Field
              label="Soreness Level"
              hint={["No Soreness", "Extreme Soreness"]}
            >
              <ScaleRow value={soreness} onChange={setSoreness} />
            </Field>

            <Field
              label="Fatigue Level"
              hint={["Energetic No Fatigue", "Worst Possible Fatigue"]}
            >
              <ScaleRow value={fatigue} onChange={setFatigue} />
            </Field>

            <Field label="Sleep Hours">
              <ScaleRow value={sleep} onChange={setSleep} />
            </Field>

            <Field
              label="Motivational Level"
              hint={["Not Motivated", "Highly Motivated"]}
              style={{ marginBottom: 18 }}
            >
              <ScaleRow value={motivation} onChange={setMotivation} />
            </Field>
          </div>
        </Card>

        {/* ── Hydration ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={Droplets}
            title="Hydration"
            sub="Match your urine colour"
          />
          <div style={{ padding: "20px 18px" }}>
            <div className="swatches" style={{ gap: 18 }}>
              {URINE_COLOURS.map((c) => {
                const sel = urineColour === c.label;
                return (
                  <div
                    key={c.label}
                    className={`swatch${sel ? " sel" : ""}`}
                    onClick={() => setUrineColour(c.label)}
                  >
                    <div
                      className="sw"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: sel ? C.sky : "transparent",
                        boxShadow: sel
                          ? `0 0 0 2px ${C.sky}55, inset 0 0 0 1px rgba(0,0,0,.06)`
                          : "inset 0 0 0 1px rgba(0,0,0,.06)",
                      }}
                    />
                    <span
                      className="sl"
                      style={{
                        color: sel ? C.skyDark : C.muted,
                        fontWeight: sel ? 700 : 400,
                      }}
                    >
                      {c.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ── Pain & Niggles ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={Activity}
            title="Pain & Niggles"
            sub="Flag any aches or pain"
          />
          <div style={{ padding: "20px 18px" }}>
            <Field label="Experiencing Aches / Pain?" style={{ marginBottom: 0 }}>
              <div className="choice-row" style={{ maxWidth: 320 }}>
                {[
                  { label: "Yes", val: true },
                  { label: "No", val: false },
                ].map(({ label, val }) => {
                  const active = injury === val;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`choice${active ? " sel" : ""}`}
                      onClick={() => setInjury(val)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {injury === true && (
              <div style={{ marginTop: 16 }}>
                <Note tone="sky" icon={Upload}>
                  Upload an injury report so the medical team can review it.
                </Note>
                <div style={{ marginTop: 12 }}>
                  {!injuryFile ? (
                    <div
                      onClick={() => fileRef.current.click()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        padding: "11px 16px",
                        background: "#fff",
                        border: `1.5px dashed ${C.sky}`,
                        borderRadius: 10,
                        color: C.skyDark,
                        fontWeight: 600,
                        fontSize: 13.5,
                      }}
                    >
                      <Upload size={16} />
                      Choose file (PDF / Image)
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: "none" }}
                        onChange={handleFile}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: C.skyTint,
                        border: `1.5px solid ${C.sky}`,
                        borderRadius: 10,
                      }}
                    >
                      <FileText size={16} style={{ color: C.skyDark }} />
                      <span
                        style={{
                          fontSize: 13.5,
                          color: C.text,
                          fontWeight: 600,
                        }}
                      >
                        {injuryFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInjuryFile(null)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <X size={15} style={{ color: C.danger }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ── Training Load ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={Dumbbell}
            title="Training Load"
            sub="Effort, volume and sessions completed"
          />
          <div style={{ padding: "20px 18px 8px" }}>
            <Field
              label="RPE (Rate of Perceived Exertion)"
              hint={["No Effort", "Max Effort"]}
            >
              <ScaleRow value={rpe} onChange={setRpe} />
            </Field>

            <Field label="Number of Balls Bowled">
              <input
                type="number"
                className="input"
                placeholder="0"
                value={ballsBowled}
                onChange={(e) => setBallsBowled(e.target.value)}
                style={{ maxWidth: 220 }}
              />
            </Field>

            <Field label="Training Session Completed" style={{ marginBottom: 18 }}>
              <div className="chip-grid">
                {TRAINING_OPTIONS.map((t) => {
                  const checked = training.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`toggle-chip${checked ? " sel" : ""}`}
                      onClick={() => toggleTraining(t)}
                    >
                      <span className="tc-check">
                        <Check />
                      </span>
                      {t}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </Card>

        {/* ── Notes ── */}
        <Card style={{ overflow: "hidden", marginBottom: 18 }}>
          <CardHead
            icon={StickyNote}
            title="Notes"
            sub="Anything else worth flagging"
          />
          <div style={{ padding: "18px 18px 8px" }}>
            <Field label="Note" style={{ marginBottom: 8 }}>
              <textarea
                className="input"
                placeholder="Add any additional notes, comments, or observations..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                style={{
                  resize: "vertical",
                  minHeight: 110,
                  fontFamily: "inherit",
                }}
              />
            </Field>
          </div>
        </Card>

        {/* ── Sticky footer: progress + submit ── */}
        <div
          className="form-footer"
          style={{ margin: "0 -24px -56px", borderRadius: 0 }}
        >
          <div style={{ flex: 1, minWidth: 180 }}>
            <div
              className="form-progress"
              style={{ marginBottom: 7, fontFamily: SEMI }}
            >
              <b style={{ fontFamily: COND, fontSize: 16 }}>{answered}</b> of{" "}
              {totalFields} answered
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 99,
                background: "#e6edf4",
                overflow: "hidden",
                maxWidth: 360,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${C.sky}, ${C.skyDark})`,
                  transition: "width .5s cubic-bezier(.2,.8,.2,1)",
                }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ fontWeight: 700, minWidth: 200 }}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyReportForm;
