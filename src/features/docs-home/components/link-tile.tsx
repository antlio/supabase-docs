import { cn } from "@/lib/utils"

const TILE_SHADOW = "shadow-[var(--shadow-raised)]"

export const LinkTile = ({ icon, label, href, className }: LinkTileProps) => (
  <a
    href={href}
    className={cn(
      "group/tile flex min-h-11 items-center gap-3 px-4 sm:h-10 sm:min-h-0 sm:px-8",
      "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
      className,
    )}
  >
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-clip rounded-xs",
        "border border-border bg-background",
        TILE_SHADOW,
        "transition-colors duration-150 ease-out",
        "group-hover/tile:border-foreground/40",
      )}
    >
      <span className="flex size-[18px] shrink-0 items-center justify-center">{icon}</span>
    </span>
    <span className="w-max font-label text-[15px] font-semibold leading-[1.5] text-brand-foreground">
      {label}
    </span>
  </a>
)

export type LinkTileProps = {
  icon: React.ReactNode
  label: string
  href: string
  className?: string
}
