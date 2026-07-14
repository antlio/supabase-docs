"use client"

import { ScrollArea as BaseScrollArea } from "@base-ui-components/react/scroll-area"
import { cn } from "@/lib/utils"

type ScrollAreaRootProps = React.ComponentProps<typeof BaseScrollArea.Root>
type ScrollAreaViewportProps = React.ComponentProps<typeof BaseScrollArea.Viewport>
type ScrollAreaContentProps = React.ComponentProps<typeof BaseScrollArea.Content>
type ScrollAreaScrollbarProps = React.ComponentProps<typeof BaseScrollArea.Scrollbar>
type ScrollAreaThumbProps = React.ComponentProps<typeof BaseScrollArea.Thumb>

export const ScrollAreaRoot = ({ className, ref, ...props }: ScrollAreaRootProps) => (
  <BaseScrollArea.Root ref={ref} className={cn("relative", className)} {...props} />
)

export const ScrollAreaViewport = ({ className, ref, ...props }: ScrollAreaViewportProps) => (
  <BaseScrollArea.Viewport
    ref={ref}
    className={cn("size-full overscroll-y-auto", className)}
    {...props}
  />
)

export const ScrollAreaContent = ({ className, ref, ...props }: ScrollAreaContentProps) => (
  <BaseScrollArea.Content ref={ref} className={cn("min-w-0", className)} {...props} />
)

export const ScrollAreaScrollbar = ({
  className,
  orientation = "vertical",
  ref,
  ...props
}: ScrollAreaScrollbarProps) => (
  <BaseScrollArea.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "z-10 flex touch-none select-none justify-center opacity-35",
      "transition-opacity duration-150 ease-out data-[hovering]:opacity-70 data-[scrolling]:opacity-70",
      orientation === "vertical" && "w-1.5 py-0.5",
      orientation === "horizontal" && "h-1.5 px-0.5",
      className,
    )}
    {...props}
  />
)

export const ScrollAreaThumb = ({ className, ref, ...props }: ScrollAreaThumbProps) => (
  <BaseScrollArea.Thumb
    ref={ref}
    className={cn(
      "rounded-full bg-foreground-muted",
      "data-[orientation=vertical]:w-0.5 data-[orientation=horizontal]:h-0.5",
      className,
    )}
    {...props}
  />
)
