// ============================================================
// AUTH (login / register / OTP), ACCOUNT, POPUPS, MOBILE NAV
// ============================================================

// ---------- AUTH — Login (mobile-sized card, also looks good on web) ----------
function AuthLogin() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Monogram size={32}/>
        <a style={{ fontSize: 12, color: "var(--ink-500)" }}>← Back to shop</a>
      </div>
      <PhotoPlaceholder tone="warm" style={{ height: 220, borderRadius: 0, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "var(--cream-100)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--mustard-200)", textTransform: "uppercase" }}>Welcome back</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 42, lineHeight: 1, margin: "12px 0 0", color: "var(--cream-100)", letterSpacing: "-0.02em" }}>
              The kitchen<br/>
              <span className="pt-display-italic">is waiting.</span>
            </h1>
          </div>
        </div>
      </PhotoPlaceholder>
      <div style={{ padding: "28px 24px 32px", flex: 1 }}>
        <div className="pt-field" style={{ marginBottom: 16 }}>
          <span className="pt-field-label">Email or phone</span>
          <input className="pt-input" defaultValue="lakshmi@kitchen.in"/>
        </div>
        <div className="pt-field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="pt-field-label">Password</span>
            <a style={{ fontSize: 11, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1 }}>Forgot?</a>
          </div>
          <input className="pt-input" type="password" defaultValue="••••••••••"/>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18, fontSize: 13, color: "var(--ink-500)" }}>
          <span style={{ width: 16, height: 16, border: "1.4px solid var(--wood-300)", borderRadius: 3, background: "var(--green-800)", display: "grid", placeItems: "center", color: "var(--cream-100)" }}><Icon.check size={10}/></span>
          Remember me on this device
        </label>
        <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 22 }}>Continue</button>

        {/* divider */}
        <div style={{ margin: "26px 0 18px", display: "flex", alignItems: "center", gap: 12, color: "var(--ink-400)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
          OR
          <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
        </div>

        {/* social */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { l: "Continue with Google", c: "#fff", fg: "#1A2E18", border: true },
            { l: "Continue with Apple", c: "#1B1E16", fg: "#FBF7EC" },
            { l: "Continue with WhatsApp OTP", c: "var(--green-100)", fg: "var(--green-900)" },
          ].map(s => (
            <button key={s.l} className="pt-btn" style={{ background: s.c, color: s.fg, border: s.border ? "1px solid var(--cream-400)" : "none", minHeight: 48, justifyContent: "center" }}>{s.l}</button>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
          New to Punyakoti? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", fontWeight: 600 }}>Create an account</a>
        </div>
      </div>
    </div>
  );
}

// ---------- AUTH — Register ----------
function AuthRegister() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Monogram size={32}/>
        <div className="pt-mono-stamp">01 / 03</div>
      </div>
      <div style={{ padding: "16px 24px 28px" }}>
        <div className="pt-eyebrow">Become a member</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 38, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
          Welcome to the<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>press-house.</span>
        </h1>
        <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>
          One small letter every fortnight. Fifteen percent off your first bottle. No spam, no emoji.
        </p>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="pt-field">
            <span className="pt-field-label">Full name</span>
            <input className="pt-input" placeholder="Lakshmi Venkataraman"/>
          </div>
          <div className="pt-field">
            <span className="pt-field-label">Email</span>
            <input className="pt-input" placeholder="lakshmi@kitchen.in"/>
          </div>
          <div className="pt-field">
            <span className="pt-field-label">Phone · for delivery updates</span>
            <div style={{ display: "flex", gap: 8 }}>
              <div className="pt-input" style={{ width: 90, padding: "12px 14px", display: "flex", alignItems: "center", gap: 6, color: "var(--green-900)" }}>+91 <Icon.chevDown size={12}/></div>
              <input className="pt-input" placeholder="98XXX XXX42" style={{ flex: 1 }}/>
            </div>
          </div>
          <div className="pt-field">
            <span className="pt-field-label">Password</span>
            <input className="pt-input" type="password" placeholder="At least 8 characters"/>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 3 ? "var(--green-800)" : "var(--cream-400)" }}/>
              ))}
            </div>
            <span style={{ fontSize: 11, color: "var(--green-800)", marginTop: 4 }}>Strong</span>
          </div>
        </div>

        <label style={{ display: "flex", gap: 10, marginTop: 18, fontSize: 12, color: "var(--ink-500)", alignItems: "flex-start" }}>
          <span style={{ width: 16, height: 16, border: "1.4px solid var(--wood-300)", borderRadius: 3, background: "var(--green-800)", flexShrink: 0, marginTop: 2, display: "grid", placeItems: "center", color: "var(--cream-100)" }}><Icon.check size={10}/></span>
          Send me a short fortnightly letter from Erode. I can unsubscribe in one click.
        </label>

        <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 22 }}>
          Continue · verify phone
        </button>
        <div style={{ marginTop: 14, fontSize: 11, color: "var(--ink-500)", textAlign: "center", lineHeight: 1.55 }}>
          By continuing you agree to our <u>terms</u> and <u>privacy policy</u>.
        </div>
        <div style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
          Already have an account? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", fontWeight: 600 }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}

// ---------- AUTH — OTP verification ----------
function AuthOTP() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", background: "var(--cream-200)" }}>
      <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between" }}>
        <button style={{ background: 0, border: 0, color: "var(--green-900)" }}><Icon.arrowLeft/></button>
        <div className="pt-mono-stamp">02 / 03</div>
      </div>
      <div style={{ padding: "12px 24px 28px" }}>
        <div className="pt-eyebrow">Verification</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 38, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
          We sent you<br/>
          <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>six digits.</span>
        </h1>
        <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>
          Check WhatsApp on <b style={{ color: "var(--green-900)" }}>+91 98XXX XXX42</b>. <a style={{ borderBottom: "1px solid var(--green-800)", color: "var(--green-800)" }}>Change number</a>
        </p>

        {/* OTP boxes */}
        <div style={{ marginTop: 36, display: "flex", gap: 10, justifyContent: "space-between" }}>
          {["4","2","9","",""," "].map((d, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: "1/1.15",
              border: `1.5px solid ${i < 3 ? "var(--green-900)" : "var(--cream-400)"}`,
              borderRadius: "var(--r-md)",
              background: i < 3 ? "var(--cream-100)" : "var(--cream-200)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--font-display)", fontSize: 32, color: "var(--green-900)",
              position: "relative",
            }}>
              {d.trim()}
              {i === 3 && <div style={{ width: 2, height: 28, background: "var(--green-800)", animation: "blink 1s infinite", position: "absolute" }}/>}
            </div>
          ))}
        </div>

        <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 32 }}>
          Verify and continue
        </button>

        <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
          Didn't get it? <a style={{ color: "var(--green-800)" }}>Resend in <b className="mono">00:42</b></a>
        </div>

        {/* divider */}
        <div style={{ margin: "32px 0 16px", display: "flex", alignItems: "center", gap: 12, color: "var(--ink-400)", fontSize: 11, letterSpacing: "0.15em" }}>
          <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
          PREFER EMAIL?
          <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
        </div>
        <button className="pt-btn pt-btn--ghost pt-btn--full">Send code to email instead</button>

        {/* shield note */}
        <div style={{ marginTop: 28, padding: 14, background: "var(--green-100)", borderRadius: "var(--r-md)", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icon.shield size={18}/>
          <div style={{ fontSize: 12, color: "var(--green-900)", lineHeight: 1.5 }}>
            We never ask for your password over WhatsApp. If anything feels off, message us at <b>help@punyakoti.in</b>.
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- ACCOUNT DESKTOP ----------
const ACCOUNT_NAV = [
  { id: "dashboard",     Ico: Icon.home,    l: "Dashboard" },
  { id: "orders",        Ico: Icon.package, l: "Orders",        count: 14 },
  { id: "subscriptions", Ico: Icon.refresh, l: "Subscriptions", count: 2 },
  { id: "saved",         Ico: Icon.heart,   l: "Saved bottles", count: 7 },
  { id: "addresses",     Ico: Icon.pin,     l: "Addresses",     count: 3 },
  { id: "payments",      Ico: Icon.credit,  l: "Payments" },
  { id: "notifications", Ico: Icon.mail,    l: "Notifications", dot: true },
  { id: "personal",      Ico: Icon.user,    l: "Personal info" },
];

const ACCOUNT_TITLES = {
  dashboard:     { eyebrow: "Member since March 2024", title: "Hello, ", italic: "Lakshmi." },
  orders:        { eyebrow: "14 lifetime · 32 bottles", title: "Your ", italic: "orders." },
  subscriptions: { eyebrow: "2 active · saving 15% per delivery", title: "Your ", italic: "shelf." },
  saved:         { eyebrow: "7 bottles · waiting for the next basket", title: "Bottles you ", italic: "noted." },
  addresses:     { eyebrow: "3 saved · home, office, parents", title: "Your ", italic: "kitchens." },
  payments:      { eyebrow: "UPI + 2 cards · all tokenised", title: "Ways to ", italic: "pay." },
  notifications: { eyebrow: "WhatsApp + email · quiet hours respected", title: "What we ", italic: "tell you." },
  personal:      { eyebrow: "Edit anything, anytime", title: "About ", italic: "you." },
};

function AccountDesktop() {
  const [section, setSection] = React.useState("dashboard");
  const meta = ACCOUNT_TITLES[section];
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto" }}>
      <DesktopHeader cartCount={0}/>
      <div style={{ padding: "40px 80px 0", fontSize: 12, color: "var(--ink-500)" }}>
        <span>Your account</span>
        {section !== "dashboard" && (
          <>
            <span style={{ opacity: 0.4, margin: "0 8px" }}>/</span>
            <span style={{ color: "var(--green-900)" }}>{ACCOUNT_NAV.find(n => n.id === section).l}</span>
          </>
        )}
      </div>

      <div style={{ padding: "16px 80px 24px" }}>
        <div className="pt-eyebrow">{meta.eyebrow}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em", color: "var(--green-900)", margin: "12px 0 0" }}>
          {meta.title}<span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>{meta.italic}</span>
        </h1>
      </div>

      <div style={{ padding: "16px 80px 80px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 56 }}>
        <AccountSidebar section={section} setSection={setSection}/>
        <div>
          {section === "dashboard"     && <AccountDashboard setSection={setSection}/>}
          {section === "orders"        && <AccountOrders/>}
          {section === "subscriptions" && <AccountSubscriptions/>}
          {section === "saved"         && <AccountSaved/>}
          {section === "addresses"     && <AccountAddresses/>}
          {section === "payments"      && <AccountPayments/>}
          {section === "notifications" && <AccountNotifications/>}
          {section === "personal"      && <AccountPersonal/>}
        </div>
      </div>
    </div>
  );
}

function AccountSidebar({ section, setSection }) {
  return (
    <aside data-stop-route="1">
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {ACCOUNT_NAV.map(m => {
          const active = m.id === section;
          return (
            <button key={m.id} onClick={() => setSection(m.id)} style={{
              all: "unset",
              display: "grid", gridTemplateColumns: "16px 1fr auto", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: "var(--r-md)",
              background: active ? "var(--cream-100)" : "transparent",
              color: active ? "var(--green-900)" : "var(--ink-700)",
              fontSize: 14, fontWeight: active ? 600 : 500,
              cursor: "pointer",
              boxShadow: active ? "var(--sh-xs)" : "none",
            }}>
              <m.Ico size={16}/>
              <span>{m.l}</span>
              {m.count != null && (
                <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: active ? "var(--green-800)" : "var(--ink-500)" }}>{m.count}</span>
              )}
              {m.dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--mustard-500)" }}/>}
            </button>
          );
        })}
        <hr className="pt-hr" style={{ margin: "12px 0" }}/>
        <a style={{ padding: "10px 14px", fontSize: 13, color: "var(--terra-600)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>Sign out</a>
      </nav>

      <div style={{ marginTop: 28, padding: 18, background: "var(--green-950)", color: "var(--cream-100)", borderRadius: "var(--r-md)" }}>
        <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Subscriber tier</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, marginTop: 6 }}>Ghani</div>
        <div style={{ marginTop: 6, fontSize: 12, color: "rgba(245,239,224,0.6)" }}>2 bottles every 30 days · 15% off</div>
        <div style={{ marginTop: 10, height: 4, background: "rgba(245,239,224,0.15)", borderRadius: 2 }}>
          <div style={{ width: "70%", height: "100%", background: "var(--mustard-400)", borderRadius: 2 }}/>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(245,239,224,0.55)" }}>2 more orders for "Chekku" tier · +5% off</div>
      </div>
    </aside>
  );
}

// ---------- Account sections ----------

function AccountSectionHeader({ title, cta, first = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: first ? "0 0 22px" : "56px 0 22px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "var(--green-900)", margin: 0, letterSpacing: "-0.01em" }}>{title}</h2>
      {cta}
    </div>
  );
}

function AccountDashboard({ setSection }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { l: "Orders", v: "14", s: "lifetime" },
          { l: "Bottles", v: "32", s: "delivered" },
          { l: "Saved", v: "₹1,847", s: "via subscription" },
          { l: "Next press", v: "Mar 04", s: "Sesame · scheduled" },
        ].map(c => (
          <div key={c.l} className="pt-card" style={{ background: "var(--cream-100)" }}>
            <div className="pt-eyebrow">{c.l}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--green-900)", marginTop: 8, lineHeight: 1 }}>{c.v}</div>
            <div className="pt-mono-stamp" style={{ marginTop: 6 }}>{c.s}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "var(--green-900)", margin: "56px 0 22px", letterSpacing: "-0.01em" }}>On its way</h2>
      <div className="pt-card" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 20, alignItems: "center" }}>
        <div style={{ background: "var(--cream-200)", borderRadius: "var(--r-md)", padding: "12px 8px", display: "grid", placeItems: "center", position: "relative" }}>
          <div style={{ display: "flex" }}>
            <Bottle variant="sesame" size={56}/>
            <Bottle variant="coconut" size={56} />
          </div>
          <span style={{ position: "absolute", top: 6, right: 6, background: "var(--wood-700)", color: "var(--cream-100)", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3 }}>+2</span>
        </div>
        <div>
          <div className="pt-mono-stamp">#PT-24011 · placed Nov 14</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--green-900)", marginTop: 6 }}>4 bottles · Sesame, Coconut, Mustard</div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
            <Pill tone="mustard">Out for delivery</Pill>
            <span style={{ fontSize: 13, color: "var(--ink-500)" }}>Today · 4 – 6:30pm</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="pt-btn pt-btn--primary pt-btn--sm">Track</button>
          <button className="pt-btn pt-btn--ghost pt-btn--sm">Invoice</button>
        </div>
      </div>

      <AccountSectionHeader title="Your subscriptions" cta={<a onClick={() => setSection("subscriptions")} style={{ fontSize: 13, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1, cursor: "pointer" }}>Manage all →</a>}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { v: "sesame", n: "Sesame · 500 ml", c: "Every 30 days", nx: "Mar 04, 2026" },
          { v: "coconut", n: "Virgin Coconut · 500 ml", c: "Every 45 days", nx: "Mar 18, 2026" },
        ].map((sb, i) => (
          <div key={i} className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "60px 1fr", gap: 14, alignItems: "center" }}>
            <Bottle variant={sb.v} size={50}/>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--green-900)" }}>{sb.n}</div>
              <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{sb.c} · next <b style={{ color: "var(--green-900)" }}>{sb.nx}</b></div>
              <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                <button style={{ background: 0, border: 0, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", padding: "0 0 1px", fontSize: 12, cursor: "pointer" }}>Skip next</button>
                <button style={{ background: 0, border: 0, color: "var(--ink-500)", borderBottom: "1px solid var(--ink-400)", padding: "0 0 1px", fontSize: 12, cursor: "pointer" }}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AccountSectionHeader title="Saved addresses" cta={<a onClick={() => setSection("addresses")} style={{ fontSize: 13, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1, cursor: "pointer" }}>All addresses →</a>}/>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { n: "Home", a: "14/2 4th Cross, Indiranagar, Bangalore 560038", d: true },
          { n: "Office", a: "WeWork Galaxy, Residency Rd, Bangalore 560025" },
          { n: "Parents", a: "Flat 4B, Pondy Bazaar, Chennai 600017" },
        ].map((ad, i) => (
          <div key={i} className="pt-card pt-card--flat" style={{ background: "var(--cream-100)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--green-900)" }}>{ad.n}</span>
              {ad.d && <Pill tone="green">Default</Pill>}
            </div>
            <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-700)", lineHeight: 1.6 }}>{ad.a}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// All orders
const FULL_ORDERS = [
  { id: "#PT-24011", date: "Nov 14, 2025",  status: "Out for delivery", tone: "mustard", items: ["sesame", "coconut", "mustard", "sesame"], total: 1047, names: "Sesame, Coconut, Mustard, Sesame", pay: "UPI · oksbi" },
  { id: "#PT-23980", date: "Oct 22, 2025",  status: "Delivered", tone: "green", items: ["sesame", "sesame"],  total: 714, names: "Sesame · 500ml × 2", pay: "Card · Visa ••2847" },
  { id: "#PT-23912", date: "Sep 15, 2025",  status: "Delivered", tone: "green", items: ["groundnut", "mustard", "coconut"], total: 980, names: "Groundnut, Mustard, Coconut", pay: "UPI · oksbi" },
  { id: "#PT-23804", date: "Aug 02, 2025",  status: "Delivered", tone: "green", items: ["blackSes"], total: 680, names: "Black Sesame · ceremonial", pay: "Card · Visa ••2847" },
  { id: "#PT-23721", date: "Jul 11, 2025",  status: "Delivered", tone: "green", items: ["sunflower", "groundnut"], total: 590, names: "Sunflower 1L, Groundnut 500ml", pay: "UPI · ybl" },
  { id: "#PT-23612", date: "Jun 06, 2025",  status: "Refunded",  tone: "terra", items: ["coconut"], total: 480, names: "Virgin Coconut · returned", pay: "UPI · oksbi" },
];

function AccountOrders() {
  return (
    <>
      {/* filter bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        {["All · 14", "Active · 1", "Delivered · 12", "Refunded · 1"].map((f, i) => (
          <button key={f} className={"pt-chip " + (i === 0 ? "pt-chip--active" : "")} style={{ cursor: "pointer" }}>{f}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--cream-100)", borderRadius: "var(--r-md)", padding: "8px 12px", border: "1px solid var(--cream-400)" }}>
          <Icon.search size={14}/>
          <input placeholder="Search by order # or oil…" style={{ background: 0, border: 0, outline: "none", fontSize: 13, color: "var(--green-900)", fontFamily: "var(--font-body)", width: 220 }}/>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FULL_ORDERS.map((o, i) => (
          <div key={i} className="pt-card" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center" }}>
              <div style={{ background: "var(--cream-200)", borderRadius: "var(--r-md)", padding: "10px 8px", display: "flex", alignItems: "center", gap: -8 }}>
                {o.items.slice(0, 3).map((v, j) => <Bottle key={j} variant={v} size={42}/>)}
              </div>
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="pt-mono-stamp">{o.id}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-500)" }}>· {o.date}</span>
                  <Pill tone={o.tone}>{o.status}</Pill>
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)", marginTop: 6 }}>{o.names}</div>
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--ink-500)" }}>
                  Paid via <b style={{ color: "var(--green-900)" }}>{o.pay}</b> · <b style={{ color: "var(--green-900)" }}>₹{o.total.toLocaleString("en-IN")}</b>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
              <button className="pt-btn pt-btn--primary pt-btn--sm">{i === 0 ? "Track" : "Reorder"}</button>
              <button className="pt-btn pt-btn--ghost pt-btn--sm">Invoice</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 8 }}>
        {[1, 2, 3].map(p => (
          <button key={p} className="pt-btn pt-btn--ghost pt-btn--sm" style={{ background: p === 1 ? "var(--green-900)" : "transparent", color: p === 1 ? "var(--cream-100)" : "var(--ink-700)", minWidth: 36 }}>{p}</button>
        ))}
        <span style={{ alignSelf: "center", padding: "0 8px", color: "var(--ink-500)" }}>· of 3</span>
      </div>
    </>
  );
}

function AccountSubscriptions() {
  const subs = [
    { v: "sesame", n: "Wood-Pressed Sesame · 500 ml", c: "Every 30 days", nx: "Mar 04, 2026", price: 357, save: 63, status: "active", count: 12 },
    { v: "coconut", n: "Virgin Coconut · 500 ml",     c: "Every 45 days", nx: "Mar 18, 2026", price: 408, save: 72, status: "active", count: 7 },
  ];
  return (
    <>
      {/* summary band */}
      <div className="pt-card" style={{ background: "var(--green-950)", color: "var(--cream-100)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 32, alignItems: "center", padding: 28 }}>
        <div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Active</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, marginTop: 6 }}>2</div>
        </div>
        <div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Saved this year</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, marginTop: 6 }}>₹1,847</div>
        </div>
        <div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Next delivery</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 36, marginTop: 6 }}>Mar 04</div>
        </div>
        <button className="pt-btn pt-btn--mustard">+ Add a subscription</button>
      </div>

      <AccountSectionHeader title="Your shelf"/>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {subs.map((s, i) => (
          <div key={i} className="pt-card" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "100px 1fr auto", gap: 24, alignItems: "center" }}>
            <div style={{ background: "var(--cream-200)", borderRadius: "var(--r-md)", padding: 8, display: "grid", placeItems: "center" }}>
              <Bottle variant={s.v} size={70}/>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Pill tone="green">Active</Pill>
                <span className="pt-mono-stamp">DELIVERY #{s.count}</span>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)", marginTop: 8 }}>{s.n}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-500)" }}>
                {s.c} · next <b style={{ color: "var(--green-900)" }}>{s.nx}</b> · ₹{s.price} (save ₹{s.save})
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 18, fontSize: 12 }}>
                <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", cursor: "pointer", paddingBottom: 1 }}>Skip next delivery</a>
                <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", cursor: "pointer", paddingBottom: 1 }}>Change cadence</a>
                <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", cursor: "pointer", paddingBottom: 1 }}>Swap oil</a>
                <a style={{ color: "var(--terra-600)", borderBottom: "1px solid var(--terra-500)", cursor: "pointer", paddingBottom: 1 }}>Pause</a>
              </div>
            </div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm" style={{ alignSelf: "center" }}>Edit</button>
          </div>
        ))}
      </div>

      {/* upcoming timeline */}
      <AccountSectionHeader title="Upcoming"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { d: "Mar 04", v: "sesame", n: "Sesame · 500 ml", s: "Bottling Feb 28 · ships Mar 02" },
            { d: "Mar 18", v: "coconut", n: "Virgin Coconut · 500 ml", s: "Bottling Mar 14 · ships Mar 16" },
            { d: "Apr 03", v: "sesame", n: "Sesame · 500 ml", s: "Scheduled" },
          ].map((u, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: 16, alignItems: "center", padding: "10px 0", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--green-900)" }}>{u.d}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Bottle variant={u.v} size={36}/>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--green-900)" }}>{u.n}</div>
                  <div className="pt-mono-stamp" style={{ marginTop: 2 }}>{u.s}</div>
                </div>
              </div>
              <a style={{ fontSize: 12, color: "var(--ink-500)", borderBottom: "1px solid var(--ink-400)", paddingBottom: 1, cursor: "pointer" }}>Skip</a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AccountSaved() {
  const list = [
    { v: "sesame",   n: "Sesame · Til",         size: "500 ml", price: 420, note: "Erode · Tamil Nadu",  tag: "Best seller" },
    { v: "blackSes", n: "Black Sesame",          size: "250 ml", price: 680, note: "Limited · ceremonial", tag: "Limited" },
    { v: "coconut",  n: "Virgin Coconut",        size: "1 litre", price: 880, note: "Kollam · Kerala", tag: null },
    { v: "castor",   n: "Castor · Eranda",       size: "200 ml", price: 540, note: "Wellness range", tag: "Not edible" },
    { v: "mustard",  n: "Mustard · Sarson",      size: "500 ml", price: 360, note: "Alwar · Rajasthan", tag: null },
    { v: "groundnut",n: "Groundnut",             size: "500 ml", price: 380, note: "Kadapa · AP", tag: null },
    { v: "sunflower",n: "Sunflower",             size: "1 litre", price: 320, note: "Hassan · Karnataka", tag: "Daily cook" },
  ];
  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 22, alignItems: "center" }}>
        {["All · 7", "Available", "Limited", "Wellness"].map((f, i) => (
          <button key={f} className={"pt-chip " + (i === 0 ? "pt-chip--active" : "")} style={{ cursor: "pointer" }}>{f}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <button className="pt-btn pt-btn--primary pt-btn--sm">Add all to basket</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {list.map((p, i) => (
          <div key={i} className="pt-card" style={{ background: "var(--cream-100)", padding: 20, position: "relative" }}>
            {p.tag && <div style={{ position: "absolute", top: 14, left: 14 }}><Pill tone={p.tag === "Limited" ? "dark" : p.tag === "Not edible" ? "terra" : "mustard"}>{p.tag}</Pill></div>}
            <div style={{ position: "absolute", top: 14, right: 14, color: "var(--terra-500)" }}><Icon.heart size={18}/></div>
            <div style={{ background: "var(--cream-200)", borderRadius: "var(--r-md)", padding: "20px 12px", display: "grid", placeItems: "center", aspectRatio: "1/1" }}>
              <Bottle variant={p.v} size={120}/>
            </div>
            <div className="pt-mono-stamp" style={{ marginTop: 14 }}>{p.note}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)", marginTop: 4 }}>{p.n}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-500)" }}>{p.size}</div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 17, color: "var(--green-900)" }}>₹{p.price}</span>
              <button className="pt-btn pt-btn--ghost pt-btn--sm"><Icon.plus size={12}/> Add</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function AccountAddresses() {
  const list = [
    { n: "Home", a1: "14/2 4th Cross, Indiranagar", a2: "Bangalore, Karnataka 560038", ph: "+91 98XXX XXX42", d: true, type: "Residence" },
    { n: "Office", a1: "WeWork Galaxy, 43 Residency Rd", a2: "Bangalore, Karnataka 560025", ph: "+91 98XXX XXX42", type: "Workplace" },
    { n: "Parents", a1: "Flat 4B, Sundar Apartments", a2: "Pondy Bazaar, Chennai 600017", ph: "+91 44 XXXX 9821", type: "Gift to" },
  ];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <p style={{ fontSize: 14, color: "var(--ink-500)", margin: 0 }}>3 of 8 address slots used. Use <span style={{ color: "var(--green-900)", fontWeight: 600 }}>Default</span> for one-click checkout.</p>
        <button className="pt-btn pt-btn--primary pt-btn--sm">+ Add new address</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {list.map((ad, i) => (
          <div key={i} className="pt-card" style={{ background: "var(--cream-100)", padding: 24, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green-900)" }}>{ad.n}</span>
                {ad.d && <Pill tone="green">Default</Pill>}
              </div>
              <span className="pt-mono-stamp">{ad.type}</span>
            </div>
            <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-700)", lineHeight: 1.7 }}>
              {ad.a1}<br/>{ad.a2}<br/>{ad.ph}
            </p>
            <div style={{ marginTop: 18, display: "flex", gap: 14, fontSize: 12, paddingTop: 16, borderTop: "1px solid var(--cream-400)" }}>
              <button style={{ background: 0, border: 0, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", padding: 0, cursor: "pointer" }}>Edit</button>
              {!ad.d && <button style={{ background: 0, border: 0, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", padding: 0, cursor: "pointer" }}>Set as default</button>}
              <button style={{ background: 0, border: 0, color: "var(--terra-600)", borderBottom: "1px solid var(--terra-500)", padding: 0, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
        {/* add card */}
        <div className="pt-card pt-card--flat" style={{ background: "transparent", border: "1px dashed var(--wood-300)", display: "grid", placeItems: "center", padding: 24, minHeight: 160 }}>
          <div style={{ textAlign: "center", color: "var(--ink-500)" }}>
            <Icon.plus size={20}/>
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500, color: "var(--green-900)" }}>Add new address</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>5 slots remaining</div>
          </div>
        </div>
      </div>
    </>
  );
}

function AccountPayments() {
  return (
    <>
      {/* saved methods */}
      <AccountSectionHeader first title="Saved methods" cta={<button className="pt-btn pt-btn--primary pt-btn--sm">+ Add card or UPI</button>}/>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* UPI */}
        <div className="pt-card" style={{ background: "var(--green-950)", color: "var(--cream-100)", padding: 24, position: "relative", overflow: "hidden", minHeight: 180 }}>
          <div style={{ position: "absolute", right: -20, bottom: -30, opacity: 0.08 }}><CowMark size={200} color="var(--mustard-400)"/></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <Pill tone="mustard">Default</Pill>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, color: "var(--mustard-400)" }}>UPI</div>
          </div>
          <div style={{ marginTop: 28, fontFamily: "var(--font-mono)", fontSize: 22, letterSpacing: "0.05em", position: "relative" }}>lakshmi@oksbi</div>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 11, color: "rgba(245,239,224,0.55)", letterSpacing: "0.08em", position: "relative" }}>
            <span>VERIFIED · STATE BANK</span>
            <span style={{ display: "flex", gap: 12 }}>
              <a style={{ color: "rgba(245,239,224,0.65)", borderBottom: "1px solid rgba(245,239,224,0.3)", cursor: "pointer" }}>Manage</a>
              <a style={{ color: "var(--mustard-400)", borderBottom: "1px solid rgba(228,176,73,0.5)", cursor: "pointer" }}>Remove</a>
            </span>
          </div>
        </div>

        {/* Card 1 */}
        <PaymentCard scheme="Visa" last="2847" name="L Venkataraman" exp="08/28" tone="wood" def={false} primary={false}/>
        <PaymentCard scheme="Mastercard" last="0091" name="L Venkataraman" exp="11/26" tone="terra" def={false} primary={false}/>

        {/* add */}
        <div className="pt-card pt-card--flat" style={{ background: "transparent", border: "1px dashed var(--wood-300)", display: "grid", placeItems: "center", padding: 24, minHeight: 180 }}>
          <div style={{ textAlign: "center", color: "var(--ink-500)" }}>
            <Icon.plus size={20}/>
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500, color: "var(--green-900)" }}>Add card or UPI ID</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Visa · Mastercard · RuPay · any UPI bank</div>
          </div>
        </div>
      </div>

      {/* preferences */}
      <AccountSectionHeader title="Preferences"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        {[
          { l: "Default payment method", v: "UPI · lakshmi@oksbi" },
          { l: "Auto-pay subscriptions", v: "On · charges 24h before delivery" },
          { l: "Tokenisation (RBI)", v: "Enabled on all cards" },
          { l: "Cash on delivery cap", v: "Up to ₹2,000 per order" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 4px", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>{r.l}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-500)" }}>{r.v}</div>
            </div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm">Change</button>
          </div>
        ))}
      </div>

      {/* recent payments */}
      <AccountSectionHeader title="Recent payments"/>
      <div className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--cream-200)" }}>
              {["Date", "Order", "Method", "Amount", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "12px 18px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-500)", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FULL_ORDERS.slice(0, 5).map((o, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--cream-300)" }}>
                <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--green-900)" }}>{o.date}</td>
                <td style={{ padding: "14px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-700)" }}>{o.id}</td>
                <td style={{ padding: "14px 18px", fontSize: 13, color: "var(--ink-700)" }}>{o.pay}</td>
                <td style={{ padding: "14px 18px", fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>₹{o.total.toLocaleString("en-IN")}</td>
                <td style={{ padding: "14px 18px", textAlign: "right" }}><a style={{ fontSize: 12, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1, cursor: "pointer" }}>Receipt</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PaymentCard({ scheme, last, name, exp, tone, def }) {
  const bg = tone === "wood" ? "linear-gradient(135deg, #6B3A12 0%, #2B1810 100%)"
           : tone === "terra" ? "linear-gradient(135deg, #C66237 0%, #6A2A36 100%)"
           : "var(--cream-100)";
  return (
    <div className="pt-card" style={{ background: bg, color: "var(--cream-100)", padding: 24, position: "relative", minHeight: 180, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        {def ? <Pill tone="mustard">Default</Pill> : <span/>}
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "var(--cream-100)" }}>{scheme}</div>
      </div>
      <div style={{ marginTop: 28, fontFamily: "var(--font-mono)", fontSize: 20, letterSpacing: "0.1em" }}>
        •••• •••• •••• {last}
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 11, color: "rgba(245,239,224,0.65)", letterSpacing: "0.08em" }}>
        <div>
          <div style={{ fontSize: 9, opacity: 0.55 }}>CARDHOLDER</div>
          <div style={{ marginTop: 2 }}>{name.toUpperCase()}</div>
        </div>
        <div>
          <div style={{ fontSize: 9, opacity: 0.55 }}>EXPIRES</div>
          <div style={{ marginTop: 2, fontFamily: "var(--font-mono)" }}>{exp}</div>
        </div>
        <a style={{ color: "rgba(245,239,224,0.85)", borderBottom: "1px solid rgba(245,239,224,0.4)", cursor: "pointer" }}>Manage</a>
      </div>
    </div>
  );
}

function AccountNotifications() {
  const groups = [
    {
      h: "Orders & shipping",
      items: [
        { l: "Order confirmation", d: "When you place a new order",  e: true, w: true, p: false },
        { l: "Dispatch & tracking", d: "When your bottles leave the press house", e: true, w: true, p: true },
        { l: "Delivery handoff",   d: "Photo & OTP when delivered",   e: true, w: true, p: true },
      ],
    },
    {
      h: "Subscriptions",
      items: [
        { l: "Pre-charge reminder", d: "24 hours before we charge", e: true, w: true, p: false },
        { l: "Skip / pause windows", d: "When you can edit the next box", e: false, w: true, p: false },
      ],
    },
    {
      h: "Newsletter & marketing",
      items: [
        { l: "Wood-Press Diary",  d: "Fortnightly letter from the press", e: true, w: false, p: false },
        { l: "New harvest drops", d: "When a limited oil goes live",       e: true, w: true, p: true },
        { l: "Recipes",           d: "Occasional, from our test kitchen", e: false, w: false, p: false },
      ],
    },
  ];
  const ch = (on, color = "var(--green-800)") => (
    <span style={{
      width: 36, height: 22, borderRadius: 11,
      background: on ? color : "var(--cream-400)",
      display: "grid", alignItems: "center", padding: "0 3px",
      position: "relative", cursor: "pointer", transition: "background .2s var(--ease-out)",
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 8, background: "var(--cream-100)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transform: on ? "translateX(14px)" : "translateX(0)",
        transition: "transform .2s var(--ease-out)",
      }}/>
    </span>
  );
  return (
    <>
      {/* contact channels */}
      <AccountSectionHeader first title="Where we reach you"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        {[
          { Ico: Icon.mail,  l: "Email",    v: "lakshmi@kitchen.in",   verified: true },
          { Ico: Icon.phone, l: "WhatsApp", v: "+91 98XXX XXX42",      verified: true },
          { Ico: Icon.phone, l: "SMS",      v: "+91 98XXX XXX42",      verified: false },
        ].map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 18, alignItems: "center", padding: "16px 4px", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
            <c.Ico size={18}/>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>{c.l}</div>
              <div style={{ marginTop: 2, fontSize: 13, color: "var(--ink-500)" }}>{c.v}</div>
            </div>
            {c.verified
              ? <Pill tone="green">Verified</Pill>
              : <button className="pt-btn pt-btn--ghost pt-btn--sm">Verify</button>}
            <button className="pt-btn pt-btn--ghost pt-btn--sm">Change</button>
          </div>
        ))}
      </div>

      {/* matrix */}
      {groups.map((g, gi) => (
        <React.Fragment key={gi}>
          <AccountSectionHeader title={g.h}/>
          <div className="pt-card" style={{ background: "var(--cream-100)", padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 16, padding: "14px 20px", background: "var(--cream-200)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-500)", fontWeight: 600 }}>
              <span>Notification</span>
              <span style={{ textAlign: "center" }}>Email</span>
              <span style={{ textAlign: "center" }}>WhatsApp</span>
              <span style={{ textAlign: "center" }}>Push</span>
            </div>
            {g.items.map((n, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 16, padding: "16px 20px", borderTop: "1px solid var(--cream-300)", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>{n.l}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-500)" }}>{n.d}</div>
                </div>
                <div style={{ display: "grid", placeItems: "center" }}>{ch(n.e)}</div>
                <div style={{ display: "grid", placeItems: "center" }}>{ch(n.w)}</div>
                <div style={{ display: "grid", placeItems: "center" }}>{ch(n.p)}</div>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      {/* quiet hours */}
      <AccountSectionHeader title="Quiet hours"/>
      <div className="pt-card" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>Don't ping me from 10pm to 7am</div>
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-500)" }}>Critical delivery messages (out for delivery, OTP) will still come through.</div>
        </div>
        {ch(true)}
      </div>
    </>
  );
}

function AccountPersonal() {
  return (
    <>
      {/* Profile band */}
      <div className="pt-card" style={{ background: "var(--cream-100)", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "center", padding: 24 }}>
        <Avatar initials="LV" tone="warm" size={92}/>
        <div>
          <div className="pt-mono-stamp">MEMBER · MAR 2024</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--green-900)", marginTop: 6 }}>Lakshmi Venkataraman</div>
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-500)" }}>Bangalore · 14 orders · 32 bottles delivered</div>
        </div>
        <button className="pt-btn pt-btn--ghost pt-btn--sm">Change portrait</button>
      </div>

      {/* identity */}
      <AccountSectionHeader title="Identity"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        {[
          { l: "Full name",       v: "Lakshmi Venkataraman" },
          { l: "Email",           v: "lakshmi@kitchen.in",      verified: true },
          { l: "Phone (primary)", v: "+91 98XXX XXX42",          verified: true },
          { l: "Date of birth",   v: "07 March 1992" },
          { l: "Pronouns",        v: "she / her" },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr auto auto", gap: 18, alignItems: "center", padding: "16px 4px", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
            <div className="pt-mono-stamp">{r.l.toUpperCase()}</div>
            <div style={{ fontSize: 15, color: "var(--green-900)" }}>{r.v}</div>
            {r.verified ? <Pill tone="green">Verified</Pill> : <span/>}
            <button className="pt-btn pt-btn--ghost pt-btn--sm">Edit</button>
          </div>
        ))}
      </div>

      {/* kitchen preferences — brand-specific */}
      <AccountSectionHeader title="Your kitchen"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        {[
          { l: "Household size",            v: "4 adults · cooking 2× a day" },
          { l: "Cuisines you cook most",    v: "South Indian · Andhra · the occasional Italian" },
          { l: "Oils you'd never use",      v: "Refined sunflower, palmolein" },
          { l: "Language for delivery SMS", v: "English · தமிழ்" },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "220px 1fr auto", gap: 18, alignItems: "center", padding: "16px 4px", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
            <div className="pt-mono-stamp">{r.l.toUpperCase()}</div>
            <div style={{ fontSize: 14, color: "var(--ink-700)" }}>{r.v}</div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm">Edit</button>
          </div>
        ))}
      </div>

      {/* security */}
      <AccountSectionHeader title="Security"/>
      <div className="pt-card" style={{ background: "var(--cream-100)" }}>
        {[
          { l: "Password",          v: "Last changed Aug 2025",       cta: "Change" },
          { l: "Two-factor auth",   v: "On · WhatsApp OTP",            cta: "Manage" },
          { l: "Active sessions",   v: "3 devices · 1 in Mumbai (yesterday)", cta: "Sign out others" },
          { l: "Login alerts",      v: "Email me on new browser sign-in", cta: "Edit" },
        ].map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "center", padding: "16px 4px", borderTop: i ? "1px solid var(--cream-400)" : "none" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green-900)" }}>{r.l}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-500)" }}>{r.v}</div>
            </div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm">{r.cta}</button>
          </div>
        ))}
      </div>

      {/* data & account */}
      <AccountSectionHeader title="Data & account"/>
      <div className="pt-card pt-card--flat" style={{ background: "transparent", border: "1px solid var(--cream-400)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <button className="pt-btn pt-btn--ghost">Download my data</button>
          <button className="pt-btn pt-btn--ghost">Export order history (CSV)</button>
        </div>
        <hr className="pt-hr" style={{ margin: "20px 0" }}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--terra-700)" }}>Delete account</div>
            <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-500)" }}>Permanently remove your data. Cannot be undone.</div>
          </div>
          <button className="pt-btn pt-btn--sm" style={{ background: "var(--terra-100)", color: "var(--terra-700)", border: "1px solid var(--terra-300)" }}>Delete</button>
        </div>
      </div>
    </>
  );
}

// ---------- ACCOUNT MOBILE ----------
function AccountMobile() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader title="Account"/>
      {/* hero */}
      <div style={{ padding: "20px 16px 0" }}>
        <div className="pt-eyebrow">Member · Mar 2024</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
          Hello, <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>Lakshmi.</span>
        </h1>
      </div>

      {/* tier card */}
      <div style={{ padding: "20px 16px" }}>
        <div style={{ padding: 18, background: "var(--green-950)", color: "var(--cream-100)", borderRadius: "var(--r-lg)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -10, top: -20, opacity: 0.1 }}><CowMark size={160} color="var(--mustard-400)"/></div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Subscriber · Ghani tier</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginTop: 8 }}>14 orders · 32 bottles</div>
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(245,239,224,0.6)" }}>2 more orders for "Chekku" tier · +5% off</div>
          <div style={{ marginTop: 12, height: 4, background: "rgba(245,239,224,0.15)", borderRadius: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "var(--mustard-400)", borderRadius: 2 }}/>
          </div>
        </div>
      </div>

      {/* live order */}
      <div style={{ padding: "0 16px" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 10 }}>On its way</div>
        <div className="pt-card" style={{ background: "var(--cream-100)", padding: 14, display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, alignItems: "center" }}>
          <div style={{ background: "var(--cream-200)", borderRadius: 8, padding: 6, display: "grid", placeItems: "center" }}>
            <Bottle variant="sesame" size={40}/>
          </div>
          <div>
            <div className="pt-mono-stamp" style={{ fontSize: 9 }}>#PT-24011</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--green-900)", lineHeight: 1.15 }}>4 bottles</div>
            <Pill tone="mustard">Today · 4–6:30pm</Pill>
          </div>
          <Icon.chevRight size={16}/>
        </div>
      </div>

      {/* tile menu */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { Ico: Icon.package, l: "Orders", s: "14 total" },
            { Ico: Icon.refresh, l: "Subscriptions", s: "2 active" },
            { Ico: Icon.heart, l: "Saved bottles", s: "7 oils" },
            { Ico: Icon.pin, l: "Addresses", s: "3 saved" },
            { Ico: Icon.credit, l: "Payments", s: "UPI · 2 cards" },
            { Ico: Icon.mail, l: "Letters", s: "Fortnightly" },
          ].map((t, i) => (
            <div key={i} className="pt-card pt-card--flat" style={{ background: "var(--cream-100)", padding: 14 }}>
              <t.Ico size={18}/>
              <div style={{ marginTop: 12, fontFamily: "var(--font-display)", fontSize: 18, color: "var(--green-900)", lineHeight: 1.1 }}>{t.l}</div>
              <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>{t.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* personal info quick */}
      <div style={{ padding: "24px 16px 0" }}>
        <div className="pt-eyebrow" style={{ marginBottom: 10 }}>Personal</div>
        <div style={{ background: "var(--cream-100)", borderRadius: "var(--r-md)" }}>
          {[
            { l: "Name", v: "Lakshmi Venkataraman" },
            { l: "Email", v: "lakshmi@kitchen.in" },
            { l: "Phone", v: "+91 98XXX XXX42" },
            { l: "Language", v: "English · தமிழ்" },
          ].map((r, i) => (
            <div key={i} style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < 3 ? "1px solid var(--cream-300)" : "none" }}>
              <div>
                <div className="pt-mono-stamp" style={{ fontSize: 9 }}>{r.l}</div>
                <div style={{ fontSize: 14, color: "var(--green-900)", marginTop: 2 }}>{r.v}</div>
              </div>
              <Icon.chevRight size={14}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        <a style={{ fontSize: 13, color: "var(--terra-600)" }}>Sign out</a>
      </div>

      <div style={{ height: 80 }}/>
      <MobileBottomNav active="me"/>
    </div>
  );
}

// ---------- NEWSLETTER POPUP ----------
function NewsletterPopup() {
  return (
    <div className="pt-artboard" style={{ background: "rgba(15,26,14,0.45)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 40, minHeight: "100vh" }}>
      <div style={{
        width: 760, maxWidth: "100%",
        background: "var(--cream-100)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--sh-xl)", overflow: "hidden",
        display: "grid", gridTemplateColumns: "0.9fr 1.1fr",
        position: "relative",
      }}>
        {/* close */}
        <button style={{
          position: "absolute", top: 16, right: 16, zIndex: 5,
          width: 34, height: 34, borderRadius: 17,
          background: "rgba(245,239,224,0.92)",
          border: "1px solid var(--cream-400)",
          color: "var(--green-900)", display: "grid", placeItems: "center", cursor: "pointer",
        }}><Icon.close size={14}/></button>

        {/* left photo */}
        <PhotoPlaceholder tone="warm" style={{ borderRadius: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 28, position: "relative", minHeight: 480 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.08, display: "grid", placeItems: "end start", paddingLeft: 16, paddingBottom: 16 }}>
            <CowMark size={240} color="var(--cream-100)"/>
          </div>
          <div style={{ position: "relative", color: "var(--cream-100)" }}>
            <div className="pt-mono-stamp" style={{ color: "var(--mustard-200)" }}>BATCH #047 · NOV 2025</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, marginTop: 6, lineHeight: 1.1, color: "var(--cream-100)" }}>
              Today's <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>press.</span>
            </div>
          </div>
          <div style={{ position: "relative", display: "grid", placeItems: "center", flex: 1 }}>
            <div style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.45))" }}>
              <Bottle variant="sesame" size={200}/>
            </div>
          </div>
          <div style={{ position: "relative", color: "var(--cream-100)", display: "flex", justifyContent: "space-between", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            <span>Erode · Tamil Nadu</span>
            <span style={{ color: "var(--mustard-200)" }}>9-hr press</span>
          </div>
        </PhotoPlaceholder>

        {/* right form */}
        <div style={{ padding: "44px 40px 36px", display: "flex", flexDirection: "column" }}>
          <div className="pt-eyebrow">Welcome — quietly</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.0, color: "var(--green-900)", margin: "14px 0 0", letterSpacing: "-0.025em" }}>
            Fifteen <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>percent off,</span><br/>
            one short letter.
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, color: "var(--ink-500)", lineHeight: 1.65 }}>
            A fortnightly note from the press at Erode — harvest dates, the occasional recipe, and the discount code for your first bottle.
          </p>

          {/* perk list */}
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { Ico: Icon.leaf, t: "Press updates from the village" },
              { Ico: Icon.mail, t: "One letter every fortnight — no spam" },
              { Ico: Icon.shield, t: "Unsubscribe in one click" },
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--green-900)" }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, background: "var(--green-100)", display: "grid", placeItems: "center", color: "var(--green-800)" }}><p.Ico size={14}/></span>
                <span style={{ fontSize: 13, color: "var(--ink-700)" }}>{p.t}</span>
              </div>
            ))}
          </div>

          {/* email form */}
          <div style={{ marginTop: 22 }}>
            <span className="pt-field-label" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-500)" }}>Email</span>
            <div style={{ marginTop: 6, background: "var(--cream-200)", borderRadius: "var(--r-md)", padding: 5, display: "flex", border: "1px solid var(--cream-400)" }}>
              <input className="pt-input" placeholder="your@kitchen.in" style={{ background: 0, border: 0, fontSize: 14, padding: "10px 12px", flex: 1, color: "var(--green-900)" }}/>
              <button className="pt-btn pt-btn--primary pt-btn--sm">Get my code</button>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--ink-500)", lineHeight: 1.5 }}>
              By subscribing you agree to our <u>privacy policy</u>. We won't sell your address.
            </div>
          </div>

          {/* dismiss */}
          <div style={{ marginTop: "auto", paddingTop: 22, textAlign: "center" }}>
            <a style={{ fontSize: 13, color: "var(--ink-500)", borderBottom: "1px solid var(--cream-400)", paddingBottom: 1 }}>No thanks, keep shopping</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- EXIT INTENT POPUP ----------
function ExitIntentPopup() {
  return (
    <div className="pt-artboard" style={{ background: "rgba(15,26,14,0.65)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 40, minHeight: "100vh" }}>
      <div style={{
        width: 580, maxWidth: "100%",
        background: "var(--green-950)", borderRadius: "var(--r-xl)",
        boxShadow: "var(--sh-xl)", color: "var(--cream-100)",
        position: "relative", overflow: "hidden",
      }}>
        {/* close */}
        <button style={{
          position: "absolute", top: 16, right: 16, zIndex: 5,
          width: 34, height: 34, borderRadius: 17,
          background: "rgba(245,239,224,0.1)",
          border: "1px solid rgba(245,239,224,0.18)",
          color: "var(--cream-100)", display: "grid", placeItems: "center", cursor: "pointer",
        }}><Icon.close size={14}/></button>

        {/* cow watermark */}
        <div style={{ position: "absolute", left: -30, bottom: -50, opacity: 0.08, pointerEvents: "none" }}>
          <CowMark size={360} color="var(--mustard-400)"/>
        </div>
        <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.06, pointerEvents: "none" }}>
          <CowMark size={260} color="var(--cream-100)"/>
        </div>

        {/* hero band — free bottle photo */}
        <div style={{ position: "relative", padding: "44px 44px 28px", textAlign: "center" }}>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-400)" }}>Before you go</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 56, lineHeight: 1.0, margin: "16px 0 0", letterSpacing: "-0.025em", color: "var(--cream-100)" }}>
            Free bottle of sesame,<br/>
            <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>your first basket.</span>
          </h2>
          <p style={{ marginTop: 16, fontSize: 15, color: "rgba(245,239,224,0.7)", lineHeight: 1.65, maxWidth: 400, margin: "16px auto 0" }}>
            A 250ml bottle of Erode wood-pressed sesame, on the house, with any order over <b style={{ color: "var(--mustard-400)" }}>₹999</b>. Code lives in your inbox for 24 hours.
          </p>
        </div>

        {/* bottle stage */}
        <div style={{ position: "relative", padding: "0 44px 8px", display: "flex", justifyContent: "center", gap: 16, alignItems: "flex-end" }}>
          <div style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.5))", opacity: 0.7 }}>
            <Bottle variant="coconut" size={90}/>
          </div>
          <div style={{ position: "relative", filter: "drop-shadow(0 28px 40px rgba(0,0,0,0.55))" }}>
            <Bottle variant="sesame" size={140}/>
            <div style={{
              position: "absolute", top: -10, right: -28,
              background: "var(--mustard-400)", color: "var(--green-950)",
              padding: "5px 10px", borderRadius: 999,
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.08em", transform: "rotate(8deg)",
            }}>FREE</div>
          </div>
          <div style={{ filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.5))", opacity: 0.7 }}>
            <Bottle variant="mustard" size={90}/>
          </div>
        </div>

        {/* form */}
        <div style={{ position: "relative", padding: "20px 44px 36px" }}>
          <div style={{ background: "rgba(245,239,224,0.08)", border: "1px solid rgba(245,239,224,0.15)", borderRadius: "var(--r-md)", padding: 5, display: "flex" }}>
            <input className="pt-input" placeholder="your@kitchen.in"
              style={{ background: 0, border: 0, color: "var(--cream-100)", padding: "12px 14px", fontSize: 14, flex: 1 }}/>
            <button className="pt-btn pt-btn--mustard">Claim my bottle</button>
          </div>

          {/* trust row */}
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid rgba(245,239,224,0.12)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, fontSize: 11, color: "rgba(245,239,224,0.55)", textAlign: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Icon.shield size={14}/> <span>No card needed</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Icon.clock size={14}/> <span>Expires in 24 h</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Icon.mail size={14}/> <span>One letter / fortnight</span>
            </div>
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <a style={{ fontSize: 12, color: "rgba(245,239,224,0.45)", borderBottom: "1px solid rgba(245,239,224,0.2)", paddingBottom: 1 }}>No thanks, I'll pay full price</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- MOBILE NAV SHOWCASE (3 mobile screens with bottom nav) ----------
function MobileNavShowcase({ tab = "shop" }) {
  if (tab === "shop") return <MobileNavOils/>;
  if (tab === "saved") return <MobileNavSaved/>;
  if (tab === "orders") return <MobileNavOrders/>;
  return null;
}

function MobileNavOils() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader title="Oils" />
      <div style={{ padding: "16px 16px 0", display: "flex", gap: 8, overflowX: "auto" }} className="pt-noscroll">
        {["All","Daily","Ceremonial","Wellness"].map((c, i) => (
          <button key={c} className={`pt-chip ${i===0?"pt-chip--active":""}`}>{c}</button>
        ))}
      </div>
      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { v:"sesame", n:"Sesame", p: 420 },
          { v:"coconut", n:"Coconut", p: 480 },
          { v:"groundnut", n:"Groundnut", p: 380 },
          { v:"mustard", n:"Mustard", p: 360 },
          { v:"sunflower", n:"Sunflower", p: 320 },
          { v:"blackSes", n:"Black Sesame", p: 680 },
        ].map((p, i) => (
          <div key={i} className="pt-card" style={{ padding: 10 }}>
            <div style={{ background: "var(--cream-200)", borderRadius: 8, padding: 14, display: "grid", placeItems: "center", aspectRatio: "1/1.1" }}>
              <Bottle variant={p.v} size={75}/>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--green-900)", marginTop: 8 }}>{p.n}</div>
            <div style={{ fontSize: 12, color: "var(--ink-500)" }}>From ₹{p.p}</div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }}/>
      <MobileBottomNav active="shop"/>
    </div>
  );
}

function MobileNavSaved() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader title="Saved · 7"/>
      <div style={{ padding: "16px" }}>
        {[
          { v: "sesame", n: "Sesame · 500ml", p: 420, note: "From Erode" },
          { v: "blackSes", n: "Black Sesame · 250ml", p: 680, note: "Limited · ceremonial" },
          { v: "castor", n: "Castor · Eranda", p: 540, note: "Wellness" },
          { v: "coconut", n: "Virgin Coconut · 1L", p: 880, note: "Kollam" },
        ].map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--cream-400)", alignItems: "center" }}>
            <div style={{ background: "var(--cream-100)", borderRadius: 8, padding: 6, display: "grid", placeItems: "center" }}>
              <Bottle variant={it.v} size={44}/>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--green-900)", lineHeight: 1.1 }}>{it.n}</div>
              <div className="pt-mono-stamp" style={{ fontSize: 9, marginTop: 2 }}>{it.note}</div>
              <div style={{ fontSize: 13, color: "var(--green-900)", fontWeight: 600, marginTop: 6 }}>₹{it.p}</div>
            </div>
            <button className="pt-btn pt-btn--ghost pt-btn--sm">Add</button>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }}/>
      <MobileBottomNav active="saved"/>
    </div>
  );
}

function MobileNavOrders() {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", position: "relative" }}>
      <MobileHeader title="Orders"/>
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { id: "#PT-24011", d: "Today", s: "Out for delivery", tone: "mustard", v: ["sesame","coconut","mustard"], n: "4 bottles · ₹1,047" },
          { id: "#PT-23980", d: "Oct 22", s: "Delivered", tone: "green", v: ["sesame","sesame"], n: "2 bottles · ₹714" },
          { id: "#PT-23912", d: "Sep 15", s: "Delivered", tone: "green", v: ["groundnut","mustard","coconut"], n: "3 bottles · ₹980" },
          { id: "#PT-23804", d: "Aug 02", s: "Delivered", tone: "green", v: ["blackSes"], n: "1 bottle · ₹680" },
        ].map((o, i) => (
          <div key={i} className="pt-card" style={{ background: "var(--cream-100)", padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="pt-mono-stamp">{o.id} · {o.d}</div>
              <Pill tone={o.tone}>{o.s}</Pill>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
              {o.v.map((v, j) => (
                <div key={j} style={{ background: "var(--cream-200)", borderRadius: 8, padding: 4, display: "grid", placeItems: "center" }}>
                  <Bottle variant={v} size={36}/>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "var(--green-900)", fontWeight: 600 }}>{o.n}</div>
              <a style={{ fontSize: 12, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1 }}>{i === 0 ? "Track" : "Reorder"}</a>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: 80 }}/>
      <MobileBottomNav active="orders"/>
    </div>
  );
}

// ============================================================
// AUTH — DESKTOP VARIANTS (split-screen, web-grade)
// ============================================================

function AuthShellDesktop({ children, eyebrow, title, italic, sub }) {
  return (
    <div className="pt-artboard pt-noscroll" style={{ overflowY: "auto", background: "var(--cream-200)" }}>
      <div style={{ padding: "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--cream-400)", background: "var(--cream-100)" }}>
        <Wordmark size={20} sub={false}/>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--ink-500)", alignItems: "center" }}>
          <a>← Back to shop</a>
          <span style={{ width: 1, height: 16, background: "var(--cream-400)" }}/>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.shield size={14}/> Secure sign-in</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", minHeight: "calc(100% - 64px)" }}>
        {/* left — photo hero */}
        <PhotoPlaceholder tone="warm" style={{ borderRadius: 0, padding: "64px 72px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.07, display: "grid", placeItems: "end start", paddingLeft: 32, paddingBottom: 32 }}><CowMark size={420} color="var(--cream-100)"/></div>
          <div className="pt-eyebrow" style={{ color: "var(--mustard-200)", position: "relative" }}>{eyebrow}</div>
          <div style={{ position: "relative" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 80, lineHeight: 0.98, color: "var(--cream-100)", letterSpacing: "-0.025em", margin: 0 }}>
              {title}<br/>
              <span className="pt-display-italic" style={{ color: "var(--mustard-400)" }}>{italic}</span>
            </h1>
            <p style={{ marginTop: 24, fontSize: 17, color: "rgba(245,239,224,0.7)", lineHeight: 1.65, maxWidth: 440 }}>
              {sub}
            </p>
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid rgba(245,239,224,0.18)", display: "flex", gap: 36 }}>
              <div>
                <div className="pt-mono-stamp" style={{ color: "rgba(245,239,224,0.5)" }}>FROM</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--cream-100)", marginTop: 4 }}>Erode press</div>
              </div>
              <div>
                <div className="pt-mono-stamp" style={{ color: "rgba(245,239,224,0.5)" }}>BATCH</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--cream-100)", marginTop: 4 }}>#047 · Nov 2025</div>
              </div>
            </div>
          </div>
        </PhotoPlaceholder>

        {/* right — form */}
        <div style={{ display: "grid", placeItems: "center", padding: "56px 56px" }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthLoginDesktop() {
  return (
    <AuthShellDesktop
      eyebrow="Welcome back"
      title="The kitchen"
      italic="is waiting."
      sub="Pressed slowly, on wood. Sign in to track your bottle from Erode to your cooktop, manage your subscription, and re-order in two taps."
    >
      <div className="pt-eyebrow">Sign in</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
        Good to see you<br/>
        <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>again.</span>
      </h2>
      <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>
        Use the email or phone you registered with. We'll send a verification code if it's a new device.
      </p>
      <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pt-field">
          <span className="pt-field-label">Email or phone</span>
          <input className="pt-input" defaultValue="lakshmi@kitchen.in"/>
        </div>
        <div className="pt-field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="pt-field-label">Password</span>
            <a style={{ fontSize: 11, color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", paddingBottom: 1 }}>Forgot?</a>
          </div>
          <input className="pt-input" type="password" defaultValue="••••••••••"/>
        </div>
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, fontSize: 13, color: "var(--ink-500)" }}>
        <span style={{ width: 16, height: 16, border: "1.4px solid var(--wood-300)", borderRadius: 3, background: "var(--green-800)", display: "grid", placeItems: "center", color: "var(--cream-100)" }}><Icon.check size={10}/></span>
        Keep me signed in on this browser
      </label>
      <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 24 }}>Continue</button>

      <div style={{ margin: "26px 0 16px", display: "flex", alignItems: "center", gap: 12, color: "var(--ink-400)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
        <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
        OR
        <div style={{ flex: 1, height: 1, background: "var(--cream-400)" }}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "Google", c: "#fff", fg: "#1A2E18", border: true },
          { l: "Apple", c: "#1B1E16", fg: "#FBF7EC" },
        ].map(s => (
          <button key={s.l} className="pt-btn" style={{ background: s.c, color: s.fg, border: s.border ? "1px solid var(--cream-400)" : "none", minHeight: 46, justifyContent: "center" }}>Continue with {s.l}</button>
        ))}
      </div>
      <button className="pt-btn" style={{ background: "var(--green-100)", color: "var(--green-900)", minHeight: 46, justifyContent: "center", width: "100%", marginTop: 10 }}>Continue with WhatsApp OTP</button>

      <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
        New to Punyakoti? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", fontWeight: 600 }}>Create an account</a>
      </div>
    </AuthShellDesktop>
  );
}

function AuthRegisterDesktop() {
  return (
    <AuthShellDesktop
      eyebrow="Become a member · 01 / 03"
      title="Welcome to the"
      italic="press-house."
      sub="A short letter every fortnight, fifteen percent off your first bottle, harvest dates, and the occasional recipe. No spam, no emoji."
    >
      <div className="pt-eyebrow">Create your account</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
        A few small <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>details.</span>
      </h2>
      <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="pt-field" style={{ gridColumn: "1 / -1" }}>
          <span className="pt-field-label">Full name</span>
          <input className="pt-input" placeholder="Lakshmi Venkataraman"/>
        </div>
        <div className="pt-field" style={{ gridColumn: "1 / -1" }}>
          <span className="pt-field-label">Email</span>
          <input className="pt-input" placeholder="lakshmi@kitchen.in"/>
        </div>
        <div className="pt-field" style={{ gridColumn: "1 / -1" }}>
          <span className="pt-field-label">Phone · for delivery updates</span>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="pt-input" style={{ width: 100, padding: "12px 14px", display: "flex", alignItems: "center", gap: 6, color: "var(--green-900)" }}>+91 <Icon.chevDown size={12}/></div>
            <input className="pt-input" placeholder="98XXX XXX42" style={{ flex: 1 }}/>
          </div>
        </div>
        <div className="pt-field" style={{ gridColumn: "1 / -1" }}>
          <span className="pt-field-label">Password</span>
          <input className="pt-input" type="password" placeholder="At least 8 characters"/>
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 3 ? "var(--green-800)" : "var(--cream-400)" }}/>
            ))}
          </div>
          <span style={{ fontSize: 11, color: "var(--green-800)", marginTop: 4 }}>Strong</span>
        </div>
      </div>
      <label style={{ display: "flex", gap: 10, marginTop: 20, fontSize: 12, color: "var(--ink-500)", alignItems: "flex-start" }}>
        <span style={{ width: 16, height: 16, border: "1.4px solid var(--wood-300)", borderRadius: 3, background: "var(--green-800)", flexShrink: 0, marginTop: 2, display: "grid", placeItems: "center", color: "var(--cream-100)" }}><Icon.check size={10}/></span>
        Send me a short fortnightly letter from Erode. I can unsubscribe in one click.
      </label>
      <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 22 }}>Continue · verify phone</button>
      <div style={{ marginTop: 14, fontSize: 11, color: "var(--ink-500)", textAlign: "center", lineHeight: 1.55 }}>
        By continuing you agree to our <u>terms</u> and <u>privacy policy</u>.
      </div>
      <div style={{ marginTop: 22, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
        Already have an account? <a style={{ color: "var(--green-800)", borderBottom: "1px solid var(--green-800)", fontWeight: 600 }}>Sign in</a>
      </div>
    </AuthShellDesktop>
  );
}

function AuthOTPDesktop() {
  return (
    <AuthShellDesktop
      eyebrow="Verification · 02 / 03"
      title="We sent you"
      italic="six digits."
      sub="Check WhatsApp on the number you provided. Codes expire in five minutes — we'll resend if it doesn't arrive."
    >
      <div className="pt-eyebrow">Almost there</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.02, color: "var(--green-900)", margin: "10px 0 0", letterSpacing: "-0.02em" }}>
        Enter the <span className="pt-display-italic" style={{ color: "var(--mustard-600)" }}>code.</span>
      </h2>
      <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-500)", lineHeight: 1.6 }}>
        Sent to WhatsApp on <b style={{ color: "var(--green-900)" }}>+91 98XXX XXX42</b>. <a style={{ borderBottom: "1px solid var(--green-800)", color: "var(--green-800)" }}>Change number</a>
      </p>

      <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "space-between" }}>
        {["4","2","9","",""," "].map((d, i) => (
          <div key={i} style={{
            flex: 1, height: 72,
            border: `1.5px solid ${i < 3 ? "var(--green-900)" : "var(--cream-400)"}`,
            borderRadius: "var(--r-md)",
            background: i < 3 ? "var(--cream-100)" : "var(--cream-200)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--font-display)", fontSize: 36, color: "var(--green-900)",
            position: "relative",
          }}>
            {d.trim()}
            {i === 3 && <div style={{ width: 2, height: 32, background: "var(--green-800)", animation: "blink 1s infinite", position: "absolute" }}/>}
          </div>
        ))}
      </div>

      <button className="pt-btn pt-btn--primary pt-btn--lg pt-btn--full" style={{ marginTop: 28 }}>Verify and continue</button>
      <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--ink-500)" }}>
        Didn't get it? <a style={{ color: "var(--green-800)" }}>Resend in <b className="mono">00:42</b></a>
      </div>

      <div style={{ marginTop: 28, padding: 16, background: "var(--green-100)", borderRadius: "var(--r-md)", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon.shield size={18}/>
        <div style={{ fontSize: 12, color: "var(--green-900)", lineHeight: 1.5 }}>
          We never ask for your password over WhatsApp. If anything feels off, message us at <b>help@punyakoti.in</b>.
        </div>
      </div>
    </AuthShellDesktop>
  );
}

Object.assign(window, {
  AuthLogin, AuthRegister, AuthOTP,
  AuthLoginDesktop, AuthRegisterDesktop, AuthOTPDesktop,
  AccountDesktop, AccountMobile,
  NewsletterPopup, ExitIntentPopup,
  MobileNavOils, MobileNavSaved, MobileNavOrders,
});
