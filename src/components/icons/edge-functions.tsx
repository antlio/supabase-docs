import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const EdgeFunctionsIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M3.385.19a.65.65 0 0 0-.92 0L.19 2.465a.65.65 0 0 0 0 .92l2.275 2.275a.65.65 0 0 0 .92 0L5.66 3.385a.65.65 0 0 0 0-.92L3.385.19Z"
      transform="translate(.35 4.575)"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M3.385.19a.65.65 0 0 0-.92 0L.19 2.465a.65.65 0 0 0 0 .92l2.275 2.275a.65.65 0 0 0 .92 0L5.66 3.385a.65.65 0 0 0 0-.92L3.385.19Z"
      transform="translate(4.575 .35)"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M3.385.19a.65.65 0 0 0-.92 0L.19 2.465a.65.65 0 0 0 0 .92l2.275 2.275a.65.65 0 0 0 .92 0L5.66 3.385a.65.65 0 0 0 0-.92L3.385.19Z"
      transform="translate(8.8 4.575)"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M3.385.19a.65.65 0 0 0-.92 0L.19 2.465a.65.65 0 0 0 0 .92l2.275 2.275a.65.65 0 0 0 .92 0L5.66 3.385a.65.65 0 0 0 0-.92L3.385.19Z"
      transform="translate(4.575 8.8)"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
)
