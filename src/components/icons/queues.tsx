import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const QueuesIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M3.4 2.333H14.6C15.189 2.333 15.667 2.811 15.667 3.4V7.133C15.667 7.722 15.189 8.2 14.6 8.2H3.4C2.811 8.2 2.333 7.722 2.333 7.133V3.4C2.333 2.811 2.811 2.333 3.4 2.333Z"
      stroke="var(--color-foreground-subtle)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.333 11.933H15.667M2.333 15.667H15.667"
      stroke="var(--color-foreground-subtle)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
