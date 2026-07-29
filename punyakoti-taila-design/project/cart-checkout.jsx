// ============================================================
// CART + CHECKOUT — desktop + mobile
// ============================================================

const cartItems = [
  { v: "sesame", name: "Wood-Pressed Sesame · Til", size: "500 ml", region: "Erode · Tamil Nadu", price: 420, qty: 2, sub: false },
  { v: "coconut", name: "Virgin Coconut", size: "500 ml", region: "Kollam · Kerala", price: 480, qty: 1, sub: true },
  { v: "mustard", name: "Mustard · Sarson", size: "500 ml", region: "Alwar · Rajasthan", price: 360, qty: 1, sub: false },
];
const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
const discount = 213;
const shipping = 0;
const total = subtotal - discount + shipping;

// ---------- CART DESKTOP (drawer overlay style on PDP background) ----------
function CartDesktop() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <DesktopHeader cartCount={4} />

      {/* breadcrumb */}
      <div style={{ padding: "32px 80px 0", fontSize: 12, color: "var(--ink-500)" }}>
        Home <span style={{ opacity: 0.4 }}>/</span> <span style={{ color: "var(--green-900)" }}>Basket</span>
      </div>

      <div style={{ padding: "24px 80px 64px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }}>
        {/* LEFT */}
        <div>
          <div className="pt-eyebrow">Your basket</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "12px 0 0" }}>
            Three bottles, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>well chosen.</span>
          </h1>

          <div style={{ marginTop: 32 }}>
            {cartItems.map((it, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 24,
                padding: "26px 0",
                borderTop: i === 0 ? "1px solid var(--cream-400)" : "none",
                borderBottom: "1px solid var(--cream-400)",
                alignItems: "center",
              }}>
                <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: "12px 0", display: "grid", placeItems: "center" }}>
                  <Bottle variant={it.v} size={70}/>
                </div>
                <div>
                  <div className="pt-mono-stamp">{it.region}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--green-900)", marginTop: 4 }}>{it.name}</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-500)" }}>
                    {it.size} {it.sub && <Pill tone="green" style={{ marginLeft: 8 }}>Subscribe · save 15%</Pill>}
                  </div>
                  <div style={{ marginTop: 12, display: "flex", gap: 18, fontSize: 13, color: "var(--ink-500)" }}>
                    <button style={{ background: 0, border: 0, padding: 0, color: "var(--ink-500)", borderBottom: "1px solid var(--ink-400)" }}>Save for later</button>
                    <button style={{ background: 0, border: 0, padding: 0, color: "var(--ink-500)", borderBottom: "1px solid var(--ink-400)" }}>Remove</button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", background: "var(--cream-100)", border: "1px solid var(--cream-400)", borderRadius: "var(--r-md)", padding: 3 }}>
                    <button style={{ width: 32, height: 32, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.minus size={12}/></button>
                    <span style={{ width: 24, textAlign: "center", fontWeight: 600 }}>{it.qty}</span>
                    <button style={{ width: 32, height: 32, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.plus size={12}/></button>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 20, fontWeight: 600, color: "var(--green-900)" }}>₹{it.price * it.qty}</div>
                </div>
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div style={{ marginTop: 32, background: "var(--green-100)", borderRadius: "var(--r-md)", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
            <Icon.truck size={20}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>You unlocked free shipping. Add ₹459 more to reach the gift threshold (₹2,500).</div>
              <div style={{ marginTop: 8, height: 4, background: "var(--cream-100)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: "82%", height: "100%", background: "var(--green-800)" }}/>
              </div>
            </div>
          </div>

          {/* upsell */}
          <div style={{ marginTop: 40 }}>
            <div className="pt-eyebrow" style={{ marginBottom: 14 }}>Often added with sesame</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[{v:"groundnut",n:"Groundnut",p:380},{v:"sunflower",n:"Sunflower",p:320},{v:"blackSes",n:"Black Sesame",p:680}].map((p,i) => (
                <div key={i} className="pt-card pt-card--flat" style={{ display: "flex", gap: 12, alignItems: "center", padding: 14, background: "var(--cream-100)" }}>
                  <Bottle variant={p.v} size={48}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--green-900)" }}>{p.n}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>500 ml · ₹{p.p}</div>
                  </div>
                  <button className="pt-btn pt-btn--ghost pt-btn--sm"><Icon.plus size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — summary */}
        <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
          <div className="pt-card" style={{ padding: 28, background: "var(--cream-100)" }}>
            <div className="pt-eyebrow">Order summary</div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <Line l="Subtotal · 4 bottles" v={`₹${subtotal}`}/>
              <Line l="Subscriber discount" v={`−₹${discount}`} accent/>
              <Line l="Shipping" v="Free" muted/>
              <Line l="GST · included" v="—" muted/>
            </div>

            {/* coupon */}
            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <input className="pt-input" placeholder="Promo code" style={{ flex: 1, padding: "10px 12px" }}/>
              <button className="pt-btn pt-btn--ghost pt-btn--sm">Apply</button>
            </div>
            <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--green-100)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--green-800)", display: "flex", justifyContent: "space-between" }}>
              <span><b>WELCOME15</b> applied — Save ₹213</span>
              <Icon.close size={14}/>
            </div>

            <hr className="pt-hr" style={{ margin: "20px 0" }}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--green-900)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--green-900)" }}>₹{total}</span>
            </div>
            <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 18 }}>
              Continue to checkout <Icon.arrowRight size={14}/>
            </button>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, fontSize: 11, color: "var(--ink-500)" }}>
              <Icon.lock size={12}/> Secured by Razorpay · UPI · cards · netbanking
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "var(--ink-500)", textAlign: "center", lineHeight: 1.6 }}>
            Pressed within the last 14 days. Bottled in dark amber glass. Ships from Bangalore in two days.
          </div>
        </aside>
      </div>

      <FooterBlock/>
    </div>
  );
}

function Line({ l, v, muted, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: muted ? "var(--ink-500)" : "var(--ink-700)" }}>{l}</span>
      <span style={{ color: accent ? "var(--green-800)" : "var(--green-900)", fontWeight: accent ? 600 : 500 }}>{v}</span>
    </div>
  );
}

// ---------- CART MOBILE ----------
function CartMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader title="Basket · 4 items" back cart={false} action={<Icon.close/>}/>
      <div style={{ padding: "16px" }}>
        {cartItems.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--cream-400)", alignItems: "center" }}>
            <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: 8, display: "grid", placeItems: "center" }}>
              <Bottle variant={it.v} size={50}/>
            </div>
            <div>
              <div className="pt-mono-stamp" style={{ fontSize: 9 }}>{it.region}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--green-900)", lineHeight: 1.15, marginTop: 2 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{it.size}{it.sub && " · Subscribed"}</div>
              <div style={{ display: "inline-flex", alignItems: "center", background: "var(--cream-100)", border: "1px solid var(--cream-400)", borderRadius: 999, padding: 2, marginTop: 8 }}>
                <button style={{ width: 24, height: 24, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.minus size={11}/></button>
                <span style={{ width: 20, textAlign: "center", fontWeight: 600, fontSize: 12 }}>{it.qty}</span>
                <button style={{ width: 24, height: 24, border: 0, background: "transparent", color: "var(--green-900)" }}><Icon.plus size={11}/></button>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>₹{it.price * it.qty}</div>
          </div>
        ))}
        <div style={{ marginTop: 16, background: "var(--green-100)", borderRadius: 10, padding: 12, fontSize: 12, color: "var(--green-900)" }}>
          <Icon.truck size={14}/> Free shipping unlocked · Add ₹459 more for gift
          <div style={{ marginTop: 8, height: 4, background: "var(--cream-100)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: "82%", height: "100%", background: "var(--green-800)" }}/>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
          <Line l="Subtotal" v={`₹${subtotal}`}/>
          <Line l="Discount · WELCOME15" v={`−₹${discount}`} accent/>
          <Line l="Shipping" v="Free" muted/>
        </div>
        <hr className="pt-hr" style={{ margin: "16px 0" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>Total</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--green-900)" }}>₹{total}</span>
        </div>
        <div style={{ height: 80 }}/>
      </div>
      {/* sticky checkout */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(251,247,236,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--cream-400)", padding: "14px 16px 22px" }}>
        <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full">Checkout · ₹{total}</button>
      </div>
    </div>
  );
}

// ---------- CHECKOUT DESKTOP ----------
function CheckoutDesktop() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      {/* minimal header */}
      <div style={{ padding: "20px 80px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--cream-400)" }}>
        <Wordmark size={20} sub={false}/>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13, color: "var(--ink-500)" }}>
          <Icon.lock size={14}/> Secure checkout
          <span>·</span>
          <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 2 }}>Back to basket</a>
        </div>
      </div>

      {/* stepper */}
      <div style={{ padding: "32px 80px 16px", display: "flex", justifyContent: "center", gap: 28 }}>
        {[
          { n: "01", t: "Contact", done: true },
          { n: "02", t: "Shipping", done: true },
          { n: "03", t: "Delivery", active: true },
          { n: "04", t: "Payment" },
        ].map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 14,
              background: s.done ? "var(--green-800)" : s.active ? "var(--cream-100)" : "transparent",
              border: s.done ? "none" : `1.5px solid ${s.active ? "var(--green-900)" : "var(--cream-400)"}`,
              color: s.done ? "var(--cream-100)" : s.active ? "var(--green-900)" : "var(--ink-400)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
            }}>{s.done ? <Icon.check size={12}/> : s.n}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: s.active ? "var(--green-900)" : "var(--ink-500)" }}>{s.t}</span>
            {i < 3 && <div style={{ width: 32, height: 1, background: "var(--cream-400)" }}/>}
          </div>
        ))}
      </div>

      <div style={{ padding: "40px 80px 80px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 56 }}>
        <div>
          {/* contact summary */}
          <CompactSummaryRow label="Contact" value="lakshmi@kitchen.in · +91 98XXX XXX42"/>
          <CompactSummaryRow label="Shipping address" value="L. Venkataraman · 14/2 4th Cross, Indiranagar, Bangalore 560038"/>

          {/* delivery method active */}
          <div style={{ paddingBottom: 18, marginBottom: 18, borderBottom: "1px solid var(--cream-400)" }}>
            <div className="pt-eyebrow" style={{ marginBottom: 14 }}>Delivery method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { t: "Standard", d: "Free · Mon 18 – Wed 20 Nov", p: "Free", a: true },
                { t: "Express", d: "Sun 17 Nov · before 6pm", p: "₹89" },
              ].map(o => (
                <div key={o.t} style={{
                  display: "grid", gridTemplateColumns: "20px 1fr auto", gap: 14, alignItems: "center",
                  padding: 18, borderRadius: "var(--r-md)",
                  background: o.a ? "var(--cream-100)" : "transparent",
                  border: `1.5px solid ${o.a ? "var(--green-900)" : "var(--cream-400)"}`,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `1.5px solid ${o.a ? "var(--green-900)" : "var(--wood-300)"}`,
                    display: "grid", placeItems: "center",
                  }}>{o.a && <div style={{ width: 8, height: 8, background: "var(--green-900)", borderRadius: 4 }}/>}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--green-900)", display: "flex", gap: 8, alignItems: "center" }}>
                      {o.t} {o.tag && <Pill tone="green">{o.tag}</Pill>}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink-500)", marginTop: 4 }}>{o.d}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--green-900)" }}>{o.p}</div>
                </div>
              ))}
            </div>
            <label style={{ marginTop: 16, display: "flex", gap: 10, fontSize: 13, color: "var(--ink-500)", alignItems: "center" }}>
              <span style={{ width: 18, height: 18, border: "1.4px solid var(--wood-300)", borderRadius: 4, background: "var(--green-800)", display: "grid", placeItems: "center", color: "var(--cream-100)" }}><Icon.check size={11}/></span>
              Leave at the door if I'm not home
            </label>
          </div>

          {/* payment locked next */}
          <div style={{ padding: 22, border: "1px solid var(--cream-400)", borderRadius: "var(--r-md)", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.7 }}>
            <div>
              <div className="pt-eyebrow">Payment · next</div>
              <div style={{ marginTop: 6, fontSize: 14, color: "var(--ink-500)" }}>UPI · cards · netbanking — secured by Razorpay</div>
            </div>
            <Icon.lock size={20}/>
          </div>

          <div style={{ marginTop: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a style={{ fontSize: 14, color: "var(--ink-500)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon.arrowLeft size={14}/> Back to shipping
            </a>
            <button className="pt-btn pt-btn--primary pt-btn--lg">Continue to payment <Icon.arrowRight size={14}/></button>
          </div>
        </div>

        {/* summary right */}
        <aside style={{ position: "sticky", top: 24, alignSelf: "start" }}>
          <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-lg)", padding: 24, boxShadow: "var(--sh-sm)" }}>
            <div className="pt-eyebrow">In your order · 4</div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              {cartItems.map((it, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center" }}>
                  <div style={{ background: "var(--cream-200)", borderRadius: 8, padding: 4, display: "grid", placeItems: "center", position: "relative" }}>
                    <Bottle variant={it.v} size={32}/>
                    <span style={{ position: "absolute", top: -6, right: -6, background: "var(--wood-700)", color: "var(--cream-100)", fontSize: 9, fontWeight: 700, width: 16, height: 16, borderRadius: 8, display: "grid", placeItems: "center" }}>{it.qty}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-900)", lineHeight: 1.2 }}>{it.name}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{it.size}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--green-900)", fontWeight: 500 }}>₹{it.price * it.qty}</div>
                </div>
              ))}
            </div>
            <hr className="pt-hr" style={{ margin: "20px 0" }}/>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
              <Line l="Subtotal" v={`₹${subtotal}`}/>
              <Line l="WELCOME15" v={`−₹${discount}`} accent/>
              <Line l="Shipping" v="Free" muted/>
            </div>
            <hr className="pt-hr" style={{ margin: "16px 0" }}/>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--green-900)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--green-900)" }}>₹{total}</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--ink-500)" }}>Includes ₹148 GST · Free shipping</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CompactSummaryRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 14, alignItems: "center", padding: "20px 0", borderBottom: "1px solid var(--cream-400)" }}>
      <div className="pt-eyebrow">{label}</div>
      <div style={{ fontSize: 14, color: "var(--green-900)" }}>{value}</div>
      <button style={{ background: 0, border: 0, color: "var(--green-800)", fontSize: 13, borderBottom: "1px solid var(--green-800)", paddingBottom: 2 }}>Change</button>
    </div>
  );
}

// ---------- CHECKOUT MOBILE ----------
function CheckoutMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--cream-400)" }}>
        <button style={{ background: 0, border: 0, color: "var(--green-900)" }}><Icon.arrowLeft/></button>
        <Wordmark size={16} sub={false}/>
        <Icon.lock size={16}/>
      </div>
      {/* compact stepper */}
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n <= 3 ? "var(--green-800)" : "var(--cream-400)" }}/>
          ))}
        </div>
        <span style={{ marginLeft: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)" }}>03 / 04</span>
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        <div className="pt-eyebrow">Step 03</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, lineHeight: 1.02, color: "var(--green-900)", margin: "8px 0 0", letterSpacing: "-0.02em" }}>
          When would you like <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>delivery?</span>
        </h1>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { t: "Standard", d: "Free · Mon 18 – Wed 20 Nov", p: "Free", a: true },
          { t: "Express", d: "Sun 17 · before 6pm", p: "₹89" },
        ].map(o => (
          <div key={o.t} style={{
            padding: 14, borderRadius: "var(--r-md)",
            background: o.a ? "var(--cream-100)" : "transparent",
            border: `1.5px solid ${o.a ? "var(--green-900)" : "var(--cream-400)"}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 16, height: 16, borderRadius: 8,
                border: `1.5px solid ${o.a ? "var(--green-900)" : "var(--wood-300)"}`,
                display: "grid", placeItems: "center",
              }}>{o.a && <div style={{ width: 7, height: 7, background: "var(--green-900)", borderRadius: 4 }}/>}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>{o.t}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{o.d}</div>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--green-900)" }}>{o.p}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "24px 16px" }}>
        <div style={{ padding: 16, background: "var(--green-100)", borderRadius: 10, fontSize: 12, color: "var(--green-900)", display: "flex", gap: 12, alignItems: "center" }}>
          <Icon.leaf size={16}/>
          Pressed Nov 14 · Bottled Nov 16 · In your kitchen by Nov 20.
        </div>
      </div>

      <div style={{ height: 110 }}/>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(251,247,236,0.96)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--cream-400)", padding: "14px 16px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-500)", marginBottom: 8 }}>
          <span>Total · 4 bottles</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>₹{total}</span>
        </div>
        <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full">Continue to payment</button>
      </div>
    </div>
  );
}

Object.assign(window, { CartDesktop, CartMobile, CheckoutDesktop, CheckoutMobile });
