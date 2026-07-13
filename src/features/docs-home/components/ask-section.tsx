"use client"

import { useRef, useState } from "react"
import { SubmitArrow } from "@/components/icons/submit-arrow"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ScrollAccentAnchors } from "./scroll-accent"
import { SectionLabel } from "./section-label"

type SuggestionButtonProps = {
  suggestion: Suggestion
  onSelect: (suggestion: Suggestion) => void
}

type AgentAnswerProps = {
  answer: string
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

const AgentAnswer = ({ answer, className }: AgentAnswerProps) => (
  <p
    role="status"
    aria-live="polite"
    className={cn("px-2 py-1 text-pretty text-sm leading-[1.6] text-foreground-mono", className)}
  >
    {answer}
  </p>
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
      "terminal-caret block h-4 w-[7px] shrink-0 rounded-[1px] bg-foreground-soft opacity-60",
      className,
    )}
  />
)

const TerminalCursorMirror = ({ value, className }: TerminalCursorMirrorProps) => (
  <span
    aria-hidden
    className={cn(
      "pointer-events-none absolute inset-y-0 left-7 right-14 z-10 flex items-center overflow-hidden",
      className,
    )}
  >
    {value ? (
      <span className="invisible shrink-0 whitespace-pre text-base leading-6">{value}</span>
    ) : null}
    <TerminalCursor key={value} className={value ? "ml-0.5" : undefined} />
  </span>
)

export const AskSection = ({ className }: AskSectionProps) => {
  const [query, setQuery] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSubmitDisabled = query.trim().length === 0

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setAnswer(null)
  }

  const onQueryFocus = () => {
    setAnswer(null)
  }

  const onSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.question)
    setAnswer(null)
    inputRef.current?.focus()
  }

  const onAskFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return

    const suggestion = SUGGESTIONS.find(
      (item) => item.question.toLocaleLowerCase() === normalizedQuery,
    )
    setAnswer(suggestion?.answer ?? DEFAULT_ANSWER)
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <SectionLabel label="what you ask is what you get" />
      <section className="relative flex items-center border-b border-border">
        <div className="relative flex min-w-0 grow basis-[950px] flex-col gap-8 border-t border-x border-border px-4 pb-12 pt-8 sm:px-8 sm:pb-16">
          <CornerDot corner="top-left" className="-left-[6.5px] -top-[6.5px]" />
          <CornerDot corner="top-right" className="-right-[6.5px] -top-[6.5px]" />
          <CornerDot corner="bottom-right" className="-bottom-[6.69px] -right-[6.5px]" />
          <CornerDot corner="bottom-left" className="-bottom-[6.69px] -left-[6.5px]" />
          <ScrollAccentAnchors
            corners={["top-left"]}
            sentinelPositions={ASK_ACCENT_SENTINEL_POSITIONS}
          />
          <div className="mx-auto flex w-full max-w-[447px] flex-col gap-8">
            <div className="flex h-[90px] items-center justify-center">
              <SupabaseLineMark />
            </div>
            <form className="relative flex items-center" onSubmit={onAskFormSubmit}>
              <TerminalCursorMirror value={query} />
              <Input
                ref={inputRef}
                value={query}
                onChange={onQueryChange}
                onFocus={onQueryFocus}
                placeholder="How do I get started with Supabase?"
                aria-label="Ask Supabase"
                autoComplete="off"
                spellCheck={false}
                className="caret-transparent border-y border-border pl-7 pr-14 text-base"
              />
              <button
                type="submit"
                aria-label="Submit question"
                disabled={isSubmitDisabled}
                className={cn(
                  "absolute right-2 flex size-10 items-center justify-center rounded-xs bg-surface-raised text-foreground sm:right-3 sm:size-7",
                  "shadow-[var(--shadow-raised)]",
                  "transition-[background-color,transform] duration-150 ease-out",
                  "enabled:hover:bg-surface enabled:active:scale-[0.96]",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
                )}
              >
                <SubmitArrow />
              </button>
            </form>
            {answer ? (
              <AgentAnswer answer={answer} />
            ) : (
              <ul className="flex flex-col gap-2 px-2">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion.question} className="flex">
                    <SuggestionButton suggestion={suggestion} onSelect={onSelectSuggestion} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
