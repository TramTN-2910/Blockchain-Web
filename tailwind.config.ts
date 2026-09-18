import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#e0ebff",
          200: "#c7d7fe",
          500: "#4f46e5",
          600: "#4338ca",
          700: "#3730a3",
          accent: "#8b5cf6",
          gradientStart: "#4f46e5",
          gradientEnd: "#9333ea",
        },
        darkBg: "#0b0f19",
        darkCard: "#131b2e",
        darkBorder: "#1e293b",
        lightBg: "#f8fafc",
        lightCard: "#ffffff",
        lightBorder: "#e2e8f0",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
};
export default config;
