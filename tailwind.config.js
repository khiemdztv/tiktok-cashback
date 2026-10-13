/** @type {import('tailwindcss').Config} */
const names = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "surface",
  "surface-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
];
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...Object.fromEntries(
          names.map((name) => [name, `rgb(var(--${name}) / <alpha-value>)`]),
        ),
        brand: "rgb(var(--primary) / <alpha-value>)",
        "brand-soft": "#eaf2e7",
        success: "#245d3d",
        "success-foreground": "#ffffff",
        warning: "#b57223",
        "warning-foreground": "#ffffff",
        cream: "#faf9f6",
        "cream-warm": "#f6f1e7",
        dark: "#192b23",
        navy: "#193b50",
      },
      fontFamily: { sans: ["Be Vietnam Pro", "Arial", "sans-serif"] },
      boxShadow: {
        soft: "0 2px 8px rgb(25 43 35 / .035)",
        lift: "0 12px 32px rgb(25 43 35 / .08)",
      },
      borderRadius: { xl: "12px", "2xl": "16px", "3xl": "24px" },
    },
  },
  plugins: [],
};
