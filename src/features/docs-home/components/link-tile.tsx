import { cn } from "@/lib/utils"

type LinkTileProps = Omit<React.ComponentProps<"a">, "children" | "href"> & {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

export const LinkTile = ({
  icon,
  label,
  href,
  active = false,
  className,
  ...props
}: LinkTileProps) => (
  <a
    {...props}
    href={href}
    className={cn(
      "group/focus flex min-h-11 items-center px-4 outline-none sm:h-10 sm:min-h-0 sm:px-8",
      className,
    )}
  >
    <span className="flex items-center gap-3 rounded-xs group-focus-visible/focus:outline group-focus-visible/focus:outline-2 group-focus-visible/focus:outline-accent">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center overflow-clip rounded-xs",
          "border border-border bg-background",
          "shadow-raised",
          "transition-colors duration-150 ease-out group-hover/focus:bg-surface-raised/50",
          active && "bg-surface-raised/50",
        )}
      >
        <span className="flex size-[18px] shrink-0 items-center justify-center">{icon}</span>
      </span>
      <span className="w-max font-label text-[15px] font-semibold leading-[1.5] text-brand-foreground">
        {label}
      </span>
    </span>
  </a>
)
