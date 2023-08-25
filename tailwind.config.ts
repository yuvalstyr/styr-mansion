import type { Config } from "tailwindcss"

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
} satisfies Config
