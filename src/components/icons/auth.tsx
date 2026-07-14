import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const AuthIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M5.25 6a.75.75 0 0 1-.75-.75V3a1.5 1.5 0 0 0-3 0v2.25a.75.75 0 0 1-1.5 0V3a3 3 0 0 1 6 0v2.25a.75.75 0 0 1-.75.75Z"
      transform="translate(4.5 1.5)"
      fill="currentColor"
    />
    <path
      d="M8.75 0h-6.5A2.25 2.25 0 0 0 0 2.25v3A2.25 2.25 0 0 0 2.25 7.5h6.5A2.25 2.25 0 0 0 11 5.25v-3A2.25 2.25 0 0 0 8.75 0ZM6.25 4.25a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 1.5 0v1Z"
      transform="translate(2 6)"
      fill="currentColor"
    />
  </svg>
)
