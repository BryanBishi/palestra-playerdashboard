import { useState, useRef } from "react";
import { Upload, X, FileText, ChevronLeft } from "lucide-react";
import { submitDailyReport } from "../api/authApi";

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

/* ── Reusable scale row ── */
const ScaleRow = ({ value, onChange, min = 0, max = 10 }) => {
  const count = max - min + 1;
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {Array.from({ length: count }, (_, i) => i + min).map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: active ? "2px solid #e87722" : "1.5px solid #d1d5db",
              backgroundColor: active ? "#e87722" : "#ffffff",
              color: active ? "#ffffff" : "#374151",
              fontSize: "14px",
              fontWeight: active ? "700" : "500",
              cursor: "pointer",
              transition: "all 0.15s",
              flexShrink: 0,
              boxShadow: active ? "0 2px 6px rgba(232,119,34,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = "#e87722";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = "#d1d5db";
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
};

/* ── Field wrapper ── */
const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: "28px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: hint ? "4px" : "12px",
      }}
    >
      <span
        style={{ fontSize: "15px", fontWeight: "600", color: "#1f2937" }}
      >
        {label}
      </span>
    </div>
    {hint && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#6b7280" }}>{hint[0]}</span>
        <span style={{ fontSize: "11px", color: "#6b7280" }}>{hint[1]}</span>
      </div>
    )}
    {children}
  </div>
);

/* ── Format Date Function ── */
const formatDate = (date) => {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
        reportDate: today.toISOString().split('T')[0], // Optional: send date to backend
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

  /* shared input style */
  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    backgroundColor: "#ffffff",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    color: "#1f2937",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "0",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "13px",
              cursor: "pointer",
              padding: "0",
              fontWeight: "500",
            }}
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        <div>
          {/* <h1
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
            }}
          >
            Daily Report
          </h1> */}
          <p
            style={{
              fontSize: "16px",
              color: "#1f2937",
              margin: "4px 0 0 0",
              fontWeight: "500",
            }}
          >
            {formatDate(today)}
          </p>
        </div>
      </div>

      {/* Form body */}
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "32px 20px 48px",
        }}
      >
        {/* Name */}
        <Field label="Name">
          <input
            type="text"
            placeholder="Enter player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#e87722")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
        </Field>

        {/* Urine Colour */}
           <Field label="Urine Colour">
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
            {URINE_COLOURS.map((c) => (
              <div
                key={c.label}
                onClick={() => setUrineColour(c.label)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: c.hex,
                    border:
                      urineColour === c.label
                        ? "3px solid #e87722"
                        : "3px solid transparent",
                    boxShadow:
                      urineColour === c.label
                        ? "0 0 0 2px rgba(232,119,34,0.3)"
                        : "none",
                    transition: "all 0.15s",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color:
                      urineColour === c.label ? "#e87722" : "#4b5563",
                    fontWeight: urineColour === c.label ? "700" : "400",
                    textAlign: "center",
                    maxWidth: "64px",
                    lineHeight: "1.3",
                  }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </Field>


        {/* Soreness */}
        <Field label="Soreness Level" hint={["No Soreness", "Extreme Soreness"]}>
          <ScaleRow value={soreness} onChange={setSoreness} />
        </Field>

        {/* Fatigue */}
        <Field label="Fatigue Level" hint={["Energetic No Fatigue", "Worst Possible Fatigue"]}>
          <ScaleRow value={fatigue} onChange={setFatigue} />
        </Field>

        {/* Sleep */}
        <Field label="Sleep Hours">
          <ScaleRow value={sleep} onChange={setSleep} />
        </Field>

        {/* Injury */}
        <Field label="Experiencing Aches / Pain?">
          <div style={{ display: "flex", gap: "28px", marginBottom: injury === true ? "16px" : "0", flexWrap: "wrap" }}>
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map(({ label, val }) => {
              const active = injury === val;
              return (
                <label
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: active ? "#e87722" : "#374151",
                    fontWeight: active ? "600" : "400",
                  }}
                >
                  <div
                    onClick={() => setInjury(val)}
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: active ? "2px solid #e87722" : "2px solid #9ca3af",
                      backgroundColor: active ? "rgba(232,119,34,0.12)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    {active && (
                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          backgroundColor: "#e87722",
                        }}
                      />
                    )}
                  </div>
                  {label}
                </label>
              );
            })}
          </div>

          {injury === true && (
            <div
              style={{
                marginTop: "14px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                border: "1.5px dashed #e87722",
                borderRadius: "10px",
              }}
            >
              <p style={{ fontSize: "13px", color: "#e87722", fontWeight: "600", marginBottom: "10px" }}>
                Upload Injury Report
              </p>
              {!injuryFile ? (
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    padding: "10px 16px",
                    backgroundColor: "#ffffff",
                    border: "1.5px solid #d1d5db",
                    borderRadius: "8px",
                    width: "fit-content",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#e87722")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                >
                  <Upload size={16} style={{ color: "#e87722" }} />
                  <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>
                    Choose file (PDF / Image)
                  </span>
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
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    backgroundColor: "#ffffff",
                    border: "1.5px solid #e87722",
                    borderRadius: "8px",
                    width: "fit-content",
                  }}
                >
                  <FileText size={16} style={{ color: "#e87722" }} />
                  <span style={{ fontSize: "13px", color: "#1f2937", fontWeight: "500" }}>
                    {injuryFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInjuryFile(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "0" }}
                  >
                    <X size={15} style={{ color: "#cc3333" }} />
                  </button>
                </div>
              )}
            </div>
          )}
        </Field>

        {/* Motivation */}
        <Field label="Motivational Level" hint={["Not Motivated", "Highly Motivated"]}>
          <ScaleRow value={motivation} onChange={setMotivation} />
        </Field>

        {/* Balls Bowled */}
        <Field label="Number of Balls Bowled">
          <input
            type="number"
            placeholder="0"
            value={ballsBowled}
            onChange={(e) => setBallsBowled(e.target.value)}
            style={{ ...inputStyle, maxWidth: "220px" }}
            onFocus={(e) => (e.target.style.borderColor = "#e87722")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
        </Field>

        {/* RPE */}
        <Field label="RPE (Rate of Perceived Exertion)" hint={["No Effort", "Max Effort"]}>
          <ScaleRow value={rpe} onChange={setRpe} />
        </Field>

        {/* Training Session */}
        <Field label="Training Session Completed">
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            {TRAINING_OPTIONS.map((t) => {
              const checked = training.includes(t);
              return (
                <label
                  key={t}
                  onClick={() => toggleTraining(t)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: checked ? "#e87722" : "#374151",
                    fontWeight: checked ? "600" : "400",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: checked ? "2px solid #e87722" : "2px solid #9ca3af",
                      backgroundColor: checked ? "#e87722" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {t}
                </label>
              );
            })}
          </div>
        </Field>

        {/* Note */}
        <Field label="Note">
          <textarea
            placeholder="Add any additional notes, comments, or observations..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "110px",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#e87722")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
          />
        </Field>

        {/* Submit */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "12px 36px",
              backgroundColor: "#e87722",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background 0.15s",
              boxShadow: "0 2px 8px rgba(232,119,34,0.35)",
              width: "100%",
              maxWidth: "220px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d06a18")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e87722")}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyReportForm;