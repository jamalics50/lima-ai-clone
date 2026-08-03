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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        accent: {
          DEFAULT: "#C05E44", // Terracotta
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
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
        sans: ["var(--font-inter)"],
        serif: ["var(--font-newsreader)"],
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
