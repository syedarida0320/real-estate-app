/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <– enables manual dark-mode toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};