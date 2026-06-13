/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Real Rails Design System Palette
        background: "#030712",
        surface: "#0B1117",
        "secondary-surface": "#111827",
        border: "#1F2937",
        "text-primary": "#F8FAFC",
        "text-secondary": "#94A3B8",
        "primary-accent": "#38BDF8",
        "secondary-accent": "#818CF8",
      },
    },
  },
  plugins: [],
};
