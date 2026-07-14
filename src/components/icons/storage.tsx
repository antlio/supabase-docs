import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const StorageIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M3.92 3.909H.889A.889.889 0 0 1 0 3.02V0"
      transform="translate(9.056 1.146)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 11.111V1.778A1.778 1.778 0 0 1 1.778 0h4.965c.236 0 .462.093.629.26l3.479 3.48c.167.167.26.392.26.628v6.743a1.778 1.778 0 0 1-1.778 1.778H1.778A1.778 1.778 0 0 1 0 11.111Z"
      transform="translate(1.944 1.056)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
