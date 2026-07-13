import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const KotlinIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      transform="translate(2.25 2.25)"
      d="M13.500 13.500C13.500 13.500 0.000 13.500 0.000 13.500C0.000 13.500 0.000 0.000 0.000 0.000C0.000 0.000 13.500 0.000 13.500 0.000C13.500 0.000 6.750 6.750 6.750 6.750C6.750 6.750 13.500 13.500 13.500 13.500Z"
      fillRule="evenodd"
    />
  </svg>
)
