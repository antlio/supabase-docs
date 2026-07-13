import { CliIcon } from "@/components/icons/cli"
import { CubeIcon } from "@/components/icons/cube"
import { IntegrationsIcon } from "@/components/icons/integrations"
import { ManagementApiIcon } from "@/components/icons/management-api"
import { TroubleshootingIcon } from "@/components/icons/troubleshooting"
import { UiIcon } from "@/components/icons/ui"
import { cn } from "@/lib/utils"
import { ScrollAccentAnchors } from "./scroll-accent"
import { SectionLabel } from "./section-label"

type Resource = {
  slug: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export type ResourcesSectionProps = {
  className?: string
}

const RESOURCE_COLUMNS: readonly (readonly Resource[])[] = [
  [
    {
      slug: "ai-tools",
      title: "AI tools",
      description: "Develop with Supabase AI-first using plugins, MCP, and skills.",
      href: "https://supabase.com/docs/guides/ai",
      icon: <CubeIcon />,
    },
    {
      slug: "integrations",
      title: "Integrations",
      description: "Explore a variety of integrations from Supabase partners.",
      href: "https://supabase.com/docs/guides/integrations",
      icon: <IntegrationsIcon />,
    },
  ],
  [
    {
      slug: "cli",
      title: "Supabase CLI",
      description: "Use the CLI to develop, manage and deploy your projects.",
      href: "https://supabase.com/docs/guides/cli",
      icon: <CliIcon />,
    },
    {
      slug: "ui",
      title: "Supabase UI",
      description: "A collection of pre-built Supabase components to speed up your project.",
      href: "https://supabase.com/ui",
      icon: <UiIcon />,
    },
  ],
  [
    {
      slug: "platform-guides",
      title: "Platform guides",
      description: "Learn more about the tools and services powering Supabase.",
      href: "https://supabase.com/docs/guides/platform",
      icon: <CubeIcon />,
    },
    {
      slug: "management-api",
      title: "Management API",
      description: "Manage your Supabase projects and organizations.",
      href: "https://supabase.com/docs/reference/api",
      icon: <ManagementApiIcon />,
    },
    {
      slug: "troubleshooting",
      title: "Troubleshooting",
      description: "Our troubleshooting guide for solutions to common Supabase issues.",
      href: "https://supabase.com/docs/guides/troubleshooting",
      icon: <TroubleshootingIcon />,
    },
  ],
]

const ResourceItem = ({ resource }: { resource: Resource }) => (
  <a
    href={resource.href}
    className={cn(
      "group/item flex w-full flex-col items-start gap-1 px-4 sm:px-8",
      "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
    )}
  >
    <span className="flex items-center gap-2">
      <span className="flex size-[18px] shrink-0 items-center justify-center text-foreground-subtle transition-colors duration-150 ease-out group-hover/item:text-accent">
        {resource.icon}
      </span>
      <span className="text-[15px] font-medium leading-[1.5] text-brand-foreground">
        {resource.title}
      </span>
    </span>
    <span className="max-w-[276px] text-sm leading-[1.6] text-foreground-mono">
      {resource.description}
    </span>
  </a>
)

export const ResourcesSection = ({ className }: ResourcesSectionProps) => (
  <section className={cn("relative flex flex-col", className)}>
    <SectionLabel label="additional resources" />
    <div className="grid grid-cols-1 items-start sm:grid-cols-2 lg:grid-cols-3">
      {RESOURCE_COLUMNS.map((column, columnIndex) => (
        <div
          key={column[0].slug}
          className={cn(
            "relative flex min-w-0 flex-col items-start gap-8 border-b border-t border-border py-8",
            columnIndex !== 1 ? "border-x" : "sm:border-r lg:border-r-0",
          )}
        >
          {columnIndex === 0 ? <ScrollAccentAnchors corners={["top-left"]} /> : null}
          {column.map((resource) => (
            <ResourceItem key={resource.slug} resource={resource} />
          ))}
        </div>
      ))}
    </div>
  </section>
)
