import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0B08",
        panel: "#171310",
        paper: "#F3ECE0",
        brass: {
          DEFAULT: "#C79A44",
          light: "#E4C78A",
          dark: "#8C6A2A"
        },
        ocean: "#2E6F8E",
        forest: "#3F5C3A",
        line: "#3A3227"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      maxWidth: {
        content: "72rem"
      }
    }
  },
  plugins: []
};

export default config;
