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
        // Refined Cyber Theme Palette
        background: "#050914", // Deeper dark blue
        surface: "#0F162A",    // Dark blue-grey
        "secondary-surface": "#1A243F", // Slightly lighter for contrast elements
        border: "#2C3E50",     // Subtler border color
        "text-primary": "#E0E7FF", // Light blue-white for primary text
        "text-secondary": "#A6B3CC", // Muted blue-grey for secondary text
        "primary-accent": "#00E5FF", // Vibrant Cyan
        "secondary-accent": "#AD60FF", // Complementary Purple
      },
    },
  },
  plugins: [],
};
