import { cn } from "@/lib/utils"

export const CopyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 14 14" fill="none" className={cn(className)} aria-hidden>
    <path
      d="M11.56 4.2H7.106C6.403 4.2 5.833 4.922 5.833 5.812V11.455C5.833 12.345 6.403 13.067 7.106 13.067H11.56C12.263 13.067 12.833 12.345 12.833 11.455V5.812C12.833 4.922 12.263 4.2 11.56 4.2Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.057 1.89C7.859 1.326 7.413 0.933 6.894 0.933H2.439C1.737 0.933 1.167 1.655 1.167 2.545V8.188C1.167 9.078 1.737 9.8 2.439 9.8H3.409"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
