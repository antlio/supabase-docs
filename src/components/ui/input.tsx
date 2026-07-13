"use client"

import { Input as BaseInput } from "@base-ui-components/react/input"
import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<typeof BaseInput>

export const Input = ({ className, ref, ...props }: InputProps) => (
  <BaseInput
    ref={ref}
    className={cn(
      "w-full rounded-xs border-y border-border bg-well px-3 py-3",
      "text-base leading-6 text-foreground placeholder:text-foreground-muted",
      "outline-none transition-colors duration-150 ease-out",
      "focus-visible:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
)
