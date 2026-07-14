import { cn } from "@/lib/utils"

type TileColumnsGridProps<Item extends { slug: string }> = {
  columns: readonly (readonly Item[])[]
  renderTile: (item: Item) => React.ReactNode
  className?: string
  columnClassName?: string
}

export const TileColumnsGrid = <Item extends { slug: string }>({
  columns,
  renderTile,
  className,
  columnClassName,
}: TileColumnsGridProps<Item>) => (
  <div
    className={cn("grid grid-cols-1 items-start bg-well sm:grid-cols-2 lg:grid-cols-3", className)}
  >
    {columns.map((column) => (
      <div
        key={column[0]?.slug}
        className={cn("flex min-w-0 flex-col items-start gap-4 py-6 sm:py-8", columnClassName)}
      >
        {column.map(renderTile)}
      </div>
    ))}
  </div>
)
