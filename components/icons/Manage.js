import Svg, { Path } from "react-native-svg";
const SvgManage = ({ size = 24, color = "#111", ...props }) => (
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
      d="M16 5h1.25c.464 0 .91.187 1.237.52.329.334.513.786.513 1.258v12.444c0 .472-.184.924-.513 1.257-.328.334-.773.521-1.237.521H6.75c-.464 0-.91-.187-1.237-.52A1.8 1.8 0 0 1 5 19.221V6.778c0-.472.184-.924.513-1.257C5.84 5.187 6.286 5 6.75 5H8"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 3H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1"
    />
  </Svg>
);
export default SvgManage;
