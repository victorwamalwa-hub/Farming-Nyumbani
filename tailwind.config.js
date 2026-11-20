/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      coalors: {
        paper: '#F7F3E8',
        ink: '#1F2A1F',
        accent: '#3F7D20',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}
