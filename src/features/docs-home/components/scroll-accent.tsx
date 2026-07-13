"use client"

import { useRef } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"

type AccentCorner = (typeof ACCENT_CORNERS)[number]

type ScrollAccentAnchorsProps = {
  className?: string
  corners?: readonly AccentCorner[]
  sentinelPositions?: readonly number[]
}

type ScrollAccentResetProps = {
  className?: string
  sentinelPosition?: number
}

type ScrollAccentProps = {
  className?: string
}

const ACCENT_CORNERS = ["top-left", "top-right", "bottom-right", "bottom-left"] as const

const SENTINEL_POSITIONS = [24, 28, 64, 70] as const
const SINGLE_SENTINEL_POSITION = 24
const TOP_LOCK_SCROLL_Y = 64
const DOT_STAGGER_MS = 80
const LINE_START_GAP_MS = 50
const LINE_STAGGER_MS = 30
const LINE_RESET_STAGGER_MS = 12
const ACCENT_HALF_SIZE = 10
const ACCENT_LEFT_OFFSET = 11.5
const ACCENT_TOP_OFFSET = 10.5
const OBSERVER_ROOT_MARGIN = "-36% 0px -36% 0px"

const getCornerPosition = (corner: AccentCorner, targetRect: DOMRect, rootRect: DOMRect) => {
  const left = targetRect.left - rootRect.left
  const top = targetRect.top - rootRect.top

  return {
    x:
      corner === "top-right" || corner === "bottom-right"
        ? left + targetRect.width - ACCENT_HALF_SIZE
        : left - ACCENT_LEFT_OFFSET,
    y:
      corner === "bottom-left" || corner === "bottom-right"
        ? top + targetRect.height - ACCENT_HALF_SIZE
        : top - ACCENT_TOP_OFFSET,
  }
}

const getSentinelPosition = (
  index: number,
  cornerCount: number,
  sentinelPositions?: readonly number[],
) =>
  sentinelPositions?.[index] ??
  (cornerCount === 1 ? SINGLE_SENTINEL_POSITION : SENTINEL_POSITIONS[index])

export const ScrollAccent = ({ className }: ScrollAccentProps) => {
  const accentRef = useRef<HTMLSpanElement>(null)

  useMountEffect(() => {
    const accent = accentRef.current
    const root = accent?.closest<HTMLElement>("[data-scroll-accent-root]")
    const sentinels = Array.from(
      root?.querySelectorAll<HTMLElement>("[data-scroll-accent-sentinel]") ?? [],
    )
    if (!accent || !root || sentinels.length === 0) return

    let activeSentinel = sentinels[0]
    let accentSentinel = sentinels[0]
    let pendingSentinel: HTMLElement | null = null
    let pendingDetailsSentinel: HTMLElement | null = null
    let restoreTransitionFrame = 0
    let topLocked = window.scrollY <= TOP_LOCK_SCROLL_Y
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const dotAnimationTimeouts: number[] = []
    const lineAnimationTimeouts: number[] = []

    const positionAccent = (sentinel: HTMLElement, animate: boolean) => {
      const target = sentinel.closest<HTMLElement>("[data-scroll-accent-target]")
      const corner = sentinel.dataset.scrollAccentCorner as AccentCorner | undefined
      if (!target || !corner) return false

      const rootRect = root.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const { x, y } = getCornerPosition(corner, targetRect, rootRect)

      const nextTransform = `translate3d(${x}px, ${y}px, 0)`
      const hasMoved = accent.style.transform !== nextTransform

      if (!animate) accent.style.transitionDuration = "0ms"
      accent.style.transform = nextTransform
      accent.style.opacity = "1"

      if (!animate) {
        cancelAnimationFrame(restoreTransitionFrame)
        restoreTransitionFrame = requestAnimationFrame(() => {
          accent.style.removeProperty("transition-duration")
        })
      }

      return hasMoved
    }

    const clearDetailTimeouts = () => {
      dotAnimationTimeouts.forEach(window.clearTimeout)
      dotAnimationTimeouts.length = 0
      lineAnimationTimeouts.forEach(window.clearTimeout)
      lineAnimationTimeouts.length = 0
    }

    const resetExistingDetails = () => {
      clearDetailTimeouts()

      const artworkDetails = root.querySelectorAll<HTMLElement>("[data-scroll-accent-art]")
      artworkDetails.forEach((artwork) => artwork.removeAttribute("data-active"))

      const dots = root.querySelectorAll<HTMLElement>("[data-scroll-accent-existing-dot]")
      dots.forEach((dot) => dot.removeAttribute("data-active"))

      const activeLines = root.querySelectorAll<HTMLElement>(
        "[data-scroll-accent-existing-line][data-active]",
      )
      activeLines.forEach((line, index) => {
        lineAnimationTimeouts.push(
          window.setTimeout(
            () => line.removeAttribute("data-active"),
            prefersReducedMotion ? 0 : index * LINE_RESET_STAGGER_MS,
          ),
        )
      })
    }

    const animateExistingDetails = (sentinel: HTMLElement) => {
      clearDetailTimeouts()

      const target = sentinel.closest<HTMLElement>("[data-scroll-accent-target]")
      const targetContainer = target?.parentElement
      const targetDots = ACCENT_CORNERS.map((corner) =>
        targetContainer?.querySelector<HTMLElement>(
          `[data-scroll-accent-existing-dot][data-scroll-accent-corner="${corner}"]`,
        ),
      ).filter(
        (dot): dot is HTMLElement =>
          dot !== undefined && dot !== null && targetContainer?.contains(dot) === true,
      )
      const targetLines = Array.from(
        targetContainer?.querySelectorAll<HTMLElement>("[data-scroll-accent-existing-line]") ?? [],
      )
      const targetArtwork = Array.from(
        targetContainer?.querySelectorAll<HTMLElement>("[data-scroll-accent-art]") ?? [],
      )

      targetArtwork.forEach((artwork) => artwork.setAttribute("data-active", ""))
      targetLines.forEach((line) => line.removeAttribute("data-active"))

      targetDots.forEach((dot, index) => {
        dotAnimationTimeouts.push(
          window.setTimeout(
            () => dot.setAttribute("data-active", ""),
            prefersReducedMotion ? 0 : Math.max(0, index - 1) * DOT_STAGGER_MS,
          ),
        )
      })

      if (targetLines.length === 0) return

      const dotsCompleteDelay = prefersReducedMotion
        ? 0
        : Math.max(0, targetDots.length - 2) * DOT_STAGGER_MS

      targetLines.toReversed().forEach((line, index) => {
        lineAnimationTimeouts.push(
          window.setTimeout(
            () => line.setAttribute("data-active", ""),
            dotsCompleteDelay +
              (prefersReducedMotion ? 0 : LINE_START_GAP_MS + index * LINE_STAGGER_MS),
          ),
        )
      })
    }

    const completePendingDetails = () => {
      const sentinel = pendingDetailsSentinel
      if (!sentinel) return

      pendingDetailsSentinel = null
      animateExistingDetails(sentinel)
    }

    const onAccentTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== accent || event.propertyName !== "transform") return
      completePendingDetails()
    }

    accent.addEventListener("transitionend", onAccentTransitionEnd)

    const activateSentinel = (sentinel: HTMLElement, forceReset = false) => {
      if (!forceReset && sentinel === activeSentinel) return
      activeSentinel = sentinel
      pendingDetailsSentinel = null
      resetExistingDetails()

      if (sentinel.hasAttribute("data-scroll-accent-reset")) return

      if (sentinel.dataset.scrollAccentCorner === "top-left") {
        accentSentinel = sentinel
        pendingDetailsSentinel = sentinel
        const hasMoved = positionAccent(accentSentinel, true)

        if (prefersReducedMotion || !hasMoved) completePendingDetails()
      }
    }

    positionAccent(activeSentinel, false)

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .toSorted(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight / 2) -
              Math.abs(b.boundingClientRect.top - window.innerHeight / 2),
          )
        const nextSentinel = entering[0]?.target
        if (!(nextSentinel instanceof HTMLElement)) return

        if (topLocked) {
          pendingSentinel = nextSentinel
          return
        }

        activateSentinel(nextSentinel)
      },
      { rootMargin: OBSERVER_ROOT_MARGIN, threshold: 0 },
    )

    sentinels.forEach((sentinel) => observer.observe(sentinel))

    const onScroll = () => {
      const nextTopLocked = window.scrollY <= TOP_LOCK_SCROLL_Y
      if (nextTopLocked === topLocked) return

      topLocked = nextTopLocked
      if (topLocked) {
        pendingSentinel = null
        activateSentinel(sentinels[0], true)
      } else if (pendingSentinel) {
        activateSentinel(pendingSentinel)
        pendingSentinel = null
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    const resizeObserver = new ResizeObserver(() => positionAccent(accentSentinel, false))
    resizeObserver.observe(root)
    sentinels.forEach((sentinel) => {
      const target = sentinel.closest<HTMLElement>("[data-scroll-accent-target]")
      if (target) resizeObserver.observe(target)
    })

    return () => {
      cancelAnimationFrame(restoreTransitionFrame)
      clearDetailTimeouts()
      accent.removeEventListener("transitionend", onAccentTransitionEnd)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  })

  return (
    <span
      ref={accentRef}
      data-scroll-accent
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-0.25 top-0 z-100 hidden size-5 items-center justify-center bg-background opacity-0 sm:flex",
        "transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] [will-change:transform]",
        "motion-reduce:transition-opacity motion-reduce:duration-150",
        className,
      )}
    >
      <span className="size-1 bg-accent" />
    </span>
  )
}

export const ScrollAccentAnchors = ({
  className,
  corners = ACCENT_CORNERS,
  sentinelPositions,
}: ScrollAccentAnchorsProps) => (
  <span
    data-scroll-accent-target
    aria-hidden
    className={cn("pointer-events-none absolute inset-0 z-20", className)}
  >
    {corners.map((corner, index) => (
      <span key={corner}>
        <span
          data-scroll-accent-sentinel
          data-scroll-accent-corner={corner}
          className="absolute left-1/2 size-px"
          style={{ top: `${getSentinelPosition(index, corners.length, sentinelPositions)}%` }}
        />
      </span>
    ))}
  </span>
)

export const ScrollAccentReset = ({
  className,
  sentinelPosition = SINGLE_SENTINEL_POSITION,
}: ScrollAccentResetProps) => (
  <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-20", className)}>
    <span
      data-scroll-accent-sentinel
      data-scroll-accent-reset
      className="absolute left-1/2 size-px"
      style={{ top: `${sentinelPosition}%` }}
    />
  </span>
)
