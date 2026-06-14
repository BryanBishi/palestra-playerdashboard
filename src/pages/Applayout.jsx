import { useState } from "react";
import Icon from "../components/Icon";
import logo from "../assets/company-logo.png";
import PlayerDashboard from "../pages/PlayerDashboard";
import Coach from "../pages/Coach";
import Trainer from "../pages/Trainer";
import Physiotherapist from "../pages/Physiotherapist";
import Nutritionist from "../pages/Nutritionist";

const NAV = [
  { id: "player", label: "My Dashboard", icon: "user" },
  { id: "coach", label: "Coach", icon: "team" },
  { id: "trainer", label: "Trainer", icon: "trainer" },
  { id: "physio", label: "Physiotherapist", icon: "physio" },
  { id: "nutritionist", label: "Nutritionist", icon: "apple" },
];

const VIEWS = {
  player: PlayerDashboard,
  coach: Coach,
  trainer: Trainer,
  physio: Physiotherapist,
  nutritionist: Nutritionist,
};

function TopBar({ onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <img src={logo} alt="Palaestra" style={{ height: "38px", width: "auto", display: "block" }} />
        </div>
        <div className="topbar-right">
          <div className="socials">
            <a href="#" aria-label="YouTube"><Icon name="youtube" /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" /></a>
            <a href="#" aria-label="Twitter"><Icon name="twitter" /></a>
            <a href="#" aria-label="Instagram"><Icon name="instagram" /></a>
          </div>
          <div className="divider" />
          <div className="search-box" style={{ width: "180px", background: "#163a7a", borderColor: "#234a8a" }}>
            <Icon name="search" /><input placeholder="Search…" style={{ color: "#c7ccd4" }} />
          </div>
          <button className="icon-btn" title="Notifications"><Icon name="bell" /></button>
          <button className="icon-btn" title="Settings"><Icon name="settings" /></button>
          <button className="btn-logout" onClick={onLogout}><Icon name="logout" />Logout</button>
        </div>
      </div>
    </div>
  );
}

function Navbar({ active, onNav }) {
  return (
    <div className="navbar">
      <div className="navbar-inner">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-tab ${active === n.id ? "active" : ""}`}
            onClick={() => onNav(n.id)}
          >
            <Icon name={n.icon} />{n.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="f-brand">
            <img src={logo} alt="Palaestra" style={{ height: "40px", width: "auto", display: "block" }} />
          </div>
          <p className="f-about">Palaestra Performance &amp; Rehab — structured training, performance monitoring and athlete care.</p>
        </div>
        <div className="f-col"><h4>Player</h4><a>My Dashboard</a><a>Coach</a><a>Trainer</a><a>Daily Check-in</a></div>
        <div className="f-col"><h4>Support Staff</h4><a>Coaches</a><a>Physios</a><a>Trainers</a><a>Nutritionists</a></div>
        <div className="f-col"><h4>Academy</h4><a>About Palaestra</a><a>Tournaments</a><a>Infrastructure</a><a>Contact</a></div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2026 Palaestra Performance &amp; Rehab</span>
          <span className="fb-accent">Powered by Palaestra</span>
        </div>
      </div>
    </footer>
  );
}

export default function AppLayout({ onLogout }) {
  const [active, setActive] = useState("player");
  const nav = (id) => { setActive(id); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const ActiveSection = VIEWS[active] || PlayerDashboard;

  return (
    <div className="app">
      <TopBar onLogout={onLogout} />
      <Navbar active={active} onNav={nav} />
      <main className="main">
        <ActiveSection onLogout={onLogout} />
      </main>
      <Footer />
    </div>
  );
}
