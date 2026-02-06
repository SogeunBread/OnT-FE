/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontFamily: {
          "pretendard-regular": ["Pretendard"],
          "pretendard-medium": ["Pretendard-Medium"],
          "pretendard-semibold": ["Pretendard-SemiBold"],
          "pretendard-bold": ["Pretendard-Bold"],
        },
      },
      fontSize: {
        // 12pt
        12: ["12px", { lineHeight: "18px" }],

        // 14pt
        14: ["14px", { lineHeight: "21px" }],

        // 16pt
        16: ["16px", { lineHeight: "24px" }],

        // 18pt
        18: ["18px", { lineHeight: "27px" }],

        // 24pt
        24: ["24px", { lineHeight: "36px" }],
      },
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
