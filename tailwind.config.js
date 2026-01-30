/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'medieval': ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        'ink': 'var(--color-ink)',
        'surface': 'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
      }
    },
  },
  plugins: [],
}
