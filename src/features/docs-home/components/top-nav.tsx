"use client"

import Link from "next/link"
import { CopyStateIcon } from "@/components/common/copy-state-icon"
import { ChatGptIcon } from "@/components/icons/chatgpt"
import { ChevronDownIcon } from "@/components/icons/chevron-down"
import { ChevronRightIcon } from "@/components/icons/chevron-right"
import { ClaudeIcon } from "@/components/icons/claude"
import { GitHubIcon } from "@/components/icons/github"
import { JavaScriptIcon } from "@/components/icons/javascript"
import { MarkdownIcon } from "@/components/icons/markdown"
import { ScreenshotIcon } from "@/components/icons/screenshot"
import { SupabaseWordmark } from "@/components/icons/supabase-wordmark"
import { Button } from "@/components/ui/button"
import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import {
  getServerReferenceMarkdownUrl,
  type ServerReferenceSection,
  type ServerReferenceSectionState,
  useServerReferenceSection,
} from "@/features/server-reference/server-reference-active-section"
import { dispatchAgentRevealChange } from "./agent-reveal-event"

type TopNavProps = {
  className?: string
  variant?: "home" | "server-reference"
}

const DOCS_MENU_ITEMS = [
  { label: "Guides", href: "https://supabase.com/docs/guides" },
  { label: "Reference", href: "/docs/reference/server" },
  { label: "Status", href: "https://status.supabase.com" },
] as const

const EXTERNAL_COPY_TARGETS = [
  { label: "Open in Claude", href: "https://claude.ai", Icon: ClaudeIcon },
  { label: "Open in ChatGPT", href: "https://chatgpt.com", Icon: ChatGptIcon },
] as const

const onAgentRevealEnter = () => dispatchAgentRevealChange(true)
const onAgentRevealLeave = () => dispatchAgentRevealChange(false)
const preventEmptyLinkNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
}

type DocsMenuItemData = (typeof DOCS_MENU_ITEMS)[number]

const isInternalHref = (href: string) => href.startsWith("/")

const DocsMenuItem = ({ item }: { item: DocsMenuItemData }) => (
  <MenuItem render={isInternalHref(item.href) ? <Link href={item.href} /> : <a href={item.href} />}>
    {item.label}
  </MenuItem>
)

const DocsInlineMenuLink = ({ item }: { item: DocsMenuItemData }) => {
  const className = cn(
    "flex min-h-10 items-center rounded-xs pl-6.5 pr-2 text-[13px] font-medium text-foreground-soft outline-none",
    "transition-colors duration-150 ease-out hover:bg-surface-raised/50 hover:text-foreground",
    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
  )

  return isInternalHref(item.href) ? (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  ) : (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  )
}

const DocsPopoverMenu = () => (
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
            <DocsMenuItem key={item.label} item={item} />
          ))}
        </MenuPopup>
      </MenuPositioner>
    </MenuPortal>
  </MenuRoot>
)

const DocsInlineMenu = () => (
  <CollapsibleRoot className="group/docs-menu relative -mr-px after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-16 after:w-px after:bg-border">
    <div className="flex h-16 items-center gap-1.5 border-b border-dashed border-border px-3.5 group-data-[open]/docs-menu:border-transparent group-has-[[data-ending-style]]/docs-menu:border-transparent">
      <Link
        href="/docs"
        aria-label="Supabase Docs"
        className={cn(
          "flex min-h-11 items-center rounded-xs outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      >
        <SupabaseWordmark className="h-[18.66px] w-24" />
      </Link>
      <CollapsibleTrigger
        className={cn(
          "h-11 w-auto gap-1.5 py-0 pb-0.5 text-[13px] font-medium leading-[1.1] text-brand-foreground",
          "hover:text-brand-foreground",
        )}
        indicator={
          <ChevronDownIcon className="size-[15px] text-foreground-muted transition-transform duration-75 ease-out group-data-[panel-open]:rotate-180 group-data-[panel-open]:duration-150" />
        }
      >
        Docs
      </CollapsibleTrigger>
    </div>
    <CollapsiblePanel className="box-content border-b border-dashed border-border bg-background">
      <nav aria-label="Supabase sections" className="flex flex-col px-3.5 py-2">
        {DOCS_MENU_ITEMS.map((item) => (
          <DocsInlineMenuLink key={item.label} item={item} />
        ))}
      </nav>
    </CollapsiblePanel>
  </CollapsibleRoot>
)

const CopyMarkdownSplitButton = ({ markdownUrl }: { markdownUrl: string }) => {
  const { copied, copy } = useCopyToClipboard()

  const onCopy = async () => {
    await copy(markdownUrl)
  }
  return (
    <div
      data-markdown-url={markdownUrl}
      onPointerEnter={onAgentRevealEnter}
      onPointerLeave={onAgentRevealLeave}
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
            <MenuPopup className="min-w-56">
              <MenuItem className="h-10" render={<a href={markdownUrl} />}>
                <span className="flex size-4 shrink-0 items-center justify-center text-foreground-muted">
                  <MarkdownIcon />
                </span>
                <span className="min-w-0 flex-1">View as Markdown</span>
              </MenuItem>
              <MenuItem
                className="h-10"
                render={<a href="" onClick={preventEmptyLinkNavigation} />}
                aria-label="Copy Page Screenshot (coming soon)"
              >
                <span className="flex size-4 shrink-0 items-center justify-center text-foreground-muted">
                  <ScreenshotIcon />
                </span>
                <span className="min-w-0 flex-1">Copy Page Screenshot</span>
              </MenuItem>
              {EXTERNAL_COPY_TARGETS.map(({ label, href, Icon }) => (
                <MenuItem
                  className="h-10"
                  key={label}
                  render={<a href={href} target="_blank" rel="noreferrer noopener" />}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center text-foreground-muted">
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">{label}</span>
                  <ChevronRightIcon className="!size-[15px] text-foreground-muted" />
                </MenuItem>
              ))}
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>
    </div>
  )
}

const ServerReferenceSectionTitle = ({
  state: { active, previous, direction, revision },
}: {
  state: ServerReferenceSectionState
}) => {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2">
        <li className="text-[13px] font-medium text-foreground-muted">Reference</li>
        <li aria-hidden className="size-1 shrink-0 bg-foreground-muted" />
        <li className="flex shrink-0 items-center gap-2">
          <JavaScriptIcon size="sm" className="shrink-0 text-foreground-muted" />
          <span className="text-[13px] font-medium text-brand-foreground">Server SDK</span>
        </li>
        <li aria-hidden className="size-1 shrink-0 bg-foreground-muted" />
        <li className="server-reference-title-reel relative h-[18px] min-w-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_28%,black_72%,transparent)]">
          {previous && (
            <span
              key={`${previous.id}-${revision}`}
              aria-hidden
              data-direction={direction}
              data-roll-role="previous"
              className="server-reference-roll-title pointer-events-none absolute inset-x-0 top-0 block whitespace-nowrap text-[13px] font-medium leading-[18px] text-brand-foreground"
            >
              {previous.title}
            </span>
          )}
          <span
            key={active.id}
            data-direction={direction}
            data-reference-current-title
            data-roll-role="current"
            className="server-reference-roll-title relative block whitespace-nowrap text-[13px] font-medium leading-[18px] text-brand-foreground"
          >
            {active.title}
          </span>
        </li>
      </ol>
    </nav>
  )
}

const ServerReferenceActions = ({ section }: { section: ServerReferenceSection }) => (
  <div className="flex shrink-0 items-center gap-2">
    <a
      href={section.sourceUrl}
      aria-hidden={!section.sourceUrl}
      tabIndex={section.sourceUrl ? undefined : -1}
      className={cn(
        "flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-xs px-2 text-[13px] font-medium leading-[1.1] outline-none sm:h-7 sm:min-w-0",
        "transition-[background-color,color,opacity,transform,filter] duration-200 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        section.sourceUrl
          ? "text-foreground-muted hover:bg-foreground/[0.04] hover:text-foreground-soft"
          : "pointer-events-none translate-y-1 opacity-0 blur-[1px]",
      )}
    >
      <GitHubIcon className="size-3.5" />
      <span className="hidden sm:inline">Source</span>
    </a>
    <CopyMarkdownSplitButton markdownUrl={getServerReferenceMarkdownUrl(section)} />
  </div>
)

const ServerReferenceMobileActions = () => {
  const { active } = useServerReferenceSection()
  return <ServerReferenceActions section={active} />
}

const ServerReferenceStickyCenter = () => {
  const referenceSection = useServerReferenceSection()

  return (
    <div className="pointer-events-auto flex min-w-0 flex-1 basis-[952px] items-center justify-between gap-4 border-x border-b border-dashed border-border bg-background px-6">
      <ServerReferenceSectionTitle state={referenceSection} />
      <ServerReferenceActions section={referenceSection.active} />
    </div>
  )
}

export const TopNav = ({ className, variant = "home" }: TopNavProps) => {
  const isReference = variant === "server-reference"

  return (
    <>
      <header className={cn("relative z-40 flex h-16 items-stretch bg-background", className)}>
        <div aria-hidden className="hidden w-70 shrink-0 xl:block" />
        <div className="flex min-w-0 flex-1 basis-[952px] items-center justify-between gap-3 border-b border-border px-4 sm:px-6 xl:border-x xl:border-b-0">
          <div className="flex min-w-0 items-center gap-1.5 xl:hidden">
            <Link
              href="/docs"
              aria-label="Supabase Docs"
              className="flex min-h-11 shrink-0 items-center rounded-xs outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <SupabaseWordmark className="h-[18.66px] w-24" />
            </Link>
            <DocsPopoverMenu />
          </div>
          <div aria-hidden className="hidden h-full min-w-0 w-[512px] xl:block" />
          <div className={cn("flex items-center gap-2", isReference && "xl:hidden")}>
            <ThemeToggle className="size-11 sm:size-7 xl:hidden" />
            {isReference ? (
              <ServerReferenceMobileActions />
            ) : (
              <CopyMarkdownSplitButton markdownUrl="https://supabase.com/docs.md" />
            )}
          </div>
        </div>
        <div aria-hidden className="hidden w-70 shrink-0 xl:block" />
      </header>
      <div className="pointer-events-none sticky top-0 z-50 -mt-16 hidden h-16 items-stretch xl:flex">
        <div className="pointer-events-auto w-70 shrink-0 self-start bg-background">
          <DocsInlineMenu />
        </div>
        {isReference ? (
          <ServerReferenceStickyCenter />
        ) : (
          <div
            aria-hidden
            className="min-w-0 flex-1 basis-[952px] border-b border-dashed border-border"
          />
        )}
        <div className="pointer-events-auto flex w-70 shrink-0 items-center justify-end gap-3 border-b border-dashed border-border bg-background px-4">
          {isReference ? (
            <>
              <Button variant="surface" render={<a href="https://supabase.com/dashboard" />}>
                Dashboard
              </Button>
              <ThemeToggle />
              <a
                href="https://supabase.com/dashboard/account/me"
                aria-label="Open account settings"
                className="flex size-7 items-center justify-center rounded-xs bg-surface-raised text-xs font-medium text-brand-foreground shadow-raised outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                A
              </a>
            </>
          ) : (
            <>
              <Button
                variant="surface"
                render={<a href="https://supabase.com/dashboard/sign-up" />}
              >
                Sign up
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </>
  )
}
