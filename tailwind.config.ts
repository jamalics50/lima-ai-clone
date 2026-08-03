import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#141210",
        foreground: "#F5F1EA",
        card: {
          DEFAULT: "#1C1917",
          foreground: "#F5F1EA",
        },
        border: "rgba(255, 255, 255, 0.08)",
        coral: {
          DEFAULT: "#D9714A",
          text: "#4A1B0C",
        },
        sky: {
          DEFAULT: "#3FA9E0",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#9C978C",
        }
      },
      borderRadius: {
        DEFAULT: "16px",
        md: "16px",
        lg: "20px",
        sm: "8px",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
      }
    },
  },
  plugins: [],
};
export default config;
