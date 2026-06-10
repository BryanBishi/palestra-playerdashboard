import { useState } from "react";
import Icon from "../components/Icon";

// Hardcoded roster — the player app has no "list players" endpoint.
const ROSTER = [
  { num: "01", name: "Arjun Menon", role: "Batsman", color: "#16306e", status: "Available", chip: "chip-ok" },
  { num: "02", name: "Rahul Das", role: "Bowler", color: "#1f9d57", status: "Recovering", chip: "chip-warn" },
  { num: "03", name: "Vivek Pillai", role: "All-rounder", color: "#c79a2f", status: "Available", chip: "chip-ok" },
  { num: "04", name: "Nikhil K", role: "Wicket-keeper", color: "#d6443a", status: "Available", chip: "chip-ok" },
  { num: "07", name: "Akhil (You)", role: "All-rounder", color: "#ec5a4d", status: "Injured", chip: "chip-danger" },
];

export default function MyTeam({ player, nav }) {
  const [q, setQ] = useState("");
  const first = (player?.name || "").split(" ")[0];
  const roster = ROSTER.map((r) => (r.name.includes("(You)") && first ? { ...r, name: `${first} (You)` } : r));
  const filtered = roster.filter(
    (r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <div className="banner"><div className="banner-inner">
        <div>
          <a className="back-link" onClick={() => nav("dashboard")}><Icon name="back" />Back to Dashboard</a>
          <div className="eyebrow">Palaestra</div>
          <h1>Team Roster</h1>
        </div>
      </div></div>

      <div className="wrap" style={{ maxWidth: "840px" }}>
        <div className="card">
          <div className="list-head">
            <div className="lh-title">{filtered.length} Players · U-19 Squad</div>
            <div className="search-box">
              <Icon name="search" />
              <input placeholder="Search players…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          {filtered.map((r, i) => (
            <div className="player-row" key={i} onClick={() => nav("dashboard")}>
              <div className="avatar" style={{ background: r.color }}>{r.num}</div>
              <div><div className="p-name">{r.name}</div><div className="p-role">{r.role}</div></div>
              <div className="p-right">
                <span className={`chip ${r.chip}`}>{r.status}</span>
                <span className="chev"><Icon name="chevronRight" /></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
