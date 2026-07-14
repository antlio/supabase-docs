import { SlashSpacer } from "@/components/common/slash-rule"
import { AiVectorsIcon } from "@/components/icons/ai-vectors"
import { CronIcon } from "@/components/icons/cron"
import { DataRestIcon } from "@/components/icons/data-rest"
import { GraphqlIcon } from "@/components/icons/graphql"
import { QueuesIcon } from "@/components/icons/queues"
import { cn } from "@/lib/utils"
import { ModulesCubeArt } from "./modules-cube-art"
import { ScrollAccentAnchors } from "./scroll-accent"

type Module = {
  label: string
  href: string
  icon: (props: { className?: string }) => React.ReactElement
}

type ModulesSectionProps = {
  className?: string
}

const MODULES: readonly Module[] = [
  { label: "AI & Vectors", href: "https://supabase.com/docs/guides/ai", icon: AiVectorsIcon },
  { label: "Cron", href: "https://supabase.com/docs/guides/cron", icon: CronIcon },
  { label: "Queues", href: "https://supabase.com/docs/guides/queues", icon: QueuesIcon },
  { label: "Data REST API", href: "https://supabase.com/docs/guides/api", icon: DataRestIcon },
  { label: "GraphQL API", href: "https://supabase.com/docs/guides/graphql", icon: GraphqlIcon },
] as const

export const ModulesSection = ({ className }: ModulesSectionProps) => (
  <div className={cn("flex flex-col", className)}>
    <SlashSpacer />
    <section className="relative flex flex-col md:flex-row">
      <ScrollAccentAnchors corners={["top-left"]} />
      <div className="flex w-full shrink-0 items-center justify-center border border-border px-4 py-8 md:w-[54%] xl:w-[512px]">
        <ModulesCubeArt />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-6 p-8 sm:p-12 xl:p-16">
        <h2 className="text-2xl font-medium leading-[30px] text-foreground">Modules</h2>
        <ul className="flex flex-col gap-1.5">
          {MODULES.map((module) => {
            const Icon = module.icon

            return (
              <li key={module.href}>
                <a
                  href={module.href}
                  className={cn(
                    "group -mx-2 flex min-h-11 items-center gap-3 rounded-xs px-2 sm:h-10 sm:min-h-0",
                    "transition-colors duration-150 ease-out hover:bg-surface-raised/50",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent",
                  )}
                >
                  <Icon />
                  <span className="font-label text-[15px] font-semibold leading-[22.5px] text-brand-foreground">
                    {module.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  </div>
)
