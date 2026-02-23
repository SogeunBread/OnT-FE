import Svg, { Path } from "react-native-svg";
const SvgCheck = ({ size = 24, color = "#111", ...props }) => (
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
      d="M20 7 9 18l-5-5"
    />
  </Svg>
);
export default SvgCheck;
