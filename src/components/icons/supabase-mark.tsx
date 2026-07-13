import { useId } from "react"
import { cn } from "@/lib/utils"

export const SupabaseMark = ({ className }: { className?: string }) => {
  const id = useId()
  const greenGradientId = `${id}-supabase-green`
  const shadeGradientId = `${id}-supabase-shade`

  return (
    <svg viewBox="0 0 23 23" fill="none" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient
          id={greenGradientId}
          gradientUnits="objectBoundingBox"
          x1="0"
          y1="0.21"
          x2="0.73"
          y2="0.44"
        >
          <stop offset="0" stopColor="var(--color-logo-green-dark)" />
          <stop offset="1" stopColor="var(--color-logo-green)" />
        </linearGradient>
        <linearGradient
          id={shadeGradientId}
          gradientUnits="objectBoundingBox"
          x1="-0.32"
          y1="-0.13"
          x2="0.01"
          y2="0.35"
        >
          <stop offset="0" stopColor="var(--color-black)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--color-black)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M13.403 21.865c-.56.698-1.697.316-1.71-.575l-.198-13.03h8.861c1.605 0 2.5 1.832 1.503 3.075l-8.456 10.53Z"
        fill={`url(#${greenGradientId})`}
      />
      <path
        d="M13.403 21.865c-.56.698-1.697.316-1.71-.575l-.198-13.03h8.861c1.605 0 2.5 1.832 1.503 3.075l-8.456 10.53Z"
        fill={`url(#${shadeGradientId})`}
      />
      <path
        d="M9.799.898c.56-.697 1.696-.315 1.71.576l.086 13.03h-8.75c-1.605 0-2.5-1.833-1.502-3.076L9.799.898Z"
        fill="var(--color-logo-green)"
      />
    </svg>
  )
}
