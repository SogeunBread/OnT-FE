import CheckSvg from "@/assets/icons/check.svg";

const Check = ({ size = 24, color = "#111", ...props }) => (
  <CheckSvg width={size} height={size} color={color} {...props} />
);

export default Check;
