import { cn } from "@/lib/utils"

export const SunIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 12 12" fill="none" className={cn(className)} aria-hidden>
    <circle cx="6" cy="6" r="2.1" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M6 0.75V2M6 10V11.25M0.75 6H2M10 6H11.25M2.29 2.29L3.18 3.18M8.82 8.82L9.71 9.71M9.71 2.29L8.82 3.18M3.18 8.82L2.29 9.71"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
)
