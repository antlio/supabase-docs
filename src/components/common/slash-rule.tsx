import { cn } from "@/lib/utils"

type SlashRuleProps = {
  className?: string
}

export const SLASH_RULE = "/".repeat(200)

export const SlashRule = ({ className }: SlashRuleProps) => (
  <div aria-hidden className={cn("flex min-w-0 items-center overflow-hidden py-1", className)}>
    <span className="w-max whitespace-nowrap font-mono text-xs font-medium uppercase leading-[19.2px] text-surface-raised">
      {SLASH_RULE}
    </span>
  </div>
)
