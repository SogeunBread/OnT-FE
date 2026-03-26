import Svg, { Path } from "react-native-svg";
const SvgHeart = ({ size = 24, color = "#111", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.458 4.591a5.3 5.3 0 0 0-1.708-1.177 5.12 5.12 0 0 0-4.028 0 5.3 5.3 0 0 0-1.708 1.177L12 5.638 10.986 4.59a5.18 5.18 0 0 0-3.722-1.59 5.18 5.18 0 0 0-3.722 1.59A5.52 5.52 0 0 0 2 8.431a5.52 5.52 0 0 0 1.542 3.841l1.014 1.047 6.007 6.199a2 2 0 0 0 2.873 0l6.008-6.2 1.014-1.046a5.45 5.45 0 0 0 1.141-1.761 5.58 5.58 0 0 0 0-4.158 5.45 5.45 0 0 0-1.141-1.762"
    />
  </Svg>
);
export default SvgHeart;
