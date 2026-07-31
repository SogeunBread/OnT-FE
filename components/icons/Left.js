import Svg, { Path } from "react-native-svg";
const SvgLeft = ({ size = 24, color = "#111", strokeWidth = 2, ...props }) => (
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
      strokeWidth={strokeWidth}
      d="m16 20-8-8 8-8"
    />
  </Svg>
);
export default SvgLeft;
