import Icon from "../components/Icon";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const todayStr = () =>
  new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const sparkHeights = (vals) => {
  const max = Math.max(...vals, 1);
  return vals.map((v) => Math.max(8, Math.round((v / max) * 100)));
};

export default function Dashboard({ player, wellness, nav }) {
  const first = (player?.name || "Player").split(" ")[0];
  const position = player?.position || "All-rounder";
  const number = player?.number || "07";

  const recent = (wellness || []).slice(-7);
  const latest = recent[recent.length - 1] || null;

  // Readiness derived from the latest wellness entry (fallback 78)
  const readiness = latest
    ? Math.max(0, Math.min(100, Math.round(100 - (Number(latest.fatigue) || 0) * 7 - (Number(latest.soreness) || 0) * 3)))
    : 78;
  const gaugeColor = readiness >= 70 ? "#1f9d57" : readiness >= 40 ? "#d98a0b" : "#ec5a4d";
  const statusText = readiness >= 70 ? "Match Ready" : readiness >= 40 ? "Manage Load" : "Rest Advised";

  const sleepVal = latest?.sleep != null ? `${latest.sleep}h` : "7.5h";
  const fatigueVal = latest?.fatigue != null ? `${latest.fatigue}/10` : "2/10";
  const streak = wellness?.length || 6;

  const buildMetric = (key, label, unit) => {
    const vals = recent.map((r) => Number(r[key])).filter((v) => !isNaN(v));
    if (!vals.length) return null;
    const cur = vals[vals.length - 1];
    const prev = vals.length > 1 ? vals[vals.length - 2] : cur;
    return { label, unit, cur, delta: +(cur - prev).toFixed(1), heights: sparkHeights(vals), lowerBetter: key !== "sleep" };
  };

  const trends = wellness && wellness.length
    ? [buildMetric("soreness", "Soreness", "/10"), buildMetric("fatigue", "Fatigue", "/10"), buildMetric("sleep", "Sleep", "h")].filter(Boolean)
    : [
        { label: "Soreness", unit: "/10", cur: 3, delta: -1, heights: [83, 67, 67, 100, 50, 67, 50], lowerBetter: true },
        { label: "Fatigue", unit: "/10", cur: 2, delta: -2, heights: [100, 83, 83, 67, 50, 50, 33], lowerBetter: true },
        { label: "Sleep", unit: "h", cur: 7.5, delta: 0.5, heights: [80, 87, 93, 80, 93, 93, 100], lowerBetter: false },
      ];

  const injuries = player?.injuries || [];
  const firstInj = injuries[0] || {};

  const deltaClass = (t) => ((t.lowerBetter ? t.delta <= 0 : t.delta >= 0) ? "delta-up" : "delta-down");
  const deltaText = (t) => (t.delta > 0 ? `+${t.delta}` : `${t.delta}`);

  return (
    <>
      <div className="banner"><div className="banner-inner">
        <div>
          <div className="eyebrow">Player Dashboard</div>
          <h1>{greeting()}, {first}</h1>
          <div className="sub">{todayStr()} · Your check-in for today is complete</div>
        </div>
        <button className="btn btn-primary" onClick={() => nav("daily")}><Icon name="plus" />Log Daily Progress</button>
      </div></div>

      <div className="wrap">
        <div className="grid cols-3-2">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="hero"><div className="hero-inner">
              <div className="gauge" style={{ "--val": readiness, "--gauge-color": gaugeColor }}>
                <div className="g-num">{readiness}</div><div className="g-lbl">Readiness</div>
              </div>
              <div className="hero-meta">
                <div className="greet">#{number} · {position}</div>
                <h2>{first}</h2>
                <span className="status"><span className="d" />{statusText}</span>
                <div className="hero-stats">
                  <div className="hs"><div className="n">{sleepVal}</div><div className="l">Sleep</div></div>
                  <div className="hs"><div className="n">{fatigueVal}</div><div className="l">Fatigue</div></div>
                  <div className="hs"><div className="n">{streak}</div><div className="l">Day streak</div></div>
                </div>
              </div>
            </div></div>

            <div className="card">
              <div className="card-head">
                <div className="ch-icon"><Icon name="bolt" /></div>
                <div><h3>7-Day Wellness Trend</h3><div className="ch-sub">Lower is better</div></div>
              </div>
              <div className="card-pad">
                <div className="metric-grid">
                  {trends.map((t, i) => (
                    <div className="metric" key={i}>
                      <div className="m-top"><span className="m-name">{t.label}</span>
                        <span className={`m-delta ${deltaClass(t)}`}>{deltaText(t)}</span></div>
                      <div className="m-val">{t.cur}<small>{t.unit}</small></div>
                      <div className="spark">
                        {t.heights.map((h, j) => (
                          <span key={j} className={j === t.heights.length - 1 ? "hi" : ""} style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {injuries.length > 0 && (
              <div className="alert">
                <div className="a-icon"><Icon name="alert" /></div>
                <div>
                  <div className="a-title">{injuries.length} active injur{injuries.length > 1 ? "ies" : "y"} on record</div>
                  <div className="a-sub">{firstInj.type || firstInj.bodyPart || "Injury"} · in recovery</div>
                </div>
                <a className="a-cta" onClick={() => nav("injuries")}>View <Icon name="arrowRight" /></a>
              </div>
            )}

            <div className="card">
              <div className="card-head">
                <div className="ch-icon"><Icon name="shieldCheck" /></div>
                <div><h3>My Support Team</h3><div className="ch-sub">{player?.team?.name || "U-19 Squad"}</div></div>
              </div>
              <div>
                <div className="info-row"><div className="ir-icon"><Icon name="user" /></div><div className="ir-label">Head Coach</div><div className="ir-value">Suresh Menon</div></div>
                <div className="info-row"><div className="ir-icon"><Icon name="physio" /></div><div className="ir-label">Physio</div><div className="ir-value">Dr. Arun</div></div>
                <div className="info-row"><div className="ir-icon"><Icon name="trainer" /></div><div className="ir-label">Trainer</div><div className="ir-value">Admin</div></div>
                <div className="info-row"><div className="ir-icon"><Icon name="apple" /></div><div className="ir-label">Nutritionist</div><div className="ir-value">Anjali</div></div>
              </div>
            </div>

            <button className="btn btn-ghost" onClick={() => nav("team")} style={{ width: "100%" }}>
              <Icon name="team" />View Full Team Roster <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
