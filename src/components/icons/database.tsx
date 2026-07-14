import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const DatabaseIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M11.111 2C11.111 3.105 8.624 4 5.556 4S0 3.105 0 2 2.487 0 5.556 0s5.555.895 5.555 2Z"
      transform="translate(1.944 1.278)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 0v8.444c0 1.105 2.487 2 5.556 2s5.555-.895 5.555-2V0"
      transform="translate(1.944 3.278)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 0c0 1.105 2.487 2 5.556 2s5.555-.895 5.555-2"
      transform="translate(1.944 7.5)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
