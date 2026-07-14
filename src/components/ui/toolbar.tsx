"use client"

import { Toolbar as BaseToolbar } from "@base-ui-components/react/toolbar"
import { cn } from "@/lib/utils"

type ToolbarRootProps = React.ComponentProps<typeof BaseToolbar.Root>
type ToolbarInputProps = React.ComponentProps<typeof BaseToolbar.Input>
type ToolbarButtonProps = React.ComponentProps<typeof BaseToolbar.Button>

export const ToolbarRoot = ({ className, ref, ...props }: ToolbarRootProps) => (
  <BaseToolbar.Root ref={ref} className={cn("flex min-w-0 items-center", className)} {...props} />
)

export const ToolbarInput = ({ className, ref, ...props }: ToolbarInputProps) => (
  <BaseToolbar.Input
    ref={ref}
    className={cn(
      "min-w-0 flex-1 bg-transparent outline-none",
      "text-sm leading-5 text-foreground placeholder:text-foreground-muted",
      className,
    )}
    {...props}
  />
)

export const ToolbarButton = ({ className, ref, ...props }: ToolbarButtonProps) => (
  <BaseToolbar.Button
    ref={ref}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-xs outline-none select-none",
      "transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
      "active:scale-[0.96] active:duration-[220ms] motion-reduce:active:scale-100",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
)
