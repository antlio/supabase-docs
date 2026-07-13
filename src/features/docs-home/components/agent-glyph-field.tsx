"use client"

import { useRef } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"

type GlyphCell = {
  x: number
  y: number
  glyph: string
  alpha: number
  targetAlpha: number
  nextChangeAt: number
}

type AgentGlyphFieldProps = {
  active?: boolean
  className?: string
}

type DrawPhraseRowOptions = {
  context: CanvasRenderingContext2D
  cells: GlyphCell[]
  phraseStartIndex: number
  idleColor: string
  phraseColor: string
  progress: number
  elapsed: number
  now: number
  reduceMotion: boolean
}

const PHRASE = "or let your agent do"
const GLYPHS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+-_=/?!<>[]{}:;~"

const HORIZONTAL_STEP = 1.45
const VERTICAL_STEP = 1.5
const FIELD_PADDING = 0.65
const PHRASE_BASELINE_OFFSET = 1.3
const EMPTY_CELL_CHANCE = 0.14
const GLYPH_CHANGE_CHANCE = 0.56
const BLINK_OFF_CHANCE = 0.22
const MIN_ALPHA = 0.14
const MAX_ALPHA = 0.48
const GLYPH_EASING = 0.14
const PHRASE_EASING = 0.16
const MUTATION_INTERVAL_MS = 80
const MIN_CHANGE_MS = 180
const MAX_CHANGE_MS = 1400
const CHARACTER_STAGGER_MS = 36
const CHARACTER_GLITCH_MS = 110
const CHARACTER_FADE_MS = 70
const GLITCH_FRAME_MS = 45
const GLITCH_SEED_OFFSET = 7
const MIN_VISIBLE_PROGRESS = 0.01
const EDGE_COLUMN_COUNT = 1

const randomBetween = (minimum: number, maximum: number): number =>
  minimum + Math.random() * (maximum - minimum)

const randomGlyph = (): string => GLYPHS.at(Math.floor(Math.random() * GLYPHS.length)) ?? "0"

const drawPhraseRow = ({
  context,
  cells,
  phraseStartIndex,
  idleColor,
  phraseColor,
  progress,
  elapsed,
  now,
  reduceMotion,
}: DrawPhraseRowOptions) => {
  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cell = cells.at(cellIndex)
    if (!cell) continue
    if (!reduceMotion) {
      cell.alpha += (cell.targetAlpha - cell.alpha) * GLYPH_EASING
    }

    const phraseIndex = cellIndex - phraseStartIndex
    const character =
      phraseIndex >= 0 && phraseIndex < PHRASE.length ? PHRASE.at(phraseIndex) : undefined
    if (character === undefined) {
      context.fillStyle = idleColor
      context.globalAlpha = cell.alpha
      context.fillText(cell.glyph, cell.x, cell.y)
      continue
    }

    const characterElapsed = elapsed - phraseIndex * CHARACTER_STAGGER_MS
    const characterProgress = Math.min(1, Math.max(0, characterElapsed / CHARACTER_FADE_MS))
    const replacementProgress = progress * characterProgress

    context.fillStyle = idleColor
    context.globalAlpha = cell.alpha * (1 - replacementProgress)
    context.fillText(cell.glyph, cell.x, cell.y)

    if (character === " " || replacementProgress < MIN_VISIBLE_PROGRESS) continue

    const isSettled = reduceMotion || characterElapsed >= CHARACTER_GLITCH_MS
    const glyph = isSettled
      ? character
      : (GLYPHS.at(
          Math.floor(now / GLITCH_FRAME_MS + phraseIndex * GLITCH_SEED_OFFSET) % GLYPHS.length,
        ) ?? character)

    context.fillStyle = phraseColor
    context.globalAlpha = replacementProgress
    context.fillText(glyph, cell.x, cell.y)
  }
}

export const AgentGlyphField = ({ active = false, className }: AgentGlyphFieldProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef(false)

  const onPointerEnter = () => {
    hoveredRef.current = true
  }

  const onPointerLeave = () => {
    hoveredRef.current = false
  }

  useMountEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const alwaysShowPhrase = window.matchMedia("(hover: none)").matches
    hoveredRef.current = alwaysShowPhrase

    let cells: GlyphCell[] = []
    let phraseCells: GlyphCell[] = []
    let width = 0
    let height = 0
    let fontSize = 16
    let fontFamily = "ui-monospace, monospace"
    let color = ""
    let phraseColor = ""
    let phraseStartIndex = 0
    let phraseProgress = alwaysShowPhrase ? 1 : 0
    let phraseStartedAt = 0
    let phraseElapsed = alwaysShowPhrase ? Number.POSITIVE_INFINITY : 0
    let wasActive = alwaysShowPhrase
    let lastMutation = 0
    let animationFrame = 0

    const seedCells = () => {
      const preferredHorizontalStep = fontSize * HORIZONTAL_STEP
      const verticalStep = fontSize * VERTICAL_STEP
      const padding = fontSize * FIELD_PADDING
      const availableWidth = width - padding * 2
      const baseColumns = Math.max(1, Math.floor(availableWidth / preferredHorizontalStep))
      const columns = baseColumns + EDGE_COLUMN_COUNT * 2
      const horizontalStep = availableWidth / columns
      const rows = Math.max(1, Math.floor((height - padding * 2) / verticalStep))
      const now = performance.now()
      const nextCells: GlyphCell[] = []

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          if (Math.random() < EMPTY_CELL_CHANCE) continue
          const alpha = randomBetween(MIN_ALPHA, MAX_ALPHA)
          nextCells.push({
            x: padding + horizontalStep * (column + 0.5),
            y: padding + verticalStep * (row + 0.5),
            glyph: randomGlyph(),
            alpha,
            targetAlpha: alpha,
            nextChangeAt: now + randomBetween(MIN_CHANGE_MS, MAX_CHANGE_MS),
          })
        }
      }

      cells = nextCells

      const phraseY = height - fontSize * PHRASE_BASELINE_OFFSET
      phraseStartIndex = Math.floor((columns - PHRASE.length) / 2)
      phraseCells = Array.from({ length: columns }, (_, index) => {
        const alpha = randomBetween(MIN_ALPHA, MAX_ALPHA)
        return {
          x: padding + horizontalStep * (index + 0.5),
          y: phraseY,
          glyph: randomGlyph(),
          alpha,
          targetAlpha: alpha,
          nextChangeAt: now + randomBetween(MIN_CHANGE_MS, MAX_CHANGE_MS),
        }
      })
    }

    const resize = () => {
      const bounds = root.getBoundingClientRect()
      const devicePixelRatio = window.devicePixelRatio || 1
      width = bounds.width
      height = bounds.height
      canvas.width = Math.max(1, Math.round(width * devicePixelRatio))
      canvas.height = Math.max(1, Math.round(height * devicePixelRatio))
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

      const canvasStyles = getComputedStyle(canvas)
      fontSize = Number.parseFloat(canvasStyles.fontSize) || 16
      fontFamily = canvasStyles.fontFamily
      color = canvasStyles.color
      phraseColor = getComputedStyle(root).getPropertyValue("--color-foreground-soft").trim()
      context.font = `${fontSize}px ${fontFamily}`
      seedCells()
    }

    const mutateCells = (now: number) => {
      for (const cellSet of [cells, phraseCells]) {
        for (const cell of cellSet) {
          if (now < cell.nextChangeAt) continue
          if (Math.random() < GLYPH_CHANGE_CHANCE) cell.glyph = randomGlyph()
          cell.targetAlpha =
            Math.random() < BLINK_OFF_CHANCE ? 0 : randomBetween(MIN_ALPHA, MAX_ALPHA)
          cell.nextChangeAt = now + randomBetween(MIN_CHANGE_MS, MAX_CHANGE_MS)
        }
      }
    }

    const frame = (now: number) => {
      animationFrame = requestAnimationFrame(frame)
      if (document.hidden) return

      const isActive = hoveredRef.current || root.dataset.active === "true"
      if (isActive && !wasActive) {
        phraseStartedAt = now
        phraseElapsed = 0
      }
      if (isActive) {
        phraseElapsed = alwaysShowPhrase ? Number.POSITIVE_INFINITY : now - phraseStartedAt
      }
      wasActive = isActive

      const targetPhraseProgress = isActive ? 1 : 0
      phraseProgress = reduceMotion
        ? targetPhraseProgress
        : phraseProgress + (targetPhraseProgress - phraseProgress) * PHRASE_EASING

      if (!reduceMotion && now - lastMutation >= MUTATION_INTERVAL_MS) {
        mutateCells(now)
        lastMutation = now
      }

      context.clearRect(0, 0, width, height)
      context.fillStyle = color
      context.font = `${fontSize}px ${fontFamily}`
      context.textAlign = "center"
      context.textBaseline = "middle"

      for (const cell of cells) {
        if (!reduceMotion) {
          cell.alpha += (cell.targetAlpha - cell.alpha) * GLYPH_EASING
        }
        context.globalAlpha = cell.alpha
        context.fillText(cell.glyph, cell.x, cell.y)
      }

      drawPhraseRow({
        context,
        cells: phraseCells,
        phraseStartIndex,
        idleColor: color,
        phraseColor: phraseColor || color,
        progress: phraseProgress,
        elapsed: phraseElapsed,
        now,
        reduceMotion,
      })
      context.globalAlpha = 1
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    const themeObserver = new MutationObserver(resize)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    resize()
    animationFrame = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
    }
  })

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated agent glyph field: or let your agent do"
      data-active={active}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn("relative overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 block size-full font-mono text-base text-foreground-muted"
      />
    </div>
  )
}
