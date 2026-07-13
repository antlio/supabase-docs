import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const AiVectorsIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 18 18"
    className={iconVariants({ size: size ?? "lg", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M15.807 4.635L9.001 8.589V16.303M9.001 8.589L2.195 4.636V9.366M2.195 4.636V4.595L6.272 2.227M15.807 9.408V4.595L11.730 2.227M12.918 13.945L9.001 16.439L5.083 13.945"
      stroke="var(--color-foreground-subtle)"
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
