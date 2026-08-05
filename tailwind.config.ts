import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        xl: "var(--radius-xl)",
        sm: "var(--radius-sm)",
        pill: "var(--radius-pill)",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        sm: "var(--shadow-float)",
        DEFAULT: "var(--shadow-float)",
        md: "var(--shadow-float)",
        lg: "var(--shadow-float-hover)",
        glow: "var(--shadow-float)",
        soft: "var(--shadow-float)",
        float: "var(--shadow-float)",
        "float-hover": "var(--shadow-float-hover)",
      }
    },
  },
  plugins: [],
};
export default config;
