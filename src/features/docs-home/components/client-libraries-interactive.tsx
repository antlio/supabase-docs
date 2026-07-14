"use client"

import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { SlashRule } from "@/components/common/slash-rule"
import { CSharpIcon } from "@/components/icons/csharp"
import { FlutterIcon } from "@/components/icons/flutter"
import { JavaScriptIcon } from "@/components/icons/javascript"
import { KotlinIcon } from "@/components/icons/kotlin"
import { PythonIcon } from "@/components/icons/python"
import { SwiftIcon } from "@/components/icons/swift"
import { cn } from "@/lib/utils"
import { LinkTile } from "./link-tile"
import { TileColumnsGrid } from "./tile-columns-grid"

type ClientLibrarySlug = "javascript" | "csharp" | "flutter" | "swift" | "python" | "kotlin"

type ClientLibrary = {
  slug: ClientLibrarySlug
  label: string
  href: string
  icon: ReactNode
}

export type ClientLibrariesInteractiveProps = {
  boardMarkup: string
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

const CLIENT_LIBRARIES = LIBRARY_COLUMNS.flat()

const applyBoardLibrary = (board: HTMLDivElement | null, slug: ClientLibrarySlug | null) => {
  const pads = board?.querySelectorAll<SVGElement>("[data-library-pad]")
  pads?.forEach((pad) => {
    pad.toggleAttribute("data-active", pad.dataset.libraryPad === slug)
  })
}

const getLibraryFromBoardTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null

  const slug = target.closest<SVGElement>("[data-library-pad]")?.dataset.libraryPad
  return CLIENT_LIBRARIES.find((library) => library.slug === slug) ?? null
}

type ClientLibraryTileProps = {
  library: ClientLibrary
  active: boolean
  onPointerEnter: (slug: ClientLibrarySlug) => void
  onPointerLeave: (slug: ClientLibrarySlug) => void
  onFocus: (slug: ClientLibrarySlug) => void
  onBlur: (slug: ClientLibrarySlug) => void
}

const ClientLibraryTile = ({
  library,
  active,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: ClientLibraryTileProps) => {
  const handlePointerEnter = () => onPointerEnter(library.slug)
  const handlePointerLeave = () => onPointerLeave(library.slug)
  const handleFocus = () => onFocus(library.slug)
  const handleBlur = () => onBlur(library.slug)

  return (
    <LinkTile
      href={library.href}
      label={library.label}
      icon={library.icon}
      active={active}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}

export const ClientLibrariesInteractive = ({
  boardMarkup,
  className,
}: ClientLibrariesInteractiveProps) => {
  const boardRef = useRef<HTMLDivElement>(null)
  const hoveredLibraryRef = useRef<ClientLibrarySlug | null>(null)
  const focusedLibraryRef = useRef<ClientLibrarySlug | null>(null)
  const [activeLibrary, setActiveLibrary] = useState<ClientLibrarySlug | null>(null)

  const setBoardLibrary = (slug: ClientLibrarySlug | null) => {
    applyBoardLibrary(boardRef.current, slug)
    setActiveLibrary(slug)
  }

  const setBoardRef = (board: HTMLDivElement | null) => {
    boardRef.current = board
    applyBoardLibrary(board, activeLibrary)
  }

  const syncBoardLibrary = () => {
    setBoardLibrary(hoveredLibraryRef.current ?? focusedLibraryRef.current)
  }

  const onLibraryPointerEnter = (slug: ClientLibrarySlug) => {
    hoveredLibraryRef.current = slug
    syncBoardLibrary()
  }

  const onLibraryPointerLeave = (slug: ClientLibrarySlug) => {
    if (hoveredLibraryRef.current === slug) hoveredLibraryRef.current = null
    syncBoardLibrary()
  }

  const onLibraryFocus = (slug: ClientLibrarySlug) => {
    focusedLibraryRef.current = slug
    syncBoardLibrary()
  }

  const onLibraryBlur = (slug: ClientLibrarySlug) => {
    if (focusedLibraryRef.current === slug) focusedLibraryRef.current = null
    syncBoardLibrary()
  }

  const onBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const slug = getLibraryFromBoardTarget(event.target)?.slug ?? null
    if (hoveredLibraryRef.current === slug) return

    hoveredLibraryRef.current = slug
    syncBoardLibrary()
  }

  const onBoardPointerLeave = () => {
    hoveredLibraryRef.current = null
    syncBoardLibrary()
  }

  const renderLibrary = (library: ClientLibrary) => (
    <ClientLibraryTile
      key={library.slug}
      library={library}
      active={activeLibrary === library.slug}
      onPointerEnter={onLibraryPointerEnter}
      onPointerLeave={onLibraryPointerLeave}
      onFocus={onLibraryFocus}
      onBlur={onLibraryBlur}
    />
  )

  return (
    <section className={cn("relative flex flex-col", className)}>
      <SlashRule className="pb-6 pt-16" />
      <div className="flex flex-col items-start justify-center md:flex-row">
        <div className="flex w-full flex-1 basis-auto flex-col items-start justify-center gap-3 px-4 py-10 sm:px-8 sm:py-16 md:basis-[476px]">
          <h2 className="max-w-[450px] text-2xl font-medium leading-[1.25] text-foreground">
            Client Libraries
          </h2>
          <p className="text-base leading-[1.6] text-foreground-mono">
            Official libraries for your language — query, authenticate and subscribe from the
            client.
          </p>
        </div>
        <div className="flex w-full flex-1 basis-auto items-start justify-center self-stretch md:basis-[476px]">
          <div
            ref={setBoardRef}
            aria-hidden
            onPointerMove={onBoardPointerMove}
            onPointerLeave={onBoardPointerLeave}
            className="aspect-[476/284] w-full max-w-full [&>svg]:block [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: boardMarkup }}
          />
        </div>
      </div>
      <TileColumnsGrid
        columns={LIBRARY_COLUMNS}
        renderTile={renderLibrary}
        columnClassName="text-foreground-subtle"
      />
    </section>
  )
}
