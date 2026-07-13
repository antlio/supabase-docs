"use client"

import { useState } from "react"
import { CheckIcon } from "@/components/icons/check"
import { ChevronDownIcon } from "@/components/icons/chevron-down"
import { CopyIcon } from "@/components/icons/copy"
import { SupabaseWordmark } from "@/components/icons/supabase-wordmark"
import { Button } from "@/components/ui/button"
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"

type TopNavProps = {
  className?: string
}

const MARKDOWN_URL = "https://supabase.com/docs.md"

const DOCS_MENU_ITEMS = [
  { label: "Guides", href: "https://supabase.com/docs/guides" },
  { label: "Reference", href: "https://supabase.com/docs/reference" },
  { label: "Status", href: "https://status.supabase.com" },
] as const

const COPY_MENU_ITEMS = [
  { label: "View as Markdown", href: "https://supabase.com/docs.md" },
  { label: "Open in Claude", href: "https://claude.ai" },
  { label: "Open in ChatGPT", href: "https://chatgpt.com" },
] as const

const CopyStateIcon = ({ copied }: { copied: boolean }) => (
  <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center">
    <CopyIcon
      className={cn(
        "absolute size-3.5 text-foreground-muted transition-[opacity,transform,filter] duration-150 ease-out",
        copied ? "scale-90 opacity-0 blur-[2px]" : "scale-100 opacity-100 blur-0",
      )}
    />
    <CheckIcon
      className={cn(
        "absolute size-3.5 text-brand-foreground transition-[opacity,transform,filter] duration-150 ease-out",
        copied ? "scale-100 opacity-100 blur-0" : "scale-90 opacity-0 blur-[2px]",
      )}
    />
  </span>
)

const DocsMenu = () => (
  <MenuRoot>
    <MenuTrigger
      className={cn(
        "group flex items-center gap-1.5 rounded-xs pb-0.5 outline-none",
        "text-[13px] font-medium leading-[1.1] text-brand-foreground",
        "transition-colors duration-150 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
      )}
    >
      Docs
      <ChevronDownIcon className="size-[15px] text-foreground-muted transition-transform duration-75 ease-out group-data-[popup-open]:rotate-180 group-data-[popup-open]:duration-150" />
    </MenuTrigger>
    <MenuPortal>
      <MenuPositioner align="start">
        <MenuPopup>
          {DOCS_MENU_ITEMS.map((item) => (
            <MenuItem key={item.label} render={<a href={item.href} />}>
              {item.label}
            </MenuItem>
          ))}
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
)

const CopyMarkdownSplitButton = () => {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(MARKDOWN_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-stretch overflow-hidden rounded-xs",
        "outline outline-1 -outline-offset-1 outline-border",
        "[filter:drop-shadow(var(--shadow-outline))]",
      )}
    >
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "flex h-11 items-center gap-1.5 whitespace-nowrap px-3 outline-none select-none sm:h-7 sm:px-2",
          "text-[13px] font-medium leading-[1.1] text-brand-foreground",
          "transition-[background-color,transform] duration-150 ease-out",
          "hover:bg-foreground/[0.03] active:scale-[0.98]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
        )}
      >
        <CopyStateIcon copied={copied} />
        <span className="hidden sm:inline">Copy Markdown URL</span>
      </button>
      <Separator orientation="vertical" />
      <MenuRoot>
        <MenuTrigger
          aria-label="More copy options"
          className={cn(
            "group flex min-w-11 items-center justify-center px-[6.5px] outline-none select-none sm:min-w-0",
            "text-foreground-muted transition-colors duration-150 ease-out",
            "hover:bg-foreground/[0.03]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
          )}
        >
          <ChevronDownIcon className="size-[15px] transition-transform duration-75 ease-out group-data-[popup-open]:rotate-180 group-data-[popup-open]:duration-150" />
        </MenuTrigger>
        <MenuPortal>
          <MenuPositioner align="end">
            <MenuPopup>
              {COPY_MENU_ITEMS.map((item) => (
                <MenuItem key={item.label} render={<a href={item.href} />}>
                  {item.label}
                </MenuItem>
              ))}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </div>
  )
}

export const TopNav = ({ className }: TopNavProps) => (
  <>
    <header className={cn("relative z-40 flex h-16 items-stretch bg-background", className)}>
      <div aria-hidden className="hidden w-70 shrink-0 xl:block" />
      <div className="flex min-w-0 flex-1 basis-[952px] items-center justify-between gap-3 border-b border-border px-4 sm:px-6 xl:justify-end xl:border-x xl:border-b-0">
        <div className="flex min-w-0 items-center gap-1.5 xl:hidden">
          <a
            href="https://supabase.com/docs"
            aria-label="Supabase Docs"
            className="flex min-h-11 shrink-0 items-center rounded-xs outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <SupabaseWordmark className="h-[18.66px] w-24" />
          </a>
          <div className="hidden sm:block">
            <DocsMenu />
          </div>
        </div>
        <div aria-hidden className="hidden h-full min-w-0 w-[512px] xl:block" />
        <div className="flex items-center gap-2">
          <ThemeToggle className="size-11 sm:size-7 xl:hidden" />
          <CopyMarkdownSplitButton />
        </div>
      </div>
      <div aria-hidden className="hidden w-70 shrink-0 xl:block" />
    </header>
    <div className="pointer-events-none sticky top-0 z-50 -mt-16 hidden h-16 items-stretch xl:flex">
      <div className="pointer-events-auto flex w-70 shrink-0 items-center gap-1.5 border-b border-dashed border-border bg-background px-3.5">
        <a
          href="https://supabase.com/docs"
          aria-label="Supabase Docs"
          className={cn(
            "flex items-center rounded-xs outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          <SupabaseWordmark className="h-[18.66px] w-24" />
        </a>
        <DocsMenu />
      </div>
      <div
        aria-hidden
        className="min-w-0 flex-1 basis-[952px] border-b border-dashed border-border"
      />
      <div className="pointer-events-auto flex w-70 shrink-0 items-center justify-end gap-3 border-b border-dashed border-border bg-background px-4">
        <Button variant="surface" render={<a href="https://supabase.com/dashboard/sign-up" />}>
          Sign up
        </Button>
        <ThemeToggle />
      </div>
    </div>
  </>
)
