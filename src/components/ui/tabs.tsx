"use client"

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs"
import { cn } from "@/lib/utils"

type TabsRootProps = React.ComponentProps<typeof BaseTabs.Root>
type TabsListProps = React.ComponentProps<typeof BaseTabs.List>
type TabsTabProps = React.ComponentProps<typeof BaseTabs.Tab>
type TabsPanelProps = React.ComponentProps<typeof BaseTabs.Panel>
type TabsIndicatorProps = React.ComponentProps<typeof BaseTabs.Indicator>

export const TabsRoot = ({ className, ref, ...props }: TabsRootProps) => (
  <BaseTabs.Root ref={ref} className={cn("min-w-0", className)} {...props} />
)

export const TabsList = ({ className, ref, ...props }: TabsListProps) => (
  <BaseTabs.List ref={ref} className={cn("flex min-w-0 items-center", className)} {...props} />
)

export const TabsTab = ({ className, ref, ...props }: TabsTabProps) => (
  <BaseTabs.Tab
    ref={ref}
    className={cn(
      "relative shrink-0 outline-none select-none",
      "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      className,
    )}
    {...props}
  />
)

export const TabsIndicator = ({ className, ref, ...props }: TabsIndicatorProps) => (
  <BaseTabs.Indicator
    ref={ref}
    className={cn("pointer-events-none absolute", className)}
    {...props}
  />
)

export const TabsPanel = ({ className, ref, ...props }: TabsPanelProps) => (
  <BaseTabs.Panel ref={ref} className={cn("min-w-0 outline-none", className)} {...props} />
)
