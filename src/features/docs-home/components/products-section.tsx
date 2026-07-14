"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { AuthIcon } from "@/components/icons/auth"
import { DatabaseIcon } from "@/components/icons/database"
import { EdgeFunctionsIcon } from "@/components/icons/edge-functions"
import { RealtimeIcon } from "@/components/icons/realtime"
import { StorageIcon } from "@/components/icons/storage"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import { AsciiFireworks } from "./ascii-fireworks"
import { ScrollAccentReset } from "./scroll-accent"
import { SectionLabel } from "./section-label"

type PieceId = keyof typeof PIECES

type ArtworkPiece = {
  kind: "artwork"
  id: string
  plate: string
  height: number
}

type ProductPiece = {
  kind: "product"
  id: string
  title: string
  href: string
  icon: (props: { className?: string }) => React.ReactElement
  description: string
}

type Piece = ArtworkPiece | ProductPiece

type PieceCellProps = {
  piece: Piece
  slot: number
  dimmed: boolean
  lit: boolean
  onDragStart: (slot: number) => void
  onDragEnter: (slot: number) => void
  onDragEnd: () => void
  onDrop: (slot: number) => void
}

type GridLinesProps = {
  className?: string
}

type ProductsSectionProps = {
  className?: string
}

const PIECES = {
  s: { kind: "artwork", id: "s", plate: "/art/plate-s.webp", height: 256 },
  bolt: { kind: "artwork", id: "bolt", plate: "/art/plate-bolt.webp", height: 255 },
  u: { kind: "artwork", id: "u", plate: "/art/plate-u.webp", height: 254 },
  p: { kind: "artwork", id: "p", plate: "/art/plate-p.webp", height: 254 },
  database: {
    kind: "product",
    id: "database",
    title: "Database",
    href: "https://supabase.com/docs/guides/database/overview",
    icon: DatabaseIcon,
    description:
      "Supabase provides a full Postgres database for every project with Realtime functionality, database backups, extensions, and more.",
  },
  auth: {
    kind: "product",
    id: "auth",
    title: "Auth",
    href: "https://supabase.com/docs/guides/auth",
    icon: AuthIcon,
    description:
      "Add and manage email and password, passwordless, OAuth, and mobile logins to your project through a suite of identity providers and APIs.",
  },
  storage: {
    kind: "product",
    id: "storage",
    title: "Storage",
    href: "https://supabase.com/docs/guides/storage",
    icon: StorageIcon,
    description:
      "Store, organize, transform, and serve large files—fully integrated with your Postgres database with Row Level Security access policies.",
  },
  realtime: {
    kind: "product",
    id: "realtime",
    title: "Realtime",
    href: "https://supabase.com/docs/guides/realtime",
    icon: RealtimeIcon,
    description:
      "Listen to database changes, store and sync user states across clients, broadcast data to clients subscribed to a channel, and more.",
  },
  functions: {
    kind: "product",
    id: "functions",
    title: "Edge Functions",
    href: "https://supabase.com/docs/guides/functions",
    icon: EdgeFunctionsIcon,
    description:
      "Globally distributed, server-side functions to execute your code closest to your users for the lowest latency.",
  },
} as const satisfies Record<string, Piece>

const INITIAL_BOARD: readonly PieceId[] = [
  "s",
  "database",
  "auth",
  "storage",
  "realtime",
  "bolt",
  "u",
  "functions",
  "p",
] as const

const HIGHLIGHT_STEP_MS = 220
const HIGHLIGHT_HOLD_MS = 320

const LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

// returns board with the two slots swapped, or the board unchanged when the swap is not active
const swap = (
  board: readonly PieceId[],
  a: number | null,
  b: number | null,
): readonly PieceId[] => {
  if (a === null || b === null || a === b) return board
  const next = board.slice()
  ;[next[a], next[b]] = [next[b], next[a]]
  return next
}

const isSupAligned = (board: readonly PieceId[]): boolean => {
  const at = (id: PieceId) => board.indexOf(id)
  const s = at("s")
  const u = at("u")
  const p = at("p")
  return LINES.some(([a, b, c]) => b === u && ((a === s && c === p) || (a === p && c === s)))
}

const CornerDots = () => (
  <span
    aria-hidden
    className="absolute left-2 top-2 size-5 text-dot transition-colors duration-150 ease-out group-hover:text-dot-hover sm:left-3 sm:top-[calc(50%-96px)] sm:-translate-y-1/2 xl:top-[calc(50%-136px)]"
  >
    <span className="absolute left-0 top-0 size-1 rounded-full bg-current" />
    <span className="absolute left-0 top-4 size-1 rounded-full bg-current" />
    <span className="absolute left-4 top-1 size-1 rounded-full bg-current" />
  </span>
)

const PieceCell = ({
  piece,
  slot,
  dimmed,
  lit,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
}: PieceCellProps) => {
  const onCellDragStart = (event: React.DragEvent) => {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", piece.id)
    onDragStart(slot)
  }
  // preventDefault marks this a valid drop target, dragover repeats so hover tracking stays live
  const onCellDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    onDragEnter(slot)
  }
  const onCellDrop = (event: React.DragEvent) => {
    event.preventDefault()
    onDrop(slot)
  }

  const shared = cn(
    "group relative flex h-40 p-3 sm:h-56 sm:p-6 xl:h-80 xl:p-8",
    "transition-[background-color,opacity] duration-150 ease-out",
    dimmed && "opacity-35",
  )

  // every cell is a drop target, only artwork cells initiate a drag
  if (piece.kind === "product") {
    const Icon = piece.icon

    return (
      <a
        href={piece.href}
        onDragOver={onCellDragOver}
        onDrop={onCellDrop}
        className={cn(
          shared,
          "flex-col justify-between bg-well hover:bg-surface-raised/50",
          "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon className="text-foreground-subtle transition-colors duration-150 ease-out group-hover:text-accent" />
          <h3 className="text-xs font-medium leading-4 text-brand-foreground sm:text-[15px] sm:leading-[22.5px]">
            {piece.title}
          </h3>
        </div>
        <p className="hidden text-[13px] font-medium leading-[18.57px] text-foreground-subtle sm:block">
          {piece.description}
        </p>
      </a>
    )
  }

  return (
    <div
      aria-hidden
      draggable
      onDragStart={onCellDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onCellDragOver}
      onDrop={onCellDrop}
      className={cn(
        shared,
        "cursor-grab items-center justify-center bg-background active:cursor-grabbing",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 bg-brand opacity-0 transition-opacity duration-150 ease-out",
          lit && "opacity-10",
        )}
      />
      <CornerDots />
      <Image
        src={piece.plate}
        alt=""
        width={201}
        height={piece.height}
        draggable={false}
        className="relative h-auto w-[96px] select-none sm:w-[150px] xl:w-[201px]"
      />
    </div>
  )
}

const GridLines = ({ className }: GridLinesProps) => (
  <span aria-hidden className={cn("pointer-events-none absolute inset-0 z-10", className)}>
    <span className="absolute inset-y-0 left-[33.333333%] w-px bg-border" />
    <span className="absolute inset-y-0 left-[66.666667%] w-px bg-border" />
    <span className="absolute inset-y-0 right-0 hidden w-px bg-border sm:block" />
    <span className="absolute inset-x-0 top-0 h-px bg-border" />
    <span className="absolute inset-x-0 top-[33.333333%] h-px bg-border" />
    <span className="absolute inset-x-0 top-[66.666667%] h-px bg-border" />
    <span className="absolute inset-x-0 bottom-0 h-px bg-border" />
  </span>
)

export const ProductsSection = ({ className }: ProductsSectionProps) => {
  // committed layout, slot index (0-8) to the piece sitting there
  const [board, setBoard] = useState<readonly PieceId[]>(INITIAL_BOARD)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)
  // ids that have lit up so far during the win sequence, in s->u->p order
  const [litPieces, setLitPieces] = useState<readonly PieceId[]>([])
  const [celebrating, setCelebrating] = useState(false)
  const dragFromRef = useRef<number | null>(null)
  const winSequenceRunningRef = useRef(false)
  const winTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useMountEffect(() => () => winTimersRef.current.forEach(clearTimeout))

  // live preview, the swap the user is currently hovering, not yet committed
  const preview = swap(board, dragFrom, hoverSlot)
  // the target cell dims while hovered so it reads as a preview, not committed
  const previewTarget = dragFrom !== null && hoverSlot !== dragFrom ? hoverSlot : null

  const onDragStart = (slot: number) => {
    dragFromRef.current = slot
    setDragFrom(slot)
  }

  const onDragEnter = (slot: number) => {
    if (dragFrom !== null) setHoverSlot(slot)
  }

  const onDragEnd = () => {
    dragFromRef.current = null
    setDragFrom(null)
    setHoverSlot(null)
  }

  // release commits the preview, a win spells out s->u->p then launches fireworks
  const onDropOnSlot = (slot: number) => {
    const nextBoard = swap(board, dragFromRef.current, slot)
    const completedWin = !isSupAligned(board) && isSupAligned(nextBoard)
    setBoard(nextBoard)
    dragFromRef.current = null
    setDragFrom(null)
    setHoverSlot(null)
    if (!winSequenceRunningRef.current && completedWin) runWinSequence()
  }

  const runWinSequence = () => {
    winSequenceRunningRef.current = true
    setLitPieces(["s"])
    winTimersRef.current = [
      setTimeout(() => setLitPieces(["s", "u"]), HIGHLIGHT_STEP_MS),
      setTimeout(() => setLitPieces(["s", "u", "p"]), HIGHLIGHT_STEP_MS * 2),
      setTimeout(() => setCelebrating(true), HIGHLIGHT_STEP_MS * 2 + HIGHLIGHT_HOLD_MS),
    ]
  }

  const onCelebrationDone = () => {
    winSequenceRunningRef.current = false
    winTimersRef.current = []
    setCelebrating(false)
    setLitPieces([])
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <SectionLabel label="products" />
      <section className="relative grid grid-cols-3 border-border sm:border-l">
        <ScrollAccentReset />
        {preview.map((pieceId, slot) => (
          <PieceCell
            key={pieceId}
            piece={PIECES[pieceId]}
            slot={slot}
            dimmed={slot === previewTarget}
            lit={litPieces.includes(pieceId)}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDrop={onDropOnSlot}
          />
        ))}
        <GridLines />
      </section>
      {celebrating ? <AsciiFireworks onDone={onCelebrationDone} /> : null}
    </div>
  )
}
