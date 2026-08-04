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
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        card: {
          DEFAULT: "var(--surface-1)",
          foreground: "var(--text-primary)",
        },
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          glass: "var(--surface-glass)",
        },
        border: "var(--border-subtle)",
        coral: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-primary-hover)",
          muted: "var(--accent-primary-muted)",
          text: "#000000",
        },
        sky: {
          DEFAULT: "var(--accent-blue)",
        },
        emerald: {
          DEFAULT: "var(--accent-emerald)",
        },
        rose: {
          DEFAULT: "var(--accent-rose)",
        },
        muted: {
          DEFAULT: "var(--surface-glass)",
          foreground: "var(--text-secondary)",
        }
      },
      borderRadius: {
        DEFAULT: "var(--radius-md)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        sm: "var(--radius-sm)",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        sm: "var(--shadow-card)",
        DEFAULT: "var(--shadow-card)",
        md: "var(--shadow-card)",
        lg: "var(--shadow-card)",
        glow: "var(--shadow-glow-accent)",
        soft: "var(--shadow-soft)",
        float: "var(--shadow-float)",
      }
    },
  },
  plugins: [],
};
export default config;
