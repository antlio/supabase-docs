import Image from "next/image"
import { AmazonRdsIcon } from "@/components/icons/amazon-rds"
import { Auth0Icon } from "@/components/icons/auth0"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { FirebaseIcon } from "@/components/icons/firebase"
import { HerokuIcon } from "@/components/icons/heroku"
import { MssqlIcon } from "@/components/icons/mssql"
import { MysqlIcon } from "@/components/icons/mysql"
import { NeonIcon } from "@/components/icons/neon"
import { PostgresIcon } from "@/components/icons/postgres"
import { RenderIcon } from "@/components/icons/render"
import { VercelPostgresIcon } from "@/components/icons/vercel-postgres"
import { SlashSpacer } from "@/components/common/slash-rule"
import { cn } from "@/lib/utils"
import { LinkTile } from "./link-tile"

type MigrateGuide = {
  slug: string
  label: string
  icon: React.ReactNode
}

export type MigrateSectionProps = {
  className?: string
}

const MIGRATE_ROOT = "https://supabase.com/docs/guides/resources/migrating-to-supabase"

const MIGRATE_COLUMNS: readonly (readonly MigrateGuide[])[] = [
  [
    { slug: "amazon-rds", label: "Amazon RDS", icon: <AmazonRdsIcon /> },
    { slug: "firebase-storage", label: "Firebase Storage", icon: <FirebaseIcon /> },
    { slug: "mssql", label: "MSSQL", icon: <MssqlIcon /> },
    { slug: "postgres", label: "Postgres", icon: <PostgresIcon /> },
  ],
  [
    { slug: "auth0", label: "Auth0", icon: <Auth0Icon /> },
    { slug: "firestore-data", label: "Firestore Data", icon: <FirebaseIcon /> },
    { slug: "mysql", label: "MySQL", icon: <MysqlIcon /> },
    { slug: "render", label: "Render", icon: <RenderIcon /> },
  ],
  [
    { slug: "firebase-auth", label: "Firebase Auth", icon: <FirebaseIcon /> },
    { slug: "heroku", label: "Heroku", icon: <HerokuIcon /> },
    { slug: "neon", label: "Neon", icon: <NeonIcon /> },
    { slug: "vercel-postgres", label: "Vercel Postgres", icon: <VercelPostgresIcon /> },
  ],
]

export const MigrateSection = ({ className }: MigrateSectionProps) => (
  <div className={cn("flex flex-col", className)}>
    <SlashSpacer />
    <section className="relative flex flex-col">
      <div className="flex flex-col items-center justify-center md:flex-row">
        <div className="flex w-full flex-1 basis-auto items-center justify-center self-stretch bg-background p-6 sm:p-8 md:basis-[476px]">
          <Image
            src="/art/migrate-cubes.svg"
            alt=""
            width={410}
            height={176}
            unoptimized
            className="w-full max-w-[410px]"
          />
        </div>
        <div className="flex w-full flex-1 basis-auto flex-col items-start justify-center gap-3 px-4 py-10 sm:px-8 sm:py-16 md:basis-[476px]">
          <h2 className="max-w-[450px] text-2xl font-medium leading-[1.25] text-foreground">
            Migrate to Supabase
          </h2>
          <p className="max-w-[412px] text-base leading-[1.6] text-foreground-mono">
            Bring your existing data, auth and storage to Supabase following our migration guides.
          </p>
          <a
            href={`${MIGRATE_ROOT}`}
            className={cn(
              "group/link flex items-center gap-1 text-[13px] font-medium leading-[1.5] text-foreground",
              "transition-colors duration-150 ease-out hover:text-accent",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            )}
          >
            Explore more resources
            <ChevronRightIcon className="size-[15px] shrink-0 text-foreground-muted transition-colors duration-150 ease-out group-hover/link:text-accent" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start bg-well sm:grid-cols-2 lg:grid-cols-3">
        {MIGRATE_COLUMNS.map((column) => (
          <div
            key={column[0].slug}
            className="flex min-w-0 flex-col items-start gap-4 py-6 sm:py-8"
          >
            {column.map((guide) => (
              <LinkTile
                key={guide.slug}
                href={`${MIGRATE_ROOT}/${guide.slug}`}
                label={guide.label}
                icon={guide.icon}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  </div>
)
