import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const AuthIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M4.16 12.1H10.14V14.35H4.16V12.1ZM4.16 12.1V9.85H10.14V12.1M12.09 6.75V4.5C12.09 3.14 10.98 2.03 9.62 2.03C8.26 2.03 7.16 3.14 7.16 4.5V6.75M4.31 9V14.625C4.31 15.868 5.317 16.875 6.56 16.875H12.185C13.428 16.875 14.435 15.868 14.435 14.625V9C14.435 7.757 13.428 6.75 12.185 6.75H6.56C5.317 6.75 4.31 7.757 4.31 9Z"
      stroke="var(--color-brand)"
      strokeWidth="1.125"
      strokeLinejoin="bevel"
    />
  </svg>
)
