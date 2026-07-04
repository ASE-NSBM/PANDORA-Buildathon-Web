import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 'deep-ocean':    '#081B2A',
        // 'midnight-blue': '#102A43',
        // 'ocean-blue':    '#143D59',
        // 'aqua-blue':     '#1E5F7A',
        // 'bio-cyan':      '#24A3C7',
        // 'bright-cyan':   '#64E6FF',
        // 'ice-blue':      '#A3F7FF',
        // 'accent-purple': '#8A2BE2',
        'deep-ocean':    '#0B1D2A',
        'midnight-blue': '#102A43',
        'ocean-blue':    '#143D59',
        'aqua-blue':     '#1E5F7A',
        'bio-cyan':      '#24A3C7',
        'bright-cyan':   '#64E6FF',
        'ice-blue':      '#A3F7FF',
        'accent-purple': '#8A2BE2',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter:   ['var(--font-inter)',   'sans-serif'],
      },
      backgroundImage: {
        'glow-cyan':   'radial-gradient(ellipse at center, rgba(100,230,255,0.15) 0%, transparent 70%)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(138,43,226,0.15)  0%, transparent 70%)',
      },
      animation: {
        float:        'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      boxShadow: {
        'cyan-glow':    '0 0 20px rgba(100,230,255,0.3)',
        'cyan-glow-lg': '0 0 40px rgba(100,230,255,0.5)',
        'purple-glow':  '0 0 20px rgba(138,43,226,0.3)',
        glass:          '0 8px 32px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        card:    '1rem',
        'card-lg': '1.25rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
