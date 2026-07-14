import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { SLASH_RULE, SlashRule } from "@/components/common/slash-rule"
import { SERVER_REFERENCE_GROUPS, type ServerReferenceItem } from "@/assets/server-reference-data"
import { cn } from "@/lib/utils"
import { getReferenceItemId, toReferenceId } from "../server-reference-ids"
import { HatchedInlineCode } from "./hatched-inline-code"
import { InstallationTabs } from "./installation-tabs"
import { ReferenceDetailDisclosure, type ReferenceDetailRow } from "./reference-detail-disclosure"
import { ReferenceCodeBlock } from "./reference-code-block"
import { ReferenceContextIsland } from "./reference-context-island"

type ServerReferenceArticleProps = {
  className?: string
}

const MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="[&:not(:first-child)]:mt-3">{children}</p>,
  ul: ({ children }) => <ul className="mt-3 space-y-2">{children}</ul>,
  li: ({ children }) => (
    <li className="flex gap-3">
      <span aria-hidden className="mt-3 size-1 shrink-0 bg-foreground-muted" />
      <span className="min-w-0">{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-accent underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <HatchedInlineCode className="text-brand-foreground">{children}</HatchedInlineCode>
  ),
}

// prose renderer for reference summaries and descriptions (GitHub-flavored markdown)
const RichText = ({ text, className }: { text: string; className?: string }) => (
  <div className={cn("text-[15px] leading-7 text-foreground-soft", className)}>
    <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {text}
    </Markdown>
  </div>
)

const referenceItems = SERVER_REFERENCE_GROUPS.flatMap<ServerReferenceItem>(
  (group) => group.items as readonly ServerReferenceItem[],
)

const findReferencedItem = (type: string) => {
  const typeNames: string[] = type.match(/[A-Z][A-Za-z0-9]*/g) ?? []

  return referenceItems.find(
    (candidate) => typeNames.includes(candidate.name) && candidate.parameters.length > 0,
  )
}

const getVisibleParameters = (item: ServerReferenceItem) =>
  item.parameters.filter((parameter) => parameter.name !== "constructor")

const getCallbackDetails = (type: string): ReferenceDetailRow[] => {
  const arrowIndex = type.lastIndexOf("=>")
  if (arrowIndex === -1) return []

  return [
    { name: "Parameters", type: "callback parameters" },
    { name: "Return", type: type.slice(arrowIndex + 2).trim() },
  ]
}

const getParameterDetails = (type: string): ReferenceDetailRow[] => {
  const callbackDetails = getCallbackDetails(type)
  if (callbackDetails.length > 0) return callbackDetails

  const referencedItem = findReferencedItem(type)
  if (!referencedItem) return []

  return getVisibleParameters(referencedItem).map((parameter) => ({
    name: `${parameter.name}${parameter.optional ? "?" : ""}`,
    type: parameter.type,
    description: parameter.description,
  }))
}

const getReturnType = (item: ServerReferenceItem) => {
  const returnMarker = item.signature.lastIndexOf("): ")
  if (returnMarker === -1) return item.returns

  return item.signature.slice(returnMarker + 3)
}

const getDisplaySignature = (item: ServerReferenceItem) => {
  if (item.kind !== "Function" && item.signature.endsWith(": unknown")) return null
  if (item.kind !== "Function") return item.signature

  const parameters = getVisibleParameters(item)
    .map((parameter) => `${parameter.name}${parameter.optional ? "?" : ""}`)
    .join(", ")

  return `${item.name}(${parameters})`
}

const getReturnDetails = (returnType: string): ReferenceDetailRow[] => {
  const callbackDetails = getCallbackDetails(returnType)
  if (callbackDetails.length > 0) return callbackDetails

  const referencedItem = findReferencedItem(returnType)
  if (referencedItem) {
    return getVisibleParameters(referencedItem).map((parameter) => ({
      name: `${parameter.name}${parameter.optional ? "?" : ""}`,
      type: parameter.type,
      description: parameter.description,
    }))
  }

  return []
}

const DetailRows = ({ item }: { item: ServerReferenceItem }) => {
  const parameters = getVisibleParameters(item)
  if (parameters.length === 0) return null

  return (
    <div className="mt-6">
      <h4 className="font-label text-lg font-semibold leading-5 text-brand-foreground">
        {item.kind === "Interface" ? "Properties" : "Parameters"}
      </h4>
      <dl className="mt-2 divide-y divide-border border-t border-border">
        {parameters.map((parameter) => (
          <div key={parameter.name} className="py-5">
            <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="min-w-0 font-mono text-[13px] font-medium leading-5 text-brand-foreground">
                {parameter.name}
                {parameter.optional && <span className="text-foreground-muted">?</span>}
              </span>
              <span className="min-w-0 break-words text-[13px] leading-5 text-foreground-muted">
                {parameter.type}
              </span>
            </dt>
            <dd className="m-0">
              {parameter.description && <RichText text={parameter.description} className="mt-3" />}
              {getParameterDetails(parameter.type).length > 0 && (
                <ReferenceDetailDisclosure details={getParameterDetails(parameter.type)} />
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

const ApiItem = ({ category, item }: { category: string; item: ServerReferenceItem }) => {
  const id = getReferenceItemId(category, item.name)
  const displaySignature = getDisplaySignature(item)

  return (
    <section id={id} data-reference-section className="scroll-mt-28 py-8">
      <h3 className="font-label text-[22px] font-semibold leading-[1.33] text-brand-foreground">
        {item.name}
      </h3>
      {displaySignature && (
        <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-sm leading-6 text-foreground-muted">
          {displaySignature}
        </code>
      )}
      {item.summary && <RichText text={item.summary} className="mt-4" />}
      {item.example && (
        <ReferenceCodeBlock className="mt-6" title={item.exampleTitle} code={item.example} />
      )}
      <DetailRows item={item} />
      {item.returns && (
        <div className="mt-8">
          <h4 className="font-label text-lg font-semibold leading-5 text-brand-foreground">
            Return Type
          </h4>
          <div className="mt-2 border-t border-border py-5">
            <p className="text-[13px] leading-5 text-foreground-muted">{getReturnType(item)}</p>
            <RichText text={item.returns} className="mt-3" />
            {getReturnDetails(getReturnType(item)).length > 0 && (
              <ReferenceDetailDisclosure details={getReturnDetails(getReturnType(item))} />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export const ServerReferenceArticle = ({ className }: ServerReferenceArticleProps) => (
  <ReferenceContextIsland className={className}>
    <article className="min-w-0">
      <header
        id="introduction"
        data-reference-section
        className="scroll-mt-28 border-b border-border px-5 py-10 sm:px-10 lg:px-20"
      >
        <p className="font-mono text-base leading-6 text-foreground-mono">@supabase/server</p>
        <h1 className="mt-2 font-label text-[28px] font-semibold leading-[1.2] text-brand-foreground">
          Server Client Library
        </h1>
        <div className="mt-6 space-y-4 text-[15px] leading-7 text-foreground-soft">
          <p>
            <HatchedInlineCode className="text-brand-foreground">
              @supabase/server
            </HatchedInlineCode>{" "}
            is a framework-agnostic toolkit for using Supabase Auth and clients in server-side
            JavaScript.
          </p>
          <p>
            It verifies JWTs, resolves project keys, and creates request-scoped clients so your
            routes can share one consistent Supabase context. Adapters are included for Hono, H3,
            Elysia, and NestJS, with lower-level primitives available for custom runtimes.
          </p>
        </div>
      </header>

      <section
        id="installation"
        data-reference-section
        className="scroll-mt-28 px-5 pb-10 pt-6 sm:px-10 lg:px-20"
      >
        <h2 className="font-label text-[22px] font-semibold leading-[1.33] text-brand-foreground">
          Installation
        </h2>
        <InstallationTabs className="mt-6" />
      </section>

      <div className="px-5 pb-20 sm:px-10 lg:px-20 lg:pt-12">
        {SERVER_REFERENCE_GROUPS.map((group) => {
          const groupId = toReferenceId(group.category)

          return (
            <section
              key={group.category}
              id={groupId}
              data-reference-section
              className="scroll-mt-28 pt-10 first:pt-0"
            >
              <h2 className="flex items-center gap-3 overflow-hidden font-mono text-xs font-medium uppercase leading-[1.6]">
                <span className="shrink-0 text-foreground-mono">{group.category}</span>
                <span aria-hidden className="shrink-0 text-surface-raised">
                  {SLASH_RULE}
                </span>
              </h2>
              <div className="mt-5">
                {group.items.map((item, index) => (
                  <div key={item.name}>
                    {index > 0 && <SlashRule />}
                    <ApiItem category={group.category} item={item} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </article>
  </ReferenceContextIsland>
)
