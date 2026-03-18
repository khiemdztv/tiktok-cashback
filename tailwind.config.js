/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d9c8f",
        secondary: "#1a6b4a",
      }
    }
  },
  plugins: [],
}