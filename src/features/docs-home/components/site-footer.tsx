import { IssueIcon } from "@/components/icons/issue"
import { NewsIcon } from "@/components/icons/news"
import { cn } from "@/lib/utils"

type SiteFooterProps = {
  className?: string
}

const OperationalDot = () => (
  <span className="size-2 rounded-xs border-[0.5px] border-black/25 bg-accent" />
)

const STATUS_CELLS = [
  {
    label: "All systems operational",
    href: "https://status.supabase.com",
    indicator: <OperationalDot />,
  },
  {
    label: "Product updates",
    href: "https://supabase.com/changelog",
    indicator: <NewsIcon />,
  },
  {
    label: "Report Issue",
    href: "https://github.com/supabase/supabase/issues",
    indicator: <IssueIcon />,
  },
] as const

const LEGAL_LINKS = [
  {
    label: "Contributing",
    href: "https://github.com/supabase/supabase/blob/master/apps/docs/DEVELOPERS.md",
  },
  {
    label: "Author Styleguide",
    href: "https://github.com/supabase/supabase/blob/master/apps/docs/CONTRIBUTING.md",
  },
  { label: "Open Source", href: "https://supabase.com/open-source" },
  { label: "SupaSquad", href: "https://supabase.com/supasquad" },
  { label: "Privacy Settings", href: "https://supabase.com/privacy" },
] as const

export const SiteFooter = ({ className }: SiteFooterProps) => (
  <footer className={cn("flex flex-col", className)}>
    <div className="flex justify-center">
      <span aria-hidden className="hidden w-70 shrink-0 self-stretch xl:flex">
        <span className="w-5.5 shrink-0 bg-well" />
        <span className="min-w-0 flex-1 border-l border-dashed border-border" />
      </span>
      <ul className="grid min-w-0 flex-1 basis-[952px] grid-cols-1 items-stretch border-t border-border sm:grid-cols-3">
        {STATUS_CELLS.map((cell, index) => (
          <li
            key={cell.label}
            className={cn(
              "flex min-w-0 items-center justify-center border-b border-border px-4 py-6 sm:border-b-0 sm:p-8",
              index === 0 ? "sm:border-l" : "sm:border-l sm:border-r",
            )}
          >
            <a
              href={cell.href}
              className={cn(
                "group flex items-center gap-2 rounded-xs outline-none",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              )}
            >
              <span className="flex size-[15px] shrink-0 items-center justify-center">
                {cell.indicator}
              </span>
              <span
                className={cn(
                  "text-xs font-medium leading-4 text-foreground",
                  "transition-colors duration-150 ease-out group-hover:text-foreground-soft",
                )}
              >
                {cell.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <span aria-hidden className="hidden w-70 shrink-0 xl:block" />
    </div>
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-4 py-5 sm:px-8 lg:flex-row lg:gap-6 lg:py-4">
      <span className="text-xs font-medium leading-4 text-foreground-mono">© Supabase Inc</span>
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-end">
        {LEGAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "rounded-xs text-xs font-medium leading-4 text-foreground-mono outline-none",
              "transition-colors duration-150 ease-out hover:text-foreground-soft",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  </footer>
)
