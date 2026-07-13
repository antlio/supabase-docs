import { cn } from "@/lib/utils"

// theme moon glyph from paper node f92-0
export const MoonIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 11.83 11.92" fill="none" className={cn(className)} aria-hidden>
    <path
      d="M9.126 8.19C6.262 8.19 3.941 5.869 3.941 3.005 3.941 1.883 4.3.849 4.905 0 2.114.521 0 2.966 0 5.909 0 9.23 2.693 11.923 6.015 11.923 8.812 11.923 11.157 10.01 11.83 7.424 11.042 7.907 10.118 8.19 9.126 8.19Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
