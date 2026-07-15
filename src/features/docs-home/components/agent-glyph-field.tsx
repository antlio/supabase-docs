"use client"

import { useRef } from "react"
import { AGENT_PHRASE, getAgentPhraseLayout } from "../agent-glyph-layout"
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

type PhraseGlyphCell = GlyphCell & {
  phraseIndex: number | null
}

type AgentGlyphFieldProps = {
  active?: boolean
  className?: string
}

type DrawPhraseCellsOptions = {
  context: CanvasRenderingContext2D
  cells: PhraseGlyphCell[]
  idleColor: string
  phraseColor: string
  characterProgresses: number[]
  now: number
  reduceMotion: boolean
}

const GLYPHS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*+-_=/?!<>[]{}:;~"

const HORIZONTAL_STEP = 1.45
const VERTICAL_STEP = 1.5
const FIELD_PADDING = 0.65
const EMPTY_CELL_CHANCE = 0.14
const GLYPH_CHANGE_CHANCE = 0.56
const BLINK_OFF_CHANCE = 0.22
const MIN_ALPHA = 0.14
const MAX_ALPHA = 0.48
const GLYPH_EASING = 0.14
const PHRASE_EASING = 0.16
const PHRASE_EXIT_EASING = 0.26
const MUTATION_INTERVAL_MS = 80
const MIN_CHANGE_MS = 180
const MAX_CHANGE_MS = 1400
const CHARACTER_STAGGER_MS = 36
const CHARACTER_EXIT_STAGGER_MS = 14
const GLITCH_FRAME_MS = 45
const GLITCH_SEED_OFFSET = 7
const MIN_VISIBLE_PROGRESS = 0.01
const IDLE_GLYPH_PROGRESS = 0.14
const SETTLED_PHRASE_PROGRESS = 0.65
const EDGE_COLUMN_COUNT = 1

const randomBetween = (minimum: number, maximum: number): number =>
  minimum + Math.random() * (maximum - minimum)

const randomGlyph = (): string => GLYPHS.at(Math.floor(Math.random() * GLYPHS.length)) ?? "0"

const createCharacterExitDelays = (): number[] => {
  const visibleCharacterIndices = Array.from(
    { length: AGENT_PHRASE.length },
    (_, index) => index,
  ).filter((index) => AGENT_PHRASE.at(index) !== " ")

  for (let index = visibleCharacterIndices.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentCharacterIndex = visibleCharacterIndices.at(index)
    const nextCharacterIndex = visibleCharacterIndices.at(swapIndex)
    if (currentCharacterIndex === undefined || nextCharacterIndex === undefined) continue
    visibleCharacterIndices[index] = nextCharacterIndex
    visibleCharacterIndices[swapIndex] = currentCharacterIndex
  }

  const delays = Array.from({ length: AGENT_PHRASE.length }, () => 0)
  visibleCharacterIndices.forEach((characterIndex, exitIndex) => {
    delays[characterIndex] = exitIndex * CHARACTER_EXIT_STAGGER_MS
  })
  return delays
}

const drawPhraseCells = ({
  context,
  cells,
  idleColor,
  phraseColor,
  characterProgresses,
  now,
  reduceMotion,
}: DrawPhraseCellsOptions) => {
  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cell = cells.at(cellIndex)
    if (!cell) continue
    if (!reduceMotion) {
      cell.alpha += (cell.targetAlpha - cell.alpha) * GLYPH_EASING
    }

    const phraseIndex = cell.phraseIndex
    if (phraseIndex === null) {
      context.fillStyle = idleColor
      context.globalAlpha = cell.alpha
      context.fillText(cell.glyph, cell.x, cell.y)
      continue
    }

    const character = AGENT_PHRASE.at(phraseIndex)
    if (character === undefined) continue

    const replacementProgress = characterProgresses.at(phraseIndex) ?? 0

    if (replacementProgress <= IDLE_GLYPH_PROGRESS) {
      context.fillStyle = idleColor
      context.globalAlpha = cell.alpha
      context.fillText(cell.glyph, cell.x, cell.y)
      continue
    }

    if (character === " ") continue

    const isSettled = reduceMotion || replacementProgress >= SETTLED_PHRASE_PROGRESS
    const glyph = isSettled
      ? character
      : (GLYPHS.at(
          Math.floor(now / GLITCH_FRAME_MS + phraseIndex * GLITCH_SEED_OFFSET) % GLYPHS.length,
        ) ?? character)

    context.fillStyle = phraseColor
    context.globalAlpha = 1
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
    let phraseCells: PhraseGlyphCell[] = []
    let width = 0
    let height = 0
    let fontSize = 16
    let fontFamily = "ui-monospace, monospace"
    let color = ""
    let phraseColor = ""
    const phraseCharacterProgresses: number[] = Array.from({ length: AGENT_PHRASE.length }, () =>
      alwaysShowPhrase ? 1 : 0,
    )
    let phraseExitDelays = createCharacterExitDelays()
    let phraseStartedAt = 0
    let phraseExitStartedAt = 0
    let phraseElapsed = alwaysShowPhrase ? Number.POSITIVE_INFINITY : 0
    let wasActive = alwaysShowPhrase
    let lastMutation = 0
    let animationFrame = 0

    const seedCells = () => {
      const preferredHorizontalStep = fontSize * HORIZONTAL_STEP
      const preferredVerticalStep = fontSize * VERTICAL_STEP
      const padding = fontSize * FIELD_PADDING
      const availableWidth = width - padding * 2
      const availableHeight = height - padding * 2
      const baseColumns = Math.max(1, Math.floor(availableWidth / preferredHorizontalStep))
      const columns = baseColumns + EDGE_COLUMN_COUNT * 2
      const horizontalStep = availableWidth / columns
      const rows = Math.max(1, Math.floor(availableHeight / preferredVerticalStep))
      const verticalStep = availableHeight / rows
      const now = performance.now()
      const nextCells: GlyphCell[] = []

      // Keep the second random cell underneath produces two anti-aliased glyphs instead
      // of a true character replacement
      const phraseY = padding + verticalStep * (rows - 0.5)
      const phraseLayout = getAgentPhraseLayout(columns)
      const phraseRowStep =
        phraseLayout.rowCount === 1
          ? verticalStep
          : Math.min(
              verticalStep,
              Math.max(fontSize, (phraseY - padding) / (phraseLayout.rowCount - 1)),
            )
      const placementByCell = new Map(
        phraseLayout.placements.map((placement) => [
          `${placement.row}:${placement.column}`,
          placement.phraseIndex,
        ]),
      )
      const phraseCellPositions = phraseLayout.fillRows
        ? Array.from({ length: phraseLayout.rowCount * columns }, (_, index) => ({
            column: index % columns,
            row: Math.floor(index / columns),
          }))
        : phraseLayout.placements.map(({ column, row }) => ({ column, row }))
      const phraseStartRow = Math.max(0, rows - phraseLayout.rowCount)
      const phraseMatrixPositions = new Set(
        phraseCellPositions.map(({ column, row }) => `${phraseStartRow + row}:${column}`),
      )

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          if (phraseMatrixPositions.has(`${row}:${column}`)) continue
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

      phraseCells = phraseCellPositions.map(({ column, row }) => {
        const alpha = randomBetween(MIN_ALPHA, MAX_ALPHA)
        return {
          x: padding + horizontalStep * (column + 0.5),
          y: phraseY - (phraseLayout.rowCount - row - 1) * phraseRowStep,
          glyph: randomGlyph(),
          alpha,
          targetAlpha: alpha,
          nextChangeAt: now + randomBetween(MIN_CHANGE_MS, MAX_CHANGE_MS),
          phraseIndex: placementByCell.get(`${row}:${column}`) ?? null,
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

    let isVisible = false

    const frame = (now: number) => {
      if (!isVisible) {
        animationFrame = 0
        return
      }

      animationFrame = requestAnimationFrame(frame)
      if (document.hidden) return

      const isActive = hoveredRef.current || root.dataset.active === "true"
      if (isActive && !wasActive) {
        phraseStartedAt = now
        phraseElapsed = 0
      }
      if (!isActive && wasActive) {
        phraseExitStartedAt = now
        phraseExitDelays = createCharacterExitDelays()
      }
      if (isActive) {
        phraseElapsed = alwaysShowPhrase ? Number.POSITIVE_INFINITY : now - phraseStartedAt
      }
      wasActive = isActive

      for (let phraseIndex = 0; phraseIndex < AGENT_PHRASE.length; phraseIndex++) {
        const currentProgress = phraseCharacterProgresses.at(phraseIndex) ?? 0
        const hasEntered =
          currentProgress >= MIN_VISIBLE_PROGRESS ||
          phraseElapsed >= phraseIndex * CHARACTER_STAGGER_MS
        const hasExited = now - phraseExitStartedAt >= (phraseExitDelays.at(phraseIndex) ?? 0)
        const targetProgress = isActive ? (hasEntered ? 1 : 0) : hasExited ? 0 : 1
        const easing = isActive ? PHRASE_EASING : PHRASE_EXIT_EASING

        phraseCharacterProgresses[phraseIndex] = reduceMotion
          ? targetProgress
          : currentProgress + (targetProgress - currentProgress) * easing
      }

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

      drawPhraseCells({
        context,
        cells: phraseCells,
        idleColor: color,
        phraseColor: phraseColor || color,
        characterProgresses: phraseCharacterProgresses,
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
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? false

      if (isVisible && animationFrame === 0) {
        lastMutation = performance.now()
        animationFrame = requestAnimationFrame(frame)
      } else if (!isVisible && animationFrame !== 0) {
        cancelAnimationFrame(animationFrame)
        animationFrame = 0
      }
    })
    visibilityObserver.observe(root)
    resize()

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      visibilityObserver.disconnect()
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
