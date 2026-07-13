import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const RealtimeIcon = ({ size, className }: IconProps) => (
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
      transform="translate(1.944 1.944)"
      d="M0.000 3.111C0.000 3.111 0.000 1.778 0.000 1.778C0.000 0.796 0.796 0.000 1.778 0.000C1.778 0.000 3.556 0.000 3.556 0.000"
    />
    <path
      transform="translate(9.5 1.945)"
      d="M0.000 0.000C0.000 0.000 1.778 0.000 1.778 0.000C2.760 0.000 3.556 0.796 3.556 1.778C3.556 1.778 3.556 3.111 3.556 3.111"
    />
    <path
      transform="translate(1.945 9.945)"
      d="M3.556 3.111C3.556 3.111 1.778 3.111 1.778 3.111C0.796 3.111 0.000 2.316 0.000 1.333C0.000 1.333 0.000 0.000 0.000 0.000"
    />
    <path
      transform="translate(7.278 7.278)"
      d="M0.386 0.018C0.386 0.018 6.478 2.244 6.478 2.244C6.735 2.338 6.727 2.703 6.468 2.787C6.468 2.787 3.679 3.679 3.679 3.679C3.679 3.679 2.787 6.468 2.787 6.468C2.703 6.728 2.338 6.735 2.244 6.478C2.244 6.478 0.018 0.386 0.018 0.386C-0.066 0.157 0.157 -0.066 0.386 0.018Z"
    />
  </svg>
)
