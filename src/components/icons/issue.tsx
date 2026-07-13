import { iconVariants, type IconProps } from "@/components/icons/icon-variants"
import { cn } from "@/lib/utils"

export const IssueIcon = ({ size, className }: IconProps) => (
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
      d="M6.39 5.056H12.612C13.347 5.056 13.944 5.653 13.944 6.389V10.389C13.944 11.124 13.347 11.721 12.611 11.721H12.167V13.944L9.722 11.721H7.722C7.369 11.721 7.03 11.581 6.781 11.331 6.531 11.082 6.391 10.743 6.39 10.39V6.39C6.39 5.654 6.987 5.057 7.723 5.057"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.11 2.833C11.011 2.452 10.789 2.114 10.477 1.873 10.166 1.632 9.784 1.501 9.39 1.5H3.833C2.851 1.5 2.056 2.296 2.056 3.278V7.723C2.056 8.704 2.852 9.501 3.833 9.5V12.167L5.167 10.712"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
