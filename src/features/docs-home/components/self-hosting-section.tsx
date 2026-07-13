import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { AnalyticsIcon } from "@/components/icons/self-hosting-analytics"
import { AuthIcon } from "@/components/icons/self-hosting-auth"
import { RealtimeIcon } from "@/components/icons/self-hosting-realtime"
import { StorageIcon } from "@/components/icons/self-hosting-storage"
import { cn } from "@/lib/utils"
import { LinkTile } from "./link-tile"
import { ScrollAccentAnchors } from "./scroll-accent"

type SelfHostingService = {
  slug: string
  label: string
  href: string
  icon: React.ReactNode
}

export type SelfHostingSectionProps = {
  className?: string
}

const SELF_HOSTING_SERVICES: readonly SelfHostingService[] = [
  {
    slug: "auth",
    label: "Auth",
    href: "https://supabase.com/docs/guides/self-hosting/auth",
    icon: <AuthIcon />,
  },
  {
    slug: "storage",
    label: "Storage",
    href: "https://supabase.com/docs/guides/self-hosting/storage",
    icon: <StorageIcon />,
  },
  {
    slug: "realtime",
    label: "Realtime",
    href: "https://supabase.com/docs/guides/self-hosting/realtime",
    icon: <RealtimeIcon />,
  },
  {
    slug: "analytics",
    label: "Analytics",
    href: "https://supabase.com/docs/guides/self-hosting/analytics",
    icon: <AnalyticsIcon />,
  },
]

export const SelfHostingSection = ({ className }: SelfHostingSectionProps) => (
  <section
    className={cn("relative flex flex-col items-stretch 2xl:flex-row 2xl:items-center", className)}
  >
    <ScrollAccentAnchors corners={["top-left"]} />
    <div className="flex flex-1 basis-auto flex-col items-start justify-center gap-3 px-4 pb-8 sm:px-8 sm:pb-16 2xl:basis-[400px]">
      <h2 className="text-2xl font-medium leading-[1.25] text-foreground">Self-Hosting</h2>
      <p className="max-w-[336px] text-base leading-[1.6] text-foreground-mono">
        Get started with self-hosting Supabase.
      </p>
      <a
        href="https://supabase.com/docs/guides/self-hosting"
        className={cn(
          "group/link flex items-center gap-1 text-[15px] font-medium leading-[1.5] text-foreground",
          "transition-colors duration-150 ease-out hover:text-accent",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        More on Self-Hosting
        <ChevronRightIcon className="size-[15px] shrink-0 text-foreground-muted transition-colors duration-150 ease-out group-hover/link:text-accent" />
      </a>
    </div>
    <div className="grid w-full grid-cols-2 items-start gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-4 sm:px-8 2xl:flex 2xl:w-auto 2xl:gap-10 2xl:px-0">
      {SELF_HOSTING_SERVICES.map((service) => (
        <LinkTile
          key={service.slug}
          href={service.href}
          label={service.label}
          icon={<span className="text-foreground-subtle">{service.icon}</span>}
          className="px-0"
        />
      ))}
    </div>
  </section>
)
