import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        bridge: {
          void: "#050714",
          hull: "#08111f",
          panel: "#0d1728",
          line: "#26466e",
          bright: "#77c4ff",
          violet: "#9c6cff",
          mint: "#22f5c8",
          danger: "#ff4d68",
          amber: "#ffd166",
        },
      },
      boxShadow: {
        signal: "0 0 24px rgba(119, 196, 255, 0.22)",
        violet: "0 0 28px rgba(156, 108, 255, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
