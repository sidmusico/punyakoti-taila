// ============================================================
// PLP + PDP — listing & detail, desktop + mobile
// ============================================================

// ---------- PLP DESKTOP ----------
function PLPDesktop() {
  const products = [
    { v: "sesame", name: "Sesame · Til", region: "Erode · Tamil Nadu", price: 420, was: null, weight: "500 ml", tag: "Best seller", tone: "mustard" },
    { v: "coconut", name: "Virgin Coconut", region: "Kollam · Kerala", price: 480, weight: "500 ml", tag: "Cold-pressed", tone: "green" },
    { v: "groundnut", name: "Groundnut", region: "Kadapa · Andhra", price: 380, weight: "500 ml" },
    { v: "mustard", name: "Mustard · Sarson", region: "Alwar · Rajasthan", price: 360, weight: "500 ml", tag: "Pungent", tone: "terra" },
    { v: "sunflower", name: "Sunflower", region: "Hassan · Karnataka", price: 320, weight: "1 litre", tag: "Daily cook" },
    { v: "blackSes", name: "Black Sesame", region: "Ceremonial · Limited", price: 680, weight: "250 ml", tag: "Limited", tone: "dark" },
    { v: "sesame", name: "Sesame · 1 Litre", region: "Erode · Tamil Nadu", price: 760, was: 820, weight: "1 litre", tag: "Save 8%", tone: "mustard" },
    { v: "castor", name: "Castor · Eranda", region: "Hair & skin · wellness", price: 540, weight: "200 ml" },
    { v: "coconut", name: "Coconut · Gift", region: "Kollam · 3-pack", price: 1380, weight: "3 × 250ml", tag: "Gift", tone: "cream" },
  ];

  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <DesktopHeader />
      {/* Breadcrumb + page heading */}
      <div style={{ padding: "40px 80px 0", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 12, color: "var(--ink-500)", letterSpacing: "0.04em" }}>
          Home <span style={{ opacity: 0.4 }}> / </span> <span style={{ color: "var(--green-900)" }}>All oils</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="pt-eyebrow">The full collection</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 64, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "12px 0 0" }}>
              Every oil, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>every press.</span>
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-500)" }}>
            <span style={{ fontWeight: 600, color: "var(--green-900)" }}>9</span> oils · <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>Updated Mon</span>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ padding: "32px 80px 0", display: "flex", gap: 10, overflowX: "auto" }} className="pt-noscroll">
        {["All", "Edible · daily", "Edible · ceremonial", "Wellness", "Gift sets", "Subscriptions"].map((c, i) => (
          <button key={c} className={`pt-chip ${i === 0 ? "pt-chip--active" : ""}`}>{c}</button>
        ))}
      </div>

      <div style={{ padding: "32px 80px 80px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 56 }}>
        {/* Filter rail */}
        <aside>
          <div style={{ position: "sticky", top: 80 }}>
            {[
              { title: "Region", items: ["Tamil Nadu (4)", "Kerala (2)", "Rajasthan (1)", "Andhra (1)", "Karnataka (1)"] },
              { title: "Size", items: ["250 ml", "500 ml", "1 litre", "Gift packs"] },
              { title: "Use", items: ["Daily cooking", "Tempering", "Salad", "Hair & body", "Ayurvedic"] },
              { title: "Certifications", items: ["USDA Organic", "India Organic", "Single-origin"] },
            ].map(g => (
              <div key={g.title} style={{ paddingBottom: 26, marginBottom: 26, borderBottom: "1px solid var(--cream-400)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div className="pt-eyebrow" style={{ color: "var(--green-900)" }}>{g.title}</div>
                  <Icon.minus size={14}/>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {g.items.map((it, i) => (
                    <label key={it} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--ink-700)", cursor: "pointer" }}>
                      <span style={{
                        width: 18, height: 18, border: "1.4px solid var(--wood-300)", borderRadius: 4,
                        display: "grid", placeItems: "center",
                        background: i === 0 ? "var(--green-800)" : "transparent",
                        borderColor: i === 0 ? "var(--green-800)" : "var(--wood-300)",
                        color: "var(--cream-100)",
                      }}>{i === 0 && <Icon.check size={12}/>}</span>
                      {it}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ marginBottom: 26 }}>
              <div className="pt-eyebrow" style={{ color: "var(--green-900)", marginBottom: 16 }}>Price</div>
              <div style={{ position: "relative", height: 36 }}>
                <div style={{ position: "absolute", top: 16, left: 0, right: 0, height: 3, background: "var(--cream-300)", borderRadius: 3 }}/>
                <div style={{ position: "absolute", top: 16, left: "10%", right: "30%", height: 3, background: "var(--green-800)", borderRadius: 3 }}/>
                <div style={{ position: "absolute", top: 10, left: "10%", width: 14, height: 14, background: "var(--cream-100)", border: "2px solid var(--green-800)", borderRadius: 14 }}/>
                <div style={{ position: "absolute", top: 10, left: "70%", width: 14, height: 14, background: "var(--cream-100)", border: "2px solid var(--green-800)", borderRadius: 14 }}/>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-500)", marginTop: 8, fontFamily: "var(--font-mono)" }}>
                <span>₹240</span><span>₹980</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--cream-400)" }}>
            <div style={{ fontSize: 14, color: "var(--ink-500)" }}>9 oils · 3 active filters</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13 }}>
              <span style={{ color: "var(--ink-500)" }}>Sort by</span>
              <button className="pt-chip" style={{ background: "transparent", borderColor: "transparent", color: "var(--green-900)", fontWeight: 600, padding: "6px 4px" }}>
                Featured <Icon.chevDown size={14}/>
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {products.map((p, i) => <ProductCard key={i} {...p} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <button className="pt-btn pt-btn--ghost pt-btn--lg">Load more <Icon.chevDown size={14}/></button>
          </div>
        </div>
      </div>

      <FooterBlock />
    </div>
  );
}

// ---------- PLP MOBILE ----------
function PLPMobile() {
  const products = [
    { v: "sesame", name: "Sesame · Til", region: "Erode · TN", price: 420, weight: "500 ml", tag: "Best seller", tone: "mustard" },
    { v: "coconut", name: "Virgin Coconut", region: "Kollam · KL", price: 480, weight: "500 ml" },
    { v: "groundnut", name: "Groundnut", region: "Kadapa · AP", price: 380, weight: "500 ml" },
    { v: "mustard", name: "Mustard", region: "Alwar · RJ", price: 360, weight: "500 ml", tag: "Pungent", tone: "terra" },
    { v: "sunflower", name: "Sunflower", region: "Hassan · KA", price: 320, weight: "1 litre" },
    { v: "blackSes", name: "Black Sesame", region: "Ceremonial", price: 680, weight: "250 ml", tag: "Limited", tone: "dark" },
  ];
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <MobileHeader title="All oils" back />
      {/* compact heading */}
      <div style={{ padding: "20px 16px 8px" }}>
        <div className="pt-eyebrow">The collection</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.02, color: "var(--green-900)", margin: "8px 0 0", letterSpacing: "-0.02em" }}>
          Every oil, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>every press.</span>
        </h1>
      </div>
      {/* chips */}
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 8, overflowX: "auto" }} className="pt-noscroll">
        {["All", "Daily", "Ceremonial", "Wellness", "Gifts"].map((c, i) => (
          <button key={c} className={`pt-chip ${i===0?"pt-chip--active":""}`} style={{ flexShrink: 0 }}>{c}</button>
        ))}
      </div>
      {/* sort/filter bar */}
      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="pt-btn pt-btn--ghost" style={{ justifyContent: "space-between", padding: "10px 14px", minHeight: 42 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon.filter size={14}/> Filters</span>
          <Pill tone="green">3</Pill>
        </button>
        <button className="pt-btn pt-btn--ghost" style={{ justifyContent: "space-between", padding: "10px 14px", minHeight: 42 }}>
          <span>Sort: Featured</span>
          <Icon.chevDown size={14}/>
        </button>
      </div>
      {/* grid 2-col */}
      <div style={{ padding: "0 16px 100px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {products.map((p, i) => (
          <div key={i} className="pt-card" style={{ padding: 12, position: "relative" }}>
            {p.tag && <div style={{ position: "absolute", top: 10, left: 10 }}><Pill tone={p.tone}>{p.tag}</Pill></div>}
            <div style={{ position: "absolute", top: 10, right: 10, color: "var(--ink-400)" }}><Icon.heart size={16}/></div>
            <div style={{ background: "var(--cream-200)", borderRadius: 10, padding: "16px 6px", display: "grid", placeItems: "center", aspectRatio: "1/1.05" }}>
              <Bottle variant={p.v} size={88}/>
            </div>
            <div className="pt-mono-stamp" style={{ marginTop: 10, fontSize: 9 }}>{p.region}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--green-900)", marginTop: 4, lineHeight: 1.1 }}>{p.name}</div>
            <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>₹{p.price}</div>
              <div style={{ width: 28, height: 28, borderRadius: 999, background: "var(--green-800)", color: "var(--cream-100)", display: "grid", placeItems: "center" }}>
                <Icon.plus size={14}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <MobileBottomNav active="shop" />
    </div>
  );
}

// ---------- PDP DESKTOP ----------
function PDPDesktop() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <DesktopHeader />
      {/* Breadcrumb */}
      <div style={{ padding: "32px 80px 0", fontSize: 12, color: "var(--ink-500)" }}>
        Home <span style={{ opacity: 0.4 }}>/</span> Oils <span style={{ opacity: 0.4 }}>/</span> <span style={{ color: "var(--green-900)" }}>Sesame · Til</span>
      </div>

      {/* main */}
      <div style={{ padding: "32px 80px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80 }}>
        {/* GALLERY */}
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                aspectRatio: "1/1",
                background: i === 0 ? "var(--green-950)" : "var(--cream-300)",
                borderRadius: "var(--r-md)",
                border: i === 0 ? "1.5px solid var(--green-900)" : "1px solid var(--cream-400)",
                display: "grid", placeItems: "center", overflow: "hidden",
              }}>
                {i === 0 ? <Bottle variant="sesame" size={56}/> : <div style={{ color: "var(--wood-500)", fontFamily: "var(--font-mono)", fontSize: 9 }}>0{i+1}</div>}
              </div>
            ))}
          </div>
          <PhotoPlaceholder tone="deep" style={{
            aspectRatio: "1/1.05", borderRadius: "var(--r-xl)", display: "grid", placeItems: "center", position: "relative",
          }}>
            <div style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>
              <Bottle variant="sesame" size={320} />
            </div>
            <div style={{ position: "absolute", top: 24, left: 24, color: "var(--mustard-200)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Batch #047 · Pressed Nov 14, 2025
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 20, background: "rgba(251,247,236,0.12)", color: "var(--cream-100)", padding: "8px 12px", borderRadius: 100, fontSize: 11, letterSpacing: "0.08em" }}>
              ↕ zoom · 4 photos
            </div>
          </PhotoPlaceholder>
        </div>

        {/* INFO */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pill tone="mustard">Best seller</Pill>
            <span className="pt-mono-stamp">Erode · Tamil Nadu</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.02, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "14px 0 0" }}>
            Wood-Pressed<br/>
            <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Sesame Oil</span>
          </h1>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--ink-500)" }}>
            <Stars value={5} size={14}/>
            <span><b style={{ color: "var(--green-900)" }}>4.9</b> · 612 reviews</span>
            <span>·</span>
            <span>2,847 reorders</span>
          </div>
          <p style={{ marginTop: 22, fontSize: 17, color: "var(--ink-700)", lineHeight: 1.65, maxWidth: 480 }}>
            From a single press in <i>Erode district</i>. Slow-pressed on a wooden <i>ghani</i> at 38°C, settled for 72 hours, bottled within a week. Deep amber. Nutty. Honest.
          </p>

          {/* size variants */}
          <div style={{ marginTop: 32 }}>
            <div className="pt-eyebrow" style={{ marginBottom: 12 }}>Size</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[{s:"250ml",p:240},{s:"500ml",p:420,active:true},{s:"1 litre",p:760,save:"Save 8%"}].map(o => (
                <div key={o.s} style={{
                  border: `1.5px solid ${o.active ? "var(--green-900)" : "var(--cream-400)"}`,
                  background: o.active ? "var(--cream-100)" : "transparent",
                  borderRadius: "var(--r-md)",
                  padding: "14px 16px",
                  cursor: "pointer",
                  position: "relative",
                }}>
                  {o.save && <div style={{ position: "absolute", top: -8, right: 8, background: "var(--mustard-500)", color: "var(--green-900)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>{o.save}</div>}
                  <div style={{ fontWeight: 600, color: "var(--green-900)" }}>{o.s}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>₹{o.p}</div>
                </div>
              ))}
            </div>
          </div>

          {/* purchase mode */}
          <div style={{ marginTop: 24 }}>
            <div className="pt-eyebrow" style={{ marginBottom: 12 }}>Purchase</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ border: "1.5px solid var(--cream-400)", borderRadius: "var(--r-md)", padding: "14px 16px" }}>
                <div style={{ fontWeight: 600, color: "var(--green-900)" }}>One time</div>
                <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>₹420 · ships in 2 days</div>
              </div>
              <div style={{ border: "1.5px solid var(--green-900)", background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: "14px 16px", position: "relative" }}>
                <div style={{ position: "absolute", top: -8, right: 8, background: "var(--green-800)", color: "var(--cream-100)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.06em" }}>SAVE 15%</div>
                <div style={{ fontWeight: 600, color: "var(--green-900)" }}>Subscribe</div>
                <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 2 }}>₹357 / month</div>
              </div>
            </div>
          </div>

          {/* qty + add */}
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", background: "var(--cream-100)", border: "1px solid var(--cream-400)", borderRadius: "var(--r-md)", padding: 4 }}>
              <button style={{ width: 38, height: 38, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.minus size={14}/></button>
              <span style={{ width: 26, textAlign: "center", fontWeight: 600 }}>1</span>
              <button style={{ width: 38, height: 38, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.plus size={14}/></button>
            </div>
            <button className="pt-btn pt-btn--primary pt-btn--lg" style={{ flex: 1 }}>Add to basket · ₹420</button>
            <button className="pt-btn pt-btn--ghost pt-btn--lg" style={{ padding: "0 18px" }}><Icon.heart size={18}/></button>
          </div>
          <button className="pt-btn pt-btn--mustard pt-btn--lg pt-btn--full" style={{ marginTop: 12 }}>Buy now · Express checkout</button>

          {/* shipping panel */}
          <div style={{ marginTop: 28, padding: 18, background: "var(--cream-100)", borderRadius: "var(--r-md)", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, background: "var(--green-100)", borderRadius: 999, display: "grid", placeItems: "center", color: "var(--green-800)" }}>
              <Icon.truck size={18}/>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>Free shipping · ships from Bangalore</div>
              <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>Estimated delivery to <b>560001</b>: Mon 18 Nov – Wed 20 Nov · Change pincode</div>
            </div>
          </div>

          {/* batch note */}
          <div style={{ marginTop: 16, padding: 18, background: "var(--green-950)", color: "var(--cream-100)", borderRadius: "var(--r-md)", display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Batch #047 · Lab report</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 6 }}>Pressed Nov 14 · Best by May 14, 2026</div>
              <div style={{ fontSize: 12, color: "rgba(245,239,224,0.6)", marginTop: 6 }}>Solvent residue 0.0% · FFA 1.3% · Lignans intact</div>
            </div>
            <button className="pt-btn pt-btn--mustard pt-btn--sm">PDF <Icon.arrowUpRight size={12}/></button>
          </div>
        </div>
      </div>

      {/* TABS / details */}
      <PDPTabs />

      {/* REVIEWS */}
      <PDPReviews />

      {/* Related */}
      <SectionHeader eyebrow="Goes well with" title="Other presses, same press-house." />
      <div style={{ padding: "32px 80px 80px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {[{v:"coconut",name:"Virgin Coconut",region:"Kollam · KL",price:480,weight:"500 ml"},
          {v:"groundnut",name:"Groundnut",region:"Kadapa · AP",price:380,weight:"500 ml"},
          {v:"mustard",name:"Mustard",region:"Alwar · RJ",price:360,weight:"500 ml"},
          {v:"blackSes",name:"Black Sesame",region:"Limited",price:680,weight:"250 ml",tag:"Limited",tone:"dark"}].map((p,i) => <ProductCard key={i} {...p} small />)}
      </div>

      <FooterBlock />
    </div>
  );
}

function PDPTabs() {
  return (
    <section style={{ padding: "32px 80px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, borderTop: "1px solid var(--cream-400)" }}>
      <div style={{ padding: "48px 0" }}>
        <div className="pt-eyebrow">Provenance</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "16px 0 0" }}>
          Single-farm. Single-press. <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Single batch.</span>
        </h2>
        <p style={{ marginTop: 18, fontSize: 16, color: "var(--ink-500)", lineHeight: 1.7, maxWidth: 440 }}>
          The seed was sown in June, harvested in October, sun-dried for nine days, and pressed on a wooden ghani in a press-house near Erode. We can show you the farm on a map. We've stood next to it.
        </p>
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { l: "Farm", v: "Sundaramoorthy & sons" },
            { l: "Press date", v: "Nov 14, 2025" },
            { l: "Yield", v: "1.9 L per 4kg seed" },
            { l: "Temperature", v: "38 °C peak" },
          ].map(b => (
            <div key={b.l} style={{ borderTop: "1px solid var(--cream-400)", paddingTop: 14 }}>
              <div className="pt-mono-stamp">{b.l}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)", marginTop: 4 }}>{b.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "48px 0" }}>
        <div className="pt-eyebrow">In your kitchen</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "16px 0 0" }}>
          What it's <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>good at.</span>
        </h2>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { t: "Tempering", d: "Smokes at 175°C — perfect for tadka, just at the edge of fragrance." },
            { t: "Drizzling", d: "Cold, over a banana-leaf thali or a bowl of curd rice." },
            { t: "Tradition", d: "The base of Tamil ennai-kathirikai, Andhra pulihora, Telugu pickles." },
            { t: "Pour shelf-life", d: "Six months sealed · ten weeks opened, refrigerated." },
          ].map(t => (
            <div key={t.t} style={{ display: "flex", gap: 16, paddingBottom: 14, borderBottom: "1px solid var(--cream-400)" }}>
              <Icon.check size={18}/>
              <div>
                <div style={{ fontWeight: 600, color: "var(--green-900)" }}>{t.t}</div>
                <div style={{ fontSize: 14, color: "var(--ink-500)", marginTop: 4, lineHeight: 1.6 }}>{t.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PDPReviews() {
  return (
    <section style={{ padding: "80px 80px", background: "var(--cream-300)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.4fr", gap: 64, alignItems: "flex-start" }}>
        <div>
          <div className="pt-eyebrow">Reviews · 612</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 80, lineHeight: 1, color: "var(--green-900)", letterSpacing: "-0.03em", marginTop: 14 }}>4.9</div>
          <Stars value={5} size={16}/>
          <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 6 }}>From <b style={{ color: "var(--green-900)" }}>612</b> verified buyers</div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 6 }}>
            {[5,4,3,2,1].map((n, i) => {
              const pct = [88, 8, 3, 0.6, 0.4][i];
              return (
                <div key={n} style={{ display: "grid", gridTemplateColumns: "16px 1fr 36px", gap: 10, alignItems: "center", fontSize: 12, color: "var(--ink-500)" }}>
                  <span>{n}★</span>
                  <div style={{ height: 6, background: "var(--cream-200)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", background: "var(--mustard-500)" }}/>
                  </div>
                  <span style={{ textAlign: "right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
          <button className="pt-btn pt-btn--primary" style={{ marginTop: 24 }}>Write a review</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {[
            { n: "Lakshmi V.", c: "Bangalore · Subscriber", d: "Mar 12", v: 5, t: "Brings my grandmother into the room", b: "I'd forgotten what real sesame smells like. The first dosa I made with this brought my grandmother into the room. The colour is darker than what's at the supermarket — that's the point." },
            { n: "Karthik R.", c: "Mumbai · 14 orders", d: "Mar 09", v: 5, t: "Not branding. Provenance.", b: "The batch number on the bottle matches the village I lived next to as a kid. That detail did it. Also: actually arrives in 8 days." },
            { n: "Aditi S.", c: "Delhi · First order", d: "Mar 04", v: 4, t: "Strong, almost too strong", b: "Took me three meals to adjust — supermarket oils are basically water. After a week I can't go back. Use a teaspoon less than you think." },
            { n: "Ravi K.", c: "Chennai · 7 orders", d: "Feb 28", v: 5, t: "Smokes correctly for tadka", b: "Tadka behaves the way it did at my mother's. That's all I needed to know. Repurchasing." },
          ].map((r, i) => (
            <div key={i} className="pt-card" style={{ background: "var(--cream-100)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stars value={r.v} size={12}/>
                <span className="pt-mono-stamp">{r.d}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)", marginTop: 12, lineHeight: 1.2 }}>"{r.t}"</div>
              <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.65, marginTop: 10 }}>{r.b}</p>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--cream-400)" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>{r.n}</div>
                <div className="pt-mono-stamp" style={{ marginTop: 2 }}>{r.c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- PDP MOBILE ----------
function PDPMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader back action={<div style={{ display: "flex", gap: 14 }}><Icon.heart/><Icon.bag/></div>} />
      {/* gallery */}
      <PhotoPlaceholder tone="deep" style={{ height: 420, display: "grid", placeItems: "center", borderRadius: 0, position: "relative" }}>
        <div style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }}>
          <Bottle variant="sesame" size={220}/>
        </div>
        <div style={{ position: "absolute", top: 16, left: 16 }}><Pill tone="mustard">Best seller</Pill></div>
        <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: i===0?20:6, height: 6, borderRadius: 3, background: i===0?"var(--mustard-500)":"rgba(245,239,224,0.5)" }}/>
          ))}
        </div>
      </PhotoPlaceholder>
      {/* info */}
      <div style={{ padding: "20px 16px 16px" }}>
        <span className="pt-mono-stamp">Erode · Tamil Nadu · Batch #047</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 34, lineHeight: 1.02, color: "var(--green-900)", margin: "8px 0 0", letterSpacing: "-0.02em" }}>
          Wood-Pressed <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Sesame</span>
        </h1>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-500)" }}>
          <Stars value={5} size={11}/>
          <span><b style={{ color: "var(--green-900)" }}>4.9</b> · 612 reviews</span>
        </div>
        <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6 }}>
          Slow-pressed at 38°C. Settled 72 hours. Bottled within a week of pressing. Deep amber, nutty, honest.
        </p>
      </div>
      {/* size */}
      <div style={{ padding: "0 16px" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 10 }}>Size</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[{s:"250ml",p:240},{s:"500ml",p:420,a:true},{s:"1 litre",p:760}].map(o => (
            <div key={o.s} style={{
              border: `1.5px solid ${o.a?"var(--green-900)":"var(--cream-400)"}`,
              background: o.a?"var(--cream-100)":"transparent",
              borderRadius: "var(--r-md)", padding: "10px 12px",
            }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>{o.s}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)" }}>₹{o.p}</div>
            </div>
          ))}
        </div>
      </div>
      {/* delivery panel */}
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: 14, display: "flex", gap: 12 }}>
          <div style={{ width: 34, height: 34, background: "var(--green-100)", borderRadius: 999, display: "grid", placeItems: "center", color: "var(--green-800)" }}>
            <Icon.truck size={16}/>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-900)" }}>Delivers Mon 18 – Wed 20 Nov</div>
            <div style={{ fontSize: 12, color: "var(--ink-500)" }}>Free shipping to <b>560001</b> · <span style={{ borderBottom: "1px solid var(--ink-500)" }}>Change</span></div>
          </div>
        </div>
      </div>
      {/* batch card */}
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ background: "var(--green-950)", color: "var(--cream-100)", borderRadius: "var(--r-md)", padding: 16 }}>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Batch #047</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginTop: 6 }}>Pressed Nov 14 · Best by May 14, 2026</div>
          <div style={{ fontSize: 11, color: "rgba(245,239,224,0.6)", marginTop: 4 }}>Solvent 0.0% · FFA 1.3% · Lab report PDF →</div>
        </div>
      </div>
      {/* details accordion */}
      <div style={{ padding: "0 16px 24px" }}>
        {[
          { t: "What it's good at", o: true, b: "Tempering, drizzling, and traditional Tamil/Andhra cooking. Smokes at 175°C." },
          { t: "Ingredients & extraction", o: false, b: "100% sesame seed, wood-pressed." },
          { t: "Shipping & returns", o: false },
          { t: "Reviews (612)", o: false },
        ].map((s, i) => (
          <div key={i} style={{ borderTop: "1px solid var(--cream-400)", padding: "16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--green-900)" }}>{s.t}</div>
              <span style={{ color: "var(--ink-500)" }}>{s.o ? <Icon.minus size={16}/> : <Icon.plus size={16}/>}</span>
            </div>
            {s.o && <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>{s.b}</p>}
          </div>
        ))}
      </div>
      {/* spacer for sticky CTA */}
      <div style={{ height: 100 }}/>
      {/* sticky CTA */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "rgba(251,247,236,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--cream-400)",
        padding: "14px 16px 22px",
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <div>
          <div className="pt-mono-stamp">500 ml</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--green-900)" }}>₹420</div>
        </div>
        <button className="pt-btn pt-btn--ghost" style={{ minHeight: 48, padding: "0 14px" }}><Icon.bag size={18}/></button>
        <button className="pt-btn pt-btn--primary pt-btn--lg" style={{ flex: 1 }}>Buy now</button>
      </div>
    </div>
  );
}

Object.assign(window, { PLPDesktop, PLPMobile, PDPDesktop, PDPMobile });
