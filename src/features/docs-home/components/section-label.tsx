import { SLASH_RULE } from "@/components/common/slash-rule"
import { cn } from "@/lib/utils"

type SectionLabelProps = {
  label: string
  className?: string
}

export const SectionLabel = ({ label, className }: SectionLabelProps) => (
  <h2
    className={cn(
      "flex items-center gap-3 overflow-hidden pb-6 pl-4 pt-12 sm:pl-8 sm:pt-16",
      "font-mono text-xs font-medium uppercase leading-[1.6]",
      className,
    )}
  >
    <span className="shrink-0 text-foreground-mono">{label}</span>
    <span aria-hidden className="shrink-0 text-surface-raised">
      {SLASH_RULE}
    </span>
  </h2>
)
