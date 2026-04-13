/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        'surface-low': 'var(--color-surface-low)',
        'surface-high': 'var(--color-surface-high)',
        'surface-highest': 'var(--color-surface-highest)',
        primary: 'var(--color-primary)',
        'primary-dim': 'var(--color-primary-dim)',
        error: '#D73357',
        'text-main': 'var(--color-text-main)',
        accent: 'var(--color-accent)',
        'card-bg': 'var(--color-card-bg)',
        'card-border': 'var(--color-card-border)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        ui: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(159, 167, 255, 0.3)',
        'glow-sm': '0 0 10px rgba(159, 167, 255, 0.2)',
        'glow-md': '0 0 24px rgba(159, 167, 255, 0.25)',
        'glow-lg': '0 0 40px rgba(159, 167, 255, 0.15)',
        'glow-xl': '0 0 60px rgba(88, 100, 241, 0.2)',
        ambient: '0 0 40px rgba(88, 100, 241, 0.05)',
        'ambient-lg': '0 0 80px rgba(88, 100, 241, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(159, 167, 255, 0.1)',
        'card-hover': '0 8px 32px rgba(88, 100, 241, 0.12), 0 0 0 1px rgba(159, 167, 255, 0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-edge': 'linear-gradient(135deg, rgba(159,167,255,0.2) 0%, transparent 50%)',
        'cta-gradient': 'linear-gradient(135deg, #5864F1, #9FA7FF)',
        'hero-mesh': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88,100,241,0.15), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-30px) translateX(-10px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(20px) rotate(3deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};
