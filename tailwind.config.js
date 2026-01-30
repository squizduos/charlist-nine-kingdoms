/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#f4e4bc',
        'parchment-dark': '#d4c49c',
        'ink': '#2c1810',
        'blood': '#8b0000',
      },
      fontFamily: {
        'medieval': ['Georgia', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
