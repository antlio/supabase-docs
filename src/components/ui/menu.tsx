"use client"

import { Menu as BaseMenu } from "@base-ui-components/react/menu"
import { cn } from "@/lib/utils"

type MenuPositionerProps = React.ComponentProps<typeof BaseMenu.Positioner>
type MenuPopupProps = React.ComponentProps<typeof BaseMenu.Popup>
type MenuItemProps = React.ComponentProps<typeof BaseMenu.Item>

export const MenuRoot = BaseMenu.Root

export const MenuTrigger = BaseMenu.Trigger

export const MenuPortal = BaseMenu.Portal

export const MenuPositioner = ({
  className,
  sideOffset = 6,
  ref,
  ...props
}: MenuPositionerProps) => (
  <BaseMenu.Positioner
    ref={ref}
    sideOffset={sideOffset}
    className={cn("z-[60] outline-none", className)}
    {...props}
  />
)

export const MenuPopup = ({ className, ref, ...props }: MenuPopupProps) => (
  <BaseMenu.Popup
    ref={ref}
    className={cn(
      "max-h-[var(--available-height)] min-w-40 origin-[var(--transform-origin)] overflow-y-auto rounded-xs border border-border bg-surface p-1",
      "text-[13px] text-foreground-soft shadow-popover",
      "transition-opacity duration-150 ease-out",
      "data-[starting-style]:opacity-0",
      "data-[ending-style]:duration-75 data-[ending-style]:opacity-0",
      className,
    )}
    {...props}
  />
)

export const MenuItem = ({ className, ref, ...props }: MenuItemProps) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "flex h-8 cursor-default items-center gap-2 rounded-xs px-2 outline-none select-none",
      "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-foreground-muted",
      "transition-colors duration-150 ease-out",
      "data-[highlighted]:bg-foreground/[0.06] data-[highlighted]:text-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
)
