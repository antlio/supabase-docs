"use client"

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip"
import { cn } from "@/lib/utils"

type TooltipPositionerProps = React.ComponentProps<typeof BaseTooltip.Positioner>
type TooltipPopupProps = React.ComponentProps<typeof BaseTooltip.Popup>

export const TooltipProvider = BaseTooltip.Provider

export const TooltipRoot = BaseTooltip.Root

export const TooltipTrigger = BaseTooltip.Trigger

export const TooltipPortal = BaseTooltip.Portal

export const TooltipPositioner = ({
  className,
  sideOffset = 6,
  ref,
  ...props
}: TooltipPositionerProps) => (
  <BaseTooltip.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("outline-none", className)}
    {...props}
  />
)

export const TooltipPopup = ({ className, ref, ...props }: TooltipPopupProps) => (
  <BaseTooltip.Popup
    ref={ref}
    className={cn(
      "max-w-[180px] origin-[var(--transform-origin)] rounded-xs border border-border bg-surface px-2 py-1",
      "text-[10px] leading-tight text-foreground-soft shadow-[var(--shadow-tooltip)]",
      "transition-[opacity,transform] duration-150 ease-out",
      "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
      "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
      "data-[instant]:duration-0",
      className,
    )}
    {...props}
  />
)
