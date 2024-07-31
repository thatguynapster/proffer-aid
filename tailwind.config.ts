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
        primary: "#0E1766",
        secondary: "#FCD01C",
        dark: "#0B0706",
        muted: "#525560",
        "dark-muted": "#1D2130",
      },
    },
  },
  plugins: [],
};
export default config;
