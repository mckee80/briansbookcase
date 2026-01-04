import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2c1810",
        accent: "#8b4513",
        parchment: "#f5f1e8",
        border: "#d4c5b0",
        textLight: "#6b5d52",
      },
      fontFamily: {
        garamond: ['"EB Garamond"', 'serif'],
        baskerville: ['"Libre Baskerville"', 'serif'],
        crimson: ['"Crimson Pro"', 'serif'],
        fraunces: ['"Fraunces"', 'serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
