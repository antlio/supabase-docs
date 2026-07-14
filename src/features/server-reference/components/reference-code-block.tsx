import { codeToTokens, createCssVariablesTheme, type BundledLanguage } from "shiki"
import { cn } from "@/lib/utils"
import { CodeCopyButton } from "./code-copy-button"

type ReferenceCodeBlockProps = {
  code: string
  title?: string
  language?: BundledLanguage | "text"
  numbered?: boolean
  className?: string
}

const codeTheme = createCssVariablesTheme({
  name: "supabase-docs",
  variablePrefix: "--shiki-",
})

const HighlightedCode = async ({
  code,
  language,
  numbered,
}: Pick<ReferenceCodeBlockProps, "code" | "language" | "numbered">) => {
  const { tokens } = await codeToTokens(code, {
    lang: language ?? "javascript",
    theme: codeTheme,
  })

  return (
    <div data-code-surface className="relative overflow-x-auto bg-surface-raised">
      <pre className="min-w-max py-4 pr-12 font-mono text-[13px] leading-6 text-(--shiki-foreground)">
        {tokens.map((line, index) => (
          <span key={line[0]?.offset ?? `empty-${index}`} className="relative block min-h-6">
            {numbered && (
              <span
                aria-hidden
                className="absolute left-3.5 top-0 select-none text-foreground-subtle"
              >
                {index + 1}
              </span>
            )}
            <code className={cn("block [font-family:inherit]", numbered ? "pl-9.5" : "pl-4")}>
              {line.length > 0
                ? line.map((token) => (
                    <span key={`${token.offset}-${token.content}`} style={{ color: token.color }}>
                      {token.content}
                    </span>
                  ))
                : " "}
            </code>
          </span>
        ))}
      </pre>
      <CodeCopyButton code={code} className="code-copy-reveal absolute right-4 top-4" />
    </div>
  )
}

export const ReferenceCodeBlock = async ({
  code,
  title,
  language,
  numbered = true,
  className,
}: ReferenceCodeBlockProps) => {
  const codePanel = (
    <div className="overflow-hidden rounded-xs bg-surface-raised shadow-code-panel">
      <HighlightedCode code={code} language={language} numbered={numbered} />
    </div>
  )

  if (!title) {
    return <div className={className}>{codePanel}</div>
  }

  return (
    <div className={cn("overflow-hidden rounded-xs bg-code-shell font-sans", className)}>
      <div className="overflow-hidden border-b border-code-divider-soft">
        <div className="relative flex h-[41px] items-center border-b border-code-divider-strong px-1.5">
          <div className="relative flex h-[41px] items-center px-2 text-sm font-normal leading-5 text-brand-foreground after:absolute after:inset-x-2 after:-bottom-0.25 after:h-px after:bg-linear-to-r after:from-transparent after:via-accent after:to-transparent">
            {title}
          </div>
        </div>
      </div>
      <div className="p-1">{codePanel}</div>
    </div>
  )
}
