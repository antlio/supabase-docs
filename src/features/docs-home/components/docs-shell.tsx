import { cn } from "@/lib/utils"
import { ScrollAccent } from "./scroll-accent"

type DocsShellProps = {
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const DocsShell = ({ sidebar, children, className }: DocsShellProps) => (
  <div
    data-scroll-accent-root
    className={cn("relative flex items-start justify-center overflow-x-clip", className)}
  >
    <aside className="sticky top-16 hidden max-h-[calc(100dvh-4rem)] w-70 shrink-0 self-start overflow-y-auto xl:block">
      {sidebar}
    </aside>
    <div className="min-w-0 w-full flex-1 basis-[952px]">{children}</div>
    <div aria-hidden className="hidden w-70 shrink-0 xl:block" />
    <ScrollAccent />
  </div>
)
