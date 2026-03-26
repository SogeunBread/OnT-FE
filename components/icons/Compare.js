import Svg, { Path } from "react-native-svg";
const SvgCompare = ({ size = 24, color = "#111", ...props }) => (
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
      d="M12 3 3 7.5l9 4.5 9-4.5zM3 16l9 4 9-4M3 12l9 4 9-4"
    />
  </Svg>
);
export default SvgCompare;
