"use client"

import { useState } from "react"
import { CopyStateIcon } from "@/components/common/copy-state-icon"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import { AgentGlyphField } from "./agent-glyph-field"
import { AGENT_REVEAL_CHANGE_EVENT } from "./agent-reveal-event"
import { AiToolLogoCarousel } from "./ai-tool-logo-carousel"
import { ScrollAccentAnchors } from "./scroll-accent"

type HeroProps = {
  className?: string
}

const AGENT_SETUP_PROMPT =
  "You are helping me build an app with Supabase. Set up the Supabase client, configure environment variables for the project URL and anon key, and scaffold auth, database, and storage helpers following the official Supabase docs at https://supabase.com/docs. Ask me for my project reference and API keys if you don't have them."

export const Hero = ({ className }: HeroProps) => {
  const { copied, copy } = useCopyToClipboard()
  const [isAgentRevealActive, setIsAgentRevealActive] = useState(false)
  const [isExternalAgentRevealActive, setIsExternalAgentRevealActive] = useState(false)

  useMountEffect(() => {
    const onAgentRevealChange = (event: Event) => {
      setIsExternalAgentRevealActive((event as CustomEvent<boolean>).detail)
    }
    window.addEventListener(AGENT_REVEAL_CHANGE_EVENT, onAgentRevealChange)

    return () => window.removeEventListener(AGENT_REVEAL_CHANGE_EVENT, onAgentRevealChange)
  })

  const onAgentRevealStart = () => {
    setIsAgentRevealActive(true)
  }

  const onAgentRevealEnd = () => {
    setIsAgentRevealActive(false)
  }

  const onCopyPrompt = async () => {
    await copy(AGENT_SETUP_PROMPT)
  }

  return (
    <section
      className={cn(
        "relative flex flex-col items-stretch gap-6 border-b border-border px-4 pt-8 sm:border-x sm:px-8 xl:flex-row xl:items-start xl:gap-10 xl:pt-4.5 xl:pb-3 xl:pl-8 xl:pr-4.5",
        className,
      )}
    >
      <ScrollAccentAnchors corners={["top-left"]} sentinelPositions={[50]} />
      <div className="flex flex-col justify-center gap-4 pt-2">
        <h1 className="text-[36px] font-medium leading-10 tracking-[-0.02em] text-foreground sm:text-[44px] sm:leading-[48.4px] xl:w-max">
          Build with Supabase
        </h1>
        <p className="max-w-[412px] text-pretty text-base leading-[1.6] text-foreground-mono">
          Get direct answers grounded in the docs, with relevant guides and examples to help you
          keep building.
        </p>
      </div>
      <AgentGlyphField
        active={isAgentRevealActive || isExternalAgentRevealActive}
        className="h-[220px] min-w-0 w-full grow xl:h-[260px] xl:basis-[448px]"
      />
      <div
        className={cn(
          "-mx-4 flex flex-col gap-2 border-t border-border bg-background px-4 py-4 sm:-mx-8 sm:px-8 sm:py-6",
          "xl:absolute xl:-bottom-px xl:-left-px xl:mx-0 xl:border-r",
        )}
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Button
            size="touch"
            render={<a href="https://supabase.com/docs/guides/getting-started" />}
          >
            Quickstart
          </Button>
          <Button
            size="touch"
            variant="outline"
            onClick={onCopyPrompt}
            onPointerEnter={onAgentRevealStart}
            onPointerLeave={onAgentRevealEnd}
          >
            <CopyStateIcon copied={copied} />
            Copy Prompt Setup
          </Button>
          <Button
            size="touch"
            className="ai-tool-carousel-trigger"
            render={<a href="https://supabase.com/docs/guides/ai-tools" />}
            variant="outline"
            onPointerEnter={onAgentRevealStart}
            onPointerLeave={onAgentRevealEnd}
          >
            <AiToolLogoCarousel />
            All AI Tools
            <ChevronRightIcon className="text-foreground-muted" />
          </Button>
        </div>
      </div>
    </section>
  )
}
