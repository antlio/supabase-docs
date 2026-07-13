import { cva, type VariantProps } from "class-variance-authority"

export const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-3.75",
      md: "size-4",
      lg: "size-4.5",
      xl: "size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export type IconProps = VariantProps<typeof iconVariants> & {
  className?: string
}
