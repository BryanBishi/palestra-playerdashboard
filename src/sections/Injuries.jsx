import Icon from "../components/Icon";

// Injury list comes from getPlayer().injuries (wired). Recovery %, timeline,
// and the physio note have no backend fields, so they are hardcoded.
export default function Injuries({ player, nav }) {
  const injuries = player?.injuries || [];

  return (
    <>
      <div className="banner"><div className="banner-inner">
        <div>
          <a className="back-link" onClick={() => nav("dashboard")}><Icon name="back" />Back to Dashboard</a>
          <div className="eyebrow">Medical Record</div>
          <h1>My Injuries</h1>
          <div className="sub">Track recovery and request playing clearance from your physio</div>
        </div>
      </div></div>

      <div className="wrap" style={{ maxWidth: "840px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {injuries.length === 0 ? (
          <div className="injury-card">
            <div className="ic-bar bar-cleared" />
            <div className="ic-body" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div className="ic-emoji" style={{ background: "var(--ok-tint)", color: "var(--ok)" }}><Icon name="shieldCheck" /></div>
              <div>
                <div className="ic-title">No active injuries</div>
                <div className="ic-meta">You're cleared to play. Keep logging your daily check-ins.</div>
              </div>
            </div>
          </div>
        ) : (
          injuries.map((inj, idx) => {
            const title = inj.type || inj.name || "Injury";
            const meta = `${inj.bodyPart || "—"} · ${inj.severity || inj.grade || "Grade I"} · Reported ${inj.dateReported || inj.date || "—"}`;
            return (
              <div className="injury-card" key={idx}>
                <div className="ic-bar bar-active" />
                <div className="ic-body">
                  <div className="ic-top">
                    <div className="ic-emoji" style={{ background: "var(--coral-tint)", color: "var(--coral)" }}><Icon name="shield" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span className="ic-title">{title}</span>
                        <span className="chip chip-danger">Active</span>
                      </div>
                      <div className="ic-meta">{meta}</div>
                    </div>
                  </div>
                  <div className="ic-grid">
                    <div className="g"><div className="gl">Mechanism</div><div className="gv">{inj.mechanism || "Sprint — fielding drill"}</div></div>
                    <div className="g"><div className="gl">Expected return</div><div className="gv">{inj.expectedReturn || "2–3 weeks"}</div></div>
                    <div className="g"><div className="gl">Managed by</div><div className="gv">{inj.managedBy || "Dr. Arun"}</div></div>
                  </div>
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                      <span style={{ color: "var(--muted)", fontWeight: 600 }}>Recovery progress</span>
                      <span style={{ fontWeight: 700, color: "var(--ok)" }}>55%</span>
                    </div>
                    <div className="progress"><span style={{ width: "55%" }} /></div>
                  </div>
                  <div className="timeline">
                    <div className="tl-step done"><div className="dot" /><div className="tl-name">Reported</div><div className="tl-date">11 May</div></div>
                    <div className="tl-step done"><div className="dot" /><div className="tl-name">Assessment</div><div className="tl-date">12 May</div></div>
                    <div className="tl-step current"><div className="dot" /><div className="tl-name">Rehab</div><div className="tl-date">In progress</div></div>
                    <div className="tl-step"><div className="dot" /><div className="tl-name">Clearance</div><div className="tl-date">Pending</div></div>
                  </div>
                  <div style={{ marginTop: "18px", padding: "14px 16px", background: "var(--paper)", borderRadius: "10px", fontSize: "13.5px", color: "#4b5159", lineHeight: 1.5 }}>
                    <b style={{ color: "var(--text)" }}>Physio note:</b> Responding well to eccentric loading. Light running cleared.
                  </div>
                  <div className="btn-row" style={{ marginTop: "18px" }}>
                    <button className="btn btn-primary"><Icon name="shieldCheck" />Request Playing Clearance</button>
                    <button className="btn btn-ghost"><Icon name="file" />View Full History</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
