/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enable dark mode class toggling
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        background: "#f9fafb",
        surface: "#ffffff",
        text: "#1f2937",
        darkBackground: "#111827",
        darkSurface: "#1f2937",
        darkText: "#f9fafb"
      }
    },
  },
  plugins: [],
}
