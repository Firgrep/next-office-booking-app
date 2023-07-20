import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "custom-black": "#0a1121",
        "custom-brown": "#863a12",
        "custom-pink": "#f68961",
        "custom-yellow": "#febe6b",
        "custom-lightpink": "#ffc9a7",
        "custom-gray": "#efefe9",
      }
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    logs: false,
    themes: [
      {
        rokni: {
          "primary": "#febe6b",
          "secondary": "#ffc9a7",
          "accent": "#f68961",
          "neutral": "#efefe9",
          "base-100": "#ffffff",
        }
      }
    ],
  }
} satisfies Config;
