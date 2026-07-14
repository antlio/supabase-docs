import { TabsIndicator, TabsList, TabsPanel, TabsRoot, TabsTab } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { HatchedInlineCode } from "./hatched-inline-code"
import { ReferenceCodeBlock } from "./reference-code-block"

type InstallationTabsProps = {
  className?: string
}

type CodeTabOption = {
  value: string
  label: string
  language: "json" | "shell" | "text"
  code: string
  numbered?: boolean
}

type CodeTabGroupProps = {
  options: readonly CodeTabOption[]
  defaultValue: string
  className?: string
}

const AGENT_OPTIONS = [
  {
    value: "prompt",
    label: "Prompt",
    language: "text",
    code: "Set up Supabase for me.\nFetch https://supabase.com/.well-known/agent-skills/get-started/SKILL.md and follow it.",
  },
  {
    value: "mcp",
    label: "Supabase MCP",
    language: "json",
    code: '{\n  "mcpServers": {\n    "supabase": {\n      "type": "http",\n      "url": "https://mcp.supabase.com/mcp"\n    }\n  }\n}',
  },
  {
    value: "claude",
    label: "Claude",
    language: "shell",
    code: "claude mcp add --transport http supabase https://mcp.supabase.com/mcp",
  },
  {
    value: "cursor",
    label: "Cursor",
    language: "text",
    code: "Add https://mcp.supabase.com/mcp as a remote MCP server named supabase, then set up @supabase/server.",
  },
  {
    value: "codex",
    label: "Codex",
    language: "shell",
    code: "codex mcp add supabase --url https://mcp.supabase.com/mcp",
  },
] as const

const PACKAGE_MANAGER_OPTIONS = [
  {
    value: "npm",
    label: "npm",
    language: "shell",
    code: "npm install @supabase/server",
    numbered: false,
  },
  {
    value: "yarn",
    label: "yarn",
    language: "shell",
    code: "yarn add @supabase/server",
    numbered: false,
  },
  {
    value: "pnpm",
    label: "pnpm",
    language: "shell",
    code: "pnpm add @supabase/server",
    numbered: false,
  },
] as const

const JSR_OPTIONS = [
  {
    value: "deno",
    label: "Deno",
    language: "shell",
    code: "deno add jsr:@supabase/server",
    numbered: false,
  },
  {
    value: "bun",
    label: "Bun",
    language: "shell",
    code: "bunx jsr add @supabase/server",
    numbered: false,
  },
] as const

const CodeTabGroup = ({ options, defaultValue, className }: CodeTabGroupProps) => (
  <TabsRoot
    defaultValue={defaultValue}
    className={cn("overflow-hidden rounded-xs bg-code-shell font-sans", className)}
  >
    <div className="overflow-hidden border-b border-code-divider-soft">
      <TabsList className="relative h-[41px] border-b border-code-divider-strong px-1.5">
        {options.map((option) => (
          <TabsTab
            key={option.value}
            value={option.value}
            className={cn(
              "h-[41px] px-2 text-sm font-normal leading-5 text-foreground-subtle",
              "transition-colors duration-150 hover:text-foreground-soft data-[active]:text-brand-foreground",
            )}
          >
            {option.label}
          </TabsTab>
        ))}
        <TabsIndicator
          renderBeforeHydration
          className="bottom-0 left-0 h-px [transform:translateX(var(--active-tab-left))] [width:var(--active-tab-width)] transition-[transform,width] duration-200 ease-[cubic-bezier(0.77,0,0.175,1)] after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-accent after:to-transparent motion-reduce:transition-none"
        />
      </TabsList>
    </div>
    {options.map((option) => (
      <TabsPanel key={option.value} value={option.value} className="p-1">
        <ReferenceCodeBlock
          code={option.code}
          language={option.language}
          numbered={option.numbered}
        />
      </TabsPanel>
    ))}
  </TabsRoot>
)

const ModeTab = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <TabsTab
    value={value}
    className={cn(
      "group flex h-8 items-center gap-2 rounded-xs bg-surface-raised px-3 text-[13px] font-medium text-foreground-subtle",
      "shadow-raised transition-colors duration-150 hover:text-foreground-soft",
      "data-[active]:text-brand-foreground",
    )}
  >
    <span className="size-1.5 bg-foreground-muted group-data-[active]:bg-accent" />
    {children}
  </TabsTab>
)

export const InstallationTabs = ({ className }: InstallationTabsProps) => (
  <TabsRoot defaultValue="agent" className={className}>
    <TabsList className="gap-6 py-1">
      <ModeTab value="agent">Agent Setup</ModeTab>
      <ModeTab value="package">Install as a package</ModeTab>
      <ModeTab value="jsr">Use via JSR (Deno / Bun)</ModeTab>
    </TabsList>

    <TabsPanel value="agent" className="pt-8">
      <p className="text-[15px] leading-7 text-foreground-soft">
        Install <HatchedInlineCode>@supabase/server</HatchedInlineCode> via your agent.
      </p>
      <CodeTabGroup options={AGENT_OPTIONS} defaultValue="prompt" className="mt-8" />
    </TabsPanel>

    <TabsPanel value="package" className="pt-8">
      <p className="text-[15px] leading-7 text-foreground-soft">
        Install the package with your preferred package manager.
      </p>
      <CodeTabGroup options={PACKAGE_MANAGER_OPTIONS} defaultValue="npm" className="mt-8" />
    </TabsPanel>

    <TabsPanel value="jsr" className="pt-8">
      <p className="text-[15px] leading-7 text-foreground-soft">
        Add the package directly from JSR in Deno or Bun.
      </p>
      <CodeTabGroup options={JSR_OPTIONS} defaultValue="deno" className="mt-8" />
    </TabsPanel>
  </TabsRoot>
)
