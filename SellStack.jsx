import { useState, useEffect, useRef } from "react";

// ─── THEME & TOKENS ──────────────────────────────────────────────────────────
const C = {
  pink: "#FF6BD8",
  dark1: "#0C0B0F",
  dark2: "#141217",
  dark3: "#1C1A21",
  dark4: "#252229",
  border: "rgba(255,107,216,0.15)",
  borderGlass: "rgba(255,255,255,0.06)",
  textMuted: "#6B6578",
  textSub: "#9D94AD",
  textPrimary: "#F0EBF8",
  glass: "rgba(255,255,255,0.04)",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'DM Sans',sans-serif; background:${C.dark1}; color:${C.textPrimary}; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:${C.dark2}; }
  ::-webkit-scrollbar-thumb { background:${C.pink}40; border-radius:4px; }
  
  .font-syne { font-family:'Syne',sans-serif; }

  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.5);opacity:0} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px ${C.pink}30} 50%{box-shadow:0 0 40px ${C.pink}60} }

  .float-anim { animation: float 4s ease-in-out infinite; }
  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }

  .glass-card {
    background: ${C.glass};
    border: 1px solid ${C.borderGlass};
    backdrop-filter: blur(12px);
    border-radius: 16px;
  }
  .glass-card:hover { border-color: ${C.border}; background: rgba(255,107,216,0.04); }
  
  .btn-primary {
    background: ${C.pink};
    color: #0C0B0F;
    font-weight:700;
    font-family:'Syne',sans-serif;
    border:none;
    cursor:pointer;
    transition: all 0.2s;
    letter-spacing:0.02em;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px ${C.pink}50; }
  .btn-primary:active { transform:translateY(0); }
  
  .btn-ghost {
    background:transparent;
    color:${C.textPrimary};
    border:1px solid ${C.borderGlass};
    cursor:pointer;
    transition: all 0.2s;
    font-family:'DM Sans',sans-serif;
  }
  .btn-ghost:hover { border-color:${C.pink}60; color:${C.pink}; }

  .nav-link { color:${C.textSub}; cursor:pointer; transition:color 0.2s; font-size:14px; }
  .nav-link:hover, .nav-link.active { color:${C.textPrimary}; }

  .sidebar-item {
    display:flex; align-items:center; gap:12px;
    padding:10px 14px; border-radius:10px;
    cursor:pointer; color:${C.textMuted};
    transition: all 0.2s; font-size:14px;
    font-weight:500;
  }
  .sidebar-item:hover { background:${C.glass}; color:${C.textSub}; }
  .sidebar-item.active { background:${C.pink}15; color:${C.pink}; }

  .metric-card {
    background:${C.dark2};
    border:1px solid ${C.borderGlass};
    border-radius:16px;
    padding:20px 24px;
    transition: all 0.2s;
  }
  .metric-card:hover { border-color:${C.border}; transform:translateY(-2px); }

  .input-field {
    background:${C.dark3};
    border:1px solid ${C.borderGlass};
    color:${C.textPrimary};
    border-radius:10px;
    padding:12px 16px;
    font-family:'DM Sans',sans-serif;
    font-size:14px;
    outline:none;
    transition: border-color 0.2s;
    width:100%;
  }
  .input-field:focus { border-color:${C.pink}60; }
  .input-field::placeholder { color:${C.textMuted}; }

  .tag {
    background:${C.pink}15;
    color:${C.pink};
    border-radius:6px;
    padding:3px 10px;
    font-size:12px;
    font-weight:600;
    font-family:'Syne',sans-serif;
    letter-spacing:0.05em;
  }

  .product-card {
    background:${C.dark2};
    border:1px solid ${C.borderGlass};
    border-radius:16px;
    overflow:hidden;
    cursor:pointer;
    transition: all 0.25s;
  }
  .product-card:hover { border-color:${C.border}; transform:translateY(-4px); box-shadow:0 20px 40px rgba(0,0,0,0.4); }

  .divider { height:1px; background:${C.borderGlass}; }

  .badge-green { background:#00D46A15; color:#00D46A; border-radius:6px; padding:3px 8px; font-size:12px; font-weight:600; }
  .badge-orange { background:#FF9A3C15; color:#FF9A3C; border-radius:6px; padding:3px 8px; font-size:12px; font-weight:600; }
  .badge-blue { background:#3C8DFF15; color:#3C8DFF; border-radius:6px; padding:3px 8px; font-size:12px; font-weight:600; }

  .noise-bg::before {
    content:'';
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity:0.4;
  }

  /* Chart bar animation */
  @keyframes barGrow { from{height:0} to{height:var(--h)} }
  .bar { animation: barGrow 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }

  /* Scrollbar in sidebar */
  .scroll-y { overflow-y:auto; }
  .scroll-y::-webkit-scrollbar { width:3px; }
  .scroll-y::-webkit-scrollbar-thumb { background:${C.borderGlass}; }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9,22 9,12 15,12 15,22" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    grid: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8"/></svg>,
    chart: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    users: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    dollar: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    package: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="22.08" x2="12" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    settings: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="1.8"/></svg>,
    search: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.8"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    bell: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    plus: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    arrow: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><polyline points="12,5 19,12 12,19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    star: <svg width={size} height={size} fill={color} viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="none"/></svg>,
    download: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7,10 12,15 17,10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    key: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    shield: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    zap: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    globe: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.8"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth="1.8"/></svg>,
    menu: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    logout: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    upload: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,8 12,3 7,8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    trending: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 23,6 23,12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    eye: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/></svg>,
    credit: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" stroke={color} strokeWidth="1.8"/><line x1="1" y1="10" x2="23" y2="10" stroke={color} strokeWidth="1.8"/></svg>,
    user: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.8"/></svg>,
    admin: <svg width={size} height={size} fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return icons[name] || null;
};

// ─── NOISE OVERLAY ───────────────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div style={{
    position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
    opacity:0.025, backgroundSize:"200px"
  }}/>
);

// ─── GLOW BG ─────────────────────────────────────────────────────────────────
const GlowBg = ({ x="50%", y="20%", color=C.pink, size=600, opacity=0.08 }) => (
  <div style={{
    position:"absolute", left:x, top:y, transform:"translate(-50%,-50%)",
    width:size, height:size, borderRadius:"50%",
    background:`radial-gradient(circle, ${color}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
    pointerEvents:"none", zIndex:0
  }}/>
);

// ─── MINI CHART ──────────────────────────────────────────────────────────────
const SparkLine = ({ data, color = C.pink, height = 40 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = height;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#grad-${color.replace("#","")})`}
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ─── BAR CHART ───────────────────────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${(d.val / max) * 100}%`,
              background: i === data.length - 1 ? C.pink : `${C.pink}30`,
              borderRadius: "4px 4px 2px 2px",
              transition: "height 1s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
          </div>
          <span style={{ fontSize: 10, color: C.textMuted }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ name = "U", size = 36, color = C.pink }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `${color}20`, border: `1px solid ${color}40`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 700, color, fontFamily: "'Syne',sans-serif",
    flexShrink: 0,
  }}>
    {name[0].toUpperCase()}
  </div>
);

// ─── SCREENS ─────────────────────────────────────────────────────────────────

// 1. LANDING PAGE
const LandingPage = ({ onNavigate }) => {
  const features = [
    { icon: "dollar", title: "Payments Built-in", desc: "Stripe & Razorpay integrated. One-time, subscriptions, coupons — all handled." },
    { icon: "shield", title: "License Management", desc: "Auto-generated keys, device locking, expiry, cloud verification." },
    { icon: "chart", title: "Deep Analytics", desc: "Revenue, cohorts, funnels, retention — everything in one dashboard." },
    { icon: "download", title: "Secure Delivery", desc: "CDN-backed hosting, controlled downloads, anti-piracy protection." },
    { icon: "users", title: "Customer CRM", desc: "Buyer profiles, support tickets, email flows in one place." },
    { icon: "zap", title: "Launch in Minutes", desc: "From upload to published product in under 10 minutes." },
  ];
  const stats = [
    { val: "10 min", label: "To launch" },
    { val: ">5%", label: "Conversion" },
    { val: ">70%", label: "Retention" },
    { val: "1K+", label: "Creators" },
  ];
  const products = [
    { name: "CodeFlow Pro", cat: "Dev Tools", price: "$49", rating: 4.9, sales: "2.3k" },
    { name: "AI Writer Studio", cat: "Productivity", price: "$29/mo", rating: 4.7, sales: "1.8k" },
    { name: "DataViz Kit", cat: "Analytics", price: "$89", rating: 4.8, sales: "956" },
    { name: "Deploy Bot", cat: "DevOps", price: "$19/mo", rating: 4.6, sales: "3.1k" },
  ];

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <NoiseOverlay />
      <GlowBg x="70%" y="0%" size={800} opacity={0.1} />
      <GlowBg x="10%" y="60%" size={500} opacity={0.06} color="#3C8DFF" />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `${C.dark1}cc`, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.borderGlass}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <span className="font-syne" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>SellStack</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Features", "Pricing", "Marketplace", "Docs"].map(l => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-ghost" style={{ padding: "8px 20px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("login")}>Log in</button>
          <button className="btn-primary" style={{ padding: "8px 20px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("signup")}>Start free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ paddingTop: 120, paddingBottom: 80, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${C.pink}12`, border: `1px solid ${C.pink}30`, borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink, animation: "glow-pulse 2s infinite" }} />
          <span style={{ fontSize: 13, color: C.pink, fontWeight: 600 }}>Now in Beta — Join 1,000+ creators</span>
        </div>
        <h1 className="font-syne" style={{
          fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 800, margin: "0 auto 24px",
        }}>
          Sell Software.<br />
          <span style={{ color: C.pink }}>Not Your Time.</span>
        </h1>
        <p style={{ fontSize: 18, color: C.textSub, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          SellStack handles payments, licensing, distribution, analytics, and customers — so you only need to build.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 16 }} onClick={() => onNavigate("signup")}>
            Start selling free →
          </button>
          <button className="btn-ghost" style={{ padding: "14px 32px", borderRadius: 12, fontSize: 16 }} onClick={() => onNavigate("marketplace")}>
            Browse marketplace
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div className="font-syne" style={{ fontSize: 32, fontWeight: 800, color: C.pink }}>{s.val}</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          borderRadius: 20, overflow: "hidden",
          border: `1px solid ${C.borderGlass}`,
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.pink}15`,
        }}>
          <div style={{ background: C.dark3, padding: "12px 20px", display: "flex", gap: 8, alignItems: "center", borderBottom: `1px solid ${C.borderGlass}` }}>
            {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, background: C.dark4, borderRadius: 6, padding: "4px 12px", margin: "0 8px", fontSize: 11, color: C.textMuted }}>app.sellstack.io/dashboard</div>
          </div>
          <div style={{ background: C.dark2, padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "Total Revenue", val: "$24,820", change: "+18.2%", data: [20,35,28,45,38,52,48,62,58,74,68,82] },
              { label: "Active Users", val: "1,847", change: "+12.5%", data: [40,35,50,45,60,55,70,65,75,70,80,88] },
              { label: "Conversions", val: "6.8%", change: "+2.1%", data: [3,4,3.5,5,4.5,6,5.5,7,6.5,7,6.8,7.2] },
              { label: "MRR", val: "$8,340", change: "+22.4%", data: [50,60,55,70,65,75,72,80,78,85,83,92] },
            ].map(m => (
              <div key={m.label} style={{ background: C.dark3, borderRadius: 12, padding: "16px 18px", border: `1px solid ${C.borderGlass}` }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{m.label}</div>
                <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{m.val}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#00D46A" }}>{m.change}</span>
                  <SparkLine data={m.data} height={30} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag">FEATURES</span>
          <h2 className="font-syne" style={{ fontSize: 42, fontWeight: 800, marginTop: 16, letterSpacing: "-0.02em" }}>Everything you need.<br />Nothing you don't.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: "28px 32px", transition: "all 0.25s" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.pink}15`, border: `1px solid ${C.pink}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={f.icon} color={C.pink} size={20} />
              </div>
              <div className="font-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS PREVIEW */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 48px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <span className="tag">MARKETPLACE</span>
            <h2 className="font-syne" style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: "-0.02em" }}>Trending software</h2>
          </div>
          <button className="btn-ghost" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("marketplace")}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {products.map((p, i) => (
            <div key={i} className="product-card" onClick={() => onNavigate("product")}>
              <div style={{ height: 120, background: `linear-gradient(135deg, ${C.pink}20, #3C8DFF15)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 36 }}>{"📦🤖📊🚀"[i]}</div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span className="badge-green" style={{ fontSize: 11 }}>NEW</span>
                </div>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>{p.cat}</div>
                <div className="font-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: C.pink, fontWeight: 700, fontSize: 15 }}>{p.price}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="star" size={12} color="#FFB800" />
                    <span style={{ fontSize: 12, color: C.textSub }}>{p.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", zIndex: 1, padding: "0 48px 100px" }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", borderRadius: 24,
          background: `linear-gradient(135deg, ${C.pink}20, #3C8DFF15)`,
          border: `1px solid ${C.pink}30`, padding: "64px 48px", textAlign: "center",
        }}>
          <h2 className="font-syne" style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Start selling today.
          </h2>
          <p style={{ fontSize: 16, color: C.textSub, marginBottom: 32, lineHeight: 1.7 }}>
            Join thousands of indie hackers, SaaS founders, and solo developers<br />already using SellStack to monetize their software.
          </p>
          <button className="btn-primary" style={{ padding: "16px 40px", borderRadius: 14, fontSize: 17 }} onClick={() => onNavigate("signup")}>
            Create free account →
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. AUTH SCREENS
const AuthScreen = ({ type = "login", onNavigate }) => {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate("dashboard"); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 24 }}>
      <NoiseOverlay />
      <GlowBg x="30%" y="30%" size={600} opacity={0.08} />
      <GlowBg x="70%" y="70%" size={400} opacity={0.06} color="#3C8DFF" />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>⚡</div>
          <span className="font-syne" style={{ fontSize: 22, fontWeight: 800 }}>SellStack</span>
        </div>

        <div className="glass-card" style={{ padding: 40, backdropFilter: "blur(20px)" }}>
          <h2 className="font-syne" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, textAlign: "center" }}>
            {type === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, textAlign: "center", marginBottom: 32 }}>
            {type === "login" ? "Sign in to your SellStack account" : "Start selling your software today"}
          </p>

          {/* Google OAuth */}
          <button className="btn-ghost" style={{ width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: C.textMuted }}>or</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {type === "signup" && (
              <div>
                <label style={{ fontSize: 13, color: C.textSub, display: "block", marginBottom: 6 }}>Full name</label>
                <input className="input-field" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 13, color: C.textSub, display: "block", marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, color: C.textSub }}>Password</label>
                {type === "login" && <span style={{ fontSize: 12, color: C.pink, cursor: "pointer" }}>Forgot?</span>}
              </div>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", padding: "13px", borderRadius: 12, fontSize: 15, marginTop: 24, opacity: loading ? 0.7 : 1 }}
            onClick={submit}
          >
            {loading ? "Loading..." : type === "login" ? "Sign in" : "Create account"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: C.textMuted, marginTop: 20 }}>
            {type === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: C.pink, cursor: "pointer" }} onClick={() => onNavigate(type === "login" ? "signup" : "login")}>
              {type === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// 3. DASHBOARD LAYOUT
const AppLayout = ({ children, onNavigate, currentScreen }) => {
  const nav = [
    { id: "dashboard", icon: "home", label: "Dashboard" },
    { id: "products", icon: "package", label: "Products" },
    { id: "analytics", icon: "chart", label: "Analytics" },
    { id: "customers", icon: "users", label: "Customers" },
    { id: "payments", icon: "dollar", label: "Payments" },
    { id: "licenses", icon: "key", label: "Licenses" },
    { id: "marketplace", icon: "globe", label: "Marketplace" },
    { id: "settings", icon: "settings", label: "Settings" },
    { id: "admin", icon: "admin", label: "Admin" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{
        width: 220, background: C.dark2, borderRight: `1px solid ${C.borderGlass}`,
        display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 50,
        padding: "20px 12px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span className="font-syne" style={{ fontSize: 17, fontWeight: 800 }}>SellStack</span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => (
            <div
              key={n.id}
              className={`sidebar-item ${currentScreen === n.id ? "active" : ""}`}
              onClick={() => onNavigate(n.id)}
            >
              <Icon name={n.icon} size={17} />
              {n.label}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{ borderTop: `1px solid ${C.borderGlass}`, paddingTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Alex" size={34} />
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Alex Kumar</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>Creator</div>
          </div>
          <div style={{ cursor: "pointer", color: C.textMuted }} onClick={() => onNavigate("landing")}>
            <Icon name="logout" size={15} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, background: C.dark1, minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{
          background: `${C.dark1}ee`, backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.borderGlass}`,
          padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.dark3, borderRadius: 10, padding: "8px 16px", width: 280 }}>
            <Icon name="search" size={15} color={C.textMuted} />
            <input style={{ background: "transparent", border: "none", outline: "none", color: C.textPrimary, fontSize: 13, flex: 1 }} placeholder="Search..." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <Icon name="bell" size={20} color={C.textSub} />
              <div style={{ width: 8, height: 8, background: C.pink, borderRadius: "50%", position: "absolute", top: -2, right: -2, border: `2px solid ${C.dark1}` }} />
            </div>
            <Avatar name="Alex" size={32} />
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "32px", position: "relative" }}>
          <NoiseOverlay />
          {children}
        </div>
      </div>
    </div>
  );
};

// 4. DASHBOARD HOME
const DashboardHome = ({ onNavigate }) => {
  const metrics = [
    { label: "Total Revenue", val: "$24,820", change: "+18.2%", positive: true, data: [20,35,28,45,38,52,48,62,58,74,68,82] },
    { label: "Active Users", val: "1,847", change: "+12.5%", positive: true, data: [40,35,50,45,60,55,70,65,75,70,80,88] },
    { label: "Conversions", val: "6.8%", change: "+2.1%", positive: true, data: [3,4,3.5,5,4.5,6,5.5,7,6.5,7,6.8,7.2] },
    { label: "Refund Rate", val: "0.8%", change: "-0.3%", positive: true, data: [2,1.8,2.2,1.5,1.2,1.8,1.2,1.0,0.9,1.1,0.8,0.7] },
  ];
  const orders = [
    { user: "Sarah M.", product: "CodeFlow Pro", amount: "$49", time: "2m ago", status: "completed" },
    { user: "Raj P.", product: "AI Writer Studio", amount: "$29", time: "14m ago", status: "completed" },
    { user: "Emily T.", product: "DataViz Kit", amount: "$89", time: "1h ago", status: "completed" },
    { user: "Marcus L.", product: "Deploy Bot", amount: "$19", time: "2h ago", status: "refunded" },
    { user: "Priya S.", product: "CodeFlow Pro", amount: "$49", time: "3h ago", status: "completed" },
  ];
  const barData = [
    { label: "Jan", val: 42 }, { label: "Feb", val: 55 }, { label: "Mar", val: 48 },
    { label: "Apr", val: 70 }, { label: "May", val: 65 }, { label: "Jun", val: 88 },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Good morning, Alex ☀️</h1>
          <p style={{ fontSize: 14, color: C.textMuted }}>Here's what's happening with your products today.</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 20px", borderRadius: 12, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => onNavigate("products")}>
          <Icon name="plus" size={16} />
          New Product
        </button>
      </div>

      {/* METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} className="metric-card">
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>{m.label}</div>
            <div className="font-syne" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{m.val}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: m.positive ? "#00D46A" : "#FF5F57" }}>{m.change} vs last month</span>
              <SparkLine data={m.data} height={28} />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS + ORDERS */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Bar chart */}
        <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
            <div>
              <div className="font-syne" style={{ fontSize: 16, fontWeight: 700 }}>Revenue Overview</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Monthly performance</div>
            </div>
            <span className="badge-green">↑ 22% YoY</span>
          </div>
          <BarChart data={barData} />
        </div>

        {/* Top products */}
        <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Products</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { name: "CodeFlow Pro", rev: "$8,240", pct: 76 },
              { name: "AI Writer Studio", rev: "$4,980", pct: 52 },
              { name: "DataViz Kit", rev: "$3,200", pct: 38 },
              { name: "Deploy Bot", rev: "$2,100", pct: 24 },
            ].map((p, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: C.pink, fontWeight: 600 }}>{p.rev}</span>
                </div>
                <div style={{ height: 4, background: C.dark4, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${p.pct}%`, background: `linear-gradient(90deg, ${C.pink}, #3C8DFF)`, borderRadius: 4, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</div>
          <button className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12 }} onClick={() => onNavigate("payments")}>View all</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr", padding: "0 0 10px", borderBottom: `1px solid ${C.borderGlass}` }}>
            {["Customer","Product","Amount","Time","Status"].map(h => (
              <span key={h} style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>
          {orders.map((o, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr", padding: "14px 0", borderBottom: i < orders.length - 1 ? `1px solid ${C.borderGlass}` : "none", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={o.user} size={28} color={["#FF6BD8","#3C8DFF","#00D46A","#FF9A3C","#A855F7"][i]} />
                <span style={{ fontSize: 13 }}>{o.user}</span>
              </div>
              <span style={{ fontSize: 13, color: C.textSub }}>{o.product}</span>
              <span className="font-syne" style={{ fontSize: 14, fontWeight: 700, color: C.pink }}>{o.amount}</span>
              <span style={{ fontSize: 12, color: C.textMuted }}>{o.time}</span>
              <span className={o.status === "completed" ? "badge-green" : "badge-orange"} style={{ width: "fit-content" }}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. PRODUCTS PAGE
const ProductsPage = ({ onNavigate }) => {
  const [showForm, setShowForm] = useState(false);
  const products = [
    { name: "CodeFlow Pro", cat: "Dev Tools", price: "$49", sales: 287, status: "published", version: "2.4.1" },
    { name: "AI Writer Studio", cat: "Productivity", price: "$29/mo", sales: 164, status: "published", version: "1.8.0" },
    { name: "DataViz Kit", cat: "Analytics", price: "$89", sales: 98, status: "draft", version: "3.0.0-beta" },
    { name: "Deploy Bot", cat: "DevOps", price: "$19/mo", sales: 312, status: "published", version: "4.2.0" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800 }}>Products</h1>
          <p style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>Manage and publish your software</p>
        </div>
        <button className="btn-primary" style={{ padding: "10px 20px", borderRadius: 12, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} /> New Product
        </button>
      </div>

      {/* Quick create form */}
      {showForm && (
        <div style={{ background: C.dark2, borderRadius: 16, padding: 28, border: `1px solid ${C.pink}30`, marginBottom: 24 }}>
          <h3 className="font-syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>New Product</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Product Name</label><input className="input-field" placeholder="My Awesome App" /></div>
            <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Category</label><input className="input-field" placeholder="Dev Tools" /></div>
            <div><label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Price</label><input className="input-field" placeholder="$49" /></div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Description</label>
            <textarea className="input-field" placeholder="Describe your product..." style={{ resize: "vertical", minHeight: 80 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14 }}>Create Product</button>
            <button className="btn-ghost" style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14 }} onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.map((p, i) => (
          <div key={i} style={{ background: C.dark2, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.borderGlass}`, display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.border}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderGlass}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {"📦🤖📊🚀"[i]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span className="font-syne" style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span>
                <span className={p.status === "published" ? "badge-green" : "badge-orange"} style={{ fontSize: 11 }}>{p.status}</span>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: C.textMuted }}>
                <span>{p.cat}</span>
                <span>v{p.version}</span>
                <span>{p.sales} sales</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="font-syne" style={{ fontSize: 18, fontWeight: 800, color: C.pink }}>{p.price}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>per license</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12 }}>Edit</button>
              <button className="btn-ghost" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12 }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. ANALYTICS PAGE
const AnalyticsPage = () => {
  const monthlyData = [
    { label: "Jan", val: 42 }, { label: "Feb", val: 55 }, { label: "Mar", val: 48 },
    { label: "Apr", val: 70 }, { label: "May", val: 65 }, { label: "Jun", val: 88 },
    { label: "Jul", val: 82 }, { label: "Aug", val: 95 },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Analytics</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Deep insights into your product performance</p>

      {/* Metrics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Conversion Rate", val: "6.8%", change: "+2.1%", bg: C.pink },
          { label: "Avg Revenue/User", val: "$42.30", change: "+8.4%", bg: "#3C8DFF" },
          { label: "Churn Rate", val: "3.2%", change: "-0.8%", bg: "#00D46A" },
          { label: "LTV", val: "$284", change: "+15.7%", bg: "#FF9A3C" },
        ].map((m, i) => (
          <div key={i} className="metric-card">
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{m.label}</div>
            <div className="font-syne" style={{ fontSize: 28, fontWeight: 800, color: m.bg }}>{m.val}</div>
            <div style={{ fontSize: 12, color: "#00D46A", marginTop: 6 }}>{m.change} this month</div>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Revenue Trend (Monthly)</div>
          <BarChart data={monthlyData} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "12px 0", borderTop: `1px solid ${C.borderGlass}` }}>
            <div style={{ textAlign: "center" }}>
              <div className="font-syne" style={{ fontSize: 20, fontWeight: 800 }}>$24.8K</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Total Revenue</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="font-syne" style={{ fontSize: 20, fontWeight: 800, color: "#00D46A" }}>+22%</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Growth</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="font-syne" style={{ fontSize: 20, fontWeight: 800 }}>$8.3K</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>MRR</div>
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Conversion Funnel</div>
          {[
            { label: "Visitors", val: 100000, pct: 100 },
            { label: "Signups", val: 8200, pct: 8.2 },
            { label: "Products Created", val: 3100, pct: 3.1 },
            { label: "Published", val: 1400, pct: 1.4 },
            { label: "Paid Customers", val: 340, pct: 0.34 },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{f.label}</span>
                <span style={{ fontSize: 13, color: C.pink, fontWeight: 600 }}>{f.val.toLocaleString()}</span>
              </div>
              <div style={{ height: 6, background: C.dark4, borderRadius: 4 }}>
                <div style={{ height: "100%", width: `${f.pct}%`, background: `linear-gradient(90deg, ${C.pink}, #3C8DFF)`, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort */}
      <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
        <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Retention Cohort Analysis</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "4px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontSize: 11, color: C.textMuted, padding: "0 8px 12px", fontWeight: 600 }}>Cohort</th>
                {["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6"].map(w => (
                  <th key={w} style={{ fontSize: 11, color: C.textMuted, padding: "0 4px 12px", fontWeight: 600, textAlign: "center" }}>{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Feb 2025", [100, 72, 58, 49, 43, 38]],
                ["Mar 2025", [100, 68, 54, 46, 40, 35]],
                ["Apr 2025", [100, 74, 61, 52, 45, "-"]],
                ["May 2025", [100, 71, 57, 48, "-", "-"]],
                ["Jun 2025", [100, 76, 63, "-", "-", "-"]],
              ].map(([cohort, vals], ri) => (
                <tr key={ri}>
                  <td style={{ fontSize: 12, color: C.textSub, padding: "4px 8px", whiteSpace: "nowrap" }}>{cohort}</td>
                  {vals.map((v, ci) => (
                    <td key={ci} style={{ padding: "3px" }}>
                      <div style={{
                        borderRadius: 6, padding: "6px 8px", textAlign: "center",
                        background: v === "-" ? C.dark4 : `${C.pink}${Math.round((v/100)*50+10).toString(16).padStart(2,'0')}`,
                        fontSize: 12, fontWeight: 600,
                        color: v === "-" ? C.textMuted : v > 60 ? C.pink : C.textSub,
                      }}>
                        {v === "-" ? "—" : `${v}%`}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 7. CUSTOMERS PAGE
const CustomersPage = () => {
  const customers = [
    { name: "Sarah Mitchell", email: "sarah@example.com", spend: "$284", products: 3, joined: "Jan 2025", status: "active" },
    { name: "Raj Patel", email: "raj@example.com", spend: "$49", products: 1, joined: "Feb 2025", status: "active" },
    { name: "Emily Torres", email: "emily@example.com", spend: "$138", products: 2, joined: "Dec 2024", status: "active" },
    { name: "Marcus Lee", email: "marcus@example.com", spend: "$29", products: 1, joined: "Mar 2025", status: "churned" },
    { name: "Priya Singh", email: "priya@example.com", spend: "$198", products: 2, joined: "Nov 2024", status: "active" },
    { name: "Tom Walsh", email: "tom@example.com", spend: "$89", products: 1, joined: "Feb 2025", status: "active" },
  ];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800 }}>Customers</h1>
          <p style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}>Manage and track your buyers</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.dark3, borderRadius: 10, padding: "8px 16px" }}>
            <Icon name="search" size={15} color={C.textMuted} />
            <input style={{ background: "transparent", border: "none", outline: "none", color: C.textPrimary, fontSize: 13, width: 180 }} placeholder="Search customers..." />
          </div>
          <button className="btn-ghost" style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13 }}>Export CSV</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Customers", val: "1,847" },
          { label: "Active (30d)", val: "1,204" },
          { label: "Avg LTV", val: "$284" },
          { label: "Support Tickets", val: "12" },
        ].map((s, i) => (
          <div key={i} className="metric-card" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{s.label}</div>
            <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, color: C.pink }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.dark2, borderRadius: 16, border: `1px solid ${C.borderGlass}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.2fr 1fr", padding: "14px 24px", borderBottom: `1px solid ${C.borderGlass}`, background: C.dark3 }}>
          {["Customer","Email","Spend","Products","Joined","Status"].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
          ))}
        </div>
        {customers.map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1.2fr 1fr", padding: "16px 24px", borderBottom: i < customers.length - 1 ? `1px solid ${C.borderGlass}` : "none", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={c.name} size={32} color={[C.pink,"#3C8DFF","#00D46A","#FF9A3C","#A855F7","#06B6D4"][i]} />
              <span style={{ fontSize: 14 }}>{c.name}</span>
            </div>
            <span style={{ fontSize: 13, color: C.textSub }}>{c.email}</span>
            <span className="font-syne" style={{ fontSize: 14, fontWeight: 700, color: C.pink }}>{c.spend}</span>
            <span style={{ fontSize: 13, color: C.textSub }}>{c.products}</span>
            <span style={{ fontSize: 12, color: C.textMuted }}>{c.joined}</span>
            <span className={c.status === "active" ? "badge-green" : "badge-orange"} style={{ width: "fit-content", fontSize: 11 }}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. PAYMENTS PAGE
const PaymentsPage = () => (
  <div style={{ position: "relative", zIndex: 1 }}>
    <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Payments & Billing</h1>
    <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Manage your revenue, payouts, and integrations</p>

    {/* Payment gateways */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
      {[
        { name: "Stripe", status: "Connected", color: "#635BFF", icon: "💳", desc: "Primary gateway for international payments" },
        { name: "Razorpay", status: "Connected", color: "#3395FF", icon: "🏦", desc: "Indian payments — UPI, cards, net banking" },
      ].map((g, i) => (
        <div key={i} style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${g.color}30`, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32 }}>{g.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span className="font-syne" style={{ fontSize: 17, fontWeight: 700 }}>{g.name}</span>
              <span className="badge-green" style={{ fontSize: 11 }}>● {g.status}</span>
            </div>
            <div style={{ fontSize: 13, color: C.textMuted }}>{g.desc}</div>
          </div>
          <button className="btn-ghost" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13 }}>Manage</button>
        </div>
      ))}
    </div>

    {/* Payout info */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Available Balance", val: "$3,240.50", action: "Withdraw", color: C.pink },
        { label: "Pending Payout", val: "$1,892.00", action: "Details", color: "#FF9A3C" },
        { label: "Next Payout Date", val: "Mar 1, 2025", action: "Schedule", color: "#3C8DFF" },
      ].map((p, i) => (
        <div key={i} className="metric-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>{p.label}</div>
          <div className="font-syne" style={{ fontSize: 24, fontWeight: 800, color: p.color }}>{p.val}</div>
          <button className="btn-ghost" style={{ padding: "8px", borderRadius: 8, fontSize: 13, width: "100%", marginTop: "auto" }}>{p.action}</button>
        </div>
      ))}
    </div>

    {/* Recent transactions */}
    <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
      <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Transactions</div>
      {[
        { type: "Sale", desc: "CodeFlow Pro — Sarah M.", amount: "+$49.00", date: "Today, 2:14 PM", status: "completed" },
        { type: "Sale", desc: "AI Writer Studio — Raj P.", amount: "+$29.00", date: "Today, 1:02 PM", status: "completed" },
        { type: "Payout", desc: "Bank transfer — HDFC", amount: "-$1,200.00", date: "Feb 24", status: "completed" },
        { type: "Refund", desc: "Deploy Bot — Marcus L.", amount: "-$19.00", date: "Feb 22", status: "refunded" },
        { type: "Sale", desc: "DataViz Kit — Emily T.", amount: "+$89.00", date: "Feb 21", status: "completed" },
      ].map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 4 ? `1px solid ${C.borderGlass}` : "none" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.type === "Sale" ? `${C.pink}15` : t.type === "Payout" ? `#3C8DFF15` : `#FF9A3C15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={t.type === "Sale" ? "dollar" : t.type === "Payout" ? "download" : "arrow"} size={15} color={t.type === "Sale" ? C.pink : t.type === "Payout" ? "#3C8DFF" : "#FF9A3C"} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.desc}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t.date}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="font-syne" style={{ fontSize: 15, fontWeight: 700, color: t.amount.startsWith("+") ? "#00D46A" : "#FF9A3C" }}>{t.amount}</span>
            <span className={t.status === "completed" ? "badge-green" : "badge-orange"} style={{ fontSize: 11 }}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 9. LICENSES PAGE
const LicensesPage = () => (
  <div style={{ position: "relative", zIndex: 1 }}>
    <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>License Management</h1>
    <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Track and manage software license keys</p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Active Licenses", val: "861", icon: "key" },
        { label: "Devices Activated", val: "2,103", icon: "shield" },
        { label: "Expired", val: "47", icon: "bell" },
        { label: "Avg Devices/License", val: "2.4", icon: "users" },
      ].map((s, i) => (
        <div key={i} className="metric-card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.pink}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={s.icon} size={18} color={C.pink} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
            <div className="font-syne" style={{ fontSize: 22, fontWeight: 800 }}>{s.val}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ background: C.dark2, borderRadius: 16, border: `1px solid ${C.borderGlass}`, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 1fr", padding: "14px 24px", background: C.dark3, borderBottom: `1px solid ${C.borderGlass}` }}>
        {["License Key","Product","Customer","Devices","Expires","Status"].map(h => (
          <span key={h} style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
        ))}
      </div>
      {[
        { key: "SS-A7X2-K9QP-4R8M", product: "CodeFlow Pro", customer: "Sarah M.", devices: "2/3", expires: "Jan 2026", status: "active" },
        { key: "SS-B3Y5-L7WQ-9S2N", product: "AI Writer", customer: "Raj P.", devices: "1/1", expires: "Feb 2026", status: "active" },
        { key: "SS-C8Z4-M2XR-5T6V", product: "DataViz Kit", customer: "Emily T.", devices: "1/3", expires: "Mar 2025", status: "expiring" },
        { key: "SS-D1W9-N8YS-3U4J", product: "Deploy Bot", customer: "Marcus L.", devices: "0/1", expires: "Dec 2024", status: "expired" },
        { key: "SS-E6V3-P4ZT-7Q1H", product: "CodeFlow Pro", customer: "Priya S.", devices: "3/3", expires: "Jan 2026", status: "active" },
      ].map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < 4 ? `1px solid ${C.borderGlass}` : "none", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontFamily: "monospace", color: C.pink, letterSpacing: "0.05em" }}>{l.key}</span>
          <span style={{ fontSize: 13, color: C.textSub }}>{l.product}</span>
          <span style={{ fontSize: 13 }}>{l.customer}</span>
          <span style={{ fontSize: 13, color: C.textSub }}>{l.devices}</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{l.expires}</span>
          <span className={l.status === "active" ? "badge-green" : l.status === "expiring" ? "badge-orange" : "badge-orange"} style={{ fontSize: 11, width: "fit-content" }}>{l.status}</span>
        </div>
      ))}
    </div>
  </div>
);

// 10. MARKETPLACE
const MarketplacePage = ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", "Dev Tools", "Productivity", "Analytics", "DevOps", "AI", "Design"];
  const products = [
    { name: "CodeFlow Pro", cat: "Dev Tools", price: "$49", rating: 4.9, sales: "2.3k", emoji: "📦", desc: "Supercharge your coding workflow" },
    { name: "AI Writer Studio", cat: "AI", price: "$29/mo", rating: 4.7, sales: "1.8k", emoji: "🤖", desc: "AI-powered writing assistant" },
    { name: "DataViz Kit", cat: "Analytics", price: "$89", rating: 4.8, sales: "956", emoji: "📊", desc: "Beautiful data visualizations" },
    { name: "Deploy Bot", cat: "DevOps", price: "$19/mo", rating: 4.6, sales: "3.1k", emoji: "🚀", desc: "One-click deployments" },
    { name: "DesignSync", cat: "Design", price: "$39", rating: 4.5, sales: "721", emoji: "🎨", desc: "Design tokens & handoff tool" },
    { name: "QueryMaster", cat: "Dev Tools", price: "$59", rating: 4.8, sales: "1.2k", emoji: "🔍", desc: "AI SQL query builder" },
    { name: "FlowChart AI", cat: "Productivity", price: "$24/mo", rating: 4.4, sales: "892", emoji: "📋", desc: "Auto-generate flowcharts from text" },
    { name: "PerfWatch", cat: "Analytics", price: "$35", rating: 4.7, sales: "534", emoji: "⚡", desc: "Real-time app performance monitoring" },
  ];
  const filtered = products.filter(p => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: C.dark1, padding: 48, position: "relative" }}>
      <NoiseOverlay />
      <GlowBg x="80%" y="10%" size={600} opacity={0.08} />

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${C.dark1}cc`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.borderGlass}`, padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <span className="font-syne" style={{ fontSize: 16, fontWeight: 800 }}>SellStack</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <button className="btn-ghost" style={{ padding: "8px 18px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("login")}>Login</button>
          <button className="btn-primary" style={{ padding: "8px 18px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("signup")}>Sell software</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 80, position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 className="font-syne" style={{ fontSize: 48, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>Discover great software</h1>
          <p style={{ fontSize: 16, color: C.textSub, marginBottom: 32 }}>Thousands of tools built by indie developers, all in one place.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.dark2, borderRadius: 14, padding: "12px 20px", maxWidth: 600, margin: "0 auto", border: `1px solid ${C.borderGlass}` }}>
            <Icon name="search" size={18} color={C.textMuted} />
            <input style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.textPrimary, fontSize: 16 }} placeholder="Search software..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Cats */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "8px 18px", borderRadius: 100, fontSize: 13, border: `1px solid ${cat === c ? C.pink : C.borderGlass}`, background: cat === c ? `${C.pink}15` : "transparent", color: cat === c ? C.pink : C.textSub, cursor: "pointer", transition: "all 0.2s" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {filtered.map((p, i) => (
            <div key={i} className="product-card" onClick={() => onNavigate("product")}>
              <div style={{ height: 110, background: `linear-gradient(135deg, ${C.pink}15, #3C8DFF10)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                {p.emoji}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{p.cat}</div>
                <div className="font-syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.textSub, marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: C.pink, fontWeight: 700, fontSize: 15 }}>{p.price}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="star" size={11} color="#FFB800" />
                    <span style={{ fontSize: 11, color: C.textSub }}>{p.rating} ({p.sales})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 11. PRODUCT PAGE
const ProductPage = ({ onNavigate }) => (
  <div style={{ minHeight: "100vh", background: C.dark1, position: "relative" }}>
    <NoiseOverlay />
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${C.dark1}cc`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.borderGlass}`, padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("landing")}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: C.pink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
        <span className="font-syne" style={{ fontSize: 16, fontWeight: 800 }}>SellStack</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-ghost" style={{ padding: "8px 18px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("marketplace")}>← Marketplace</button>
        <button className="btn-primary" style={{ padding: "8px 18px", borderRadius: 10, fontSize: 14 }} onClick={() => onNavigate("signup")}>Buy Now</button>
      </div>
    </div>

    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 48px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 48 }}>
        {/* Left */}
        <div>
          {/* Hero image */}
          <div style={{ height: 260, background: `linear-gradient(135deg, ${C.pink}20, #3C8DFF15)`, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, marginBottom: 28, border: `1px solid ${C.borderGlass}` }}>
            📦
          </div>

          {/* Screenshots */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            {["🖥️","📊","⚙️","🎨"].map((e, i) => (
              <div key={i} style={{ flex: 1, height: 64, background: `${C.pink}10`, borderRadius: 10, border: `2px solid ${i === 0 ? C.pink : C.borderGlass}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, cursor: "pointer" }}>{e}</div>
            ))}
          </div>

          <h1 className="font-syne" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>CodeFlow Pro</h1>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span className="tag">Dev Tools</span>
            <span className="badge-green">v2.4.1</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSub }}>
              <Icon name="star" size={13} color="#FFB800" /> 4.9 (287 reviews)
            </span>
          </div>
          <p style={{ fontSize: 15, color: C.textSub, lineHeight: 1.7, marginBottom: 24 }}>
            CodeFlow Pro supercharges your development workflow with AI-powered code completion, intelligent refactoring, and seamless Git integration. Trusted by 2,300+ developers worldwide.
          </p>

          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Key Features</div>
          {["AI code completion & suggestions", "Smart refactoring with one click", "Multi-language support (20+ langs)", "Built-in Git integration", "Real-time collaboration mode", "Custom theme editor"].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, fontSize: 14, color: C.textSub }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${C.pink}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="check" size={10} color={C.pink} />
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* Right - purchase panel */}
        <div>
          <div style={{ background: C.dark2, borderRadius: 20, padding: 28, border: `1px solid ${C.borderGlass}`, position: "sticky", top: 90 }}>
            <div className="font-syne" style={{ fontSize: 36, fontWeight: 800, color: C.pink, marginBottom: 4 }}>$49</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>One-time license · Lifetime updates</div>

            {[
              { plan: "Solo", price: "$49", features: ["1 device", "Lifetime updates", "Email support"] },
              { plan: "Team", price: "$149", features: ["5 devices", "Lifetime updates", "Priority support", "Team features"] },
            ].map((p, i) => (
              <div key={i} style={{
                borderRadius: 12, padding: "14px 16px", marginBottom: 12,
                border: `2px solid ${i === 0 ? C.pink : C.borderGlass}`,
                background: i === 0 ? `${C.pink}08` : "transparent",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="font-syne" style={{ fontWeight: 700 }}>{p.plan}</span>
                  <span style={{ color: C.pink, fontWeight: 700 }}>{p.price}</span>
                </div>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: C.textMuted, marginBottom: 2 }}>
                    <Icon name="check" size={10} color="#00D46A" /> {f}
                  </div>
                ))}
              </div>
            ))}

            <button className="btn-primary glow-pulse" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 16, marginTop: 8 }} onClick={() => onNavigate("signup")}>
              Buy Now — $49
            </button>
            <button className="btn-ghost" style={{ width: "100%", padding: "12px", borderRadius: 12, fontSize: 14, marginTop: 10 }}>
              Try free for 14 days
            </button>

            <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
              {["🔒 Secure checkout","💳 All cards","↩️ 14-day refund"].map(t => (
                <span key={t} style={{ fontSize: 11, color: C.textMuted }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 12. SETTINGS PAGE
const SettingsPage = () => {
  const [notifications, setNotifications] = useState({ email: true, sales: true, updates: false, marketing: false });
  const [tab, setTab] = useState("account");
  const tabs = ["account", "security", "notifications", "billing", "privacy"];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Settings</h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Manage your account preferences</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13, border: `1px solid ${tab === t ? C.pink : C.borderGlass}`, background: tab === t ? `${C.pink}15` : "transparent", color: tab === t ? C.pink : C.textSub, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        {tab === "account" && (
          <div style={{ background: C.dark2, borderRadius: 16, padding: 28, border: `1px solid ${C.borderGlass}` }}>
            <div className="font-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>Profile Information</div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 28 }}>
              <Avatar name="Alex" size={64} />
              <div>
                <button className="btn-ghost" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, marginRight: 8 }}>Change photo</button>
                <button className="btn-ghost" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13 }}>Remove</button>
              </div>
            </div>
            {[["Full Name","Alex Kumar"],["Username","@alexkumar"],["Email","alex@example.com"],["Website","alexkumar.dev"]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
                <input className="input-field" defaultValue={val} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 6 }}>Bio</label>
              <textarea className="input-field" defaultValue="Indie developer building tools for developers" style={{ resize: "vertical", minHeight: 80 }} />
            </div>
            <button className="btn-primary" style={{ padding: "10px 24px", borderRadius: 10, fontSize: 14 }}>Save changes</button>
          </div>
        )}

        {tab === "notifications" && (
          <div style={{ background: C.dark2, borderRadius: 16, padding: 28, border: `1px solid ${C.borderGlass}` }}>
            <div className="font-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>Notifications</div>
            {[
              { key: "email", label: "Email notifications", desc: "Receive emails for important updates" },
              { key: "sales", label: "Sale alerts", desc: "Get notified immediately on new sales" },
              { key: "updates", label: "Platform updates", desc: "News and feature announcements" },
              { key: "marketing", label: "Marketing emails", desc: "Tips, tutorials, and best practices" },
            ].map(n => (
              <div key={n.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${C.borderGlass}` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{n.label}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{n.desc}</div>
                </div>
                <div
                  onClick={() => setNotifications(p => ({ ...p, [n.key]: !p[n.key] }))}
                  style={{
                    width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                    background: notifications[n.key] ? C.pink : C.dark4,
                    position: "relative",
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: notifications[n.key] ? 23 : 3, transition: "left 0.2s" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {(tab === "security" || tab === "billing" || tab === "privacy") && (
          <div style={{ background: C.dark2, borderRadius: 16, padding: 28, border: `1px solid ${C.borderGlass}` }}>
            <div className="font-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 24, textTransform: "capitalize" }}>{tab}</div>
            <div style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7 }}>
              {tab === "security" && "Manage your password, two-factor authentication, and active sessions."}
              {tab === "billing" && "View your subscription, payment methods, and billing history."}
              {tab === "privacy" && "Control your data, visibility settings, and download your data."}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              {(tab === "security" ? ["Change password","Enable 2FA","View active sessions","Revoke all sessions"] :
                tab === "billing" ? ["View invoices","Update payment method","Cancel subscription","Download tax documents"] :
                ["Download my data","Delete account","Cookie preferences","Privacy policy"]).map(a => (
                <button key={a} className="btn-ghost" style={{ padding: "12px 16px", borderRadius: 10, fontSize: 14, textAlign: "left" }}>{a} →</button>
              ))}
            </div>
          </div>
        )}

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
            <div className="font-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Plan</div>
            <div style={{ display: "flex", justify: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="tag">PRO</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.pink }}>$29/mo</span>
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.6 }}>Unlimited products, advanced analytics, priority support.</div>
            <button className="btn-primary" style={{ width: "100%", padding: "10px", borderRadius: 10, fontSize: 14 }}>Manage Plan</button>
          </div>
          <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
            <div className="font-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Danger Zone</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16 }}>These actions are irreversible.</div>
            <button style={{ width: "100%", padding: "10px", borderRadius: 10, fontSize: 14, background: "transparent", border: "1px solid #FF5F5730", color: "#FF5F57", cursor: "pointer" }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 13. ADMIN PAGE
const AdminPage = () => (
  <div style={{ position: "relative", zIndex: 1 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
      <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 800 }}>Admin Panel</h1>
      <span className="tag" style={{ background: "#FF5F5715", color: "#FF5F57" }}>ADMIN</span>
    </div>
    <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Platform oversight and moderation</p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Total Users", val: "12,847", color: C.pink },
        { label: "Pending Reviews", val: "23", color: "#FF9A3C" },
        { label: "Fraud Alerts", val: "4", color: "#FF5F57" },
        { label: "Platform Revenue", val: "$84,200", color: "#00D46A" },
      ].map((s, i) => (
        <div key={i} className="metric-card">
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{s.label}</div>
          <div className="font-syne" style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
      {/* Pending products */}
      <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
        <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Pending Approval</div>
        {[
          { name: "NeuralSync SDK", creator: "dev@neuralsync.io", cat: "AI" },
          { name: "CloudDeploy CLI", creator: "tom@example.com", cat: "DevOps" },
          { name: "PixelCraft Pro", creator: "nina@studio.design", cat: "Design" },
        ].map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.borderGlass}` : "none" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{p.creator} · {p.cat}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, background: `${C.pink}20`, border: `1px solid ${C.pink}40`, color: C.pink, cursor: "pointer" }}>Approve</button>
              <button style={{ padding: "5px 12px", borderRadius: 7, fontSize: 12, background: "transparent", border: `1px solid ${C.borderGlass}`, color: C.textMuted, cursor: "pointer" }}>Reject</button>
            </div>
          </div>
        ))}
      </div>

      {/* Fraud alerts */}
      <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid #FF5F5720` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div className="font-syne" style={{ fontSize: 16, fontWeight: 700 }}>Fraud Alerts</div>
          <span style={{ background: "#FF5F5720", color: "#FF5F57", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>4 NEW</span>
        </div>
        {[
          { desc: "Multiple refund requests", user: "user_7a2x", severity: "high" },
          { desc: "Unusual download pattern", user: "user_9k4m", severity: "medium" },
          { desc: "Chargebacks detected", user: "user_2p8n", severity: "high" },
          { desc: "VPN abuse detected", user: "user_5r1q", severity: "low" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.borderGlass}` : "none" }}>
            <div>
              <div style={{ fontSize: 13 }}>{a.desc}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{a.user}</div>
            </div>
            <span style={{ background: a.severity === "high" ? "#FF5F5720" : a.severity === "medium" ? "#FF9A3C20" : "#FFB80020", color: a.severity === "high" ? "#FF5F57" : a.severity === "medium" ? "#FF9A3C" : "#FFB800", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 600 }}>
              {a.severity}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* System health */}
    <div style={{ background: C.dark2, borderRadius: 16, padding: 24, border: `1px solid ${C.borderGlass}` }}>
      <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>System Health</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {[
          { service: "API Gateway", uptime: "99.98%", status: "ok" },
          { service: "Auth Service", uptime: "100%", status: "ok" },
          { service: "Payments", uptime: "99.95%", status: "ok" },
          { service: "CDN / Storage", uptime: "99.99%", status: "ok" },
          { service: "Email Worker", uptime: "97.2%", status: "warn" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.dark3, borderRadius: 12, padding: "14px 16px", border: `1px solid ${s.status === "warn" ? "#FF9A3C30" : C.borderGlass}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "ok" ? "#00D46A" : "#FF9A3C" }} />
              <span style={{ fontSize: 11, color: C.textMuted }}>{s.service}</span>
            </div>
            <div className="font-syne" style={{ fontSize: 18, fontWeight: 800, color: s.status === "ok" ? "#00D46A" : "#FF9A3C" }}>{s.uptime}</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>uptime</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SellStack() {
  const [screen, setScreen] = useState("landing");

  const appScreens = ["dashboard","products","analytics","customers","payments","licenses","settings","admin"];
  const isAppScreen = appScreens.includes(screen);

  const navigate = (s) => setScreen(s);

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <LandingPage onNavigate={navigate} />;
      case "login": return <AuthScreen type="login" onNavigate={navigate} />;
      case "signup": return <AuthScreen type="signup" onNavigate={navigate} />;
      case "marketplace": return <MarketplacePage onNavigate={navigate} />;
      case "product": return <ProductPage onNavigate={navigate} />;
      case "dashboard": return <DashboardHome onNavigate={navigate} />;
      case "products": return <ProductsPage onNavigate={navigate} />;
      case "analytics": return <AnalyticsPage />;
      case "customers": return <CustomersPage />;
      case "payments": return <PaymentsPage />;
      case "licenses": return <LicensesPage />;
      case "settings": return <SettingsPage />;
      case "admin": return <AdminPage />;
      default: return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      {isAppScreen ? (
        <AppLayout onNavigate={navigate} currentScreen={screen}>
          {renderScreen()}
        </AppLayout>
      ) : (
        renderScreen()
      )}
    </>
  );
}
