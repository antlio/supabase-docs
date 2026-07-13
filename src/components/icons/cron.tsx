import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const CronIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M16.2 3.333L14.067 1.2M2.2 3.333L4.333 1.2M11.333 9L9 7.133V3.667M15.667 9C15.667 12.682 12.682 15.667 9 15.667C5.318 15.667 2.333 12.682 2.333 9C2.333 5.318 5.318 2.333 9 2.333C12.682 2.333 15.667 5.318 15.667 9ZM4.286 15.667L2.333 17.62M13.714 15.667L15.667 17.62"
      stroke="var(--color-foreground-subtle)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
