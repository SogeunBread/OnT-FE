import Svg, { Path } from "react-native-svg";
const SvgExercise = ({ size = 24, color = "#111", ...props }) => (
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
      strokeWidth={1.939}
      d="M8.4 6H5.6c-.331 0-.6.322-.6.72v10.56c0 .398.269.72.6.72h2.8c.331 0 .6-.322.6-.72V6.72C9 6.322 8.731 6 8.4 6M18.4 6h-2.8c-.331 0-.6.322-.6.72v10.56c0 .398.269.72.6.72h2.8c.331 0 .6-.322.6-.72V6.72c0-.398-.269-.72-.6-.72M9 12h6M19 12h2M3 12h2"
    />
  </Svg>
);
export default SvgExercise;
