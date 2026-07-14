import { cn } from "@/lib/utils"

type HatchedInlineCodeProps = {
  children: React.ReactNode
  className?: string
}

export const HatchedInlineCode = ({ children, className }: HatchedInlineCodeProps) => (
  <code
    className={cn(
      "relative inline-flex overflow-hidden rounded-xs px-1.5 py-1 font-mono text-sm",
      className,
    )}
  >
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-20 [background-image:url(/art/dot-grid.png)] [background-repeat:repeat] [background-size:4px_4px]"
    />
    <span className="relative">{children}</span>
  </code>
)
