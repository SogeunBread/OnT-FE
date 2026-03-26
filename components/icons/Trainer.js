import Svg, { Path } from "react-native-svg";
const SvgTrainer = ({ size = 24, color = "#111", ...props }) => (
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
      d="M3 21h18L19.2 3h-8.1"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={2}
      d="M3 15.217c1.228-1.947 3.59-3.265 6.3-3.265 1.775 0 4.445 1.11 5.7 2.048"
    />
    <Path stroke={color} strokeWidth={2} d="M15 9a4 4 0 0 1-4-4V2" />
    <Path fill={color} d="m17 8-1.984 6H13l2-6z" />
  </Svg>
);
export default SvgTrainer;
