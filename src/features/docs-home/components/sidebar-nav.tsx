import type { ComponentType } from "react"
import Link from "next/link"
import { CliIcon } from "@/components/icons/cli"
import { CSharpIcon } from "@/components/icons/csharp"
import { FlutterIcon } from "@/components/icons/flutter"
import { type IconProps } from "@/components/icons/icon-variants"
import { JavaScriptIcon } from "@/components/icons/javascript"
import { KotlinIcon } from "@/components/icons/kotlin"
import { ManagementApiIcon } from "@/components/icons/management-api"
import { PythonIcon } from "@/components/icons/python"
import { SwiftIcon } from "@/components/icons/swift"
import { UiIcon } from "@/components/icons/ui"
import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type SidebarNavProps = {
  className?: string
  activeHref?: string
}

type NavLink = {
  label: string
  href: string
  icon?: ComponentType<IconProps>
  badge?: "community" | "new"
  separated?: boolean
}

type NavGroup = {
  label: string
  links: NavLink[]
  flush?: boolean
}

const NAV_GROUPS: NavGroup[] = [
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
    flush: true,
    links: [
      {
        label: "JavaScript",
        href: "https://supabase.com/docs/reference/javascript",
        icon: JavaScriptIcon,
      },
      { label: "Flutter", href: "https://supabase.com/docs/reference/dart", icon: FlutterIcon },
      { label: "Swift", href: "https://supabase.com/docs/reference/swift", icon: SwiftIcon },
      { label: "Python", href: "https://supabase.com/docs/reference/python", icon: PythonIcon },
      {
        label: "C#",
        href: "https://supabase.com/docs/reference/csharp",
        icon: CSharpIcon,
        badge: "community",
      },
      {
        label: "Kotlin",
        href: "https://supabase.com/docs/reference/kotlin",
        icon: KotlinIcon,
        badge: "community",
      },
      {
        label: "Server SDK",
        href: "/docs/reference/server",
        icon: JavaScriptIcon,
        badge: "new",
        separated: true,
      },
      {
        label: "CLI Commands",
        href: "https://supabase.com/docs/reference/cli/introduction",
        icon: CliIcon,
      },
      {
        label: "Management API",
        href: "https://supabase.com/docs/reference/api/introduction",
        icon: ManagementApiIcon,
      },
      { label: "UI Library", href: "https://supabase.com/ui", icon: UiIcon },
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
]

const SidebarNavLink = ({ link, activeHref }: { link: NavLink; activeHref?: string }) => {
  const Icon = link.icon
  const isActive = link.href === activeHref
  const className = cn(
    "relative flex h-8 items-center rounded-xs text-[13px] outline-none",
    Icon
      ? "group gap-2 rounded-md p-2 font-medium leading-none text-foreground-subtle"
      : "py-1.5 leading-[1.43] text-foreground-muted",
    "transition-colors duration-150 ease-out hover:text-foreground",
    isActive && "rounded-l-none rounded-r-xs bg-foreground/[0.04] text-foreground",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
  )
  const content = (
    <>
      {isActive && (
        <span
          aria-hidden
          className="absolute left-[-1px] top-1/2 h-[1em] w-px -translate-y-1/2 bg-accent"
        />
      )}
      {Icon && (
        <Icon
          size="md"
          className="text-foreground-muted transition-colors duration-150 ease-out group-hover:text-foreground-subtle"
        />
      )}
      <span className={cn(Icon && "min-w-0 flex-1 whitespace-nowrap")}>{link.label}</span>
      {link.badge && (
        <span
          className={cn(
            "shrink-0 whitespace-nowrap rounded-xs bg-surface-raised px-1.5 py-0.5 text-xs font-medium leading-[1.1] text-foreground-subtle shadow-raised",
            link.badge === "new" && "bg-brand/20 text-accent",
          )}
        >
          {link.badge === "new" ? "New" : "Community"}
        </span>
      )}
    </>
  )

  return link.href.startsWith("/") ? (
    <Link href={link.href} aria-current={isActive ? "page" : undefined} className={className}>
      {content}
    </Link>
  ) : (
    <a href={link.href} aria-current={isActive ? "page" : undefined} className={className}>
      {content}
    </a>
  )
}

// sidebar from paper node f87-0
// quickstart link plus five collapsible groups, all collapsed by default
export const SidebarNav = ({ className, activeHref }: SidebarNavProps) => (
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
      {NAV_GROUPS.map((group) => {
        const groupIsActive = group.links.some((link) => link.href === activeHref)

        return (
          <CollapsibleRoot key={group.label} defaultOpen={groupIsActive}>
            <CollapsibleTrigger className={cn(groupIsActive && "text-foreground")}>
              {group.label}
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <ul
                className={cn(
                  "flex flex-col border-l border-border pb-1",
                  group.flush ? "pl-0 ml-1" : "pl-3",
                )}
              >
                {group.links.map((link) => {
                  return (
                    <li key={link.href} className={cn(link.separated && "pt-1")}>
                      <SidebarNavLink link={link} activeHref={activeHref} />
                    </li>
                  )
                })}
              </ul>
            </CollapsiblePanel>
          </CollapsibleRoot>
        )
      })}
    </nav>
  </div>
)
