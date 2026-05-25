// Simplified WoodPressScene SVG — stands in for real photography of the press
// Faithfully replicates the SVG composition from primitives.jsx / home-animated.jsx

export function WoodPressScene() {
  return (
    <svg
      viewBox="0 0 1200 720"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        {/* warm radial background */}
        <radialGradient id="wp-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#5a3920" />
          <stop offset="55%" stopColor="#2c1a0d" />
          <stop offset="100%" stopColor="#120a04" />
        </radialGradient>
        {/* wood grain */}
        <linearGradient id="wp-wood" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#3a2412" />
          <stop offset="35%"  stopColor="#5d3a1b" />
          <stop offset="55%"  stopColor="#6f4823" />
          <stop offset="80%"  stopColor="#3f2814" />
          <stop offset="100%" stopColor="#1d1108" />
        </linearGradient>
        {/* stone mill */}
        <radialGradient id="wp-stone" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#6b6358" />
          <stop offset="100%" stopColor="#312d28" />
        </radialGradient>
        {/* oil amber */}
        <linearGradient id="wp-oil" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="#c99c3a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7a5518" stopOpacity="0.6" />
        </linearGradient>
        {/* subtle vignette */}
        <radialGradient id="wp-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(10,5,2,0.55)" />
        </radialGradient>
        {/* light shaft */}
        <linearGradient id="wp-light" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"   stopColor="rgba(220,170,80,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* ── Background ── */}
      <rect width="1200" height="720" fill="url(#wp-bg)" />

      {/* warm light shaft from top-left */}
      <ellipse cx="380" cy="0" rx="320" ry="260" fill="url(#wp-light)" />

      {/* ── Floor / ground plane ── */}
      <ellipse cx="600" cy="640" rx="520" ry="80" fill="rgba(10,5,2,0.45)" />

      {/* ── Wooden ghani frame (horizontal beam) ── */}
      <rect x="140" y="290" width="920" height="38" rx="8" fill="url(#wp-wood)" />
      {/* grain lines */}
      {[0.12, 0.28, 0.45, 0.62, 0.78, 0.91].map((t, i) => (
        <line
          key={i}
          x1={140 + t * 920} y1="290"
          x2={140 + t * 920} y2="328"
          stroke="rgba(20,10,4,0.35)"
          strokeWidth="1.5"
        />
      ))}
      {/* beam shadow */}
      <rect x="140" y="322" width="920" height="12" rx="0" fill="rgba(10,5,2,0.3)" />

      {/* ── Central stone mill (mortar) ── */}
      <ellipse cx="600" cy="480" rx="130" ry="52" fill="#1e1a16" />
      <ellipse cx="600" cy="452" rx="130" ry="52" fill="url(#wp-stone)" />
      {/* inner hollow */}
      <ellipse cx="600" cy="446" rx="72" ry="30" fill="#120e0a" />
      {/* oil pool in hollow */}
      <ellipse cx="600" cy="446" rx="55" ry="21" fill="url(#wp-oil)" opacity="0.7" />

      {/* ── Wooden pestle / churning rod ── */}
      <rect x="584" y="180" width="32" height="272" rx="8" fill="url(#wp-wood)" />
      {/* pestle cap */}
      <ellipse cx="600" cy="180" rx="22" ry="10" fill="#8B6238" />
      {/* pestle shadow */}
      <rect x="610" y="180" width="6" height="272" rx="3" fill="rgba(10,5,2,0.22)" />

      {/* ── Horizontal drive arm ── */}
      <rect x="370" y="295" width="460" height="24" rx="6" fill="#6f4823" />
      <rect x="830" y="299" width="120" height="16" rx="4" fill="#5a3820" />

      {/* ── Oil drip / channel ── */}
      <path
        d="M470 452 Q440 500 430 560 Q428 580 445 585 Q470 590 490 570 Q510 548 505 520 Q500 495 480 470 Z"
        fill="url(#wp-oil)"
        opacity="0.55"
      />
      <path
        d="M728 452 Q755 500 765 555 Q768 578 752 582 Q728 588 710 568 Q692 545 698 518 Q704 492 720 468 Z"
        fill="url(#wp-oil)"
        opacity="0.45"
      />

      {/* ── Jute seed mat (lower-left) ── */}
      <rect x="80" y="540" width="220" height="12" rx="4" fill="#8B7355" opacity="0.7" />
      <rect x="80" y="555" width="220" height="8" rx="3" fill="#6B5535" opacity="0.5" />
      {/* seed pile */}
      {[0,1,2,3,4,5,6,7,8].map((_, i) => (
        <ellipse
          key={i}
          cx={110 + (i % 3) * 24 + Math.sin(i * 1.3) * 8}
          cy={526 + Math.floor(i / 3) * 10}
          rx="5" ry="3.5"
          fill="#c99c3a"
          opacity="0.65"
          transform={`rotate(${i * 22} ${110 + (i % 3) * 24} ${526 + Math.floor(i / 3) * 10})`}
        />
      ))}

      {/* ── Amber glass bottles (right cluster) ── */}
      {/* Bottle 1 */}
      <rect x="900" y="355" width="38" height="18" rx="3" fill="#5a3518" />
      <path d="M892 398 Q892 380 906 374 L920 374 Q934 376 934 394 L934 570 Q934 578 926 578 L902 578 Q894 578 892 570Z" fill="#3E2A14" />
      <rect x="900" y="440" width="34" height="68" rx="2" fill="#FBF7EC" opacity="0.85" />
      <text x="917" y="470" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="8" fill="#1A2E18">Punyakoti</text>
      <text x="917" y="481" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="3.8" letterSpacing="1" fill="#6E4A28">SESAME · TIL</text>
      <line x1="905" y1="488" x2="929" y2="488" stroke="#C99837" strokeWidth="0.6" />
      {/* Bottle 2 */}
      <rect x="948" y="380" width="34" height="16" rx="3" fill="#5a3518" />
      <path d="M940 418 Q940 402 954 396 L966 396 Q978 398 978 414 L978 582 Q978 590 970 590 L948 590 Q940 590 940 582Z" fill="#A86E2C" opacity="0.9"/>
      <rect x="946" y="460" width="30" height="58" rx="2" fill="#FBF7EC" opacity="0.8" />
      <text x="961" y="486" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="7.5" fill="#1A2E18">Punyakoti</text>
      <text x="961" y="496" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="3.5" letterSpacing="1" fill="#6E4A28">GROUNDNUT</text>
      {/* Bottle 3 (small, back) */}
      <rect x="855" y="375" width="30" height="14" rx="3" fill="#5a3518" opacity="0.8"/>
      <path d="M848 408 Q848 393 861 388 L871 388 Q882 390 882 404 L882 558 Q882 564 875 564 L855 564 Q848 564 848 558Z" fill="#1F1A12" opacity="0.85"/>

      {/* ── Warm ambient light glow ── */}
      <ellipse cx="430" cy="320" rx="180" ry="100" fill="rgba(200,150,50,0.08)" />
      <ellipse cx="920" cy="500" rx="100" ry="80" fill="rgba(200,140,40,0.06)" />

      {/* ── Vignette overlay ── */}
      <rect width="1200" height="720" fill="url(#wp-vignette)" />

      {/* ── Floating dust particles ── */}
      {[
        { cx: 330, cy: 180, r: 1.8 }, { cx: 520, cy: 140, r: 1.2 },
        { cx: 720, cy: 200, r: 1.5 }, { cx: 880, cy: 160, r: 1.0 },
        { cx: 250, cy: 300, r: 1.3 }, { cx: 660, cy: 120, r: 2.0 },
      ].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(220,170,80,0.35)" />
      ))}
    </svg>
  )
}
