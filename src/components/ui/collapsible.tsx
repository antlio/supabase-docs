"use client"

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { cn } from "@/lib/utils"

type CollapsibleTriggerProps = React.ComponentProps<typeof BaseCollapsible.Trigger> & {
  indicator?: React.ReactNode
}
type CollapsiblePanelProps = React.ComponentProps<typeof BaseCollapsible.Panel>

export const CollapsibleRoot = BaseCollapsible.Root

export const CollapsibleTrigger = ({
  className,
  children,
  indicator,
  ref,
  ...props
}: CollapsibleTriggerProps) => (
  <BaseCollapsible.Trigger
    ref={ref}
    className={cn(
      "group flex h-8 w-full items-center gap-1 py-1.5 text-[13px] font-medium leading-[1.43]",
      "text-foreground-subtle outline-none select-none",
      "transition-colors duration-150 ease-out hover:text-foreground",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
      className,
    )}
    {...props}
  >
    {children}
    {indicator ?? (
      <ChevronRightIcon className="size-[15px] text-foreground-muted transition-transform duration-150 ease-out group-data-[panel-open]:rotate-90" />
    )}
  </BaseCollapsible.Trigger>
)

export const CollapsiblePanel = ({ className, ref, ...props }: CollapsiblePanelProps) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn(
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "transition-[height] duration-200 ease-out",
      "data-[starting-style]:h-0 data-[ending-style]:h-0",
      className,
    )}
    {...props}
  />
)
