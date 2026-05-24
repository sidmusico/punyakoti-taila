// ============================================================
// SITE — clickable router around the existing screens
// ============================================================

const { useState: useS, useEffect: useE, useRef: useR } = React;

// Pages registry — id, label, group, device, component renderer
const PAGES = [
  { id: "home",       label: "Homepage",          group: "Shop",      device: "responsive", D: (p) => <HomeDesktop heroVariant={p.hero} quiet={p.quiet}/>, M: (p) => <HomeMobile heroVariant={p.hero}/> },
  { id: "plp",        label: "All oils · PLP",    group: "Shop",      device: "responsive", D: () => <PLPDesktop/>, M: () => <PLPMobile/> },
  { id: "pdp",        label: "Product detail",    group: "Shop",      device: "responsive", D: () => <PDPDesktop/>, M: () => <PDPMobile/> },
  { id: "cart",       label: "Basket",            group: "Buy",       device: "responsive", D: () => <CartDesktop/>, M: () => <CartMobile/> },
  { id: "checkout",   label: "Checkout",          group: "Buy",       device: "responsive", D: () => <CheckoutDesktop/>, M: () => <CheckoutMobile/> },
  { id: "pay-modal",  label: "Pay · Razorpay",    group: "Buy",       device: "responsive", D: () => <PaymentRazorpayDesktop/>,  M: () => <PaymentRazorpay/> },
  { id: "pay-proc",   label: "Pay · UPI waiting", group: "Buy",       device: "responsive", D: () => <PaymentProcessingDesktop/>, M: () => <PaymentProcessing/> },
  { id: "pay-fail",   label: "Pay · failure",     group: "Buy",       device: "responsive", D: () => <PaymentFailedDesktop/>,    M: () => <PaymentFailed/> },
  { id: "ord-success",label: "Order success",     group: "Order",     device: "responsive", D: () => <OrderSuccess/>,  M: () => <OrderSuccessMobile/> },
  { id: "ord-track",  label: "Order tracking",    group: "Order",     device: "responsive", D: () => <OrderTracking/>, M: () => <OrderTrackingMobile/> },
  { id: "auth-login", label: "Sign in",           group: "Account",   device: "responsive", D: () => <AuthLoginDesktop/>,    M: () => <AuthLogin/> },
  { id: "auth-reg",   label: "Register",          group: "Account",   device: "responsive", D: () => <AuthRegisterDesktop/>, M: () => <AuthRegister/> },
  { id: "auth-otp",   label: "OTP verify",        group: "Account",   device: "responsive", D: () => <AuthOTPDesktop/>,      M: () => <AuthOTP/> },
  { id: "account",    label: "Account dashboard", group: "Account",   device: "responsive", D: () => <AccountDesktop/>, M: () => <AccountMobile/> },
  { id: "nav-shop",   label: "Mobile · Oils tab", group: "Mobile-only", device: "mobile",   M: () => <MobileNavOils/> },
  { id: "nav-saved",  label: "Mobile · Saved",    group: "Mobile-only", device: "mobile",   M: () => <MobileNavSaved/> },
  { id: "nav-orders", label: "Mobile · Orders",   group: "Mobile-only", device: "mobile",   M: () => <MobileNavOrders/> },
  { id: "pop-news",   label: "Newsletter modal",  group: "Marketing", device: "overlay",    M: () => <NewsletterPopup/>, D: () => <NewsletterPopup/> },
  { id: "pop-exit",   label: "Exit-intent popup", group: "Marketing", device: "overlay",    M: () => <ExitIntentPopup/>, D: () => <ExitIntentPopup/> },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "default",
  "cream": "default",
  "hero": "poetic",
  "device": "auto",
  "quiet": false,
  "accent": "#C58A1F"
}/*EDITMODE-END*/;

function readHash() {
  const h = (location.hash || "#home").slice(1);
  return PAGES.find(p => p.id === h)?.id || "home";
}

function SiteApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = useS(readHash());
  const [showMenu, setShowMenu] = useS(false);
  const [tipShown, setTipShown] = useS(false);

  // hash sync
  useE(() => {
    const onHash = () => setPage(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useE(() => {
    if (location.hash.slice(1) !== page) history.replaceState(null, "", "#" + page);
    window.scrollTo({ top: 0, behavior: "instant" });
    setShowMenu(false);
  }, [page]);

  // density/cream/accent classes
  useE(() => {
    const b = document.body;
    b.classList.remove("pt-density-compact", "pt-density-airy");
    b.classList.remove("pt-cream-light", "pt-cream-dark");
    b.classList.remove("pt-accent-terra", "pt-accent-saffron", "pt-accent-rose");
    if (t.density === "compact") b.classList.add("pt-density-compact");
    if (t.density === "airy") b.classList.add("pt-density-airy");
    if (t.cream === "light") b.classList.add("pt-cream-light");
    if (t.cream === "dark") b.classList.add("pt-cream-dark");
    if (t.accent === "#C66237") b.classList.add("pt-accent-terra");
    if (t.accent === "#D4961F") b.classList.add("pt-accent-saffron");
    if (t.accent === "#B8505F") b.classList.add("pt-accent-rose");
  }, [t.density, t.cream, t.accent]);

  // first-load tip
  useE(() => {
    if (!sessionStorage.getItem("pt-tip")) {
      setTipShown(true);
      sessionStorage.setItem("pt-tip", "1");
      setTimeout(() => setTipShown(false), 5200);
    }
  }, []);

  // device picker
  const meta = PAGES.find(p => p.id === page);
  const auto = window.matchMedia("(max-width: 700px)").matches ? "mobile" : "desktop";
  let device = t.device === "auto" ? auto : t.device;
  if (meta.device === "mobile") device = "mobile";
  if (meta.device === "desktop") device = "desktop";

  // click delegation — wire real-looking interactions to real navigation
  const stageRef = useR(null);
  useE(() => {
    const el = stageRef.current;
    if (!el) return;
    const map = [
      // Auth
      [/^sign in$|^log\s*in$/i, "auth-login"],
      [/sign out|log[\s-]?out/i, "home"],
      [/create.{0,12}account|new to|^register$/i, "auth-reg"],
      [/verify and continue|verify phone/i, "auth-otp"],
      // Order
      [/track your order|track on map|^track$/i, "ord-track"],
      [/order success|^confirmation$/i, "ord-success"],
      [/set up subscription|subscribe to your/i, "account"],
      // Payment
      [/^place order|continue to payment|pay now|pay punyakoti|^approve$|open upi/i, "pay-modal"],
      [/try payment again|try again/i, "pay-proc"],
      [/different method|use a different/i, "pay-modal"],
      // Checkout
      [/^checkout$|continue to checkout|proceed to checkout|^pay\b/i, "checkout"],
      [/buy now|express checkout/i, "checkout"],
      // Cart
      [/add to basket|^add\b|quick add/i, "cart"],
      [/^basket$|view basket|^cart$|view your basket/i, "cart"],
      // Editorial / story
      [/our story|read our story|read the journal|press diary|shop the harvest|^journal$/i, "home"],
      // PLP / catalog
      [/all oils|shop all|shop the collection|^see all$|^browse$|the collection/i, "plp"],
      // Account
      [/^account$|dashboard|^profile$|my account/i, "account"],
      // Home
      [/^home$|^punyakoti$/i, "home"],
      // Popups
      [/^claim bottle|^get my code/i, "ord-success"],
    ];
    const onClick = (e) => {
      const btn = e.target.closest("button, a, [role='button']");
      if (!btn) return;
      // Allow components to opt out of global routing
      if (btn.closest("[data-stop-route]")) return;
      const text = (btn.innerText || btn.textContent || "").trim();
      if (!text) return;
      for (const [re, dest] of map) {
        if (re.test(text)) {
          e.preventDefault();
          e.stopPropagation();
          setPage(dest);
          return;
        }
      }
    };
    // also: clicks on product-card-looking things → PDP
    const onCardClick = (e) => {
      const card = e.target.closest("[data-pcard]");
      if (card) { e.preventDefault(); setPage("pdp"); }
      const item = e.target.closest("[data-nav-tab]");
      if (item) {
        e.preventDefault();
        const dest = item.dataset.navTab;
        setPage(dest);
      }
    };
    el.addEventListener("click", onClick, true);
    el.addEventListener("click", onCardClick, true);
    return () => {
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("click", onCardClick, true);
    };
  }, [page]);

  const renderPage = () => {
    if (meta.device === "overlay") {
      // overlay popups float above the homepage
      return (
        <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none", filter: "saturate(0.8)", overflow: "hidden" }}>
            {device === "mobile"
              ? <div style={{ display: "grid", placeItems: "center", padding: 24, minHeight: "100vh" }}><Phone height={780}><HomeMobile heroVariant={t.hero}/></Phone></div>
              : <div style={{ width: "100%", minHeight: "100vh", overflow: "hidden" }}><HomeDesktop heroVariant={t.hero}/></div>}
          </div>
          <div style={{ position: "absolute", inset: 0, zIndex: 5, minHeight: "100vh" }}>
            {device === "mobile"
              ? <div style={{ display: "grid", placeItems: "center", padding: 24, minHeight: "100vh" }}><Phone height={780}>{meta.M ? meta.M(t) : meta.D(t)}</Phone></div>
              : (meta.D ? meta.D(t) : meta.M(t))}
          </div>
        </div>
      );
    }
    if (device === "mobile") {
      const C = meta.M || meta.D;
      return (
        <div style={{ display: "grid", placeItems: "center", padding: 24, minHeight: "100%" }}>
          <Phone height={780}>{C(t)}</Phone>
        </div>
      );
    }
    const C = meta.D || meta.M;
    return <div style={{ width: "100%", minHeight: "100%" }}>{C(t)}</div>;
  };

  return (
    <>
      <div ref={stageRef} className="pt-stage">
        {renderPage()}
      </div>

      {/* top-right floating control cluster */}
      <FloatingNav page={page} setPage={setPage} t={t} setTweak={setTweak} showMenu={showMenu} setShowMenu={setShowMenu}/>

      {/* Tweaks panel — toggled from the toolbar */}
      <SiteTweaks t={t} setTweak={setTweak}/>

      {tipShown && (
        <div className="pt-tip">
          <Icon.arrowUpRight size={14}/>
          Click anywhere — every <b>Add</b>, <b>Checkout</b>, or <b>Sign in</b> button is wired up. Use <b>Pages</b> to jump.
        </div>
      )}
    </>
  );
}

// ---------- Tweaks panel ----------
function SiteTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Layout"/>
      <TweakRadio
        label="Density"
        value={t.density}
        options={["compact", "default", "airy"]}
        onChange={(v) => setTweak("density", v)}
      />
      <TweakSelect
        label="Hero style"
        value={t.hero}
        options={["poetic", "product", "editorial"]}
        onChange={(v) => setTweak("hero", v)}
      />
      <TweakToggle
        label="Quiet mode"
        value={t.quiet}
        onChange={(v) => setTweak("quiet", v)}
      />

      <TweakSection label="Palette"/>
      <TweakRadio
        label="Cream"
        value={t.cream}
        options={["light", "default", "dark"]}
        onChange={(v) => setTweak("cream", v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={["#C58A1F", "#C66237", "#D4961F", "#B8505F"]}
        onChange={(v) => setTweak("accent", v)}
      />

      <TweakSection label="Device"/>
      <TweakRadio
        label="Viewport"
        value={t.device}
        options={["auto", "desktop", "mobile"]}
        onChange={(v) => setTweak("device", v)}
      />
    </TweaksPanel>
  );
}

// ----- Phone frame (small) -----
function Phone({ children, height = 780 }) {
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

// ----- Floating nav cluster -----
function FloatingNav({ page, setPage, t, setTweak, showMenu, setShowMenu }) {
  const meta = PAGES.find(p => p.id === page);
  const groups = [...new Set(PAGES.map(p => p.group))];
  return (
    <>
      <div className="pt-floatcluster">
        <button className="pt-floatbtn" onClick={() => setPage("home")} title="Go home">
          <Icon.home size={16}/>
        </button>
        <div className="pt-floatdivider"/>
        <button className="pt-floatbtn pt-floatbtn--primary" onClick={() => setShowMenu(!showMenu)}>
          <Icon.grid size={14}/>
          <span>Pages · <span style={{ color: "var(--mustard-400)" }}>{meta.label}</span></span>
          <Icon.chevDown size={12} style={{ transform: showMenu ? "rotate(180deg)" : "none", transition: "transform .2s" }}/>
        </button>
        <div className="pt-floatdivider"/>
        <DevicePicker t={t} setTweak={setTweak}/>
      </div>

      {showMenu && (
        <>
          <div className="pt-menubackdrop" onClick={() => setShowMenu(false)}/>
          <div className="pt-pagemenu">
            <div className="pt-pagemenu-head">
              <Wordmark size={16} sub={false}/>
              <button onClick={() => setShowMenu(false)} className="pt-floatbtn" style={{ padding: 6 }}><Icon.close size={14}/></button>
            </div>
            <div className="pt-pagemenu-body">
              {groups.map(g => (
                <div key={g} className="pt-pagemenu-group">
                  <div className="pt-eyebrow" style={{ marginBottom: 10 }}>{g}</div>
                  <div className="pt-pagemenu-list">
                    {PAGES.filter(p => p.group === g).map(p => (
                      <button key={p.id}
                        className={"pt-pagemenu-item" + (p.id === page ? " active" : "")}
                        onClick={() => setPage(p.id)}>
                        <span className="pt-pagemenu-dot"/>
                        <span>{p.label}</span>
                        <span className="pt-pagemenu-device">
                          {p.device === "mobile" ? "M" : p.device === "desktop" ? "D" : p.device === "overlay" ? "Φ" : "↔"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-pagemenu-foot">
              <a href="Punyakoti Taila — Complete Site Design.html" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon.arrowUpRight size={12}/> Open as design canvas
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function DevicePicker({ t, setTweak }) {
  return (
    <div style={{ display: "flex", gap: 0, background: "rgba(245,239,224,0.08)", borderRadius: 999, padding: 3 }}>
      {[
        { v: "auto", l: "Auto" },
        { v: "desktop", l: "D" },
        { v: "mobile", l: "M" },
      ].map(o => (
        <button key={o.v}
          onClick={() => setTweak('device', o.v)}
          className="pt-devicebtn"
          style={{
            background: t.device === o.v ? "var(--mustard-500)" : "transparent",
            color: t.device === o.v ? "var(--green-950)" : "rgba(245,239,224,0.7)",
          }}>{o.l}</button>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SiteApp/>);
