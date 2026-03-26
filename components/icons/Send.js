import Svg, { Path } from "react-native-svg";
const SvgSend = ({ size = 24, color = "#111", ...props }) => (
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
      d="M21 3 11 13M21 3l-6 19-4-9-9-3z"
    />
  </Svg>
);
export default SvgSend;
