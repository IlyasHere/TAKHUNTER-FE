/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4758E0',
        primaryDark: '#2F3FC4',
        sidebar: '#173A9E',
        bgSoft: '#F7F8FC',
        textDark: '#1F2937',
        textMuted: '#6B7280',
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
