import Image from "next/image"
import { SlashSpacer } from "@/components/common/slash-rule"
import { CSharpIcon } from "@/components/icons/csharp"
import { FlutterIcon } from "@/components/icons/flutter"
import { JavaScriptIcon } from "@/components/icons/javascript"
import { KotlinIcon } from "@/components/icons/kotlin"
import { PythonIcon } from "@/components/icons/python"
import { SwiftIcon } from "@/components/icons/swift"
import { cn } from "@/lib/utils"
import { LinkTile } from "./link-tile"

type ClientLibrary = {
  slug: string
  label: string
  href: string
  icon: React.ReactNode
}

export type ClientLibrariesSectionProps = {
  className?: string
}

const LIBRARY_COLUMNS: readonly (readonly ClientLibrary[])[] = [
  [
    {
      slug: "javascript",
      label: "JavaScript",
      href: "https://supabase.com/docs/reference/javascript/introduction",
      icon: <JavaScriptIcon />,
    },
    {
      slug: "csharp",
      label: "C#",
      href: "https://supabase.com/docs/reference/csharp",
      icon: <CSharpIcon />,
    },
  ],
  [
    {
      slug: "flutter",
      label: "Flutter",
      href: "https://supabase.com/docs/reference/dart",
      icon: <FlutterIcon />,
    },
    {
      slug: "swift",
      label: "Swift",
      href: "https://supabase.com/docs/reference/swift",
      icon: <SwiftIcon />,
    },
  ],
  [
    {
      slug: "python",
      label: "Python",
      href: "https://supabase.com/docs/reference/python",
      icon: <PythonIcon />,
    },
    {
      slug: "kotlin",
      label: "Kotlin",
      href: "https://supabase.com/docs/reference/kotlin",
      icon: <KotlinIcon />,
    },
  ],
]

export const ClientLibrariesSection = ({ className }: ClientLibrariesSectionProps) => (
  <section className={cn("relative flex flex-col", className)}>
    <SlashSpacer />
    <div className="flex flex-col items-start justify-center md:flex-row">
      <div className="flex w-full flex-1 basis-auto flex-col items-start justify-center gap-3 px-4 py-10 sm:px-8 sm:py-16 md:basis-[476px]">
        <h2 className="max-w-[450px] text-2xl font-medium leading-[1.25] text-foreground">
          Client Libraries
        </h2>
        <p className="text-base leading-[1.6] text-foreground">
          Official libraries for your language — query, authenticate and subscribe from the client.
        </p>
      </div>
      <div className="flex w-full flex-1 basis-auto items-start justify-center self-stretch md:basis-[476px]">
        <Image
          src="/art/client-libraries-board.svg"
          alt=""
          width={476}
          height={284}
          unoptimized
          className="w-full max-w-full"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 items-start bg-well sm:grid-cols-2 lg:grid-cols-3">
      {LIBRARY_COLUMNS.map((column) => (
        <div
          key={column[0].slug}
          className="flex min-w-0 flex-col items-start gap-4 py-6 text-foreground-subtle sm:py-8"
        >
          {column.map((library) => (
            <LinkTile
              key={library.slug}
              href={library.href}
              label={library.label}
              icon={library.icon}
            />
          ))}
        </div>
      ))}
    </div>
  </section>
)
