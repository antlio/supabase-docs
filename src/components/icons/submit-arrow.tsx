import { cn } from "@/lib/utils"

export const SubmitArrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 15 15" width="15" height="15" fill="none" className={cn(className)} aria-hidden>
    <path
      d="M7.5 1.944V13.055"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.722 5.722L7.5 1.944L11.278 5.722"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
