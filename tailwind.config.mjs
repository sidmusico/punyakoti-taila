/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Greens — forest, brand primary
        green: {
          50:  '#EFF2EA',
          100: '#DDE5D4',
          300: '#94AC8C',
          600: '#3E6039',
          700: '#2D4A2B',
          800: '#244023',
          900: '#1A2E18',
          950: '#0F1A0E',
        },
        // Mustard / turmeric — warm accent
        mustard: {
          100: '#F8EBC5',
          200: '#F1DDA1',
          400: '#DEB04D',
          500: '#C99837',
          600: '#B0801E',
          700: '#8C6516',
        },
        // Terracotta — secondary warmth
        terra: {
          100: '#F1D3C2',
          300: '#D8896A',
          500: '#B5512D',
          600: '#9B4523',
          700: '#823818',
        },
        // Wood — deep brown
        wood: {
          300: '#B89572',
          500: '#8B6238',
          600: '#6E4A28',
          700: '#4A331C',
          900: '#2B1C0F',
        },
        // Cream / paper — backgrounds
        cream: {
          100: '#FBF7EC',
          200: '#F5EFE0',
          300: '#ECE3CE',
          400: '#DCD0B3',
        },
        // Ink — warm-shifted neutrals
        ink: {
          200: '#D9D9C9',
          300: '#B6B8A8',
          400: '#8A8E7C',
          500: '#6B6F5E',
          700: '#3D4233',
          900: '#1B1E16',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Garamond', '"Times New Roman"', 'Georgia', 'serif'],
        body: ['Manrope', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', '"Cascadia Mono"', '"SFMono-Regular"', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1.55' }],
        'sm':   ['0.875rem', { lineHeight: '1.55' }],
        'base': ['1rem',     { lineHeight: '1.55' }],
        'md':   ['1.125rem', { lineHeight: '1.55' }],
        'lg':   ['1.25rem',  { lineHeight: '1.55' }],
        'xl':   ['1.5rem',   { lineHeight: '1.2'  }],
        '2xl':  ['2rem',     { lineHeight: '1.2'  }],
        '3xl':  ['2.75rem',  { lineHeight: '1.05' }],
        '4xl':  ['3.75rem',  { lineHeight: '1.05' }],
        '5xl':  ['5rem',     { lineHeight: '1.05' }],
        '6xl':  ['6.5rem',   { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tight:  '-0.02em',
        snug:   '-0.01em',
        base:    '0em',
        wide:    '0.04em',
        wider:   '0.12em',
      },
      borderRadius: {
        'xs':   '4px',
        'sm':   '8px',
        'md':   '12px',
        'lg':   '18px',
        'xl':   '28px',
        '2xl':  '40px',
        'pill': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(43, 28, 15, 0.06)',
        'sm': '0 2px 6px rgba(43, 28, 15, 0.05), 0 1px 2px rgba(43, 28, 15, 0.06)',
        'md': '0 6px 16px rgba(43, 28, 15, 0.07), 0 2px 4px rgba(43, 28, 15, 0.04)',
        'lg': '0 16px 40px rgba(43, 28, 15, 0.10), 0 4px 8px rgba(43, 28, 15, 0.04)',
        'xl': '0 32px 80px rgba(43, 28, 15, 0.14), 0 8px 16px rgba(43, 28, 15, 0.05)',
        'inset': 'inset 0 1px 2px rgba(43, 28, 15, 0.08)',
        'ring': '0 0 0 3px rgba(45, 74, 43, 0.18)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast: '140ms',
        med:  '240ms',
        slow: '420ms',
      },
      spacing: {
        '1':  '0.25rem',
        '2':  '0.5rem',
        '3':  '0.75rem',
        '4':  '1rem',
        '5':  '1.5rem',
        '6':  '2rem',
        '7':  '3rem',
        '8':  '4rem',
        '9':  '6rem',
        '10': '8rem',
        '11': '12rem',
      },
      maxWidth: {
        container: '1240px',
        wide: '1440px',
        narrow: '760px',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: { fontWeight: 'normal', marginBottom: '0.25em' },
            },
          ],
        },
        base: {
          css: [
            {
              h1: { fontSize: '2.5rem' },
              h2: { fontSize: '1.25rem', fontWeight: 600 },
            },
          ],
        },
        md: {
          css: [
            {
              h1: { fontSize: '3.5rem' },
              h2: { fontSize: '1.5rem' },
            },
          ],
        },
      },
    },
  },
}

export default config
