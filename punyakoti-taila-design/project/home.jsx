// ============================================================
// HOMEPAGE — desktop (1280×) + mobile (390×)
// ============================================================

function HomeDesktop({ heroVariant = "poetic", quiet = false }) {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      {/* announcement bar */}
      <div style={{
        background: "var(--green-950)", color: "var(--cream-100)",
        fontSize: 12, letterSpacing: "0.08em",
        textAlign: "center", padding: "9px 0", fontWeight: 500,
      }}>
        Free shipping on orders over <span style={{ color: "var(--mustard-400)" }}>₹999</span> · Single-origin · Pressed weekly in Erode
      </div>
      <DesktopHeader scrolled={false} />

      {/* IMMERSIVE "ESSENCE OF PURITY" HERO — top of page */}
      {!quiet && (
        <EssenceHero
          eyebrow="Traditional extraction"
          title="The essence of"
          italic="purity."
          sub="Handcrafted cold-pressed oils, honouring ancient Ayurvedic wisdom for modern wellness. Single-origin. Wooden-press. Bottled within 72 hours."
          cta="Shop the collection"
        />
      )}

      {/* HERO */}
      <HeroBlock variant={heroVariant} />

      {/* LIVE PRESS MARQUEE — new */}
      <PressBand />

      {/* TRUST STRIP */}
      <div style={{ borderTop: "1px solid var(--cream-400)", borderBottom: "1px solid var(--cream-400)" }}>
        <TrustStrip />
      </div>

      {/* FEATURED OILS */}
      <FadeUp><SectionHeader eyebrow="The collection" title="Six oils, one philosophy" subtitle="Pressed slowly on wooden ghanis. Bottled within 72 hours. Always single-batch." cta="Shop all" /></FadeUp>
      <FeaturedGrid />

      {/* TRADITION editorial block */}
      <TraditionBlock />

      {/* STORY / PROCESS */}
      <ProcessBlock />

      {/* POETIC INTERLUDE — new kinetic-type hero */}
      {!quiet && <PoeticInterlude />}

      {/* WHY COLD PRESSED */}
      <WhyColdPressedBlock />

      {/* STATS BAND — new animated counters */}
      <StatsBand />

      {/* BEST SELLERS */}
      <FadeUp><SectionHeader eyebrow="Best sellers" title="What kitchens keep reordering." cta="Subscribe & save 15%" mustard /></FadeUp>
      <BestSellersRow />

      {/* PARALLAX BOTTLE ROW — new */}
      {!quiet && <ParallaxBottleRow />}

      {/* TESTIMONIALS */}
      <TestimonialsBlock />

      {/* JOURNAL */}
      <FadeUp><SectionHeader eyebrow="Journal" title="Recipes, rituals, and what we're reading." cta="Read the journal" /></FadeUp>
      <JournalRow />

      {/* NEWSLETTER */}
      <NewsletterBand />

      {/* FAQ */}
      <FAQBlock />

      <FooterBlock />
    </div>
  );
}

// -------- Hero variants --------
function HeroBlock({ variant }) {
  if (variant === "product") return <HeroProduct />;
  if (variant === "editorial") return <HeroEditorial />;
  return <HeroPoetic />;
}

function HeroPoetic() {
  return (
    <section style={{
      padding: "112px 80px 96px",
      display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48,
      position: "relative",
    }}>
      {/* Decorative cow watermarks — absolutely positioned so they don't take grid cells */}
      <div style={{ position: "absolute", top: 80, left: 60, opacity: 0.05, pointerEvents: "none" }}>
        <CowMark size={140} color="var(--green-800)" />
      </div>
      <div style={{ position: "absolute", top: 100, right: 80, opacity: 0.07, pointerEvents: "none" }}>
        <CowMark size={220} color="var(--green-900)" />
      </div>
      <div style={{ alignSelf: "center", position: "relative", zIndex: 2 }}>
        <div className="pt-eyebrow" style={{ marginBottom: 28 }}>Est. from a village press</div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 96, lineHeight: 0.98, letterSpacing: "-0.025em",
          color: "var(--green-900)", margin: 0,
        }}>
          Pressed slowly,<br/>
          on <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>wood.</span>
        </h1>
        <p style={{
          marginTop: 32, maxWidth: 480, fontSize: 19, lineHeight: 1.55,
          color: "var(--ink-700)",
        }}>
          The way your grandmother's kitchen smelled. Unrefined oils from
          wooden <i>ghanis</i> in Erode and Coimbatore — bottled within 72 hours,
          shipped to your kitchen in eight days.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
          <button className="pt-btn pt-btn--primary pt-btn--lg">Shop the collection</button>
          <button className="pt-btn pt-btn--ghost pt-btn--lg">Read our story <Icon.arrowRight size={16} /></button>
        </div>
        <div style={{ marginTop: 56, display: "flex", gap: 32, alignItems: "center" }}>
          <Stars value={5} size={14} />
          <div style={{ fontSize: 13, color: "var(--ink-500)" }}>
            <span style={{ color: "var(--green-900)", fontWeight: 600 }}>4.9 / 5</span> · 2,847 verified kitchens
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <PhotoPlaceholder tone="deep" style={{
          aspectRatio: "4/5",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--sh-xl)",
        }}>
          {/* layered bottle */}
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <div style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>
              <Bottle variant="sesame" size={280} />
            </div>
          </div>
          <div style={{
            position: "absolute", bottom: 28, left: 28, right: 28,
            color: "var(--cream-100)", fontSize: 12, letterSpacing: "0.18em",
            display: "flex", justifyContent: "space-between", textTransform: "uppercase",
          }}>
            <span>Batch #047</span>
            <span style={{ color: "var(--mustard-200)" }}>Erode · Nov 2025</span>
          </div>
        </PhotoPlaceholder>
        <div style={{
          position: "absolute", left: -28, bottom: 64,
          background: "var(--cream-100)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--sh-md)",
          padding: "16px 20px",
          display: "flex", gap: 14, alignItems: "center",
          maxWidth: 240,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "var(--green-100)",
            display: "grid", placeItems: "center",
            color: "var(--green-800)",
          }}><Icon.leaf size={18} /></div>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Press of the week</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green-900)" }}>Sesame · Erode</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroProduct() {
  const oils = ["sesame", "coconut", "groundnut", "mustard"];
  return (
    <section style={{ padding: "80px 80px 64px", position: "relative" }}>
      <div className="pt-eyebrow" style={{ marginBottom: 18 }}>Six oils. One village press.</div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 400,
        fontSize: 84, lineHeight: 1, letterSpacing: "-0.025em",
        color: "var(--green-900)", margin: 0, maxWidth: 980,
      }}>
        The kitchen rebuilt around <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>provenance.</span>
      </h1>
      <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {oils.map((v, i) => (
          <div key={v} style={{
            background: "var(--cream-100)",
            borderRadius: "var(--r-lg)",
            padding: "24px 24px 28px",
            boxShadow: "var(--sh-sm)",
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "relative",
          }}>
            {i === 0 && <div style={{ position: "absolute", top: 14, right: 14 }}><Pill tone="mustard">New harvest</Pill></div>}
            <Bottle variant={v} size={180} />
            <div style={{ marginTop: 8, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>
              {{sesame:"Sesame", coconut:"Coconut", groundnut:"Groundnut", mustard:"Mustard"}[v]}
            </div>
            <div className="pt-mono-stamp" style={{ marginTop: 4 }}>500ML · ₹{[420, 380, 360, 320][i]}</div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm" style={{ marginTop: 14 }}>Quick add</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeroEditorial() {
  return (
    <section style={{ padding: "80px 0 0", position: "relative" }}>
      <PhotoPlaceholder tone="warm" style={{ height: 620, position: "relative", borderRadius: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(15,26,14,0.0) 30%, rgba(15,26,14,0.55) 100%)",
        }}/>
        <div style={{
          position: "absolute", left: 80, top: 80, color: "var(--cream-100)",
          maxWidth: 540,
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mustard-200)" }}>The Wood-Press Diary · Chapter 03</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: 80, lineHeight: 1, letterSpacing: "-0.02em",
            color: "var(--cream-100)", margin: "20px 0 0",
          }}>
            From Erode<br/>
            <span className="pt-display-italic">to your kitchen,</span><br/>
            in eight days.
          </h1>
        </div>
        <div style={{
          position: "absolute", right: 80, bottom: 0,
          transform: "translateY(20%)",
        }}>
          <Bottle variant="sesame" size={240} />
        </div>
        <div style={{ position: "absolute", left: 80, bottom: 56, color: "var(--cream-100)", display: "flex", gap: 18 }}>
          <button className="pt-btn pt-btn--mustard pt-btn--lg">Shop the harvest</button>
          <button className="pt-btn pt-btn--inverse pt-btn--lg" style={{ background: "transparent", borderColor: "rgba(245,239,224,0.4)", color: "var(--cream-100)" }}>Read the press diary <Icon.arrowRight size={16} /></button>
        </div>
      </PhotoPlaceholder>
    </section>
  );
}

// -------- Section header --------
function SectionHeader({ eyebrow, title, subtitle, cta, mustard = false }) {
  return (
    <div style={{
      padding: "96px 80px 32px",
      display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 48,
    }}>
      <div style={{ maxWidth: 720 }}>
        {eyebrow && <div className="pt-eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.02em",
          color: "var(--green-900)", margin: 0,
        }}>{title}</h2>
        {subtitle && <p style={{ marginTop: 18, fontSize: 17, color: "var(--ink-500)", maxWidth: 520, lineHeight: 1.55 }}>{subtitle}</p>}
      </div>
      {cta && (
        <a style={{
          fontSize: 14, fontWeight: 500,
          color: mustard ? "var(--mustard-600)" : "var(--green-800)",
          display: "inline-flex", alignItems: "center", gap: 8,
          borderBottom: `1px solid ${mustard ? "var(--mustard-500)" : "var(--green-800)"}`,
          paddingBottom: 4,
        }}>{cta} <Icon.arrowRight size={14} /></a>
      )}
    </div>
  );
}

// -------- Featured grid --------
function FeaturedGrid() {
  const products = [
    { v: "sesame", name: "Sesame · Til", region: "Erode · Tamil Nadu", price: 420, weight: "500 ml", tag: "Best seller", tone: "mustard" },
    { v: "coconut", name: "Virgin Coconut", region: "Kollam · Kerala", price: 480, weight: "500 ml", tag: "Cold-pressed", tone: "green" },
    { v: "groundnut", name: "Groundnut", region: "Kadapa · Andhra Pradesh", price: 380, weight: "500 ml", tag: null },
    { v: "mustard", name: "Mustard · Sarson", region: "Alwar · Rajasthan", price: 360, weight: "500 ml", tag: "Pungent", tone: "terra" },
    { v: "sunflower", name: "Sunflower", region: "Hassan · Karnataka", price: 320, weight: "1 litre", tag: "Daily cook" },
    { v: "blackSes", name: "Black Sesame", region: "Ceremonial · Limited", price: 680, weight: "250 ml", tag: "Limited", tone: "dark" },
  ];
  return (
    <div style={{ padding: "32px 80px 96px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
      {products.map((p, i) => (
        <ProductCard key={i} {...p} />
      ))}
    </div>
  );
}

function ProductCard({ v, name, region, price, weight, tag, tone = "green", small = false }) {
  return (
    <div className="pt-card" style={{ padding: small ? 18 : 28, position: "relative", display: "flex", flexDirection: "column" }}>
      {tag && <div style={{ position: "absolute", top: 16, left: 16 }}><Pill tone={tone}>{tag}</Pill></div>}
      <div style={{ position: "absolute", top: 16, right: 16, color: "var(--ink-400)" }}><Icon.heart size={18} /></div>
      <div style={{
        background: "var(--cream-200)",
        borderRadius: "var(--r-md)",
        padding: small ? "20px 12px 8px" : "32px 16px 16px",
        display: "grid", placeItems: "center",
        aspectRatio: small ? "4/5" : "1/1.15",
      }}>
        <Bottle variant={v} size={small ? 130 : 180} />
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="pt-mono-stamp">{region}</div>
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: small ? 20 : 24,
          color: "var(--green-900)", marginTop: 6,
        }}>{name}</div>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <span style={{ fontSize: small ? 16 : 19, fontWeight: 600, color: "var(--green-900)" }}>₹{price}</span>
          <span style={{ fontSize: 12, color: "var(--ink-500)", marginLeft: 8 }}>· {weight}</span>
        </div>
        <button className="pt-btn pt-btn--ghost pt-btn--sm">
          <Icon.plus size={14}/> Add
        </button>
      </div>
    </div>
  );
}

// -------- Process block --------
function ProcessBlock() {
  return (
    <section style={{
      background: "var(--green-950)", color: "var(--cream-100)",
      padding: "112px 80px", marginTop: 32,
      position: "relative", overflow: "hidden",
    }}>
      <CowMark size={420} color="var(--mustard-500)" opacity={0.06} />
      <div style={{ position: "absolute", right: 60, top: 60, opacity: 0.08 }}>
        <CowMark size={460} color="var(--cream-100)" />
      </div>
      <div style={{ position: "relative", maxWidth: 700 }}>
        <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>The process · est. five generations</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.02em",
          color: "var(--cream-100)", margin: "20px 0 0",
        }}>
          Wood, weight,<br/>
          and <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>time.</span>
        </h2>
        <p style={{ marginTop: 24, fontSize: 18, lineHeight: 1.7, color: "rgba(245,239,224,0.7)", maxWidth: 560 }}>
          A wooden <i>ghani</i> turns at four revolutions per minute. No heat. No solvents.
          Just seed, stone, and the patience to wait nine hours for two litres.
          The yield is half. The flavour is whole.
        </p>
      </div>
      <div style={{
        marginTop: 64, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32,
        position: "relative",
      }}>
        {[
          { n: "01", t: "Sourced", d: "Single-farm seed. Sun-dried on jute mats. Cleaned by hand." },
          { n: "02", t: "Pressed", d: "Wood ghani at 40rpm. Two-litre yield per nine-hour press." },
          { n: "03", t: "Settled", d: "72 hours of gravity. No filtration. No clarifiers." },
          { n: "04", t: "Bottled", d: "Dark amber glass. Numbered. Stamped. Shipped warm." },
        ].map((s) => (
          <div key={s.n} style={{ borderTop: "1px solid rgba(245,239,224,0.18)", paddingTop: 22 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mustard-400)", letterSpacing: "0.1em" }}>{s.n}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--cream-100)", marginTop: 12 }}>{s.t}</div>
            <div style={{ marginTop: 12, fontSize: 14, color: "rgba(245,239,224,0.62)", lineHeight: 1.6 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------- Why cold pressed --------
function WhyColdPressedBlock() {
  return (
    <section style={{ padding: "112px 80px", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 80 }}>
      <div>
        <div className="pt-eyebrow" style={{ marginBottom: 18 }}>Why cold-pressed</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.02em",
          color: "var(--green-900)", margin: 0,
        }}>
          Refined oil is a<br/>
          twentieth-century<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>compromise.</span>
        </h2>
        <p style={{ marginTop: 22, fontSize: 16, color: "var(--ink-500)", lineHeight: 1.7, maxWidth: 460 }}>
          Solvent extraction came from the chemistry of soap, not food. At 240°C, an oil loses what makes it nourishing: lignans, tocopherols, the volatile aromatics. We don't go past 38°C.
        </p>
        <button className="pt-btn pt-btn--ghost" style={{ marginTop: 28 }}>The science, plainly written <Icon.arrowRight size={14} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {[
          { t: "Lignans intact", d: "Wood-pressing preserves sesamin and sesamol — the antioxidants that distinguish a real til oil." },
          { t: "Below 40 °C", d: "Heat fragments fatty acids. We stay cool enough to protect every chain." },
          { t: "No solvents", d: "Industrial oil is hexane-extracted. Ours touches only seed, wood, and gravity." },
          { t: "Unfiltered", d: "We let oil settle for 72 hours. What rises is what nourishes." },
        ].map((b, i) => (
          <div key={i} className="pt-card pt-card--flat" style={{
            padding: 26, background: i % 2 === 0 ? "var(--cream-100)" : "var(--cream-300)",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--green-900)" }}>{b.t}</div>
            <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// -------- Best sellers --------
function BestSellersRow() {
  const list = [
    { v: "sesame", name: "Sesame · Til", region: "Erode · TN", price: 420, weight: "500 ml", tag: "#1 best seller", tone: "mustard" },
    { v: "coconut", name: "Virgin Coconut", region: "Kollam · KL", price: 480, weight: "500 ml" },
    { v: "groundnut", name: "Groundnut", region: "Kadapa · AP", price: 380, weight: "500 ml" },
    { v: "mustard", name: "Mustard", region: "Alwar · RJ", price: 360, weight: "500 ml" },
  ];
  return (
    <div style={{ padding: "32px 80px 96px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
      {list.map((p, i) => <ProductCard key={i} {...p} small />)}
    </div>
  );
}

// -------- Testimonials --------
function TestimonialsBlock() {
  const items = [
    { q: "I'd forgotten what real sesame smells like. The first dosa I made with this brought my grandmother into the room.", n: "Lakshmi V.", c: "Bangalore · Sesame · 6 orders", initials: "LV", tone: "warm" },
    { q: "Not branding. Provenance. The batch number on the bottle matches the village I lived next to as a kid. That detail did it.", n: "Karthik R.", c: "Mumbai · Subscriber · 14 months", initials: "KR", tone: "deep" },
    { q: "I've stopped buying the supermarket coconut oil. The colour, the cling, even how it solidifies — it's just different.", n: "Anisha M.", c: "Chennai · Coconut · 9 orders", initials: "AM", tone: "sun" },
  ];
  return (
    <section style={{ padding: "112px 80px", background: "var(--cream-300)", borderTop: "1px solid var(--cream-400)", borderBottom: "1px solid var(--cream-400)" }}>
      <div className="pt-eyebrow" style={{ textAlign: "center", marginBottom: 18, display: "block" }}>Letters from kitchens</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 32 }}>
        {items.map((t, i) => (
          <figure key={i} style={{ margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
            <Stars value={5} size={12} />
            <blockquote style={{
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
              fontSize: 24, lineHeight: 1.4, color: "var(--green-900)",
              margin: "20px 0 24px", letterSpacing: "-0.01em",
            }}>"{t.q}"</blockquote>
            <figcaption style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar initials={t.initials} tone={t.tone}/>
              <div>
                <div style={{ fontWeight: 600, color: "var(--green-900)" }}>{t.n}</div>
                <div className="pt-mono-stamp" style={{ marginTop: 4 }}>{t.c}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

// Portrait avatar — warm gradient frame with initials, as a rounded rectangle
// (4:5 portrait, the same aspect as our product photography).
// Doubles as a slot for real photography: when the team has portraits, replace
// the inner span with <img src=... /> at the same size.
function Avatar({ initials, tone = "warm", size = 84 }) {
  const palettes = {
    warm: "linear-gradient(135deg, #C58A1F 0%, #6B3A12 60%, #2B1810 100%)",
    deep: "linear-gradient(135deg, #2F4A2A 0%, #1A2918 60%, #0F1A0E 100%)",
    sun:  "linear-gradient(135deg, #E0AF52 0%, #A8741D 60%, #4B2A0D 100%)",
    field: "linear-gradient(135deg, #5A7B3E 0%, #2E4222 60%, #142010 100%)",
  };
  const h = Math.round(size * 1.2); // 4:5 portrait
  return (
    <span style={{
      width: size, height: h, borderRadius: 14,
      background: palettes[tone] || palettes.warm,
      display: "grid", placeItems: "center",
      color: "var(--cream-100)",
      fontFamily: "var(--font-display)", fontWeight: 500,
      fontSize: size * 0.42, letterSpacing: "0.02em",
      boxShadow: "inset 0 0 0 1px rgba(245,239,224,0.18), 0 10px 18px rgba(43,28,15,0.22)",
      flexShrink: 0,
      position: "relative", overflow: "hidden",
    }}>
      {/* subtle highlight */}
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(180deg, rgba(245,239,224,0.18) 0%, transparent 100%)" }}/>
      <span style={{ position: "relative" }}>{initials}</span>
    </span>
  );
}

// -------- Journal row --------
function JournalRow() {
  const posts = [
    { tone: "field", tag: "Recipe", title: "Til kuzhambu — the way they cook it in Tirunelveli", read: "6 min read" },
    { tone: "deep", tag: "Provenance", title: "The day we drove to Erode and sat next to the press for nine hours", read: "11 min read" },
    { tone: "sun", tag: "Wellness", title: "Why your great-grandmother oiled her hair on Saturdays", read: "4 min read" },
  ];
  return (
    <div style={{ padding: "32px 80px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
      {posts.map((p, i) => (
        <article key={i} style={{ background: "var(--cream-100)", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
          <PhotoPlaceholder tone={p.tone} style={{ aspectRatio: "16/10", borderRadius: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 16, left: 16 }}><Pill tone="dark">{p.tag}</Pill></div>
          </PhotoPlaceholder>
          <div style={{ padding: 26 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 24, color: "var(--green-900)", margin: 0, lineHeight: 1.2 }}>{p.title}</h3>
            <div style={{ marginTop: 14, fontSize: 12, color: "var(--ink-500)", letterSpacing: "0.05em" }}>{p.read} · journal</div>
          </div>
        </article>
      ))}
    </div>
  );
}

// -------- Newsletter band --------
function NewsletterBand() {
  return (
    <section style={{
      margin: "0 80px 96px",
      padding: "64px 64px",
      background: "var(--green-900)", color: "var(--cream-100)",
      borderRadius: "var(--r-xl)",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.08 }}>
        <CowMark size={320} color="var(--mustard-400)" />
      </div>
      <div style={{ position: "relative" }}>
        <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>The Wood-Press Diary</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "16px 0 0", color: "var(--cream-100)" }}>
          A short letter,<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>once a fortnight.</span>
        </h2>
        <p style={{ marginTop: 14, fontSize: 15, color: "rgba(245,239,224,0.7)", maxWidth: 380, lineHeight: 1.6 }}>
          Press updates from Erode, the occasional recipe from our test kitchen, and ten percent off your next bottle.
        </p>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 0, background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: 6 }}>
          <input className="pt-input" placeholder="your@kitchen.in"
            style={{ background: "transparent", border: 0, fontSize: 15, paddingLeft: 14 }} />
          <button className="pt-btn pt-btn--primary" style={{ minHeight: 0, padding: "12px 22px" }}>Subscribe</button>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(245,239,224,0.55)" }}>
          We won't sell your address. Unsubscribe in one click. No emoji.
        </div>
      </div>
    </section>
  );
}

// -------- FAQ --------
function FAQBlock() {
  const qs = [
    { q: "How long does the oil keep?", a: "Six months from the press date stamped on the bottle. After opening, refrigerate and finish within ten weeks for full aroma." },
    { q: "Is this organic-certified?", a: "Our farms are USDA-NOP and India-Organic certified. We publish lab tests for each batch on the product page." },
    { q: "What does 'kachi ghani' actually mean?", a: "Literally: a cold press. Practically: pressed without heat in a wooden mortar — the original method, slow and low-yield." },
    { q: "Can I subscribe?", a: "Yes — pick any oil and select 'subscribe & save 15%'. Pause, skip, or cancel anytime from your account." },
  ];
  return (
    <section style={{ padding: "0 80px 112px", display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 80 }}>
      <div>
        <div className="pt-eyebrow">Frequently asked</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "16px 0 0", color: "var(--green-900)" }}>
          Short, honest <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>answers.</span>
        </h2>
      </div>
      <div>
        {qs.map((f, i) => (
          <div key={i} style={{
            borderTop: "1px solid var(--cream-400)",
            padding: "26px 0",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start",
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--green-900)", fontWeight: 500 }}>{f.q}</div>
              {i === 0 && <p style={{ marginTop: 10, fontSize: 15, color: "var(--ink-500)", lineHeight: 1.65, maxWidth: 620 }}>{f.a}</p>}
            </div>
            <button style={{ background: "var(--cream-300)", borderRadius: 100, width: 36, height: 36, border: 0, display: "grid", placeItems: "center", color: "var(--green-900)" }}>
              {i === 0 ? <Icon.minus size={14}/> : <Icon.plus size={14}/>}
            </button>
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--cream-400)" }}/>
      </div>
    </section>
  );
}

// -------- Footer --------
function FooterBlock() {
  return (
    <footer style={{ background: "var(--wood-900)", color: "var(--cream-100)", padding: "80px 80px 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 48 }}>
        <div>
          <Wordmark size={26} color="var(--cream-100)" />
          <p style={{ marginTop: 22, fontSize: 14, color: "rgba(245,239,224,0.6)", lineHeight: 1.7, maxWidth: 280 }}>
            Wood-pressed oils, one batch at a time. Bangalore · Erode · Kollam.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 14, color: "rgba(245,239,224,0.5)" }}>
            <Icon.mail/><Icon.phone/><Icon.pin/>
          </div>
        </div>
        {[
          { h: "Shop", l: ["All oils", "Sesame", "Coconut", "Groundnut", "Mustard", "Wellness", "Gift sets"] },
          { h: "Learn", l: ["Our story", "The press", "Journal", "Recipes", "Lab reports"] },
          { h: "Help", l: ["Contact", "Shipping", "Returns", "FAQ", "Order tracking"] },
          { h: "Legal", l: ["Privacy", "Terms", "Refund policy", "B2B / bulk"] },
        ].map((c, i) => (
          <div key={i}>
            <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>{c.h}</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 0", display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "rgba(245,239,224,0.75)" }}>
              {c.l.map(li => <li key={li}>{li}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 72, paddingTop: 24, borderTop: "1px solid rgba(245,239,224,0.12)", display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(245,239,224,0.5)" }}>
        <div>© 2026 Punyakoti Foods Pvt. Ltd. · GSTIN 29ABCDE1234F1Z5</div>
        <div style={{ display: "flex", gap: 24 }}>
          <span>Made slowly in Bangalore</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>v2.4 · batch 047</span>
        </div>
      </div>
    </footer>
  );
}

// =========== MOBILE HOME ===========
function HomeMobile({ heroVariant = "poetic" }) {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <MobileHeader />
      {/* announcement bar */}
      <div style={{ background: "var(--green-950)", color: "var(--mustard-200)", textAlign: "center", padding: "8px 0", fontSize: 11, letterSpacing: "0.06em" }}>
        Free shipping over ₹999 · Pressed weekly
      </div>

      {/* Mobile hero */}
      <MobileHero variant={heroVariant} />

      {/* trust strip mobile */}
      <div style={{ padding: "0 16px", marginTop: 24 }}>
        <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-lg)", padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <TrustItemMobile Ico={Icon.leaf} l="Wood-pressed" />
          <TrustItemMobile Ico={Icon.shield} l="Lab tested" />
          <TrustItemMobile Ico={Icon.truck} l="Free over ₹999" />
          <TrustItemMobile Ico={Icon.refresh} l="30-day return" />
        </div>
      </div>

      {/* shop by oil */}
      <div style={{ padding: "40px 16px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="pt-eyebrow">Shop</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, lineHeight: 1.05, color: "var(--green-900)", margin: "8px 0 0", letterSpacing: "-0.02em" }}>The collection</h2>
        </div>
        <a style={{ fontSize: 13, color: "var(--green-800)", fontWeight: 500, borderBottom: "1px solid var(--green-800)", paddingBottom: 2 }}>See all</a>
      </div>
      <div style={{ display: "flex", gap: 12, padding: "8px 16px 8px", overflowX: "auto" }} className="pt-noscroll">
        {["sesame","coconut","groundnut","mustard","sunflower","blackSes"].map(v => (
          <div key={v} style={{ minWidth: 110, background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: "12px 8px 14px", textAlign: "center" }}>
            <Bottle variant={v} size={70} />
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--green-900)", marginTop: 6 }}>
              {{sesame:"Sesame", coconut:"Coconut", groundnut:"Groundnut", mustard:"Mustard", sunflower:"Sunflower", blackSes:"Black Til"}[v]}
            </div>
            <div style={{ fontSize: 10, color: "var(--ink-500)", marginTop: 2 }}>From ₹{[420,480,380,360,320,680][["sesame","coconut","groundnut","mustard","sunflower","blackSes"].indexOf(v)]}</div>
          </div>
        ))}
      </div>

      {/* featured single */}
      <div style={{ padding: "32px 16px" }}>
        <div style={{ background: "var(--green-950)", borderRadius: "var(--r-xl)", padding: 24, color: "var(--cream-100)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -30 }}>
            <Bottle variant="sesame" size={150} />
          </div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Press of the week</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 30, lineHeight: 1.05, margin: "10px 0 0", maxWidth: 200, color: "var(--cream-100)" }}>
            Sesame, from <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>Erode.</span>
          </h3>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button className="pt-btn pt-btn--mustard pt-btn--sm">Shop ₹420</button>
            <button className="pt-btn pt-btn--ghost pt-btn--sm" style={{ borderColor: "rgba(245,239,224,0.3)", color: "var(--cream-100)" }}>Read</button>
          </div>
        </div>
      </div>

      {/* process strip */}
      <div style={{ padding: "32px 16px" }}>
        <div className="pt-eyebrow">The process</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, lineHeight: 1.05, color: "var(--green-900)", margin: "8px 0 18px", letterSpacing: "-0.02em" }}>
          Wood, weight, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>time.</span>
        </h2>
        {[
          { n: "01", t: "Sourced", d: "Single-farm seed." },
          { n: "02", t: "Pressed", d: "Wood ghani · 9 hours." },
          { n: "03", t: "Settled", d: "72 hours · gravity." },
          { n: "04", t: "Bottled", d: "Dark amber · numbered." },
        ].map(s => (
          <div key={s.n} style={{ display: "flex", gap: 18, padding: "14px 0", borderTop: "1px solid var(--cream-400)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mustard-600)", width: 24 }}>{s.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>{s.t}</div>
              <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* testimonial single */}
      <div style={{ padding: "16px 16px 32px" }}>
        <div style={{ background: "var(--cream-300)", borderRadius: "var(--r-lg)", padding: 24 }}>
          <Stars value={5} size={12} />
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, lineHeight: 1.4, color: "var(--green-900)", margin: "16px 0 18px" }}>
            "The first dosa I made with this brought my grandmother into the room."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials="LV" tone="warm" size={48}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>Lakshmi V.</div>
              <div className="pt-mono-stamp" style={{ marginTop: 2 }}>Bangalore · 6 orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* newsletter mini */}
      <div style={{ padding: "16px 16px 24px" }}>
        <div style={{ background: "var(--green-900)", borderRadius: "var(--r-xl)", padding: 22, color: "var(--cream-100)" }}>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>The Wood-Press Diary</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, lineHeight: 1.1, marginTop: 10, color: "var(--cream-100)" }}>
            A short letter, <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>fortnightly.</span>
          </div>
          <div style={{ marginTop: 16, background: "var(--cream-100)", borderRadius: 10, padding: 5, display: "flex" }}>
            <input className="pt-input" placeholder="your@kitchen.in" style={{ background: "transparent", border: 0, padding: "10px 12px", fontSize: 14, flex: 1 }} />
            <button className="pt-btn pt-btn--primary pt-btn--sm">Join</button>
          </div>
        </div>
      </div>

      <div style={{ height: 80 }}/>
      <MobileBottomNav active="home" />
    </div>
  );
}

function MobileHero({ variant = "poetic" }) {
  if (variant === "editorial") {
    return (
      <div style={{ padding: "12px 16px 8px" }}>
        <PhotoPlaceholder tone="warm" style={{ height: 460, borderRadius: "var(--r-xl)", padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ color: "var(--mustard-200)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>The Wood-Press Diary · Ch. 03</div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 48, lineHeight: 0.98, color: "var(--cream-100)", margin: 0, letterSpacing: "-0.02em" }}>
              From Erode<br/>
              <span className="pt-display-italic">to your kitchen,</span><br/>
              in eight days.
            </h1>
            <button className="pt-btn pt-btn--mustard" style={{ marginTop: 22 }}>Shop the harvest <Icon.arrowRight size={14}/></button>
          </div>
        </PhotoPlaceholder>
      </div>
    );
  }
  if (variant === "product") {
    return (
      <div style={{ padding: "20px 16px 8px" }}>
        <div className="pt-eyebrow">Six oils · one press</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1, color: "var(--green-900)", margin: "10px 0 22px", letterSpacing: "-0.02em" }}>
          The kitchen, rebuilt around <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>provenance.</span>
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {["sesame","coconut"].map((v, i) => (
            <div key={v} style={{ background: "var(--cream-100)", borderRadius: "var(--r-lg)", padding: 14, textAlign: "center", boxShadow: "var(--sh-sm)" }}>
              <Bottle variant={v} size={100} />
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green-900)", marginTop: 6 }}>{["Sesame","Coconut"][i]}</div>
              <div className="pt-mono-stamp">₹{[420,480][i]} · 500ml</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // poetic default
  return (
    <div style={{ padding: "24px 16px 8px", position: "relative" }}>
      <div className="pt-eyebrow">Est. from a village press</div>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 400,
        fontSize: 56, lineHeight: 0.98, letterSpacing: "-0.025em",
        color: "var(--green-900)", margin: "12px 0 0",
      }}>
        Pressed slowly,<br/>on <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>wood.</span>
      </h1>
      <p style={{ marginTop: 18, fontSize: 15, color: "var(--ink-500)", lineHeight: 1.55 }}>
        The way your grandmother's kitchen smelled. Unrefined oils from wooden <i>ghanis</i> — bottled within 72 hours.
      </p>
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button className="pt-btn pt-btn--primary">Shop the collection</button>
        <button className="pt-btn pt-btn--ghost">Our story</button>
      </div>
      <div style={{ marginTop: 24, position: "relative" }}>
        <PhotoPlaceholder tone="deep" style={{ aspectRatio: "16/12", borderRadius: "var(--r-xl)", display: "grid", placeItems: "center", overflow: "hidden" }}>
          <div style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }}>
            <Bottle variant="sesame" size={170} />
          </div>
          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, color: "var(--cream-100)", fontSize: 10, letterSpacing: "0.15em", display: "flex", justifyContent: "space-between", textTransform: "uppercase" }}>
            <span>Batch #047</span>
            <span style={{ color: "var(--mustard-200)" }}>Erode · Nov 2025</span>
          </div>
        </PhotoPlaceholder>
      </div>
    </div>
  );
}

function TrustItemMobile({ Ico, l }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--green-900)" }}>
      <Ico size={16}/>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{l}</span>
    </div>
  );
}

Object.assign(window, { HomeDesktop, HomeMobile, ProductCard, FooterBlock, SectionHeader, Avatar });
