"use client"

import { Separator as BaseSeparator } from "@base-ui-components/react/separator"
import { cn } from "@/lib/utils"

type SeparatorProps = React.ComponentProps<typeof BaseSeparator>

export const Separator = ({
  className,
  orientation = "horizontal",
  ref,
  ...props
}: SeparatorProps) => (
  <BaseSeparator
    ref={ref}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
      className,
    )}
    {...props}
  />
)
