import { cn } from "@/lib/utils"

type SlashSpacerProps = {
  className?: string
}

export const SLASH_RULE = "/".repeat(200)

export const SlashSpacer = ({ className }: SlashSpacerProps) => (
  <div className={cn("flex items-center overflow-hidden pt-16 pb-6", className)}>
    <span
      aria-hidden
      className="whitespace-nowrap p-1 font-mono text-xs font-medium uppercase leading-[19.2px] text-surface-raised"
    >
      {SLASH_RULE}
    </span>
  </div>
)
