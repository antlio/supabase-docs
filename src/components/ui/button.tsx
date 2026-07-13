"use client"

import { Button as BaseButton } from "@base-ui-components/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const RAISED_SHADOW = "shadow-[var(--shadow-raised)]"

const OUTLINE_SHADOW = "[filter:drop-shadow(var(--shadow-outline))]"

export const buttonVariants = cva(
  cn(
    "inline-flex items-center rounded-xs text-[13px] font-medium leading-[1.1] select-none",
    "transition-[background-color,box-shadow,transform] duration-150 ease-out",
    "focus:outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
    "active:scale-[0.98]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&>svg]:size-3.5 [&>svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        brand: cn("bg-brand text-on-brand", RAISED_SHADOW, "hover:bg-brand/90 active:bg-brand/80"),
        outline: cn(
          "bg-transparent text-brand-foreground outline outline-1 -outline-offset-1 outline-border",
          OUTLINE_SHADOW,
          "hover:bg-foreground/[0.03] active:bg-foreground/[0.06]",
        ),
        surface: cn(
          "bg-surface-raised text-brand-foreground",
          RAISED_SHADOW,
          "hover:bg-surface active:bg-surface-raised",
        ),
        ghost: cn(
          "bg-transparent text-foreground-soft",
          "hover:bg-foreground/[0.04] active:bg-foreground/[0.06]",
        ),
      },
      size: {
        default: "h-7 gap-1.5 px-2",
        icon: "size-7 justify-center",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "default",
    },
  },
)

type ButtonProps = React.ComponentProps<typeof BaseButton> & VariantProps<typeof buttonVariants>

export const Button = ({ variant, size, className, ref, ...props }: ButtonProps) => (
  <BaseButton
    ref={ref}
    // a render prop can swap in a non-button element (e.g. an anchor), tell base ui unless the caller was explicit
    nativeButton={props.nativeButton ?? props.render === undefined}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
)
