import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      full: "0",
    },
    extend: {
      colors: {
        surface: "#ffffff",
        ink: "#1a1a1a",
        border: "#e0e0e0",
        muted: "#999999",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        display: ["72px", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "300" }],
        heading: ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
        body: ["15px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "400" }],
        code: ["13px", { lineHeight: "1.5", fontWeight: "400" }],
      },
      spacing: {
        "grid-1": "8px",
        "grid-2": "16px",
        "grid-3": "24px",
        "grid-4": "32px",
        "grid-5": "40px",
        "grid-6": "48px",
        "grid-8": "64px",
        "grid-10": "80px",
      },
    },
  },
  plugins: [],
};

export default config;
