/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15803D',
          dark: '#166534',
          tint: '#DCFCE7',
        },
        accent: {
          DEFAULT: '#A21C63',
          dark: '#861657',
          tint: '#FCE7F3',
        },
        ink: '#14261C',
        muted: '#5C6B62',
        paper: '#FAF8F3',
        surface: '#FFFFFF',
        line: '#E3E7E1',
        warning: '#B45309',
        danger: '#B91C1C',
        info: '#1D4ED8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 38, 28, 0.06), 0 8px 24px -12px rgba(20, 38, 28, 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 400ms ease-out both',
      },
    },
  },
  plugins: [],
}