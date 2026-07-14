import { iconVariants, type IconProps } from "@/components/icons/icon-variants"

export const RealtimeIcon = ({ size, className }: IconProps) => (
  <svg
    viewBox="0 0 15 15"
    className={iconVariants({ size: size ?? "sm", className })}
    fill="none"
    aria-hidden
  >
    <path
      d="M0 3.111V1.778A1.778 1.778 0 0 1 1.778 0h1.778"
      transform="translate(1.944 1.944)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 0h1.778a1.778 1.778 0 0 1 1.778 1.778v1.333"
      transform="translate(9.5 1.945)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.556 3.111H1.778A1.778 1.778 0 0 1 0 1.333V0"
      transform="translate(1.945 9.945)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m.386.018 6.092 2.226a.287.287 0 0 1-.01.543l-2.789.892-.892 2.789a.287.287 0 0 1-.543.01L.018.386A.287.287 0 0 1 .386.018Z"
      transform="translate(7.278 7.278)"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
