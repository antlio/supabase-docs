"use client"

import { Toggle as BaseToggle } from "@base-ui/react/toggle"
import { cn } from "@/lib/utils"

type ToggleProps = React.ComponentProps<typeof BaseToggle>

export const Toggle = ({ className, ref, ...props }: ToggleProps) => (
  <BaseToggle
    ref={ref}
    className={cn(
      "inline-flex size-7 items-center justify-center rounded-xs",
      "text-foreground-muted outline outline-1 -outline-offset-1 outline-border",
      "[filter:drop-shadow(var(--shadow-outline))]",
      "[&>svg]:size-3.5 [&>svg]:shrink-0",
      "transition-[background-color,color,transform] duration-150 ease-out",
      "hover:bg-foreground/[0.03] hover:text-foreground-soft",
      "active:scale-[0.98]",
      "focus-visible:outline-2 focus-visible:outline-accent",
      "data-[pressed]:bg-surface-raised data-[pressed]:text-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
)
