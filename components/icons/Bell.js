import Svg, { Path } from "react-native-svg";
const SvgBell = ({ size = 24, color = "#111", ...props }) => (
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
      d="M18 9A6 6 0 1 0 6 9c0 7-3 9-3 9h18s-3-2-3-9"
    />
    <Path stroke={color} strokeWidth={2} d="M15 18a3 3 0 1 1-6 0" />
  </Svg>
);
export default SvgBell;
