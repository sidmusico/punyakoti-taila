// ============================================================
// PAYMENT — Razorpay modal, UPI flow, processing, failure
// ORDER — success + tracking
// ============================================================

// ---------- 1. Razorpay-style payment modal (mobile-sized card) ----------
function PaymentRazorpay() {
  return (
    <div className="pt-artboard" style={{ background: "rgba(15,26,14,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "end center", padding: "20px 20px 0" }}>
      {/* faint backdrop hint */}
      <div style={{
        width: 360,
        background: "var(--cream-100)", borderRadius: "20px 20px 0 0",
        boxShadow: "var(--sh-xl)",
        overflow: "hidden",
        maxHeight: "94%",
      }}>
        {/* top bar — Razorpay-style branded */}
        <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--cream-300)", background: "var(--green-950)", color: "var(--cream-100)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Monogram size={26}/>
            <div>
              <div style={{ fontSize: 11, color: "rgba(245,239,224,0.6)", letterSpacing: "0.06em" }}>Pay Punyakoti Taila</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--cream-100)" }}>₹1,047</div>
            </div>
          </div>
          <Icon.close/>
        </div>

        <div style={{ padding: 16 }}>
          <div className="pt-eyebrow" style={{ marginBottom: 10 }}>Pay using</div>
          {/* UPI featured */}
          <div style={{ border: "1.5px solid var(--green-900)", borderRadius: "var(--r-md)", padding: 14, background: "var(--cream-200)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--green-900)", color: "var(--mustard-400)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12 }}>UPI</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--green-900)" }}>UPI · Pay instantly</div>
              </div>
              <Pill tone="mustard">Saves ₹0 fee</Pill>
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[
                { n: "GPay", c: "var(--terra-300)" },
                { n: "PhonePe", c: "#6D40B4" },
                { n: "Paytm", c: "#1A4B8C" },
                { n: "More", c: "var(--wood-500)" },
              ].map(a => (
                <div key={a.n} style={{ background: "var(--cream-100)", borderRadius: 8, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ width: 28, height: 28, background: a.c, borderRadius: 6, margin: "0 auto 4px" }}/>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "var(--green-900)" }}>{a.n}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input className="pt-input" placeholder="yourname@bank" style={{ padding: "10px 12px", fontSize: 13 }}/>
              <button className="pt-btn pt-btn--primary pt-btn--sm">Verify</button>
            </div>
          </div>

          {/* other methods */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { i: Icon.credit, t: "Cards · Visa, Mastercard, RuPay" },
              { i: Icon.package, t: "Netbanking · 60+ banks" },
              { i: Icon.clock, t: "Pay later · Simpl, LazyPay" },
              { i: Icon.truck, t: "Cash on delivery · ₹40 fee" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid var(--cream-400)", borderRadius: "var(--r-md)", color: "var(--green-900)" }}>
                <m.i size={18}/>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.t}</div>
                <Icon.chevRight size={16}/>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--cream-300)", borderRadius: "var(--r-sm)", fontSize: 11, color: "var(--ink-700)", display: "flex", gap: 8, alignItems: "center" }}>
            <Icon.shield size={14}/> Razorpay holds funds until your bottle ships. PCI-DSS · 256-bit.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- 2. UPI processing/waiting state ----------
function PaymentProcessing() {
  return (
    <div className="pt-artboard" style={{ background: "var(--green-950)", color: "var(--cream-100)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, display: "grid", placeItems: "center" }}>
        <CowMark size={420} color="var(--mustard-400)"/>
      </div>
      <Monogram size={36}/>
      <div className="pt-eyebrow" style={{ marginTop: 32, color: "var(--mustard-400)" }}>Step 4 of 4 · Payment</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, color: "var(--cream-100)", margin: "16px 0 0", textAlign: "center", letterSpacing: "-0.02em" }}>
        Open your UPI app<br/>
        <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>and approve.</span>
      </h1>
      <p style={{ marginTop: 16, fontSize: 14, color: "rgba(245,239,224,0.6)", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
        We've sent a collect request to <b>lakshmi@oksbi</b>. Your payment will be confirmed automatically.
      </p>

      {/* circular timer */}
      <div style={{ marginTop: 32, position: "relative", width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(245,239,224,0.12)" strokeWidth="3"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--mustard-400)" strokeWidth="3" strokeDasharray="326" strokeDashoffset="80" strokeLinecap="round"/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, color: "var(--cream-100)", textAlign: "center" }}>02:14</div>
            <div style={{ fontSize: 10, color: "rgba(245,239,224,0.5)", letterSpacing: "0.1em", textAlign: "center", marginTop: 2 }}>WAITING</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, background: "rgba(245,239,224,0.06)", border: "1px solid rgba(245,239,224,0.12)", borderRadius: "var(--r-md)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", width: 320 }}>
        <div>
          <div style={{ fontSize: 11, color: "rgba(245,239,224,0.5)", letterSpacing: "0.06em" }}>PAYING</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginTop: 2 }}>₹1,047 · to Punyakoti</div>
        </div>
        <Icon.lock size={20}/>
      </div>
      <button className="pt-btn pt-btn--mustard" style={{ marginTop: 24 }}>Open UPI app <Icon.arrowUpRight size={14}/></button>
      <button style={{ marginTop: 12, background: 0, border: 0, color: "rgba(245,239,224,0.6)", fontSize: 13, padding: 8 }}>Try a different method</button>
    </div>
  );
}

// ---------- 3. Payment failed / retry ----------
function PaymentFailed() {
  return (
    <div className="pt-artboard" style={{ background: "var(--cream-200)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, display: "grid", placeItems: "center" }}>
        <CowMark size={400} color="var(--terra-600)"/>
      </div>
      <div style={{ width: 72, height: 72, borderRadius: 36, background: "var(--terra-100)", display: "grid", placeItems: "center", color: "var(--terra-700)" }}>
        <Icon.close size={32}/>
      </div>
      <div className="pt-eyebrow" style={{ marginTop: 24, color: "var(--terra-600)" }}>Payment didn't go through</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.05, color: "var(--green-900)", margin: "16px 0 0", letterSpacing: "-0.02em", maxWidth: 360 }}>
        That's alright. <span className="pt-display-italic" style={{ color: "var(--terra-600)" }}>Try again?</span>
      </h1>
      <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-500)", maxWidth: 320, lineHeight: 1.6 }}>
        Your bank declined the UPI collect request (<span className="pt-mono-stamp">UPI:U30 · expired</span>). Your basket is held for 30 minutes.
      </p>
      <div style={{ marginTop: 24, padding: 16, background: "var(--cream-100)", borderRadius: "var(--r-md)", width: 320 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "var(--ink-500)" }}>Order #PT-24011</span>
          <span style={{ fontWeight: 600, color: "var(--green-900)" }}>₹1,047</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: "var(--ink-500)" }}>4 bottles · WELCOME15 still applies</div>
      </div>
      <button className="pt-btn pt-btn--primary pt-btn--lg" style={{ marginTop: 24, minWidth: 240 }}>Try payment again</button>
      <button className="pt-btn pt-btn--ghost pt-btn--sm" style={{ marginTop: 12 }}>Use a different method</button>
      <div style={{ marginTop: 20, fontSize: 12, color: "var(--ink-500)" }}>
        Need help? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1 }}>WhatsApp +91 98XXX XXX42</a>
      </div>
    </div>
  );
}

// ---------- 4. Order success ----------
function OrderSuccess() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <div style={{ padding: "20px 80px", borderBottom: "1px solid var(--cream-400)", display: "flex", justifyContent: "space-between" }}>
        <Wordmark size={20} sub={false}/>
        <div style={{ fontSize: 12, color: "var(--ink-500)" }}>Order confirmation</div>
      </div>

      {/* hero */}
      <section style={{ padding: "80px 80px 40px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "var(--green-100)", color: "var(--green-800)", display: "grid", placeItems: "center" }}>
            <Icon.check size={24}/>
          </div>
          <div className="pt-eyebrow" style={{ marginTop: 24 }}>Order #PT-24011 · received</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 72, lineHeight: 1, letterSpacing: "-0.025em", color: "var(--green-900)", margin: "20px 0 0" }}>
            Thank you, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Lakshmi.</span>
          </h1>
          <p style={{ marginTop: 22, fontSize: 18, color: "var(--ink-700)", lineHeight: 1.6, maxWidth: 480 }}>
            Your bottles will be packed Friday morning and dispatched from Bangalore the same evening. Estimated delivery <b>Mon 18 – Wed 20 Nov</b>.
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <button className="pt-btn pt-btn--primary pt-btn--lg">Track your order</button>
            <button className="pt-btn pt-btn--ghost pt-btn--lg">Download invoice</button>
          </div>
          <div style={{ marginTop: 24, fontSize: 13, color: "var(--ink-500)" }}>
            Confirmation sent to <b>lakshmi@kitchen.in</b> and WhatsApp +91 98XXX XXX42.
          </div>
        </div>
        <div>
          <PhotoPlaceholder tone="warm" style={{ aspectRatio: "4/5", borderRadius: "var(--r-xl)", display: "grid", placeItems: "center", position: "relative" }}>
            <div style={{ display: "flex", gap: 4 }}>
              <Bottle variant="sesame" size={130}/>
              <Bottle variant="coconut" size={130}/>
              <Bottle variant="mustard" size={130}/>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 24, right: 24, color: "var(--cream-100)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
              <span>4 bottles · 2 batches</span><span style={{ color: "var(--mustard-200)" }}>Bangalore → 560038</span>
            </div>
          </PhotoPlaceholder>
        </div>
      </section>

      {/* timeline */}
      <section style={{ padding: "32px 80px 64px" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 18 }}>Your bottles, on their way</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 20 }}>
          {[
            { t: "Order placed", d: "Today · 14:08", done: true },
            { t: "Bottling", d: "Fri 15 Nov · morning", done: true },
            { t: "Out for delivery", d: "Mon 18 Nov · expected", active: true },
            { t: "Delivered", d: "Wed 20 Nov · estimated" },
          ].map((s, i) => (
            <div key={i} style={{ position: "relative", padding: "0 8px" }}>
              <div style={{ position: "absolute", top: 11, left: 0, right: 0, height: 2, background: s.done || s.active ? "var(--green-800)" : "var(--cream-400)" }}/>
              <div style={{ position: "relative", width: 24, height: 24, borderRadius: 12, background: s.done ? "var(--green-800)" : s.active ? "var(--mustard-500)" : "var(--cream-300)", border: "3px solid var(--cream-200)", display: "grid", placeItems: "center", color: "var(--cream-100)" }}>
                {s.done && <Icon.check size={12}/>}
                {s.active && <div style={{ width: 8, height: 8, background: "var(--green-900)", borderRadius: 4 }}/>}
              </div>
              <div style={{ marginTop: 16, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>{s.t}</div>
              <div className="pt-mono-stamp" style={{ marginTop: 4 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* details panels */}
      <section style={{ padding: "0 80px 80px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        <div className="pt-card" style={{ background: "var(--cream-100)" }}>
          <div className="pt-eyebrow">Shipping to</div>
          <div style={{ marginTop: 14, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>L. Venkataraman</div>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.65 }}>
            14/2 4th Cross, Indiranagar<br/>Bangalore 560038<br/>+91 98XXX XXX42
          </p>
        </div>
        <div className="pt-card" style={{ background: "var(--cream-100)" }}>
          <div className="pt-eyebrow">Payment</div>
          <div style={{ marginTop: 14, fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>UPI · oksbi</div>
          <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.65 }}>
            ₹1,047 paid · receipt #RZP-9837<br/>WELCOME15 applied · −₹213
          </p>
        </div>
        <div className="pt-card" style={{ background: "var(--green-950)", color: "var(--cream-100)" }}>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>One more thing</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginTop: 14, lineHeight: 1.2 }}>Subscribe to your sesame and save 15%</div>
          <button className="pt-btn pt-btn--mustard pt-btn--sm" style={{ marginTop: 16 }}>Set up subscription</button>
        </div>
      </section>

      <FooterBlock/>
    </div>
  );
}

// ---------- 5. Order tracking ----------
function OrderTracking() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <DesktopHeader cartCount={0}/>
      <div style={{ padding: "40px 80px 0", fontSize: 12, color: "var(--ink-500)" }}>
        Account <span style={{ opacity: 0.4 }}>/</span> Orders <span style={{ opacity: 0.4 }}>/</span> <span style={{ color: "var(--green-900)" }}>#PT-24011</span>
      </div>

      <div style={{ padding: "24px 80px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="pt-eyebrow">Order #PT-24011 · placed 14 Nov</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "12px 0 0" }}>
            Out for <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>delivery.</span>
          </h1>
          <p style={{ marginTop: 14, fontSize: 16, color: "var(--ink-500)" }}>
            Expected today between <b style={{ color: "var(--green-900)" }}>4:00 – 6:30 pm</b> · Delhivery agent Suresh M.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="pt-btn pt-btn--ghost">Need help?</button>
          <button className="pt-btn pt-btn--primary">Track on map <Icon.arrowUpRight size={14}/></button>
        </div>
      </div>

      <div style={{ padding: "0 80px 80px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 56 }}>
        {/* timeline left */}
        <div>
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div style={{ position: "absolute", left: 11, top: 6, bottom: 6, width: 2, background: "var(--cream-400)" }}/>
            {[
              { t: "Out for delivery", d: "Today · 11:42", b: "Agent Suresh M. picked up your parcel from the Indiranagar hub.", done: true, active: true },
              { t: "Dispatched · Bangalore", d: "Sun 17 · 09:14", b: "Departed our packing room in Yelahanka. 4 bottles, 1.2 kg.", done: true },
              { t: "Bottled & sealed", d: "Fri 15 · 11:02", b: "Batch #047 sesame · Batch #019 coconut · Batch #028 mustard.", done: true },
              { t: "Pressed & settled", d: "Nov 14 · Erode press", b: "Sesame: 9-hour press at 38°C, settled 72 hours. Lab-tested clean.", done: true },
              { t: "Order received", d: "Thu 14 · 14:08", b: "Confirmed via UPI · ₹1,047 received from oksbi.", done: true },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative", paddingBottom: 32 }}>
                <div style={{
                  position: "absolute", left: -28, top: 2,
                  width: 24, height: 24, borderRadius: 12,
                  background: s.active ? "var(--mustard-500)" : s.done ? "var(--green-800)" : "var(--cream-300)",
                  color: "var(--cream-100)",
                  display: "grid", placeItems: "center",
                  border: "3px solid var(--cream-200)",
                }}>
                  {s.done && <Icon.check size={12}/>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: s.active ? "var(--mustard-700)" : "var(--green-900)" }}>{s.t}</div>
                  <div className="pt-mono-stamp">{s.d}</div>
                </div>
                <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6, maxWidth: 540 }}>{s.b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* right */}
        <aside>
          <div className="pt-card" style={{ background: "var(--cream-100)" }}>
            <div className="pt-eyebrow">Inside the box · 4 bottles</div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {cartItems.map((it, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 12, alignItems: "center" }}>
                  <div style={{ background: "var(--cream-200)", borderRadius: 8, padding: 4, display: "grid", placeItems: "center" }}>
                    <Bottle variant={it.v} size={32}/>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-900)" }}>{it.name}</div>
                    <div className="pt-mono-stamp" style={{ marginTop: 2 }}>{it.size} · ×{it.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--green-900)" }}>₹{it.price * it.qty}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-card" style={{ background: "var(--green-950)", color: "var(--cream-100)", marginTop: 16 }}>
            <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Your agent</div>
            <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "var(--mustard-400)", color: "var(--green-950)", display: "grid", placeItems: "center", fontWeight: 700 }}>SM</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Suresh M.</div>
                <div className="pt-mono-stamp" style={{ color: "rgba(245,239,224,0.6)" }}>Delhivery · ID #DLH-9128</div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button className="pt-btn pt-btn--mustard pt-btn--sm" style={{ flex: 1 }}><Icon.phone size={14}/> Call</button>
              <button className="pt-btn pt-btn--inverse pt-btn--sm" style={{ background: "transparent", color: "var(--cream-100)", border: "1px solid rgba(245,239,224,0.2)", flex: 1 }}>Chat</button>
            </div>
          </div>

          <div className="pt-card pt-card--flat" style={{ marginTop: 16, background: "transparent", border: "1px solid var(--cream-400)" }}>
            <div className="pt-eyebrow">Delivery address</div>
            <div style={{ marginTop: 10, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.6 }}>
              14/2 4th Cross, Indiranagar<br/>Bangalore 560038<br/>+91 98XXX XXX42
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// PAYMENT — DESKTOP VARIANTS (modal over dimmed checkout)
// ============================================================

function CheckoutBackdrop() {
  return (
    <div style={{ position: "absolute", inset: 0, filter: "blur(4px) saturate(0.9)", opacity: 0.55, pointerEvents: "none", overflow: "hidden" }}>
      <CheckoutDesktop/>
    </div>
  );
}

function PaymentRazorpayDesktop() {
  return (
    <div className="pt-artboard" style={{ background: "var(--cream-200)", position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      <CheckoutBackdrop/>
      <div style={{ position: "absolute", inset: 0, background: "rgba(15,26,14,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 40 }}>
        <div style={{
          width: 520, background: "var(--cream-100)",
          borderRadius: "var(--r-xl)", boxShadow: "var(--sh-xl)",
          overflow: "hidden", maxHeight: "92%",
        }}>
          <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--green-950)", color: "var(--cream-100)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Monogram size={32}/>
              <div>
                <div style={{ fontSize: 11, color: "rgba(245,239,224,0.6)", letterSpacing: "0.06em" }}>Pay Punyakoti Taila</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--cream-100)" }}>₹1,047</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 11, color: "rgba(245,239,224,0.5)", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.lock size={12}/> RAZORPAY · SECURE</span>
              <Icon.close/>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <div className="pt-eyebrow" style={{ marginBottom: 12 }}>Pay using</div>
            <div style={{ border: "1.5px solid var(--green-900)", borderRadius: "var(--r-md)", padding: 18, background: "var(--cream-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--green-900)", color: "var(--mustard-400)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 13 }}>UPI</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--green-900)" }}>UPI · Pay instantly</div>
                    <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>Funds debit in 2 seconds, no card fee</div>
                  </div>
                </div>
                <Pill tone="mustard">Recommended</Pill>
              </div>
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { n: "GPay", c: "var(--terra-300)" },
                  { n: "PhonePe", c: "#6D40B4" },
                  { n: "Paytm", c: "#1A4B8C" },
                  { n: "More", c: "var(--wood-500)" },
                ].map(a => (
                  <div key={a.n} style={{ background: "var(--cream-100)", borderRadius: 8, padding: "12px 6px", textAlign: "center" }}>
                    <div style={{ width: 32, height: 32, background: a.c, borderRadius: 6, margin: "0 auto 4px" }}/>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green-900)" }}>{a.n}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <input className="pt-input" placeholder="yourname@bank" style={{ padding: "12px 14px", fontSize: 14 }}/>
                <button className="pt-btn pt-btn--primary pt-btn--sm">Verify</button>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { i: Icon.credit, t: "Cards" },
                { i: Icon.package, t: "Netbanking" },
                { i: Icon.clock, t: "Pay later" },
                { i: Icon.truck, t: "Cash on delivery" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid var(--cream-400)", borderRadius: "var(--r-md)", color: "var(--green-900)" }}>
                  <m.i size={18}/>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.t}</div>
                  <Icon.chevRight size={14}/>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--cream-300)", borderRadius: "var(--r-sm)", fontSize: 12, color: "var(--ink-700)", display: "flex", gap: 10, alignItems: "center" }}>
              <Icon.shield size={14}/> Razorpay holds funds until your bottle ships. PCI-DSS · 256-bit encryption.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentProcessingDesktop() {
  return (
    <div className="pt-artboard" style={{ background: "var(--green-950)", color: "var(--cream-100)", position: "relative", overflow: "hidden", padding: "56px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, display: "grid", placeItems: "center" }}>
        <CowMark size={720} color="var(--mustard-400)"/>
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Monogram size={36}/>
        <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Step 4 of 4 · Payment</div>
      </div>
      <div style={{ position: "relative", flex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center", marginTop: 24 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 88, lineHeight: 0.98, color: "var(--cream-100)", letterSpacing: "-0.025em", margin: 0 }}>
            Open your UPI app<br/>
            <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>and approve.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 18, color: "rgba(245,239,224,0.65)", lineHeight: 1.6, maxWidth: 520 }}>
            We've sent a collect request to <b style={{ color: "var(--cream-100)" }}>lakshmi@oksbi</b>. Your payment will be confirmed automatically — keep this tab open.
          </p>
          <div style={{ marginTop: 32, display: "flex", gap: 14 }}>
            <button className="pt-btn pt-btn--mustard pt-btn--lg">Open UPI app <Icon.arrowUpRight size={14}/></button>
            <button className="pt-btn pt-btn--lg" style={{ background: "rgba(245,239,224,0.08)", color: "var(--cream-100)", border: "1px solid rgba(245,239,224,0.15)" }}>Try a different method</button>
          </div>
          <div style={{ marginTop: 28, display: "flex", gap: 28, fontSize: 12, color: "rgba(245,239,224,0.55)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.lock size={14}/> 256-bit TLS</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.shield size={14}/> RBI tokenised</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.check size={14}/> No card stored</span>
          </div>
        </div>

        {/* timer + summary */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ position: "relative", width: 240, height: 240 }}>
            <svg width="240" height="240" viewBox="0 0 240 240" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(245,239,224,0.1)" strokeWidth="4"/>
              <circle cx="120" cy="120" r="108" fill="none" stroke="var(--mustard-400)" strokeWidth="4" strokeDasharray="678" strokeDashoffset="160" strokeLinecap="round"/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 56, color: "var(--cream-100)" }}>02:14</div>
                <div style={{ fontSize: 11, color: "rgba(245,239,224,0.5)", letterSpacing: "0.18em", marginTop: 4 }}>WAITING</div>
              </div>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 360, background: "rgba(245,239,224,0.05)", border: "1px solid rgba(245,239,224,0.12)", borderRadius: "var(--r-md)", padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(245,239,224,0.5)", letterSpacing: "0.1em" }}>PAYING</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginTop: 2 }}>₹1,047</div>
              </div>
              <Icon.lock size={20}/>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(245,239,224,0.1)", fontSize: 12, color: "rgba(245,239,224,0.6)" }}>
              To Punyakoti Taila Pvt. Ltd. · Razorpay #RZP-9837
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentFailedDesktop() {
  return (
    <div className="pt-artboard" style={{ background: "var(--cream-200)", position: "relative", overflow: "hidden", padding: "80px 80px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, display: "grid", placeItems: "center" }}>
        <CowMark size={720} color="var(--terra-600)"/>
      </div>
      <div style={{ position: "relative", width: 96, height: 96, borderRadius: 48, background: "var(--terra-100)", display: "grid", placeItems: "center", color: "var(--terra-700)" }}>
        <Icon.close size={40}/>
      </div>
      <div className="pt-eyebrow" style={{ marginTop: 28, color: "var(--terra-600)", position: "relative" }}>Payment didn't go through</div>
      <h1 style={{ position: "relative", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 72, lineHeight: 1, color: "var(--green-900)", letterSpacing: "-0.025em", margin: "20px 0 0", maxWidth: 760 }}>
        That's alright. <span className="pt-display-italic" style={{ color: "var(--terra-600)" }}>Try again?</span>
      </h1>
      <p style={{ position: "relative", marginTop: 18, fontSize: 17, color: "var(--ink-500)", maxWidth: 540, lineHeight: 1.65 }}>
        Your bank declined the UPI collect request (<span className="pt-mono-stamp">UPI:U30 · expired</span>). No money was debited. Your basket is held for 30 minutes.
      </p>
      <div style={{ position: "relative", marginTop: 32, padding: 24, background: "var(--cream-100)", borderRadius: "var(--r-lg)", width: 480, boxShadow: "var(--sh-sm)", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="pt-mono-stamp">ORDER #PT-24011</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--green-900)", marginTop: 6 }}>₹1,047 · 4 bottles</div>
          </div>
          <Pill tone="mustard">WELCOME15 still applies</Pill>
        </div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--cream-400)", fontSize: 13, color: "var(--ink-500)" }}>
          Sesame · Coconut · Mustard · Black Sesame · Free shipping
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 28, display: "flex", gap: 12 }}>
        <button className="pt-btn pt-btn--primary pt-btn--lg" style={{ minWidth: 240 }}>Try payment again</button>
        <button className="pt-btn pt-btn--ghost pt-btn--lg">Use a different method</button>
      </div>
      <div style={{ position: "relative", marginTop: 24, fontSize: 13, color: "var(--ink-500)" }}>
        Need help? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1 }}>WhatsApp +91 98XXX XXX42</a>
      </div>
    </div>
  );
}

// ============================================================
// ORDER — MOBILE VARIANTS
// ============================================================

function OrderSuccessMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", background: "var(--cream-200)" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark size={16} sub={false}/>
        <div className="pt-mono-stamp">#PT-24011</div>
      </div>

      {/* hero */}
      <div style={{ padding: "28px 20px 8px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--green-100)", color: "var(--green-800)", display: "grid", placeItems: "center", margin: "0 auto" }}>
          <Icon.check size={28}/>
        </div>
        <div className="pt-eyebrow" style={{ marginTop: 20 }}>Order received</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "12px 0 0" }}>
          Thank you,<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Lakshmi.</span>
        </h1>
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6, padding: "0 8px" }}>
          Packed Friday, dispatched same evening. <b style={{ color: "var(--green-900)" }}>Mon 18 — Wed 20 Nov</b>.
        </p>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <PhotoPlaceholder tone="warm" style={{ borderRadius: "var(--r-lg)", padding: "28px 20px", display: "grid", placeItems: "center", position: "relative" }}>
          <div style={{ display: "flex", gap: 2 }}>
            <Bottle variant="sesame" size={72}/>
            <Bottle variant="coconut" size={72}/>
            <Bottle variant="mustard" size={72}/>
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 14, right: 14, color: "var(--cream-100)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
            <span>4 bottles · 2 batches</span><span style={{ color: "var(--mustard-200)" }}>→ 560038</span>
          </div>
        </PhotoPlaceholder>
      </div>

      <div style={{ padding: "20px", display: "flex", gap: 10 }}>
        <button className="pt-btn pt-btn--primary pt-btn--full">Track your order</button>
        <button className="pt-btn pt-btn--ghost" style={{ flex: "0 0 auto" }}><Icon.arrowUpRight size={14}/></button>
      </div>

      {/* timeline */}
      <div style={{ padding: "8px 20px 0" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 14 }}>Your bottles, on their way</div>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "var(--cream-400)" }}/>
          {[
            { t: "Order placed", d: "Today · 14:08", done: true },
            { t: "Bottling", d: "Fri 15 · morning", done: true },
            { t: "Out for delivery", d: "Mon 18 · expected", active: true },
            { t: "Delivered", d: "Wed 20 · estimated" },
          ].map((s, i) => (
            <div key={i} style={{ position: "relative", paddingBottom: 18 }}>
              <div style={{
                position: "absolute", left: -24, top: 2,
                width: 22, height: 22, borderRadius: 11,
                background: s.active ? "var(--mustard-500)" : s.done ? "var(--green-800)" : "var(--cream-300)",
                color: "var(--cream-100)",
                display: "grid", placeItems: "center",
                border: "3px solid var(--cream-200)",
              }}>
                {s.done && <Icon.check size={10}/>}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: s.active ? "var(--mustard-700)" : "var(--green-900)" }}>{s.t}</div>
              <div className="pt-mono-stamp" style={{ marginTop: 2 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* detail cards */}
      <div style={{ padding: "8px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", padding: 16 }}>
          <div className="pt-eyebrow">Shipping to</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green-900)", marginTop: 8 }}>L. Venkataraman</div>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-700)", lineHeight: 1.6 }}>14/2 4th Cross, Indiranagar, Bangalore 560038</p>
        </div>
        <div className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", padding: 16 }}>
          <div className="pt-eyebrow">Payment</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green-900)", marginTop: 8 }}>UPI · oksbi</div>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-700)" }}>₹1,047 paid · WELCOME15 (−₹213) · receipt #RZP-9837</p>
        </div>
        <div className="pt-card" style={{ background: "var(--green-950)", color: "var(--cream-100)", padding: 18 }}>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>One more thing</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 10, lineHeight: 1.2 }}>Subscribe to your sesame, save 15%</div>
          <button className="pt-btn pt-btn--mustard pt-btn--sm" style={{ marginTop: 14 }}>Set up subscription</button>
        </div>
      </div>

      <div style={{ height: 24 }}/>
    </div>
  );
}

function OrderTrackingMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", background: "var(--cream-200)", position: "relative" }}>
      <MobileHeader title="Tracking" back={true}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div className="pt-eyebrow">Order #PT-24011 · 14 Nov</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 38, lineHeight: 1.02, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "10px 0 0" }}>
          Out for <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>delivery.</span>
        </h1>
        <p style={{ marginTop: 10, fontSize: 14, color: "var(--ink-500)" }}>
          Today between <b style={{ color: "var(--green-900)" }}>4:00 — 6:30 pm</b>
        </p>
      </div>

      {/* agent card */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ background: "var(--green-950)", color: "var(--cream-100)", borderRadius: "var(--r-lg)", padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "var(--mustard-400)", color: "var(--green-950)", display: "grid", placeItems: "center", fontWeight: 700 }}>SM</div>
          <div style={{ flex: 1 }}>
            <div className="pt-mono-stamp" style={{ color: "rgba(245,239,224,0.5)", fontSize: 9 }}>DELHIVERY · #DLH-9128</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginTop: 2 }}>Suresh M.</div>
          </div>
          <button className="pt-btn pt-btn--mustard pt-btn--sm" style={{ padding: "8px 14px" }}><Icon.phone size={14}/></button>
        </div>
      </div>

      {/* map placeholder */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ height: 160, background: "linear-gradient(135deg, var(--green-100) 0%, var(--cream-300) 70%)", borderRadius: "var(--r-lg)", position: "relative", overflow: "hidden", border: "1px solid var(--cream-400)" }}>
          <svg width="100%" height="100%" viewBox="0 0 320 160" preserveAspectRatio="none">
            <path d="M20,130 Q80,80 140,90 T280,40" stroke="var(--green-800)" strokeWidth="2" strokeDasharray="4 5" fill="none"/>
            <circle cx="20" cy="130" r="6" fill="var(--green-800)"/>
            <circle cx="280" cy="40" r="8" fill="var(--mustard-500)" stroke="var(--cream-100)" strokeWidth="2"/>
          </svg>
          <div style={{ position: "absolute", top: 10, left: 10, background: "var(--cream-100)", padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, color: "var(--green-900)", boxShadow: "var(--sh-xs)" }}>2.4 km away</div>
          <button className="pt-btn pt-btn--primary pt-btn--sm" style={{ position: "absolute", bottom: 10, right: 10 }}>Open in maps</button>
        </div>
      </div>

      {/* timeline */}
      <div style={{ padding: "20px 20px 0" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 12 }}>Journey</div>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div style={{ position: "absolute", left: 11, top: 6, bottom: 6, width: 2, background: "var(--cream-400)" }}/>
          {[
            { t: "Out for delivery", d: "Today · 11:42", b: "Picked up from Indiranagar hub.", active: true, done: true },
            { t: "Dispatched", d: "Sun · 09:14", b: "Left Yelahanka packing room.", done: true },
            { t: "Bottled & sealed", d: "Fri · 11:02", b: "Batch #047 sesame, #019 coconut.", done: true },
            { t: "Pressed", d: "Nov 14 · Erode", b: "9-hour press at 38°C, settled 72 hrs.", done: true },
            { t: "Order received", d: "Thu · 14:08", b: "UPI · ₹1,047 from oksbi.", done: true },
          ].map((s, i) => (
            <div key={i} style={{ position: "relative", paddingBottom: 20 }}>
              <div style={{
                position: "absolute", left: -24, top: 2,
                width: 22, height: 22, borderRadius: 11,
                background: s.active ? "var(--mustard-500)" : s.done ? "var(--green-800)" : "var(--cream-300)",
                color: "var(--cream-100)",
                display: "grid", placeItems: "center",
                border: "3px solid var(--cream-200)",
              }}>
                {s.done && <Icon.check size={10}/>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: s.active ? "var(--mustard-700)" : "var(--green-900)" }}>{s.t}</div>
                <div className="pt-mono-stamp" style={{ fontSize: 9 }}>{s.d}</div>
              </div>
              <p style={{ marginTop: 4, fontSize: 12, color: "var(--ink-500)", lineHeight: 1.5 }}>{s.b}</p>
            </div>
          ))}
        </div>
      </div>

      {/* inside the box */}
      <div style={{ padding: "0 20px 16px" }}>
        <div className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", padding: 14 }}>
          <div className="pt-eyebrow">Inside the box · 4 bottles</div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {cartItems.map((it, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 10, alignItems: "center" }}>
                <div style={{ background: "var(--cream-200)", borderRadius: 6, padding: 3, display: "grid", placeItems: "center" }}>
                  <Bottle variant={it.v} size={28}/>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--green-900)" }}>{it.name}</div>
                  <div className="pt-mono-stamp" style={{ fontSize: 9, marginTop: 1 }}>{it.size} · ×{it.qty}</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--green-900)" }}>₹{it.price * it.qty}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}

Object.assign(window, {
  PaymentRazorpay, PaymentProcessing, PaymentFailed,
  PaymentRazorpayDesktop, PaymentProcessingDesktop, PaymentFailedDesktop,
  OrderSuccess, OrderTracking,
  OrderSuccessMobile, OrderTrackingMobile,
});
