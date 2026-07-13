import { iconVariants, type IconProps } from "@/components/icons/icon-variants"
import { cn } from "@/lib/utils"

export const NewsIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    fill="none"
    className={iconVariants({
      size: size ?? "sm",
      className: cn("text-foreground-mono", className),
    })}
    aria-hidden
  >
    <path
      d="M2.611 8.167C1.752 8.167 1.056 7.47 1.056 6.611V2.833C1.056 2.588 1.255 2.389 1.5 2.389H1.944"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.167 12.389C4.167 13.248 3.47 13.945 2.611 13.945H12.167C13.149 13.945 13.944 13.149 13.944 12.167V2.833C13.944 1.852 13.149 1.056 12.167 1.056H5.944C4.963 1.056 4.167 1.852 4.167 2.833V12.389Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.833 3.722H11.278V5.944H6.833V3.722Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.278 8.611H6.833"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.278 11.278H6.833"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
