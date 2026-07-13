import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const AnalyticsIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      transform="translate(1.056 2.85)"
      d="M12.889 4.430C12.889 4.430 10.847 4.430 10.847 4.430C10.472 4.430 10.138 4.665 10.011 5.017C10.011 5.017 8.547 9.084 8.547 9.084C8.440 9.381 8.019 9.375 7.919 9.077C7.919 9.077 4.970 0.227 4.970 0.227C4.870 -0.072 4.449 -0.077 4.342 0.220C4.342 0.220 2.878 4.286 2.878 4.286C2.751 4.639 2.417 4.874 2.042 4.874C2.042 4.874 0.000 4.874 0.000 4.874"
    />
  </svg>
)
