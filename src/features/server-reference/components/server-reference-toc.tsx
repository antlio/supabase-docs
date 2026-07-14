"use client"

import { type MouseEvent, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDownIcon } from "@/components/icons/chevron-down"
import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import {
  getServerReferencePath,
  getServerReferenceSectionFromPathname,
  SERVER_REFERENCE_SECTIONS,
  setActiveServerReferenceSection,
  type ServerReferenceSection,
  useServerReferenceSection,
} from "../server-reference-active-section"
import { SERVER_REFERENCE_GROUPS } from "@/assets/server-reference-data"
import { getReferenceItemId } from "../server-reference-ids"

type ServerReferenceTocProps = {
  className?: string
}

type ReferenceTocLinkProps = {
  section: ServerReferenceSection
  activeId: string
  onNavigate?: () => void
  className?: string
  // the accent bar sits on the desktop group's left border; mobile has no such border
  showActiveBar?: boolean
}

const SCROLL_ANCHOR_PX = 112

const navigateToReferenceSection = (
  event: MouseEvent<HTMLAnchorElement>,
  section: ServerReferenceSection,
) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return
  }

  const element = document.getElementById(section.id)
  if (!element) return

  event.preventDefault()
  element.scrollIntoView({ behavior: "auto" })
  window.history.pushState(window.history.state, "", getServerReferencePath(section))
  setActiveServerReferenceSection(section.id)
}

const ReferenceTocLink = ({
  section,
  activeId,
  onNavigate,
  className,
  showActiveBar = false,
}: ReferenceTocLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    navigateToReferenceSection(event, section)
    onNavigate?.()
  }

  const isActive = activeId === section.id

  return (
    <Link
      href={getServerReferencePath(section)}
      onClick={handleClick}
      aria-current={isActive ? "location" : undefined}
      className={cn(
        "relative block rounded-xs py-1 text-[13px] leading-[1.43] text-foreground-muted outline-none",
        "transition-colors duration-150 hover:text-foreground-soft",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        isActive && "text-accent",
        className,
      )}
    >
      {isActive && showActiveBar && (
        <span
          aria-hidden
          className="absolute left-[-13px] top-1/2 h-[1em] w-px -translate-y-1/2 bg-accent"
        />
      )}
      {section.title}
    </Link>
  )
}

export const ServerReferenceToc = ({ className }: ServerReferenceTocProps) => {
  const { active } = useServerReferenceSection()
  const historyTimerRef = useRef<number | undefined>(undefined)

  useMountEffect(() => {
    const initialSection = getServerReferenceSectionFromPathname(window.location.pathname)
    const initialElement = document.getElementById(initialSection.id)

    if (initialSection.id !== "introduction" && initialElement && window.scrollY === 0) {
      window.scrollTo({ top: initialElement.getBoundingClientRect().top - SCROLL_ANCHOR_PX })
    }

    setActiveServerReferenceSection(initialSection.id)

    const elements = SERVER_REFERENCE_SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    )

    const updateActiveSection = () => {
      const anchor = SCROLL_ANCHOR_PX
      const passed = elements.filter((element) => element.getBoundingClientRect().top <= anchor)
      const next =
        passed.at(-1) ?? elements.find((element) => element.getBoundingClientRect().bottom > anchor)

      if (!next) return

      const section = SERVER_REFERENCE_SECTIONS.find(({ id }) => id === next.id)
      if (!section) return

      setActiveServerReferenceSection(section.id)

      const path = getServerReferencePath(section)
      window.clearTimeout(historyTimerRef.current)

      if (window.location.pathname !== path) {
        historyTimerRef.current = window.setTimeout(() => {
          window.history.replaceState(window.history.state, "", path)
        }, 120)
      }
    }

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: "-80px 0px -62% 0px",
      threshold: [0, 0.01, 0.5],
    })

    elements.forEach((element) => observer.observe(element))
    updateActiveSection()
    return () => {
      observer.disconnect()
      window.clearTimeout(historyTimerRef.current)
    }
  })

  return (
    <nav aria-label="On this page" className={cn("px-6 py-4 font-sans", className)}>
      <ul className="w-[190px] space-y-1">
        {SERVER_REFERENCE_SECTIONS.slice(0, 2).map((section) => (
          <li key={section.id}>
            <ReferenceTocLink section={section} activeId={active.id} />
          </li>
        ))}
        {SERVER_REFERENCE_GROUPS.map((group) => {
          return (
            <li key={group.category} className="pt-2">
              <span className="block py-1 text-xs font-medium tracking-[0.05em] text-foreground-subtle">
                {group.category}
              </span>
              <ul className="mt-1 border-l border-border pl-3 ml-1">
                {group.items.map((item) => {
                  const id = getReferenceItemId(group.category, item.name)
                  const section = SERVER_REFERENCE_SECTIONS.find((candidate) => candidate.id === id)

                  if (!section) return null

                  return (
                    <li key={id}>
                      <ReferenceTocLink section={section} activeId={active.id} showActiveBar />
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export const ServerReferenceMobileNav = ({ className }: ServerReferenceTocProps) => {
  const [open, setOpen] = useState(false)
  const { active } = useServerReferenceSection()

  const close = () => setOpen(false)

  return (
    <CollapsibleRoot
      open={open}
      onOpenChange={setOpen}
      className={cn("border-b border-dashed border-border bg-background xl:hidden", className)}
    >
      <CollapsibleTrigger
        className="h-11 justify-between px-4 text-foreground-soft sm:px-6"
        indicator={
          <ChevronDownIcon className="size-[15px] text-foreground-muted transition-transform duration-150 group-data-[panel-open]:rotate-180 motion-reduce:transition-none" />
        }
      >
        <span>On this page</span>
        <span className="ml-auto truncate text-foreground-muted">{active.title}</span>
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <nav
          aria-label="On this page"
          className="max-h-[min(60dvh,28rem)] overflow-y-auto border-t border-border px-4 py-2 sm:px-6"
        >
          <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {SERVER_REFERENCE_SECTIONS.map((section) => (
              <li key={section.id}>
                <ReferenceTocLink
                  section={section}
                  activeId={active.id}
                  onNavigate={close}
                  className="min-h-10 py-2.5"
                />
              </li>
            ))}
          </ul>
        </nav>
      </CollapsiblePanel>
    </CollapsibleRoot>
  )
}
