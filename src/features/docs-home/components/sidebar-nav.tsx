import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type SidebarNavProps = {
  className?: string
}

const NAV_GROUPS = [
  {
    label: "Products",
    links: [
      { label: "Database", href: "https://supabase.com/docs/guides/database/overview" },
      { label: "Auth", href: "https://supabase.com/docs/guides/auth" },
      { label: "Storage", href: "https://supabase.com/docs/guides/storage" },
      { label: "Realtime", href: "https://supabase.com/docs/guides/realtime" },
      { label: "Edge Functions", href: "https://supabase.com/docs/guides/functions" },
    ],
  },
  {
    label: "Build",
    links: [
      { label: "Getting Started", href: "https://supabase.com/docs/guides/getting-started" },
      { label: "CLI", href: "https://supabase.com/docs/guides/cli" },
      { label: "Local Development", href: "https://supabase.com/docs/guides/local-development" },
    ],
  },
  {
    label: "Manage",
    links: [
      { label: "Platform", href: "https://supabase.com/docs/guides/platform" },
      { label: "Dashboard", href: "https://supabase.com/docs/guides/dashboard" },
    ],
  },
  {
    label: "Reference",
    links: [
      { label: "JavaScript", href: "https://supabase.com/docs/reference/javascript" },
      { label: "Dart/Flutter", href: "https://supabase.com/docs/reference/dart" },
      { label: "Python", href: "https://supabase.com/docs/reference/python" },
      { label: "CLI", href: "https://supabase.com/docs/reference/cli" },
      { label: "Management API", href: "https://supabase.com/docs/reference/api" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Glossary", href: "https://supabase.com/docs/guides/resources/glossary" },
      { label: "Troubleshooting", href: "https://supabase.com/docs/guides/troubleshooting" },
      { label: "Changelog", href: "https://supabase.com/changelog" },
    ],
  },
] as const

// sidebar from paper node f87-0
// quickstart link plus five collapsible groups, all collapsed by default
export const SidebarNav = ({ className }: SidebarNavProps) => (
  <div className={cn("flex min-h-[calc(100dvh-4rem)]", className)}>
    <div aria-hidden className="w-5.5 shrink-0 bg-well" />
    <nav className="min-w-0 flex-1 border-l border-dashed border-border p-4">
      <a
        href="https://supabase.com/docs/guides/getting-started"
        className={cn(
          "flex h-8 items-center rounded-xs py-1.5 text-[13px] font-medium leading-[1.43]",
          "text-foreground-subtle outline-none",
          "transition-colors duration-150 ease-out hover:text-foreground",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        )}
      >
        Quickstart
      </a>
      {NAV_GROUPS.map((group) => (
        <CollapsibleRoot key={group.label}>
          <CollapsibleTrigger>{group.label}</CollapsibleTrigger>
          <CollapsiblePanel>
            <ul className="flex flex-col pb-1 pl-3 border-l border-border">
              {group.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "flex h-8 items-center rounded-xs py-1.5 text-[13px] leading-[1.43]",
                      "text-foreground-muted outline-none",
                      "transition-colors duration-150 ease-out hover:text-foreground",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </CollapsiblePanel>
        </CollapsibleRoot>
      ))}
    </nav>
  </div>
)
