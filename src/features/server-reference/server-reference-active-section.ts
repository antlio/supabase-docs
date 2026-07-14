"use client"

import { useSyncExternalStore } from "react"
import { SERVER_REFERENCE_GROUPS } from "@/assets/server-reference-data"
import { getReferenceItemId, getReferenceItemSlug } from "./server-reference-ids"

export type ServerReferenceSection = {
  id: string
  title: string
  markdownSlug: string
  sourceUrl?: string
}

export type ServerReferenceSectionState = {
  active: ServerReferenceSection
  previous: ServerReferenceSection | null
  direction: "forward" | "backward"
  revision: number
}

export const SERVER_REFERENCE_SECTIONS: ServerReferenceSection[] = [
  { id: "introduction", title: "Introduction", markdownSlug: "introduction" },
  { id: "installation", title: "Installation", markdownSlug: "installation" },
  ...SERVER_REFERENCE_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      id: getReferenceItemId(group.category, item.name),
      title: item.name,
      markdownSlug: getReferenceItemSlug(group.category, item.name),
      sourceUrl: item.sourceUrl,
    })),
  ),
]

const initialState: ServerReferenceSectionState = {
  active: SERVER_REFERENCE_SECTIONS[0],
  previous: null,
  direction: "forward",
  revision: 0,
}

let state = initialState
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => state
const getServerSnapshot = () => initialState

export const setActiveServerReferenceSection = (id: string) => {
  if (state.active.id === id) return

  const next = SERVER_REFERENCE_SECTIONS.find((section) => section.id === id)
  if (!next) return

  const activeIndex = SERVER_REFERENCE_SECTIONS.findIndex(
    (section) => section.id === state.active.id,
  )
  const nextIndex = SERVER_REFERENCE_SECTIONS.findIndex((section) => section.id === id)

  state = {
    active: next,
    previous: state.active,
    direction: nextIndex >= activeIndex ? "forward" : "backward",
    revision: state.revision + 1,
  }
  listeners.forEach((listener) => listener())
}

export const useServerReferenceSection = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

const SERVER_REFERENCE_PATH = "/docs/reference/server"

export const getServerReferencePath = (section: ServerReferenceSection) =>
  section.id === "introduction"
    ? SERVER_REFERENCE_PATH
    : `${SERVER_REFERENCE_PATH}/${section.markdownSlug}`

export const getServerReferenceSectionFromPathname = (pathname: string) => {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/"
  const slug = normalizedPathname.replace(`${SERVER_REFERENCE_PATH}/`, "")

  if (normalizedPathname === SERVER_REFERENCE_PATH || slug === normalizedPathname) {
    return SERVER_REFERENCE_SECTIONS[0]
  }

  return (
    SERVER_REFERENCE_SECTIONS.find((section) => section.markdownSlug === slug) ??
    SERVER_REFERENCE_SECTIONS[0]
  )
}

export const getServerReferenceMarkdownUrl = (section: ServerReferenceSection) =>
  section.id === "introduction"
    ? "https://supabase.com/docs/reference/server.md"
    : `https://supabase.com${getServerReferencePath(section)}.md`
