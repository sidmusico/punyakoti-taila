import React from 'react'

export type OilVariant = 'sesame' | 'coconut' | 'groundnut' | 'mustard' | 'sunflower' | 'blackSes' | 'castor'

const PALETTES: Record<OilVariant, { oil1: string; oil2: string; id: string }> = {
  sesame:    { oil1: '#3E2A14', oil2: '#1A1108', id: 'SESAME · TIL'                   },
  coconut:   { oil1: '#F6E5B8', oil2: '#E5D096', id: 'COCONUT · NARIYAL'              },
  groundnut: { oil1: '#A86E2C', oil2: '#5C3A14', id: 'GROUNDNUT · MOONGFALI'          },
  mustard:   { oil1: '#C99837', oil2: '#8C6516', id: 'MUSTARD · SARSON'               },
  sunflower: { oil1: '#E6C168', oil2: '#9F7B25', id: 'SUNFLOWER · SURYAMUKHI'         },
  blackSes:  { oil1: '#1F1A12', oil2: '#0A0805', id: 'BLACK SESAME · KAALA TIL'       },
  castor:    { oil1: '#EFE4C5', oil2: '#C9B98A', id: 'CASTOR · ERANDA · WELLNESS'     },
}

interface BottleProps {
  variant?: OilVariant
  size?: number
  showLabel?: boolean
}

export function Bottle({ variant = 'sesame', size = 200, showLabel = true }: BottleProps) {
  const p = PALETTES[variant]
  const gid = `g-${variant}`

  return (
    <svg width={size} height={size * 2} viewBox="0 0 100 200">
      <defs>
        <linearGradient id={`oil-${gid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={p.oil1} />
          <stop offset="1" stopColor={p.oil2} />
        </linearGradient>
        <linearGradient id={`hi-${gid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.20" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="36" y="6" width="28" height="20" rx="3" fill="#6E4A28" />
      <rect x="36" y="6" width="28" height="6" rx="2" fill="#8B6238" />
      <rect x="42" y="24" width="16" height="22" fill={`url(#oil-${gid})`} />
      {/* body */}
      <path
        d="M28 60 Q28 48 42 46 L58 46 Q72 48 72 60 L72 184 Q72 192 64 192 L36 192 Q28 192 28 184 Z"
        fill={`url(#oil-${gid})`}
      />
      <path
        d="M28 60 Q28 48 42 46 L58 46 Q72 48 72 60 L72 184 Q72 192 64 192 L36 192 Q28 192 28 184 Z"
        fill={`url(#hi-${gid})`}
      />
      {showLabel && (
        <>
          <rect x="32" y="100" width="36" height="60" rx="2" fill="#FBF7EC" />
          <text x="50" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="9" fill="#1A2E18">
            Punyakoti
          </text>
          <text x="50" y="136" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="4.2" letterSpacing="1.2" fill="#6E4A28">
            {p.id}
          </text>
          <line x1="38" y1="142" x2="62" y2="142" stroke="#C99837" strokeWidth="0.7" />
          <text x="50" y="152" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="3.3" letterSpacing="1" fill="#6B6F5E">
            WOOD-PRESSED · 500 ML
          </text>
        </>
      )}
    </svg>
  )
}
