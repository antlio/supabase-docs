"use client"

import { useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from "react"
import { CheckIcon } from "@/components/icons/check"
import { SubmitArrow } from "@/components/icons/submit-arrow"
import { ToolbarButton, ToolbarInput, ToolbarRoot } from "@/components/ui/toolbar"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import { dispatchReferenceContextQuestion } from "./reference-context-question-event"

type ReferenceContextIslandProps = {
  className?: string
  children: React.ReactNode
}

type SelectionContext = {
  text: string
  sectionId: string
  fragments: HighlightFragment[]
  left: number
  top: number
  placement: "above" | "below"
}

type HighlightFragment = {
  left: number
  top: number
  width: number
  height: number
}

const MAX_CONTEXT_LENGTH = 2_000
const ISLAND_MAX_WIDTH = 544
const VIEWPORT_GUTTER = 12
const ABOVE_PLACEMENT_THRESHOLD = 124
const HIGHLIGHT_EXIT_DELAY = 100

type TerminalCursorProps = {
  className?: string
}

type TerminalCursorMirrorProps = {
  value: string
  className?: string
}

const TerminalCursor = ({ className }: TerminalCursorProps) => (
  <span
    aria-hidden
    className={cn(
      "block h-4 w-[7px] shrink-0 rounded-[1px] bg-foreground-soft opacity-35",
      "transition-opacity duration-150 ease-out group-focus-within:opacity-80",
      className,
    )}
  />
)

const TerminalCursorMirror = ({ value, className }: TerminalCursorMirrorProps) => (
  <span
    aria-hidden
    className={cn(
      "pointer-events-none absolute inset-y-0 left-3 right-12 z-10 flex items-center overflow-hidden",
      className,
    )}
  >
    {value ? (
      <span className="invisible shrink-0 whitespace-pre text-sm leading-5">{value}</span>
    ) : null}
    <TerminalCursor className={value ? "ml-0.5" : undefined} />
  </span>
)

const getSelectionElement = (node: Node | null): Element | null => {
  if (!node) return null
  if (node.nodeType === Node.ELEMENT_NODE) return node as Element
  return node.parentElement
}

export const ReferenceContextIsland = ({ className, children }: ReferenceContextIslandProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const highlightExitTimeoutRef = useRef<number | null>(null)
  const [context, setContext] = useState<SelectionContext | null>(null)
  const [isHighlightVisible, setIsHighlightVisible] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isSent, setIsSent] = useState(false)

  const cancelPendingHighlightClear = () => {
    if (highlightExitTimeoutRef.current === null) return
    window.clearTimeout(highlightExitTimeoutRef.current)
    highlightExitTimeoutRef.current = null
  }

  const dismiss = ({ clearHighlightImmediately = false } = {}) => {
    cancelPendingHighlightClear()
    if (clearHighlightImmediately) {
      setIsHighlightVisible(false)
      setIsOpen(false)
      setIsSent(false)
      return
    }

    highlightExitTimeoutRef.current = window.setTimeout(() => {
      setIsHighlightVisible(false)
      highlightExitTimeoutRef.current = null
    }, HIGHLIGHT_EXIT_DELAY)
    setIsOpen(false)
    setIsSent(false)
  }

  const captureSelection = () => {
    const root = rootRef.current
    const selection = window.getSelection()
    if (!root || !selection || selection.isCollapsed || selection.rangeCount === 0) {
      dismiss()
      return
    }

    const range = selection.getRangeAt(0)
    const selectionElement = getSelectionElement(selection.anchorNode)
    if (
      !root.contains(range.commonAncestorContainer) ||
      selectionElement?.closest("[data-reference-context-island]")
    ) {
      return
    }

    const text = selection.toString().replace(/\s+/g, " ").trim().slice(0, MAX_CONTEXT_LENGTH)
    const rect = range.getBoundingClientRect()
    if (!text || (rect.width === 0 && rect.height === 0)) {
      dismiss()
      return
    }

    const islandWidth = Math.min(ISLAND_MAX_WIDTH, window.innerWidth - VIEWPORT_GUTTER * 2)
    const halfWidth = islandWidth / 2
    const selectionCenter = rect.left + rect.width / 2
    const left = Math.min(
      Math.max(selectionCenter, halfWidth + VIEWPORT_GUTTER),
      window.innerWidth - halfWidth - VIEWPORT_GUTTER,
    )
    const placement = rect.top >= ABOVE_PLACEMENT_THRESHOLD ? "above" : "below"
    const sectionId = selectionElement?.closest<HTMLElement>("[data-reference-section]")?.id ?? ""
    const selectionLineHeight = selectionElement
      ? Number.parseFloat(window.getComputedStyle(selectionElement).lineHeight)
      : 0
    const fragments = Array.from(range.getClientRects())
      .filter((fragment) => fragment.width > 0 && fragment.height > 0)
      .map((fragment) => {
        const height = Math.max(fragment.height, selectionLineHeight || fragment.height)

        return {
          left: fragment.left,
          top: fragment.top - (height - fragment.height) / 2,
          width: fragment.width,
          height,
        }
      })

    cancelPendingHighlightClear()
    setIsHighlightVisible(true)
    setContext({
      text,
      sectionId,
      fragments,
      left,
      top: placement === "above" ? rect.top : rect.bottom,
      placement,
    })
    setQuery("")
    setIsSent(false)
    setIsOpen(true)
    window.requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("[data-reference-context-island]")) return
    if (isOpen) dismiss({ clearHighlightImmediately: true })
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("[data-reference-context-island]")) return
    window.requestAnimationFrame(captureSelection)
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("[data-reference-context-island]")) return
    captureSelection()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const question = query.trim()
    if (!context || !question) return

    dispatchReferenceContextQuestion({
      question,
      context: context.text,
      sectionId: context.sectionId,
      pathname: window.location.pathname,
    })
    setIsSent(true)
    inputRef.current?.focus()
  }

  useMountEffect(() => {
    const handleViewportChange = () => dismiss()
    const handleDocumentPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        dismiss({ clearHighlightImmediately: true })
      }
    }
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }

    window.addEventListener("resize", handleViewportChange)
    document.addEventListener("scroll", handleViewportChange, true)
    document.addEventListener("pointerdown", handleDocumentPointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      cancelPendingHighlightClear()
      window.removeEventListener("resize", handleViewportChange)
      document.removeEventListener("scroll", handleViewportChange, true)
      document.removeEventListener("pointerdown", handleDocumentPointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  })

  return (
    <div
      ref={rootRef}
      className={cn("min-w-0", className)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyUp={handleKeyUp}
    >
      {children}

      {context?.fragments.map((fragment, index) => (
        <span
          key={`${fragment.left}-${fragment.top}-${index}`}
          aria-hidden
          className={cn(
            "pointer-events-none fixed z-[70] bg-selection",
            isHighlightVisible ? "opacity-100" : "opacity-0",
          )}
          style={fragment}
        />
      ))}

      <div
        data-reference-context-island
        data-open={isOpen}
        inert={!isOpen}
        className={cn(
          "pointer-events-none fixed z-[80] w-[min(34rem,calc(100vw-1.5rem))]",
          context?.placement === "above"
            ? "-translate-x-1/2 -translate-y-[calc(100%+0.625rem)]"
            : "-translate-x-1/2 translate-y-2.5",
        )}
        style={{ left: context?.left ?? 0, top: context?.top ?? 0 }}
      >
        <div
          data-open={isOpen}
          className={cn(
            "relative overflow-hidden rounded-lg border border-border bg-code-shell shadow-popover",
            "transition-[opacity,transform,filter] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "data-[open=false]:scale-[0.985] data-[open=false]:opacity-0 data-[open=false]:blur-[2px]",
            "data-[open=true]:pointer-events-auto data-[open=true]:scale-100 data-[open=true]:opacity-100 data-[open=true]:blur-0",
            "motion-reduce:transition-none motion-reduce:data-[open=false]:blur-0",
          )}
        >
          <div className="flex min-w-0 items-center border-b border-border px-3 py-2">
            <span
              className={cn(
                "max-w-full truncate whitespace-nowrap rounded-xs bg-surface-raised px-1.5 py-0.5",
                "text-xs font-medium leading-[1.1] text-foreground-subtle shadow-raised",
              )}
            >
              {context?.text}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <ToolbarRoot
              className="group relative h-11 gap-2 px-3"
              aria-label="Ask about selected reference text"
            >
              <TerminalCursorMirror value={query} />
              <ToolbarInput
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setIsSent(false)
                }}
                placeholder="Ask about this selection"
                aria-label="Question about selected reference text"
                className="caret-transparent pr-10 placeholder-shown:pl-3"
              />
              <ToolbarButton
                type="submit"
                disabled={!query.trim()}
                aria-label={isSent ? "Question sent" : "Submit question"}
                className="relative size-8 bg-surface-raised text-foreground shadow-raised hover:bg-surface"
              >
                <SubmitArrow
                  className={cn(
                    "size-4 transition-[opacity,transform,filter] duration-200",
                    isSent ? "scale-75 opacity-0 blur-[3px]" : "scale-100 opacity-100 blur-0",
                  )}
                />
                <CheckIcon
                  className={cn(
                    "absolute size-4 text-accent transition-[opacity,transform,filter] duration-200",
                    isSent ? "scale-100 opacity-100 blur-0" : "scale-75 opacity-0 blur-[3px]",
                  )}
                />
              </ToolbarButton>
            </ToolbarRoot>
          </form>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {isSent ? "Question sent with the selected reference context." : ""}
      </span>
    </div>
  )
}
