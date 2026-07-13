import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const StorageIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M14.626 8.447V6.301L10.556 2.25H4.501C3.88 2.25 3.376 2.754 3.376 3.375V6.75M14.587 6.283L10.554 2.25V5.158C10.554 5.779 11.058 6.283 11.679 6.283H14.587ZM4.998 6.75H3.347C2.726 6.75 2.222 7.253 2.222 7.875V13.5C2.222 14.742 3.229 15.75 4.472 15.75H13.472C14.715 15.75 15.722 14.742 15.722 13.5V9.572C15.722 8.951 15.218 8.447 14.597 8.447H7.645C7.35 8.447 7.066 8.331 6.856 8.124L5.787 7.073C5.577 6.866 5.293 6.75 4.998 6.75Z"
      stroke="var(--color-brand)"
      strokeWidth="1.125"
      strokeLinejoin="bevel"
    />
  </svg>
)
