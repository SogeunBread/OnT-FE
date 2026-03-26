/** @type {import('tailwindcss').Config} */

// Design System Colors
// main = 400
const colors = {
  primary: {
    50: "#FFECE8",
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
  grayscale: {
    G900: "#292929",
    G800: "#414141",
    G700: "#595959",
    G600: "#707070",
    G500: "#888888",
    G400: "#A0A0A0",
    G500: "#888888",
    G300: "#B7B7B7",
    G200: "#CFCFCF",
    G100: "#E7E7E7",
  },
  text: {
    DEFAULT: "#111111",
    inverse: "#FFFFFF",
    sub: "#505050",
    sub2: "#767676",
    disabled: "#999999",
  },
};

module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "pretendard-regular": ["Pretendard"],
        "pretendard-medium": ["Pretendard-Medium"],
        "pretendard-semibold": ["Pretendard-SemiBold"],
        "pretendard-bold": ["Pretendard-Bold"],
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
      colors: colors,
    },
  },
  plugins: [],
};

module.exports.colors = colors;
