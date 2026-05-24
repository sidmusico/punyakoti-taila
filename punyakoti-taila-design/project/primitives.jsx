// ============================================================
// Punyakoti Taila — shared primitives (icons, bottles, logo)
// ============================================================

// ----- Lucide-style line icons (inline so they always render) -----
const Icon = {
  search: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  bag: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>,
  user: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>,
  heart: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill={p.fill||"none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z"/></svg>,
  menu: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>,
  close: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  arrowRight: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  arrowLeft: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>,
  arrowUpRight: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>,
  check: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12 5 5L20 6"/></svg>,
  plus: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  minus: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14"/></svg>,
  star: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill={p.fill||"currentColor"} stroke="currentColor" strokeWidth="1" strokeLinejoin="round"><path d="m12 3 2.7 5.7L21 9.5l-4.5 4.3L18 21l-6-3.2L6 21l1.5-7.2L3 9.5l6.3-.8L12 3Z"/></svg>,
  leaf: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19c0-9 7-15 16-15 0 9-6 15-15 15-1 0-1 0-1 0Z"/><path d="M5 19 16 8"/></svg>,
  truck: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h12v10H2zM14 11h4l3 3v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  shield: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  drop: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/></svg>,
  home: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>,
  grid: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  filter: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z"/></svg>,
  chevDown: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  chevRight: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>,
  package: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7 12 3l9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>,
  mail: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>,
  phone: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4a2 2 0 0 1-2 2c-9-1-16-8-17-17a2 2 0 0 1 2-1Z"/></svg>,
  pin: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  credit: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>,
  lock: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>,
  clock: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  refresh: (p={}) => <svg viewBox="0 0 24 24" width={p.size||20} height={p.size||20} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>,
  signal: (p={}) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="currentColor"><rect x="2" y="11" width="3" height="5" rx="0.5"/><rect x="7" y="8" width="3" height="8" rx="0.5"/><rect x="12" y="5" width="3" height="11" rx="0.5"/><rect x="17" y="2" width="3" height="14" rx="0.5"/></svg>,
  wifi: (p={}) => <svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 9c5-5 15-5 20 0M5 13c4-4 10-4 14 0M9 17c1.5-1.5 4.5-1.5 6 0"/></svg>,
  battery: (p={}) => <svg viewBox="0 0 28 16" width={p.size||24} height={p.size||14} fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="22" height="14" rx="3"/><rect x="3" y="3" width="18" height="10" rx="1" fill="currentColor"/><rect x="24" y="5" width="2" height="6" rx="1" fill="currentColor"/></svg>,
};

// ----- Brand wordmark (HTML-based, so it uses our fonts) -----
function Wordmark({ size = 22, color = "var(--green-900)", sub = true }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, color }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: size,
        letterSpacing: "-0.01em",
      }}>
        Punyakoti<span style={{ color: "var(--mustard-500)" }}>·</span>
      </span>
      {sub && (
        <span style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: size * 0.32,
          letterSpacing: "0.32em",
          marginTop: size * 0.18,
          color: "var(--wood-600)",
        }}>
          T A I L A
        </span>
      )}
    </div>
  );
}

// ----- Monogram (cleaner inline SVG) -----
function Monogram({ size = 40, dark = false }) {
  const bg = dark ? "var(--cream-100)" : "var(--green-900)";
  const fg = dark ? "var(--green-900)" : "var(--cream-100)";
  return (
    <svg width={size} height={size} viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="29" fill="none" stroke={bg} strokeWidth="0.8" opacity="0.4" />
      <circle cx="30" cy="30" r="26" fill={bg} />
      <text x="30" y="36" textAnchor="middle"
        fontFamily="Cormorant Garamond, serif" fontWeight="500"
        fontSize="22" fill={fg} letterSpacing="-1">PT</text>
      <circle cx="30" cy="46" r="0.9" fill="var(--mustard-500)" />
    </svg>
  );
}

// ----- Stylized cow mark (Punyakoti motif), simplified -----
function CowMark({ size = 80, color = "currentColor", opacity = 1 }) {
  return (
    <svg width={size} height={size * 0.625} viewBox="0 0 160 100" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
      <path d="M28 64 C28 50 38 44 50 44 L96 44 C108 44 116 38 122 30 C126 24 130 22 134 24 C138 26 138 32 134 38 L128 46 C132 50 134 56 134 62 L134 72"/>
      <path d="M28 64 L28 78 M40 64 L40 80 M104 64 L104 80 M116 64 L116 80"/>
      <path d="M58 44 C60 36 66 32 72 36"/>
      <path d="M124 26 C120 18 116 16 112 18 M132 24 C136 16 140 14 144 16"/>
      <path d="M28 64 C22 64 18 66 18 72 C18 76 20 78 22 78"/>
      <circle cx="124" cy="34" r="1.1" fill={color} stroke="none"/>
    </svg>
  );
}

// ----- Bottle illustration (parametric SVG, themable by oil type) -----
function Bottle({ variant = "sesame", size = 200, showLabel = true }) {
  const palettes = {
    sesame:   { oil1: "#3E2A14", oil2: "#1A1108", name: "Sesame · Til", id: "SESAME · TIL" },
    coconut:  { oil1: "#F6E5B8", oil2: "#E5D096", name: "Coconut",     id: "COCONUT · NARIYAL" },
    groundnut:{ oil1: "#A86E2C", oil2: "#5C3A14", name: "Groundnut",   id: "GROUNDNUT · MOONGFALI" },
    mustard:  { oil1: "#C99837", oil2: "#8C6516", name: "Mustard",     id: "MUSTARD · SARSON" },
    sunflower:{ oil1: "#E6C168", oil2: "#9F7B25", name: "Sunflower",   id: "SUNFLOWER · SURYAMUKHI" },
    blackSes: { oil1: "#1F1A12", oil2: "#0A0805", name: "Black Sesame",id: "BLACK SESAME · KAALA TIL" },
    castor:   { oil1: "#EFE4C5", oil2: "#C9B98A", name: "Castor",      id: "CASTOR · ERANDA · WELLNESS" },
  };
  const p = palettes[variant] || palettes.sesame;
  const gid = `g-${variant}-${Math.random().toString(36).slice(2,7)}`;
  return (
    <svg width={size} height={size * 2} viewBox="0 0 100 200">
      <defs>
        <linearGradient id={`oil-${gid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={p.oil1}/>
          <stop offset="1" stopColor={p.oil2}/>
        </linearGradient>
        <linearGradient id={`hi-${gid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0"/>
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.20"/>
          <stop offset="0.55" stopColor="#fff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="36" y="6" width="28" height="20" rx="3" fill="#6E4A28"/>
      <rect x="36" y="6" width="28" height="6" rx="2" fill="#8B6238"/>
      <rect x="42" y="24" width="16" height="22" fill={`url(#oil-${gid})`}/>
      {/* body */}
      <path d="M28 60 Q28 48 42 46 L58 46 Q72 48 72 60 L72 184 Q72 192 64 192 L36 192 Q28 192 28 184 Z" fill={`url(#oil-${gid})`}/>
      <path d="M28 60 Q28 48 42 46 L58 46 Q72 48 72 60 L72 184 Q72 192 64 192 L36 192 Q28 192 28 184 Z" fill={`url(#hi-${gid})`}/>
      {showLabel && (
        <>
          <rect x="32" y="100" width="36" height="60" rx="2" fill="#FBF7EC"/>
          <text x="50" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="9" fill="#1A2E18">Punyakoti</text>
          <text x="50" y="136" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="4.2" letterSpacing="1.2" fill="#6E4A28">{p.id}</text>
          <line x1="38" y1="142" x2="62" y2="142" stroke="#C99837" strokeWidth="0.7"/>
          <text x="50" y="152" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="3.3" letterSpacing="1" fill="#6B6F5E">WOOD-PRESSED · 500 ML</text>
        </>
      )}
    </svg>
  );
}

// ----- Photo placeholder (warm gradient that reads as imagery) -----
function PhotoPlaceholder({ children, style = {}, tone = "deep", grain = true }) {
  const tones = {
    deep:   "linear-gradient(135deg, #244023 0%, #0F1A0E 70%, #2B1C0F 100%)",
    warm:   "linear-gradient(135deg, #8B6238 0%, #4A331C 60%, #2B1C0F 100%)",
    field:  "linear-gradient(135deg, #94AC8C 0%, #3E6039 70%, #1A2E18 100%)",
    sun:    "linear-gradient(135deg, #DEB04D 0%, #B0801E 60%, #4A331C 100%)",
    cream:  "linear-gradient(135deg, #F5EFE0 0%, #DCD0B3 100%)",
  };
  return (
    <div className={grain ? "pt-grain" : ""} style={{
      background: tones[tone] || tones.deep,
      borderRadius: "inherit",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ----- Header chrome -----
function DesktopHeader({ scrolled = true, cartCount = 2, dark = false }) {
  const fg = dark ? "var(--cream-100)" : "var(--green-900)";
  return (
    <div className={scrolled && !dark ? "pt-header-blur" : ""} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 48px",
      borderBottom: `1px solid ${dark ? "rgba(245,239,224,0.12)" : "var(--cream-400)"}`,
      color: fg,
      background: dark ? "var(--green-950)" : (scrolled ? "transparent" : "var(--cream-200)"),
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <Wordmark size={20} color={fg} sub={false} />
        <nav style={{ display: "flex", gap: 28, fontSize: 13, fontWeight: 500, letterSpacing: "-0.005em" }}>
          <a style={{ color: fg }}>Oils</a>
          <a style={{ color: fg }}>Wellness</a>
          <a style={{ color: fg }}>Gift sets</a>
          <a style={{ color: fg }}>Our story</a>
          <a style={{ color: fg }}>Journal</a>
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22, color: fg }}>
        <Icon.search />
        <Icon.user />
        <Icon.heart />
        <div style={{ position: "relative" }}>
          <Icon.bag />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -6, right: -8,
              background: "var(--mustard-500)", color: "var(--green-900)",
              fontSize: 10, fontWeight: 700,
              width: 16, height: 16, borderRadius: 8,
              display: "grid", placeItems: "center",
            }}>{cartCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ----- Mobile top header chrome -----
function MobileHeader({ title, back = false, cart = true, action = null }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px 12px",
      borderBottom: "1px solid var(--cream-400)",
      background: "rgba(251,247,236,0.92)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 30,
    }}>
      {back ? (
        <button style={{ background: "none", border: 0, padding: 4, color: "var(--green-900)" }}>
          <Icon.arrowLeft />
        </button>
      ) : <Monogram size={28} />}
      <div style={{
        fontFamily: title ? "var(--font-body)" : "var(--font-display)",
        fontWeight: title ? 600 : 500,
        fontSize: title ? 15 : 16,
        color: "var(--green-900)",
        letterSpacing: title ? "-0.01em" : "-0.01em",
      }}>{title || "Punyakoti"}</div>
      <div style={{ display: "flex", gap: 12, color: "var(--green-900)" }}>
        {action || (
          <>
            <Icon.search />
            {cart && (
              <div style={{ position: "relative" }}>
                <Icon.bag />
                <span style={{
                  position: "absolute", top: -4, right: -6,
                  background: "var(--mustard-500)", color: "var(--green-900)",
                  fontSize: 9, fontWeight: 700,
                  width: 14, height: 14, borderRadius: 7,
                  display: "grid", placeItems: "center",
                }}>2</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ----- Bottom tab nav (mobile) -----
function MobileBottomNav({ active = "home" }) {
  const tabs = [
    { id: "home", label: "Shop", Ico: Icon.home },
    { id: "shop", label: "Oils", Ico: Icon.grid },
    { id: "saved", label: "Saved", Ico: Icon.heart },
    { id: "orders", label: "Orders", Ico: Icon.package },
    { id: "me", label: "Account", Ico: Icon.user },
  ];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(251,247,236,0.94)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid var(--cream-400)",
      padding: "10px 8px 22px",
      display: "flex", justifyContent: "space-around",
    }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        return (
          <div key={t.id} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: isActive ? "var(--green-900)" : "var(--ink-400)",
            fontSize: 10, fontWeight: 500, letterSpacing: "0.05em",
            textTransform: "uppercase",
            minWidth: 56,
          }}>
            <t.Ico size={20} />
            {t.label}
          </div>
        );
      })}
    </div>
  );
}

// ----- Trust strip -----
function TrustStrip({ items, dark = false }) {
  const fg = dark ? "var(--cream-100)" : "var(--green-900)";
  const muted = dark ? "rgba(245,239,224,0.62)" : "var(--ink-500)";
  const def = items || [
    { Ico: Icon.leaf, label: "Wood-pressed", sub: "Slow · cold · single-batch" },
    { Ico: Icon.shield, label: "Lab tested", sub: "Every batch, every farm" },
    { Ico: Icon.truck, label: "Free shipping", sub: "On orders over ₹999" },
    { Ico: Icon.refresh, label: "30-day return", sub: "Unopened bottles" },
  ];
  return (
    <div style={{ display: "flex", gap: 0, color: fg }}>
      {def.map((it, i) => (
        <div key={i} style={{
          flex: 1, padding: "26px 24px",
          borderRight: i < def.length - 1 ? `1px solid ${dark ? "rgba(245,239,224,0.12)" : "var(--cream-400)"}` : "none",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          <it.Ico size={22} />
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, marginTop: 8 }}>{it.label}</div>
          <div style={{ fontSize: 12, color: muted }}>{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ----- Status pill (small inline) -----
function Pill({ tone = "green", children }) {
  const cls = `pt-badge pt-badge--${tone}`;
  return <span className={cls}>{children}</span>;
}

// ----- Star row -----
function Stars({ value = 5, size = 12, count = null }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--mustard-500)" }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < value ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="m12 3 2.7 5.7L21 9.5l-4.5 4.3L18 21l-6-3.2L6 21l1.5-7.2L3 9.5l6.3-.8L12 3Z"/></svg>
      ))}
      {count !== null && <span style={{ color: "var(--ink-500)", fontSize: size, marginLeft: 4 }}>{count}</span>}
    </div>
  );
}

// Share globally
Object.assign(window, {
  Icon, Wordmark, Monogram, CowMark, Bottle, PhotoPlaceholder,
  DesktopHeader, MobileHeader, MobileBottomNav, TrustStrip, Pill, Stars,
});
