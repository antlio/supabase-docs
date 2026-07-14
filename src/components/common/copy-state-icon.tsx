import { CheckIcon } from "@/components/icons/check"
import { CopyIcon } from "@/components/icons/copy"
import { cn } from "@/lib/utils"

type CopyStateIconProps = {
  copied: boolean
  className?: string
}

export const CopyStateIcon = ({ copied, className }: CopyStateIconProps) => (
  <span
    className={cn("relative inline-flex size-3.5 shrink-0 items-center justify-center", className)}
  >
    <CopyIcon
      className={cn(
        "absolute size-3.5 text-foreground-muted transition-[opacity,transform,filter] duration-150 ease-out motion-reduce:transition-none",
        copied ? "scale-90 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
      )}
    />
    <CheckIcon
      className={cn(
        "absolute size-3.5 text-brand-foreground transition-[opacity,transform,filter] duration-150 ease-out motion-reduce:transition-none",
        copied ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-0 blur-[2px]",
      )}
    />
  </span>
)
