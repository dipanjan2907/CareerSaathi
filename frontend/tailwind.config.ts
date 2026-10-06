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
        paper: {
          bg: "#F6F5F2",
          surface: "#FFFFFF",
          secondary: "#EEEDE8",
          border: "#DDDCD6",
          text: "#252522",
          muted: "#6F6E68",
          sage: "#49665A",
          softSage: "#DCE7E0",
          amber: "#B58A52",
        },
        charcoal: {
          bg: "#171816",
          surface: "#20211E",
          secondary: "#282925",
          border: "#373832",
          text: "#E8E7E1",
          muted: "#A7A69F",
          sage: "#8FAE9D",
          softSage: "#29352F",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
