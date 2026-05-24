// ============================================================
// home-animated.jsx — new hero sections + scroll/intersection
// powered animations for the homepage.
// ============================================================

// ---------- HOOKS ----------
function useInView(opts = { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || seen) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }, opts);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [seen]);
  return [ref, seen];
}

function findScrollParent(el) {
  let p = el?.parentElement;
  while (p) {
    const oy = getComputedStyle(p).overflowY;
    if (oy === "auto" || oy === "scroll") return p;
    p = p.parentElement;
  }
  return null;
}

// returns 0..1 progress as section scrolls through viewport
function useScrollProgress(ref) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) return;
    const scroller = findScrollParent(ref.current);
    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const scrollerH = scroller ? scroller.clientHeight : window.innerHeight;
        // start: top of section enters viewport (r.top = scrollerH)
        // end: bottom of section leaves viewport (r.bottom = 0)
        // But for scroll-expand we want progress over the SECTION itself.
        const sectionH = ref.current.offsetHeight;
        const scrolled = scrollerH - r.top;     // 0 when entering, > when scrolled past start
        const total = sectionH + scrollerH * 0;  // we want full progress over sectionH - scrollerH
        const denom = Math.max(1, sectionH - scrollerH);
        const raw = (scrolled - scrollerH) / denom; // 0 when sticky starts, 1 when ends
        setP(Math.max(0, Math.min(1, raw)));
      });
    };
    const target = scroller || window;
    target.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

// ---------- FadeUp wrapper ----------
function FadeUp({ children, delay = 0, y = 28, as: As = "div", style = {}, ...rest }) {
  const [ref, seen] = useInView();
  return (
    <As ref={ref} className={"pt-fade-up" + (seen ? " is-in" : "")} style={{
      transitionDelay: `${delay}s`,
      ...style,
    }} {...rest}>
      {children}
    </As>
  );
}

// ---------- Animated counter ----------
function AnimatedNumber({ to = 100, duration = 1600, prefix = "", suffix = "", format = (n) => Math.round(n).toLocaleString("en-IN") }) {
  const [ref, seen] = useInView();
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuart
      const e = 1 - Math.pow(1 - t, 4);
      setVal(to * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);
  return <span ref={ref}>{prefix}{format(val)}{suffix}</span>;
}

// ---------- Marquee strip ----------
function Marquee({ items, dark = false, fast = false, reverse = false }) {
  const list = [...items, ...items];
  return (
    <div className="pt-marquee" style={{
      overflow: "hidden",
      borderTop: `1px solid ${dark ? "rgba(245,239,224,0.1)" : "var(--cream-400)"}`,
      borderBottom: `1px solid ${dark ? "rgba(245,239,224,0.1)" : "var(--cream-400)"}`,
      background: dark ? "var(--green-950)" : "var(--cream-100)",
      color: dark ? "var(--cream-100)" : "var(--green-900)",
      padding: "12px 0",
    }}>
      <div className={"pt-marquee-track" + (fast ? " pt-marquee-fast" : "") + (reverse ? " pt-marquee-rev" : "")}>
        {list.map((it, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "0 32px" }}>
            {it.live && <span className="pt-pulse-dot"/>}
            <span style={{ fontFamily: "var(--font-display)", fontStyle: it.italic ? "italic" : "normal", fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em" }}>
              {it.text}
            </span>
            {it.stamp && <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
              color: dark ? "var(--mustard-400)" : "var(--mustard-600)",
              textTransform: "uppercase",
            }}>{it.stamp}</span>}
            <span style={{ color: dark ? "rgba(245,239,224,0.25)" : "var(--cream-400)", margin: "0 6px" }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Scroll-expand hero (adapted) ----------
function ScrollExpandHero({ eyebrow, title, italic, scrollHint = "Scroll · the press unfolds", height = "260vh", tone = "deep" }) {
  const ref = React.useRef(null);
  const p = useScrollProgress(ref);

  // Two-phase animation:
  // Phase 1 (p: 0 → 0.5): title is full-size at top, photo card grows from a small card below to fill.
  // Phase 2 (p: 0.5 → 1): title slides apart and fades; photo card dominates.
  const phase1 = Math.min(1, p / 0.5);          // 0..1 during first half
  const phase2 = Math.max(0, (p - 0.5) / 0.5);  // 0..1 during second half

  const mediaW = 420 + phase1 * 900;            // 420 → 1320 px (clamped to vw)
  const mediaH = 260 + phase1 * 480;            // 260 → 740 px
  const textShift = phase2 * 28;                // vw, only in phase 2
  const titleOpacity = 1 - phase2 * 0.9;        // stays full opacity through phase 1
  const titleY = -phase1 * 40;                  // lifts up slightly to make room
  const labelOpacity = phase1 > 0.5 ? (phase1 - 0.5) / 0.5 : 0;
  const scrollHintOpacity = Math.max(0, 1 - p * 3);

  return (
    <section ref={ref} style={{ height, position: "relative", background: "var(--cream-200)" }}>
      <div className="pt-scrollexpand-sticky">
        {/* background tone shifts in with phase2 */}
        <div style={{
          position: "absolute", inset: 0, opacity: phase2,
          transition: "opacity .15s linear",
        }}>
          <PhotoPlaceholder tone={tone} style={{ width: "100%", height: "100%", borderRadius: 0 }}/>
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, rgba(15,26,14,${0.2 + phase2*0.2}) 0%, rgba(15,26,14,${0.45 + phase2*0.3}) 100%)`,
          }}/>
        </div>

        {/* Title — anchored to top half of sticky frame */}
        <div style={{
          position: "absolute", top: "10%", left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: "0.4em",
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: "clamp(48px, 9vw, 124px)",
          lineHeight: 1, letterSpacing: "-0.025em",
          color: phase2 > 0.3 ? "var(--cream-100)" : "var(--green-900)",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          transition: "color .3s linear, transform .15s linear, opacity .15s linear",
          textAlign: "center", padding: "0 24px",
          pointerEvents: "none",
        }}>
          <span style={{ transform: `translateX(-${textShift}vw)`, display: "inline-block", transition: "transform .15s linear" }}>{title}</span>
          <span style={{ transform: `translateX(${textShift}vw)`, display: "inline-block", transition: "transform .15s linear", fontStyle: "italic", color: "var(--mustard-500)" }}>{italic}</span>
        </div>

        {/* eyebrow above title */}
        {eyebrow && (
          <div className="pt-eyebrow" style={{
            position: "absolute", top: "6%", left: 0, right: 0, textAlign: "center",
            color: phase2 > 0.3 ? "var(--mustard-400)" : "var(--green-800)",
            transition: "color .3s linear",
            opacity: titleOpacity,
          }}>{eyebrow}</div>
        )}

        {/* Media card — anchored to BOTTOM half of sticky frame, grows upward */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: `calc(8% + ${phase2 * 8}%)`,
          transform: `translateX(-50%) translateY(${phase2 * -12}%)`,
          width: `min(${mediaW}px, 92vw)`,
          height: `min(${mediaH}px, 62vh)`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `0 ${30 + phase1*30}px ${60 + phase1*40}px rgba(15,26,14,${0.35 + phase1*0.2})`,
          transition: "width .15s linear, height .15s linear, box-shadow .15s linear, transform .15s linear, bottom .15s linear",
        }}>
          <PhotoPlaceholder tone="warm" style={{ width: "100%", height: "100%", borderRadius: 0, display: "grid", placeItems: "center", position: "relative" }}>
            <div className="pt-float" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>
              <Bottle variant="sesame" size={Math.max(160, 160 + phase1 * 140)} />
            </div>
            <div style={{
              position: "absolute", bottom: 24, left: 28, right: 28,
              color: "var(--cream-100)", display: "flex", justifyContent: "space-between",
              fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase",
              opacity: labelOpacity, transition: "opacity .3s var(--ease-out)",
            }}>
              <span>Batch #047 · 9-hour press</span>
              <span style={{ color: "var(--mustard-200)" }}>Erode · Tamil Nadu</span>
            </div>
          </PhotoPlaceholder>
        </div>

        {/* scroll hint */}
        <div style={{
          position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
          color: "var(--green-900)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
          opacity: scrollHintOpacity, display: "flex", alignItems: "center", gap: 12,
          mixBlendMode: phase2 > 0.5 ? "screen" : "normal",
        }}>
          <span style={{ width: 20, height: 1, background: "currentColor" }}/>
          {scrollHint}
          <span style={{ width: 20, height: 1, background: "currentColor" }}/>
        </div>
      </div>
    </section>
  );
}

// ---------- Animated stats band ----------
function StatsBand() {
  const stats = [
    { to: 47, suffix: "", l: "Batches", s: "this season alone" },
    { to: 2847, suffix: "", l: "Kitchens", s: "across India" },
    { to: 9, suffix: " hr", l: "Per press", s: "wooden ghani at 38°C", format: (n) => Math.round(n) },
    { to: 4.9, suffix: " / 5", l: "Reviews", s: "from 612 verified buyers", format: (n) => n.toFixed(1) },
  ];
  return (
    <section style={{ padding: "120px 80px", background: "var(--cream-300)", borderTop: "1px solid var(--cream-400)", borderBottom: "1px solid var(--cream-400)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -60, top: -40, opacity: 0.05 }}>
        <CowMark size={420} color="var(--green-900)"/>
      </div>
      <FadeUp>
        <div style={{ maxWidth: 700, marginBottom: 56 }}>
          <div className="pt-eyebrow">By the numbers</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "16px 0 0" }}>
            What slow looks like, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>plainly.</span>
          </h2>
        </div>
      </FadeUp>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, position: "relative" }}>
        {stats.map((s, i) => (
          <FadeUp key={i} delay={i * 0.12}>
            <div style={{ borderTop: "1px solid var(--wood-300)", paddingTop: 24 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 400,
                fontSize: 84, lineHeight: 1, letterSpacing: "-0.03em",
                color: "var(--green-900)",
              }}>
                <AnimatedNumber to={s.to} suffix={s.suffix} format={s.format}/>
              </div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>{s.l}</div>
              <div className="pt-mono-stamp" style={{ marginTop: 6 }}>{s.s}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

// ---------- "Live press" marquee section ----------
function PressBand() {
  const items = [
    { live: true, text: "Pressing now · Sesame", stamp: "Erode · NOV 14" },
    { text: "Bottled this week · Coconut", stamp: "Kollam · NOV 12", italic: true },
    { text: "Settling · Mustard", stamp: "Alwar · NOV 11" },
    { text: "Harvest in · Black sesame", stamp: "Salem · NOV 09", italic: true },
    { text: "Lab cleared · Groundnut", stamp: "Kadapa · NOV 08" },
    { live: true, text: "Press of the week · Sesame", stamp: "Batch #047" },
  ];
  return <Marquee items={items} dark />;
}

// ---------- Kinetic split-text feature (2nd hero) ----------
function PoeticInterlude() {
  return (
    <section style={{
      padding: "180px 80px",
      background: "var(--cream-200)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -100, bottom: -120, opacity: 0.05 }}>
        <CowMark size={520} color="var(--green-900)"/>
      </div>
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <FadeUp>
          <div className="pt-eyebrow" style={{ marginBottom: 24 }}>An aside · from the Wood-Press Diary</div>
        </FadeUp>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1.02, letterSpacing: "-0.025em",
          color: "var(--green-900)", margin: 0,
          display: "flex", flexWrap: "wrap", gap: "0.18em",
        }}>
          {[
            "Refined", "oil", "is", "a", "shortcut.",
          ].map((w, i) => (
            <FadeUp key={i} delay={i * 0.08} y={48} as="span" style={{ display: "inline-block" }}>{w}</FadeUp>
          ))}
        </h2>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400, fontStyle: "italic",
          fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1.02, letterSpacing: "-0.025em",
          color: "var(--mustard-600)", margin: "8px 0 0",
          display: "flex", flexWrap: "wrap", gap: "0.18em",
        }}>
          {[
            "We", "press", "the", "long", "way", "around.",
          ].map((w, i) => (
            <FadeUp key={i} delay={0.4 + i * 0.08} y={48} as="span" style={{ display: "inline-block" }}>{w}</FadeUp>
          ))}
        </h2>
        <FadeUp delay={1.0}>
          <p className="pt-dropcap" style={{ marginTop: 56, maxWidth: 620, fontSize: 18, color: "var(--ink-700)", lineHeight: 1.85 }}>
            The industrial press runs at 240°C with hexane solvent — fast, high-yield, and chemically obedient. The wooden ghani turns at four revolutions per minute, peaks at 38°C, and gives you back exactly half. The other half is what tradition called <i>flavour</i>. We chose half.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Parallax oil row (drifting bottles) ----------
function ParallaxBottleRow() {
  const ref = React.useRef(null);
  const p = useScrollProgress(ref);
  const bottles = ["sesame", "coconut", "groundnut", "mustard", "sunflower", "blackSes"];
  return (
    <section ref={ref} style={{
      padding: "80px 0", background: "var(--green-950)", color: "var(--cream-100)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center", padding: "0 80px" }}>
        <FadeUp>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Six presses · one shelf</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--cream-100)", margin: "16px 0 64px" }}>
            The whole <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>kitchen.</span>
          </h2>
        </FadeUp>
      </div>
      <div style={{
        display: "flex", justifyContent: "center", gap: 40,
        transform: `translateX(${(p - 0.5) * 120}px)`,
        transition: "transform .15s linear",
      }}>
        {bottles.map((v, i) => (
          <div key={v} className={i % 2 === 0 ? "pt-float" : "pt-float-slow"} style={{
            animationDelay: `${i * 0.4}s`,
            transform: `translateY(${Math.sin((p * 4 + i) * Math.PI) * 8}px)`,
          }}>
            <Bottle variant={v} size={160}/>
            <div style={{ textAlign: "center", marginTop: 10, fontFamily: "var(--font-display)", fontSize: 18, color: "var(--cream-100)" }}>
              {{sesame:"Sesame", coconut:"Coconut", groundnut:"Groundnut", mustard:"Mustard", sunflower:"Sunflower", blackSes:"Black Til"}[v]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Wood Press scene (SVG composition that fakes a hero photograph) ----------
// This stands in for real photography. When the team supplies a hi-res shot of
// the press + bottles, drop the image into <img> and remove this SVG.
function WoodPressScene({ animate = true }) {
  return (
    <svg viewBox="0 0 1200 720" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        {/* warm radial background */}
        <radialGradient id="wp-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#5a3920"/>
          <stop offset="55%" stopColor="#2c1a0d"/>
          <stop offset="100%" stopColor="#120a04"/>
        </radialGradient>
        {/* wood grain for press cylinder */}
        <linearGradient id="wp-wood" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#3a2412"/>
          <stop offset="35%"  stopColor="#5d3a1b"/>
          <stop offset="55%"  stopColor="#6f4823"/>
          <stop offset="80%"  stopColor="#3f2814"/>
          <stop offset="100%" stopColor="#1d1108"/>
        </linearGradient>
        {/* bowl gradient */}
        <linearGradient id="wp-bowl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7a4a22"/>
          <stop offset="60%" stopColor="#3d2210"/>
          <stop offset="100%" stopColor="#1a0e06"/>
        </linearGradient>
        {/* bottle glass — amber */}
        <linearGradient id="wp-glass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"  stopColor="#3a1f0a" stopOpacity="0.95"/>
          <stop offset="50%" stopColor="#7d4716" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#2a1607" stopOpacity="0.95"/>
        </linearGradient>
        {/* leaf */}
        <linearGradient id="wp-leaf" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4d6e2a"/>
          <stop offset="100%" stopColor="#2a3f15"/>
        </linearGradient>
        {/* floor wood plank */}
        <linearGradient id="wp-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3a2412"/>
          <stop offset="100%" stopColor="#0e0703"/>
        </linearGradient>
        {/* film grain */}
        <filter id="wp-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="3"/>
          <feColorMatrix values="0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.08 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
        {/* drop shadow */}
        <filter id="wp-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
      </defs>

      {/* background */}
      <rect width="1200" height="720" fill="url(#wp-bg)"/>

      {/* soft top vignette */}
      <rect width="1200" height="720" fill="url(#wp-bg)" opacity="0.4"/>

      {/* leaves left */}
      <g style={animate ? { transformOrigin: "100px 600px", animation: "wp-sway 7s ease-in-out infinite" } : {}}>
        <path d="M40,620 Q90,540 170,520 Q150,580 90,640 Z" fill="url(#wp-leaf)" opacity="0.85"/>
        <path d="M70,660 Q120,580 200,560 Q180,620 110,680 Z" fill="url(#wp-leaf)" opacity="0.75"/>
        <path d="M30,680 Q60,610 140,600 Q110,650 60,700 Z" fill="url(#wp-leaf)" opacity="0.6"/>
      </g>

      {/* wooden floor plank (perspective ellipse) */}
      <ellipse cx="600" cy="640" rx="560" ry="50" fill="url(#wp-floor)" opacity="0.9"/>
      <ellipse cx="600" cy="650" rx="600" ry="60" fill="#0a0502" opacity="0.6"/>

      {/* bowl base (wide flat dish) */}
      <ellipse cx="600" cy="610" rx="320" ry="44" fill="url(#wp-bowl)"/>
      <ellipse cx="600" cy="608" rx="320" ry="20" fill="#5a3217" opacity="0.7"/>
      <ellipse cx="600" cy="606" rx="310" ry="14" fill="#3a2010"/>

      {/* small wooden block beneath press */}
      <ellipse cx="600" cy="590" rx="180" ry="22" fill="#2d1a0c"/>
      <ellipse cx="600" cy="586" rx="180" ry="12" fill="#46291a"/>

      {/* central wood press cylinder */}
      <g style={animate ? { transformOrigin: "600px 380px", animation: "wp-ken 14s ease-in-out infinite" } : {}}>
        {/* cylinder body */}
        <rect x="450" y="100" width="300" height="490" fill="url(#wp-wood)"/>
        {/* vertical wood-slat lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1={450 + i * 15.78} y1="100" x2={450 + i * 15.78} y2="590"
            stroke={i % 2 ? "#2a190b" : "#4a2c14"} strokeWidth={i % 3 ? "1.2" : "2"} opacity="0.6"/>
        ))}
        {/* top cap */}
        <ellipse cx="600" cy="100" rx="150" ry="22" fill="#5a3719"/>
        <ellipse cx="600" cy="100" rx="150" ry="14" fill="#3a2110" opacity="0.7"/>
        {/* metal band top */}
        <rect x="450" y="125" width="300" height="8" fill="#1a0e06"/>
        <rect x="450" y="560" width="300" height="8" fill="#1a0e06"/>
        {/* bottom shadow on press */}
        <ellipse cx="600" cy="585" rx="148" ry="14" fill="#000" opacity="0.5"/>
      </g>

      {/* small wooden handle / spout on top */}
      <rect x="585" y="40" width="30" height="80" rx="6" fill="#3a2210"/>
      <ellipse cx="600" cy="40" rx="18" ry="6" fill="#5a3719"/>

      {/* bottle LEFT */}
      <g style={animate ? { transformOrigin: "200px 480px", animation: "wp-float-a 6s ease-in-out infinite" } : {}}>
        <ellipse cx="200" cy="635" rx="80" ry="10" fill="#000" opacity="0.45" filter="url(#wp-soft)"/>
        {/* body */}
        <path d="M150,300 L150,600 Q150,630 200,630 Q250,630 250,600 L250,300 Q250,260 230,250 L230,210 L170,210 L170,250 Q150,260 150,300 Z" fill="url(#wp-glass)"/>
        {/* highlight */}
        <path d="M165,310 Q165,310 165,560" stroke="#c89a4d" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
        <path d="M235,330 Q235,330 235,540" stroke="#1a0d05" strokeWidth="6" strokeLinecap="round" opacity="0.7"/>
        {/* cork */}
        <rect x="178" y="180" width="44" height="32" rx="4" fill="#7a5230"/>
        <rect x="178" y="180" width="44" height="8" fill="#5a3720"/>
        {/* oil inside (peek) */}
        <rect x="158" y="380" width="84" height="240" fill="#7d4716" opacity="0.5" rx="0"/>
        <ellipse cx="200" cy="380" rx="42" ry="6" fill="#a06a25" opacity="0.7"/>
      </g>

      {/* bottle RIGHT */}
      <g style={animate ? { transformOrigin: "1000px 500px", animation: "wp-float-b 7s ease-in-out infinite" } : {}}>
        <ellipse cx="1000" cy="635" rx="65" ry="9" fill="#000" opacity="0.45" filter="url(#wp-soft)"/>
        <path d="M960,360 L960,605 Q960,630 1000,630 Q1040,630 1040,605 L1040,360 Q1040,328 1024,320 L1024,290 L976,290 L976,320 Q960,328 960,360 Z" fill="url(#wp-glass)"/>
        <path d="M972,370 Q972,370 972,580" stroke="#c89a4d" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M1028,390 Q1028,390 1028,560" stroke="#1a0d05" strokeWidth="5" strokeLinecap="round" opacity="0.7"/>
        <rect x="982" y="266" width="36" height="28" rx="4" fill="#7a5230"/>
        <rect x="982" y="266" width="36" height="7" fill="#5a3720"/>
        {/* oil inside */}
        <rect x="966" y="420" width="68" height="200" fill="#7d4716" opacity="0.5"/>
        <ellipse cx="1000" cy="420" rx="34" ry="5" fill="#a06a25" opacity="0.7"/>
      </g>

      {/* film grain overlay */}
      <rect width="1200" height="720" filter="url(#wp-grain)" opacity="0.5" pointerEvents="none"/>

      {/* top vignette darken */}
      <linearGradient id="wp-top" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#000" stopOpacity="0.55"/>
        <stop offset="40%" stopColor="#000" stopOpacity="0"/>
      </linearGradient>
      <rect width="1200" height="720" fill="url(#wp-top)" pointerEvents="none"/>

      <style>{`
        @keyframes wp-ken { 0%, 100% { transform: scale(1) translateY(0); } 50% { transform: scale(1.025) translateY(-6px); } }
        @keyframes wp-sway { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2.5deg); } }
        @keyframes wp-float-a { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes wp-float-b { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </svg>
  );
}

// ---------- Essence Hero (replaces the old broken ScrollExpandHero) ----------
function EssenceHero({
  eyebrow = "Traditional extraction",
  title = "The essence of",
  italic = "purity.",
  sub = "Handcrafted cold-pressed oils, honouring ancient Ayurvedic wisdom for modern wellness. Single-origin. Wooden-press. Bottled within 72 hours.",
  cta = "Shop the collection",
}) {
  return (
    <section style={{ position: "relative", height: "100vh", minHeight: 640, maxHeight: 900, width: "100%", overflow: "hidden", background: "#1a0e06" }}>
      {/* scene as full-bleed background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <WoodPressScene/>
      </div>
      {/* dark scrim for text legibility */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(15,9,4,0.35) 0%, rgba(15,9,4,0.15) 35%, rgba(15,9,4,0.55) 100%)",
      }}/>

      {/* centered content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 32px",
      }}>
        <FadeUp>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--green-900)", color: "var(--cream-100)",
            padding: "8px 18px", borderRadius: 999,
            fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase",
            border: "1px solid rgba(245,239,224,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--mustard-400)" }}/>
            {eyebrow}
          </div>
        </FadeUp>
        <FadeUp delay={0.15} style={{ width: "min(1100px, 92vw)" }}>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(52px, 8vw, 112px)", lineHeight: 0.98, letterSpacing: "-0.025em",
            color: "var(--cream-100)", margin: "28px 0 0",
            textShadow: "0 6px 30px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}>
            {title}<br/>
            <span className="pt-display-italic" style={{ color: "var(--cream-100)" }}>{italic}</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.3} style={{ width: "min(580px, 92vw)" }}>
          <p style={{
            marginTop: 22, fontSize: 17, lineHeight: 1.7,
            color: "rgba(245,239,224,0.85)",
            textShadow: "0 2px 12px rgba(0,0,0,0.45)",
            textAlign: "center",
          }}>{sub}</p>
        </FadeUp>
        <FadeUp delay={0.45}>
          <button className="pt-btn pt-btn--primary pt-btn--lg" style={{
            marginTop: 36,
            background: "var(--green-900)",
            border: "1px solid rgba(245,239,224,0.15)",
            boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
          }}>{cta}</button>
        </FadeUp>
      </div>

      {/* scroll cue */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        color: "rgba(245,239,224,0.55)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        animation: "wp-bob 2.4s ease-in-out infinite",
      }}>
        <span>Scroll</span>
        <span style={{ width: 1, height: 28, background: "rgba(245,239,224,0.4)" }}/>
        <style>{`@keyframes wp-bob { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 6px); } }`}</style>
      </div>
    </section>
  );
}

// ---------- Tradition Block (two-column editorial like the reference) ----------
function TraditionBlock() {
  return (
    <section style={{ padding: "120px 80px", background: "var(--cream-200)", position: "relative" }}>
      <div style={{ position: "absolute", right: 60, top: 80, opacity: 0.05, pointerEvents: "none" }}>
        <CowMark size={280} color="var(--green-900)"/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 80, alignItems: "center", maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <FadeUp>
          <div className="pt-eyebrow">Five generations</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.025em",
            color: "var(--green-900)", margin: "20px 0 0",
          }}>
            The Punyakoti<br/>
            <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>tradition.</span>
          </h2>
          <p style={{ marginTop: 26, fontSize: 17, color: "var(--ink-700)", lineHeight: 1.75 }}>
            For five generations, our family has practised the art of cold-pressing oils using traditional wooden churns — <i>chekku</i> in Tamil, <i>kachi ghani</i> in Hindi. This gentle method preserves the natural aroma, vital nutrients, and pure essence of the seed — uncorrupted by heat or chemical solvents.
          </p>
          <p style={{ marginTop: 18, fontSize: 17, color: "var(--ink-700)", lineHeight: 1.75 }}>
            We source from trusted organic farmers who share our commitment to sustainable, earth-friendly agriculture. Every drop of Punyakoti Taila is a testament to purity, and a quiet return to nature's profound healing power.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 24, alignItems: "center" }}>
            <a style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--green-900)", fontWeight: 600,
              borderBottom: "1px solid var(--green-900)", paddingBottom: 4,
            }}>
              Discover our story <Icon.arrowRight size={14}/>
            </a>
            <a style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--mustard-700)", fontWeight: 600,
              borderBottom: "1px solid var(--mustard-500)", paddingBottom: 4,
            }}>
              Visit the press
            </a>
          </div>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div style={{
            position: "relative",
            aspectRatio: "1/1",
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
            boxShadow: "var(--sh-xl)",
            background: "#1a0e06",
          }}>
            <WoodPressScene animate={true}/>
            {/* gold tradition stamp */}
            <div style={{
              position: "absolute", top: 28, left: "50%", transform: "translateX(-50%)",
              display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4,
              color: "var(--mustard-400)",
              fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: "0.16em",
            }}>
              <CowMark size={36} color="var(--mustard-400)"/>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "0.3em" }}>PUNYAKOTI</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(228,176,73,0.7)", letterSpacing: "0.32em" }}>WOOD · PRESS</span>
            </div>
            {/* batch caption */}
            <div style={{
              position: "absolute", bottom: 20, left: 24, right: 24,
              display: "flex", justifyContent: "space-between",
              color: "rgba(245,239,224,0.65)",
              fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              <span>Batch #047 · 9-hour press</span>
              <span style={{ color: "var(--mustard-300)" }}>Erode · Tamil Nadu</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

Object.assign(window, {
  useInView, useScrollProgress,
  FadeUp, AnimatedNumber,
  Marquee, ScrollExpandHero, StatsBand, PressBand, PoeticInterlude, ParallaxBottleRow,
  WoodPressScene, EssenceHero, TraditionBlock,
});
