import Svg, { Path } from "react-native-svg";
const SvgBottom = ({ size = 24, color = "#111", ...props }) => (
  <Svg width={size} height={size} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m20 8-8 8-8-8"
    />
  </Svg>
);
export default SvgBottom;
