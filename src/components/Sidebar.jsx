import { useState, useEffect } from "react";
import {
  User, Users, Stethoscope, Dumbbell, Apple, ChefHat,
  Menu, X, ChevronRight, Activity, LogOut,
} from "lucide-react";

// ── NAV ITEMS ──────────────────────────────────────────────────────────────
const NAV = [
  { id: "player",      label: "My Dashboard", icon: User,        color: "#2f9be0" },
  { id: "coach",       label: "Coach",         icon: Users,       color: "#4f9cf9" },
  { id: "trainer",     label: "Trainer",       icon: Dumbbell,    color: "#a855f7" },
  { id: "physio",      label: "Physiotherapist", icon: Stethoscope, color: "#f94f7c" },
  { id: "nutritionist",label: "Nutritionist",  icon: Apple,       color: "#22c55e" },
];

// ── STYLES ─────────────────────────────────────────────────────────────────
const S = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    zIndex: 200, backdropFilter: "blur(2px)",
  },
  sidebar: (open) => ({
    position: "fixed", top: 0, left: 0, height: "100vh",
    width: "260px",
    background: "#fff",
    borderRight: "1px solid #e8e8e8",
    boxShadow: "2px 0 24px rgba(0,0,0,0.08)",
    zIndex: 300,
    display: "flex", flexDirection: "column",
    transform: open ? "translateX(0)" : "translateX(-100%)",
    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
  }),
  desktopSidebar: {
    position: "fixed", top: 0, left: 0, height: "100vh",
    width: "260px",
    background: "#fff",
    borderRight: "1px solid #e8e8e8",
    boxShadow: "2px 0 16px rgba(0,0,0,0.05)",
    zIndex: 100,
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "22px 20px 18px",
    borderBottom: "1px solid #f0f0f0",
    flexShrink: 0,
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px",
  },
  logoIcon: {
    width: "38px", height: "38px", borderRadius: "10px",
    background: "linear-gradient(135deg, #2f9be0 0%, #f0a050 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(47,155,224,0.3)",
  },
  logoText: {
    fontSize: "15px", fontWeight: "800", color: "#222", letterSpacing: "-0.3px",
  },
  logoSub: {
    fontSize: "10px", color: "#aaa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.6px",
  },
  nav: {
    flex: 1, padding: "16px 12px", overflowY: "auto",
  },
  sectionLabel: {
    fontSize: "10px", fontWeight: "700", color: "#bbb",
    textTransform: "uppercase", letterSpacing: "0.8px",
    padding: "0 8px", marginBottom: "6px", marginTop: "8px",
  },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 12px", borderRadius: "9px",
    cursor: "pointer", marginBottom: "2px",
    background: active ? "#fff8f2" : "transparent",
    border: active ? "1px solid #ffd8b0" : "1px solid transparent",
    transition: "all 0.15s ease",
    textDecoration: "none",
  }),
  navIcon: (active, color) => ({
    width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
    background: active ? color + "22" : "#f5f5f5",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s ease",
  }),
  navLabel: (active) => ({
    flex: 1, fontSize: "13px", fontWeight: active ? "700" : "500",
    color: active ? "#222" : "#555",
  }),
  navDot: {
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#2f9be0", flexShrink: 0,
  },
  footer: {
    padding: "16px 12px",
    borderTop: "1px solid #f0f0f0",
    flexShrink: 0,
  },
  playerCard: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 12px", borderRadius: "9px",
    background: "#fafafa", border: "1px solid #e8e8e8",
    marginBottom: "10px",
  },
  avatar: {
    width: "34px", height: "34px", borderRadius: "50%",
    background: "#e8f3fb", border: "1.5px solid #ffd8b0",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  logoutBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "9px 12px", borderRadius: "8px",
    background: "none", border: "1px solid #e8e8e8",
    cursor: "pointer", width: "100%",
    fontSize: "12px", fontWeight: "600", color: "#888",
    transition: "all 0.15s ease",
  },
  hamburger: {
    position: "fixed", top: "16px", left: "16px", zIndex: 400,
    width: "40px", height: "40px", borderRadius: "10px",
    background: "#fff", border: "1px solid #e8e8e8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
  },
};

// ── SIDEBAR CONTENT ────────────────────────────────────────────────────────
const SidebarContent = ({ active, setActive, playerName, onClose, onLogout }) => (
  <>
    {/* Header */}
    <div style={S.header}>
      <div style={S.logo}>
        <div style={S.logoIcon}>
          <Activity size={18} color="#fff" />
        </div>
        <div>
          <div style={S.logoText}>AthletePro</div>
          <div style={S.logoSub}>Performance Hub</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <div style={S.nav}>
      <div style={S.sectionLabel}>Main</div>
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <div
            key={item.id}
            style={S.navItem(isActive)}
            onClick={() => { setActive(item.id); onClose?.(); }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "#fafafa";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={S.navIcon(isActive, item.color)}>
              <Icon size={16} style={{ color: isActive ? item.color : "#888" }} />
            </div>
            <span style={S.navLabel(isActive)}>{item.label}</span>
            {isActive && <div style={S.navDot} />}
          </div>
        );
      })}
    </div>

    {/* Footer */}
    <div style={S.footer}>
      <div style={S.playerCard}>
        <div style={S.avatar}>
          <User size={16} style={{ color: "#2f9be0" }} />
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {
  playerName
    ? playerName.split("@")[0]
    : "Player"
}
          </div>
          <div style={{ fontSize: "10px", color: "#aaa", fontWeight: "600" }}>Active · KCA</div>
        </div>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
      </div>
      <button style={S.logoutBtn} onClick={onLogout}
        onMouseEnter={e => { e.currentTarget.style.background = "#fff0f0"; e.currentTarget.style.color = "#cc3333"; e.currentTarget.style.borderColor = "#ffc5c5"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#e8e8e8"; }}
      >
        <LogOut size={14} /> Sign Out
      </button>
    </div>
  </>
);

// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export default function Sidebar({ active, setActive, playerName, onLogout }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile sidebar on outside click / route change
  useEffect(() => { setMobileOpen(false); }, [active]);

  if (!isMobile) {
    return (
      <aside style={S.desktopSidebar}>
        <SidebarContent active={active} setActive={setActive} playerName={playerName} onLogout={onLogout} />
      </aside>
    );
  }

  return (
    <>
      {/* Hamburger */}
      <button style={S.hamburger} onClick={() => setMobileOpen(true)}>
        <Menu size={20} style={{ color: "#333" }} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div style={S.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Drawer */}
      <aside style={S.sidebar(mobileOpen)}>
        <button
          onClick={() => setMobileOpen(false)}
          style={{ position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "6px", zIndex: 10 }}
        >
          <X size={18} style={{ color: "#888" }} />
        </button>
        <SidebarContent active={active} setActive={setActive} playerName={playerName} onClose={() => setMobileOpen(false)} onLogout={onLogout} />
      </aside>
    </>
  );
}