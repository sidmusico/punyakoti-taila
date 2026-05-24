// ============================================================
// CANVAS — arranges all screens into reorderable sections
// ============================================================

const { useState, useEffect } = React;

// Mobile phone-frame wrapper for any 390-wide mobile screen
function Phone({ children, height = 844 }) {
  return (
    <div className="pt-phone" style={{ width: 390 + 24, height: height + 24 }}>
      <div className="pt-phone-screen" style={{ width: 390, height: height, position: "relative" }}>
        <div className="pt-phone-notch"/>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 32 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Desktop browser-chrome wrapper for any wide screen
function Browser({ children, width = 1280, height = 800, title = "punyakoti.in" }) {
  return (
    <div style={{ width, background: "var(--cream-300)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--sh-lg)" }}>
      <div style={{ height: 32, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#E8DFC4", borderBottom: "1px solid var(--cream-400)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#E97765" }}/>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#F4BE4F" }}/>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#62C462" }}/>
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--wood-700)", fontFamily: "var(--font-mono)" }}>{title}</div>
      </div>
      <div style={{ height, overflow: "hidden", background: "var(--cream-200)" }}>{children}</div>
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "default",
  "cream": "default",
  "hero": "poetic"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply density + cream globally via body classes
  useEffect(() => {
    const b = document.body;
    b.classList.remove("pt-density-compact", "pt-density-airy");
    b.classList.remove("pt-cream-light", "pt-cream-dark");
    if (t.density === "compact") b.classList.add("pt-density-compact");
    if (t.density === "airy") b.classList.add("pt-density-airy");
    if (t.cream === "light") b.classList.add("pt-cream-light");
    if (t.cream === "dark") b.classList.add("pt-cream-dark");
  }, [t.density, t.cream]);

  return (
    <>
      <DesignCanvas title="Punyakoti Taila — design system" subtitle="Ten priority screens · desktop + mobile · push the system">

        <DCSection id="cover" title="Punyakoti Taila" subtitle="A premium D2C ecommerce experience for wood-pressed oils. Ten priority surfaces, paired desktop + mobile, built directly against the design system tokens.">
          <DCArtboard id="cover" label="Cover" width={920} height={420}>
            <CoverCard t={t}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="home" title="01 · Homepage" subtitle={`Hero variant: ${t.hero} · serif-led, batch-stamped imagery, asymmetric editorial.`}>
          <DCArtboard id="home-d" label="Desktop · home" width={1280 + 28} height={800 + 32}>
            <Browser><HomeDesktop heroVariant={t.hero}/></Browser>
          </DCArtboard>
          <DCArtboard id="home-m" label="Mobile · home" width={390 + 24} height={844 + 24}>
            <Phone><HomeMobile heroVariant={t.hero}/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="plp" title="02 · Product listing" subtitle="The collection, filterable. Sticky filter rail, sortable grid, mobile filter sheet.">
          <DCArtboard id="plp-d" label="Desktop · PLP" width={1280 + 28} height={800 + 32}>
            <Browser><PLPDesktop/></Browser>
          </DCArtboard>
          <DCArtboard id="plp-m" label="Mobile · PLP" width={390 + 24} height={844 + 24}>
            <Phone><PLPMobile/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="pdp" title="03 · Product detail" subtitle="Provenance front-loaded · batch lab-report · sticky mobile CTA · subscribe variant.">
          <DCArtboard id="pdp-d" label="Desktop · PDP" width={1280 + 28} height={800 + 32}>
            <Browser><PDPDesktop/></Browser>
          </DCArtboard>
          <DCArtboard id="pdp-m" label="Mobile · PDP" width={390 + 24} height={844 + 24}>
            <Phone><PDPMobile/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="cart" title="04 · Basket" subtitle="Full-page basket on desktop, sheet on mobile · subscriber discount, free-shipping rail, upsell row.">
          <DCArtboard id="cart-d" label="Desktop · basket" width={1280 + 28} height={800 + 32}>
            <Browser><CartDesktop/></Browser>
          </DCArtboard>
          <DCArtboard id="cart-m" label="Mobile · basket" width={390 + 24} height={844 + 24}>
            <Phone><CartMobile/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="checkout" title="05 · Checkout" subtitle="Four-step accordion with locked future steps · same data column on desktop and mobile.">
          <DCArtboard id="ck-d" label="Desktop · checkout (delivery)" width={1280 + 28} height={800 + 32}>
            <Browser><CheckoutDesktop/></Browser>
          </DCArtboard>
          <DCArtboard id="ck-m" label="Mobile · checkout (delivery)" width={390 + 24} height={844 + 24}>
            <Phone><CheckoutMobile/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="payment" title="06 · Payment flow" subtitle="Razorpay sheet · UPI waiting state · failure with retry · all three live as mobile-first surfaces.">
          <DCArtboard id="pay-modal" label="Razorpay sheet" width={390 + 24} height={844 + 24}>
            <Phone><PaymentRazorpay/></Phone>
          </DCArtboard>
          <DCArtboard id="pay-proc" label="UPI · awaiting approval" width={390 + 24} height={844 + 24}>
            <Phone><PaymentProcessing/></Phone>
          </DCArtboard>
          <DCArtboard id="pay-fail" label="Payment failed · retry" width={390 + 24} height={844 + 24}>
            <Phone><PaymentFailed/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="order" title="07 · Order experience" subtitle="Success confirmation · live tracking with agent + timeline.">
          <DCArtboard id="ord-success" label="Desktop · order success" width={1280 + 28} height={800 + 32}>
            <Browser><OrderSuccess/></Browser>
          </DCArtboard>
          <DCArtboard id="ord-track" label="Desktop · order tracking" width={1280 + 28} height={800 + 32}>
            <Browser><OrderTracking/></Browser>
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="08 · Authentication" subtitle="Three sequential surfaces · WhatsApp OTP as the primary verification.">
          <DCArtboard id="auth-login" label="Sign in" width={390 + 24} height={844 + 24}>
            <Phone><AuthLogin/></Phone>
          </DCArtboard>
          <DCArtboard id="auth-reg" label="Register · 1 of 3" width={390 + 24} height={844 + 24}>
            <Phone><AuthRegister/></Phone>
          </DCArtboard>
          <DCArtboard id="auth-otp" label="OTP · 2 of 3" width={390 + 24} height={844 + 24}>
            <Phone><AuthOTP/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="account" title="09 · Account" subtitle="Tier program, live order, subscriptions, addresses · mobile-first parity.">
          <DCArtboard id="acc-d" label="Desktop · dashboard" width={1280 + 28} height={800 + 32}>
            <Browser><AccountDesktop/></Browser>
          </DCArtboard>
          <DCArtboard id="acc-m" label="Mobile · account home" width={390 + 24} height={844 + 24}>
            <Phone><AccountMobile/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="mobile-nav" title="10 · Mobile bottom-nav" subtitle="Three states of the persistent tab bar · Shop, Saved, Orders. Account is shown in section 09.">
          <DCArtboard id="nav-shop" label="Tab · Oils" width={390 + 24} height={844 + 24}>
            <Phone><MobileNavOils/></Phone>
          </DCArtboard>
          <DCArtboard id="nav-saved" label="Tab · Saved" width={390 + 24} height={844 + 24}>
            <Phone><MobileNavSaved/></Phone>
          </DCArtboard>
          <DCArtboard id="nav-orders" label="Tab · Orders" width={390 + 24} height={844 + 24}>
            <Phone><MobileNavOrders/></Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="popups" title="11 · Marketing surfaces" subtitle="Welcome newsletter modal · exit-intent dark popup.">
          <DCArtboard id="pop-news" label="Newsletter modal" width={720} height={520}>
            <NewsletterPopup/>
          </DCArtboard>
          <DCArtboard id="pop-exit" label="Exit-intent popup" width={720} height={520}>
            <ExitIntentPopup/>
          </DCArtboard>
        </DCSection>

      </DesignCanvas>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Layout"/>
        <TweakRadio label="Page density" value={t.density}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Default", value: "default" },
            { label: "Airy", value: "airy" },
          ]}
          onChange={(v) => setTweak('density', v)}/>
        <TweakRadio label="Cream shade" value={t.cream}
          options={[
            { label: "Light", value: "light" },
            { label: "Default", value: "default" },
            { label: "Dark", value: "dark" },
          ]}
          onChange={(v) => setTweak('cream', v)}/>

        <TweakSection label="Homepage"/>
        <TweakSelect label="Hero variant" value={t.hero}
          options={[
            { label: "Poetic — wordmark led", value: "poetic" },
            { label: "Product — six-pack grid", value: "product" },
            { label: "Editorial — full-bleed photo", value: "editorial" },
          ]}
          onChange={(v) => setTweak('hero', v)}/>
      </TweaksPanel>
    </>
  );
}

// ----- Cover card for the canvas -----
function CoverCard({ t }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--green-950)", color: "var(--cream-100)",
      borderRadius: 18, padding: 48,
      display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -60, bottom: -80, opacity: 0.08 }}>
        <CowMark size={420} color="var(--mustard-400)"/>
      </div>
      <div style={{ position: "relative" }}>
        <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Design exploration · 11 sections · 23 artboards</div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 400,
          fontSize: 64, lineHeight: 1, letterSpacing: "-0.025em",
          color: "var(--cream-100)", margin: "18px 0 0",
        }}>
          Pure tradition,<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>delivered.</span>
        </h1>
        <p style={{ marginTop: 18, fontSize: 15, color: "rgba(245,239,224,0.7)", lineHeight: 1.6, maxWidth: 420 }}>
          A complete premium D2C experience for <i>Punyakoti Taila</i> —
          homepage through checkout, payment, account, and the mobile bottom-nav.
          Pan and zoom; click any artboard to focus.
        </p>
        <div style={{ marginTop: 22, display: "flex", gap: 24, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mustard-400)", letterSpacing: "0.08em" }}>
          <span>HERO · {t.hero.toUpperCase()}</span>
          <span>·</span>
          <span>DENSITY · {t.density.toUpperCase()}</span>
          <span>·</span>
          <span>CREAM · {t.cream.toUpperCase()}</span>
        </div>
      </div>
      <div style={{ display: "grid", placeItems: "center", position: "relative" }}>
        <div style={{ display: "flex", gap: 12, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))" }}>
          <Bottle variant="sesame" size={120}/>
          <Bottle variant="coconut" size={120}/>
          <Bottle variant="mustard" size={120}/>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
