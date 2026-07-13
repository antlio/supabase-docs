import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const StorageIcon = ({ size, className }: IconProps) => (
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
      transform="translate(9.056 1.146)"
      d="M3.920 3.909C3.920 3.909 0.889 3.909 0.889 3.909C0.398 3.909 0.000 3.511 0.000 3.020C0.000 3.020 0.000 0.000 0.000 0.000"
    />
    <path
      transform="translate(1.944 1.056)"
      d="M0.000 11.111C0.000 11.111 0.000 1.778 0.000 1.778C0.000 0.796 0.796 0.000 1.778 0.000C1.778 0.000 6.743 0.000 6.743 0.000C6.979 0.000 7.205 0.093 7.372 0.260C7.372 0.260 10.851 3.740 10.851 3.740C11.018 3.907 11.111 4.132 11.111 4.368C11.111 4.368 11.111 11.111 11.111 11.111C11.111 12.093 10.316 12.889 9.333 12.889C9.333 12.889 1.778 12.889 1.778 12.889C0.796 12.889 0.000 12.093 0.000 11.111Z"
    />
  </svg>
)
