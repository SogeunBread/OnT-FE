/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#FFCFC5",
          200: "#FFA492",
          300: "#FF8E78",
          main: "#FF795E",
          500: "#EF6346",
        },
        secondary: {
          blue: "#62B1FF",
          yellow: "#FFC74D",
        },
        text: {
          DEFAULT: "#111111",
          inverse: "#FFFFFF",
          sub: "#505050",
          sub2: "#767676",
          disabled: "#999999",
        },
      },
    },
  },
  plugins: [],
};
