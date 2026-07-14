"use client"

import { useRef, useState } from "react"
import { SubmitArrow } from "@/components/icons/submit-arrow"
import { SupabaseMark } from "@/components/icons/supabase-mark"
import { Input } from "@/components/ui/input"
import {
  ScrollAreaContent,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "@/components/ui/scroll-area"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import { ScrollAccentAnchors } from "./scroll-accent"
import { SectionLabel } from "./section-label"

type SuggestionButtonProps = {
  suggestion: Suggestion
  onSelect: (suggestion: Suggestion) => void
}

type AgentAnswerProps = {
  answer: string
  isVisible: boolean
  className?: string
}

type UserPromptProps = {
  prompt: string
  isVisible: boolean
  className?: string
}

type AgentLoadingProps = {
  isVisible: boolean
  className?: string
}

type TerminalCursorMirrorProps = {
  value: string
  className?: string
}

type TerminalCursorProps = {
  className?: string
}

type CornerDotProps = {
  corner: "top-left" | "top-right" | "bottom-right" | "bottom-left"
  className?: string
}

type SupabaseLineMarkProps = {
  className?: string
}

type AskSectionProps = {
  className?: string
}

type Suggestion = (typeof SUGGESTIONS)[number]

type ConversationPhase = "settling" | "user" | "loading" | "answered"

type ConversationTurn = {
  id: number
  prompt: string
  answer: string
  phase: ConversationPhase
}

const SUGGESTIONS = [
  {
    question: "How do I set up authentication?",
    answer:
      "Initialize the Supabase client, choose an authentication method, then protect your data with Row Level Security policies tied to the signed-in user.",
  },
  {
    question: "How do I query my database from the client?",
    answer:
      "Use the client’s from('table').select() API, add filters such as eq(), and handle the returned data and error. Row Level Security keeps each request scoped correctly.",
  },
  {
    question: "How do I write an Edge Function?",
    answer:
      "Create a function with the Supabase CLI, add your Deno handler, test it locally with functions serve, then deploy it with functions deploy.",
  },
  {
    question: "How do I run Supabase locally?",
    answer:
      "Install the Supabase CLI and run supabase init followed by supabase start. The local stack includes Postgres, Auth, Storage, Studio, and development API keys.",
  },
] as const

const DEFAULT_ANSWER =
  "I can help with that. Start with the relevant Supabase guide, confirm your project setup, and work through the smallest testable implementation before adding production policies and error handling."

const CONVERSATION_TIMINGS = {
  user: 140,
  loading: 380,
  answer: 980,
} as const

const REDUCED_MOTION_ANSWER_DELAY = 220

const FOLLOW_UP_ANSWER_DELAY = CONVERSATION_TIMINGS.answer - CONVERSATION_TIMINGS.loading

const ASK_ACCENT_SENTINEL_POSITIONS = [40] as const

const SUPABASE_LINE_MARK = [
  [0, 34, 5],
  [4, 31, 8],
  [8, 28, 11],
  [12, 25, 14],
  [16, 22, 17],
  [20, 19, 20],
  [24, 16, 23],
  [28, 12, 27],
  [32, 9, 60],
  [36, 6, 65],
  [40, 2, 70],
  [44, 2, 68],
  [48, 5, 62],
  [52, 35, 29],
  [56, 35, 26],
  [60, 35, 23],
  [64, 35, 20],
  [68, 35, 17],
  [72, 35, 14],
  [76, 35, 10],
  [78, 36, 7],
] as const

const SuggestionButton = ({ suggestion, onSelect }: SuggestionButtonProps) => {
  const onClick = () => onSelect(suggestion)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex min-h-11 items-center overflow-clip rounded-xs px-1.5 text-left sm:h-7 sm:min-h-0",
        "font-mono text-xs leading-[19.2px] text-foreground-mono",
        "transition-colors duration-150 ease-out hover:text-foreground-subtle",
        "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-accent",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-full opacity-20",
          "[background-image:url(/art/dot-grid.png)] [background-repeat:repeat] [background-size:4px_4px]",
        )}
      />
      <span className="relative py-1 sm:py-0">{suggestion.question}</span>
    </button>
  )
}

const AgentAnswer = ({ answer, isVisible, className }: AgentAnswerProps) => (
  <p
    aria-hidden={!isVisible}
    data-open={isVisible}
    className={cn(
      "t-panel-slide px-2 py-1 text-pretty text-sm leading-[1.6] text-foreground-mono",
      className,
    )}
  >
    {answer}
  </p>
)

const UserPrompt = ({ prompt, isVisible, className }: UserPromptProps) => (
  <div
    aria-hidden={!isVisible}
    data-open={isVisible}
    className={cn("t-panel-slide flex justify-end", className)}
  >
    <p className="max-w-[82%] rounded-sm bg-surface-raised px-3 py-2 text-pretty text-sm leading-[1.6] text-foreground shadow-raised">
      {prompt}
    </p>
  </div>
)

const AgentLoading = ({ isVisible, className }: AgentLoadingProps) => (
  <div
    aria-hidden={!isVisible}
    data-open={isVisible}
    className={cn("t-panel-slide flex items-center gap-2 px-2 py-1 text-accent", className)}
  >
    <SupabaseMark className="ask-loader-mark size-6" />
    <span className="sr-only">Supabase is preparing an answer</span>
  </div>
)

const CornerDot = ({ corner, className }: CornerDotProps) => (
  <span
    aria-hidden
    className={cn("absolute flex size-3 items-center justify-center bg-background", className)}
  >
    <span
      data-scroll-accent-existing-dot
      data-scroll-accent-corner={corner}
      className="size-1 bg-dot-soft transition-colors duration-150 ease-out data-[active]:bg-accent"
    />
  </span>
)

const SupabaseLineMark = ({ className }: SupabaseLineMarkProps) => (
  <span aria-hidden className={cn("relative block h-20 w-[74px]", className)}>
    {SUPABASE_LINE_MARK.map(([top, left, width]) => (
      <span
        key={top}
        data-scroll-accent-existing-line
        className="absolute h-0.5 bg-foreground-soft opacity-30 transition-colors duration-75 ease-out data-[active]:bg-accent data-[active]:opacity-100"
        style={{ top, left, width }}
      />
    ))}
  </span>
)

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
      "pointer-events-none absolute inset-y-0 left-0 right-14 z-10 flex items-center overflow-hidden",
      className,
    )}
  >
    {value ? (
      <span className="invisible shrink-0 whitespace-pre text-base leading-6">{value}</span>
    ) : null}
    <TerminalCursor className={value ? "ml-0.5" : undefined} />
  </span>
)

export const AskSection = ({ className }: AskSectionProps) => {
  const [query, setQuery] = useState("")
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const conversationViewportRef = useRef<HTMLDivElement>(null)
  const nextTurnIdRef = useRef(0)
  const focusFrameRef = useRef<number | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const sequenceTimersRef = useRef<number[]>([])

  useMountEffect(() => () => {
    sequenceTimersRef.current.forEach((timer) => window.clearTimeout(timer))
    if (focusFrameRef.current !== null) window.cancelAnimationFrame(focusFrameRef.current)
    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current)
  })

  const isSubmitDisabled = query.trim().length === 0
  const hasConversation = conversationTurns.length > 0
  const isConversationBusy = conversationTurns.some((turn) => turn.phase !== "answered")
  const isFirstTurnSettling =
    conversationTurns.length === 1 && conversationTurns[0]?.phase === "settling"
  const latestTurn = conversationTurns.at(-1)
  const liveAnnouncement =
    latestTurn?.phase === "loading"
      ? "Supabase is preparing an answer"
      : latestTurn?.phase === "answered"
        ? latestTurn.answer
        : ""

  const scheduleSequenceStep = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      sequenceTimersRef.current = sequenceTimersRef.current.filter(
        (scheduledTimer) => scheduledTimer !== timer,
      )
      callback()
    }, delay)

    sequenceTimersRef.current.push(timer)
  }

  const updateTurn = (turnId: number, phase: ConversationPhase) => {
    setConversationTurns((currentTurns) =>
      currentTurns.map((turn) => (turn.id === turnId ? { ...turn, phase } : turn)),
    )
  }

  const refocusInput = () => {
    if (focusFrameRef.current !== null) window.cancelAnimationFrame(focusFrameRef.current)

    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = null
      inputRef.current?.focus({ preventScroll: true })
    })
  }

  const scrollTurnToTop = (turnId: number) => {
    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current)

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null
      const viewport = conversationViewportRef.current
      const turn = viewport?.querySelector<HTMLElement>(`[data-conversation-turn="${turnId}"]`)
      if (!viewport || !turn) return

      const top = turn.getBoundingClientRect().top - viewport.getBoundingClientRect().top
      const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      viewport.scrollTo({
        top: viewport.scrollTop + top,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      })
    })
  }

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const onSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.question)
    inputRef.current?.focus()
  }

  const onAskFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return

    const suggestion = SUGGESTIONS.find(
      (item) => item.question.toLocaleLowerCase() === normalizedQuery,
    )

    const nextAnswer = suggestion?.answer ?? DEFAULT_ANSWER
    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isFollowUp = conversationTurns.length > 0
    const turnId = nextTurnIdRef.current + 1
    nextTurnIdRef.current = turnId

    setConversationTurns((currentTurns) => [
      ...currentTurns,
      {
        id: turnId,
        prompt: query.trim(),
        answer: nextAnswer,
        phase: shouldReduceMotion || isFollowUp ? "loading" : "settling",
      },
    ])
    setQuery("")
    scrollTurnToTop(turnId)
    refocusInput()

    if (shouldReduceMotion) {
      scheduleSequenceStep(() => {
        updateTurn(turnId, "answered")
      }, REDUCED_MOTION_ANSWER_DELAY)
      return
    }

    if (isFollowUp) {
      scheduleSequenceStep(() => {
        updateTurn(turnId, "answered")
      }, FOLLOW_UP_ANSWER_DELAY)
      return
    }

    scheduleSequenceStep(() => updateTurn(turnId, "user"), CONVERSATION_TIMINGS.user)
    scheduleSequenceStep(() => updateTurn(turnId, "loading"), CONVERSATION_TIMINGS.loading)
    scheduleSequenceStep(() => {
      updateTurn(turnId, "answered")
    }, CONVERSATION_TIMINGS.answer)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <SectionLabel label="what you ask is what you get" />
      <section className="relative flex items-center border-b border-border">
        <div className="relative flex min-w-0 grow basis-[950px] flex-col gap-8 border-t border-border px-4 pb-12 pt-8 sm:border-x sm:px-8 sm:pb-16">
          <CornerDot corner="top-left" className="-left-[6.5px] -top-[6.5px]" />
          <CornerDot corner="top-right" className="-right-[6.5px] -top-[6.5px]" />
          <CornerDot corner="bottom-right" className="-bottom-[6.69px] -right-[6.5px]" />
          <CornerDot corner="bottom-left" className="-bottom-[6.69px] -left-[6.5px]" />
          <ScrollAccentAnchors
            corners={["top-left"]}
            sentinelPositions={ASK_ACCENT_SENTINEL_POSITIONS}
          />
          <div className="mx-auto flex w-full max-w-[447px] flex-col gap-8 [--panel-blur:2px] [--panel-close-dur:160ms] [--panel-open-dur:240ms] [--panel-translate-y:10px]">
            <span role="status" aria-live="polite" className="sr-only">
              {liveAnnouncement}
            </span>
            <div className="flex h-[90px] items-center justify-center">
              <SupabaseLineMark />
            </div>
            {hasConversation ? (
              <ScrollAreaRoot className="h-[min(300px,44dvh)]">
                <ScrollAreaViewport
                  ref={conversationViewportRef}
                  role="log"
                  aria-label="Supabase conversation"
                  aria-busy={isConversationBusy}
                >
                  <ScrollAreaContent className="flex min-h-full flex-col gap-4 pb-4 pr-3">
                    {conversationTurns.map((turn) => {
                      const isUserPromptVisible =
                        turn.phase === "user" ||
                        turn.phase === "loading" ||
                        turn.phase === "answered"

                      return (
                        <div
                          key={turn.id}
                          data-conversation-turn={turn.id}
                          className="flex shrink-0 flex-col gap-4 last:min-h-[calc(min(300px,44dvh)-1rem)]"
                        >
                          <UserPrompt prompt={turn.prompt} isVisible={isUserPromptVisible} />
                          <div className="relative min-h-[142px] overflow-hidden sm:min-h-[112px]">
                            <AgentLoading
                              isVisible={turn.phase === "loading"}
                              className="absolute inset-0"
                            />
                            <AgentAnswer
                              answer={turn.answer}
                              isVisible={turn.phase === "answered"}
                              className="absolute inset-0 max-w-[90%] px-0"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </ScrollAreaContent>
                </ScrollAreaViewport>
                <ScrollAreaScrollbar>
                  <ScrollAreaThumb />
                </ScrollAreaScrollbar>
              </ScrollAreaRoot>
            ) : null}
            <form
              className={cn(
                "group relative flex items-center",
                isFirstTurnSettling && "ask-composer-settle",
              )}
              onSubmit={onAskFormSubmit}
            >
              <TerminalCursorMirror value={query} />
              <Input
                ref={inputRef}
                value={query}
                onChange={onQueryChange}
                placeholder="How do I get started with Supabase?"
                aria-label="Ask Supabase"
                autoComplete="off"
                spellCheck={false}
                className="caret-transparent border-y border-border pl-0 pr-14 text-base placeholder-shown:pl-3 focus-visible:border-border"
              />
              <button
                type="submit"
                aria-label="Submit question"
                disabled={isSubmitDisabled}
                className={cn(
                  "absolute right-2 flex size-10 items-center justify-center rounded-xs bg-surface-raised text-foreground sm:right-3 sm:size-7",
                  "shadow-raised",
                  "transition-[background-color,transform] duration-150 ease-out",
                  "enabled:hover:bg-surface enabled:active:scale-[0.96]",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                )}
              >
                <SubmitArrow />
              </button>
            </form>
            {!hasConversation ? (
              <ul className="flex flex-col gap-2 px-2">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion.question} className="flex">
                    <SuggestionButton suggestion={suggestion} onSelect={onSelectSuggestion} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
