import { SERVER_REFERENCE_GROUPS, type ServerReferenceItem } from "@/assets/server-reference-data"
import {
  getReferenceItemId,
  getReferenceItemSlug,
  toReferenceId,
} from "@/features/server-reference/server-reference-ids"

export const AGENT_TOKENS_METHOD = "characters_divided_by_4_rounded_to_nearest_100"
export const AGENT_DATE_MODIFIED = "2026-07-14"

export type AgentDocumentKind = "guide" | "reference" | "reference-index"

export type AgentDocumentRecord = {
  id: string
  kind: AgentDocumentKind
  path: string
  markdownPath: string
  title: string
  description: string
  composesWith: string[]
  precededBy: string[]
  requiresSetup: string[]
  errors: string[]
  usedInGuides: string[]
  recordsUsed: string[]
  body: string
}

export const renderAgentJson = (record: AgentDocumentRecord) => {
  const { tokens } = renderAgentMarkdown(record)

  return {
    id: record.id,
    kind: record.kind,
    path: record.path,
    markdown_path: record.markdownPath,
    title: record.title,
    description: record.description,
    composes_with: record.composesWith,
    preceded_by: record.precededBy,
    requires_setup: record.requiresSetup,
    errors: record.errors,
    used_in_guides: record.usedInGuides,
    records_used: record.recordsUsed,
    tokens,
    tokens_method: AGENT_TOKENS_METHOD,
    date_modified: AGENT_DATE_MODIFIED,
    content: record.body,
  }
}

export const getAgentMetaDescription = (record: AgentDocumentRecord) => {
  const description = record.description.trim()
  if (description.length < 50) {
    return `${description} Learn more in the Supabase Server SDK reference.`
  }
  return description.length <= 160 ? description : `${description.slice(0, 157).trimEnd()}…`
}

const DOCS_PRODUCTS = [
  ["Database", "Full Postgres database with Realtime, backups, and extensions."],
  ["Auth", "Email, passwordless, OAuth, and mobile identity APIs."],
  ["Storage", "File storage integrated with Postgres Row Level Security."],
  ["Realtime", "Database changes, presence, and broadcast channels."],
  ["Edge Functions", "Globally distributed server-side functions."],
] as const

const DOCS_MODULES = ["AI & Vectors", "Cron", "Queues", "Data REST API", "GraphQL API"]

const renderDocsBody = () => `# Build with Supabase

Get direct answers grounded in the docs, with relevant guides and examples to help you keep building.

## Start building

- [Quickstart](https://supabase.com/docs/guides/getting-started)
- [AI tools](https://supabase.com/docs/guides/ai-tools)
- [Server SDK reference](/docs/reference/server)

## Products

${DOCS_PRODUCTS.map(([name, description]) => `- **${name}:** ${description}`).join("\n")}

## Modules

${DOCS_MODULES.map((name) => `- ${name}`).join("\n")}

## Client libraries

- JavaScript
- Flutter
- Swift
- Python
- C#
- Kotlin
- [Server SDK](/docs/reference/server)

## Additional resources

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Management API](https://supabase.com/docs/reference/api)
- [Troubleshooting](https://supabase.com/docs/guides/troubleshooting)
`

export const DOCS_AGENT_RECORD: AgentDocumentRecord = {
  id: "docs.home",
  kind: "guide",
  path: "/docs",
  markdownPath: "/docs.md",
  title: "Build with Supabase",
  description: "Find the right Supabase guide, product, client library, or reference page.",
  composesWith: ["server.introduction"],
  precededBy: [],
  requiresSetup: [],
  errors: [],
  usedInGuides: [],
  recordsUsed: ["server.introduction", "server.installation"],
  body: renderDocsBody(),
}

const toServerRecordId = (category: string, name: string) =>
  `server.${toReferenceId(category)}.${toReferenceId(name)}`

const getCategoryRecordIds = (category: string) => {
  const group = SERVER_REFERENCE_GROUPS.find((candidate) => candidate.category === category)
  return group?.items.map((item) => toServerRecordId(category, item.name)) ?? []
}

const SERVER_ERROR_IDS = getCategoryRecordIds("Errors")

const renderParameters = (item: ServerReferenceItem) => {
  if (item.parameters.length === 0) return ""

  return `## ${item.kind === "Interface" ? "Properties" : "Parameters"}

| Name | Type | Optional | Description |
| --- | --- | --- | --- |
${item.parameters
  .map(
    (parameter) =>
      `| \`${parameter.name}\` | \`${parameter.type.replaceAll("|", "\\|")}\` | ${parameter.optional ? "Yes" : "No"} | ${parameter.description || "—"} |`,
  )
  .join("\n")}
`
}

const renderServerItemBody = (
  category: string,
  item: ServerReferenceItem,
  composesWith: string[],
) => `# ${item.name}

${item.summary}

## Signature

\`\`\`ts
${item.signature}
\`\`\`

${
  item.example
    ? `## ${item.exampleTitle || "Example"}

\`\`\`ts
${item.example}
\`\`\`
`
    : ""
}
${renderParameters(item)}
${
  item.returns
    ? `## Returns

${item.returns}
`
    : ""
}
## Relationships

- Category: ${category}
- Composes with: ${composesWith.length > 0 ? composesWith.map((id) => `\`${id}\``).join(", ") : "none recorded"}
- [Source](${item.sourceUrl})
`

const createServerItemRecord = (
  category: string,
  item: ServerReferenceItem,
  siblingIds: string[],
): AgentDocumentRecord => {
  const id = toServerRecordId(category, item.name)
  const slug = getReferenceItemSlug(category, item.name)
  const composesWith = siblingIds.filter((candidate) => candidate !== id).slice(0, 4)
  const isError = category === "Errors" || item.name.endsWith("Error")

  return {
    id,
    kind: "reference",
    path: `/docs/reference/server/${slug}`,
    markdownPath: `/docs/reference/server/${slug}.md`,
    title: item.name,
    description: item.summary || `${item.kind} in the Supabase Server SDK.`,
    composesWith,
    precededBy: category === "Middleware" ? [] : ["server.introduction"],
    requiresSetup: ["server.installation"],
    errors: isError ? [] : SERVER_ERROR_IDS.slice(0, 4),
    usedInGuides: [],
    recordsUsed: [],
    body: renderServerItemBody(category, item, composesWith),
  }
}

const SERVER_ITEM_RECORDS = SERVER_REFERENCE_GROUPS.flatMap((group) => {
  const siblingIds = getCategoryRecordIds(group.category)
  return group.items.map((item) => createServerItemRecord(group.category, item, siblingIds))
})

const renderServerIndex = () => `# Server Client Library

\`@supabase/server\` is a framework-agnostic toolkit for Supabase Auth and request-scoped clients in server-side JavaScript.

It verifies JWTs, resolves project keys, and creates request-scoped clients. Adapters are available for modern server runtimes, with lower-level primitives for custom integrations.

## Start here

- [Installation](/docs/reference/server/installation)

${SERVER_REFERENCE_GROUPS.map(
  (group) => `## ${group.category}

${group.items
  .map(
    (item) =>
      `- [${item.name}](/docs/reference/server/${getReferenceItemSlug(group.category, item.name)}): ${item.summary || item.kind}`,
  )
  .join("\n")}`,
).join("\n\n")}
`

export const SERVER_INTRODUCTION_AGENT_RECORD: AgentDocumentRecord = {
  id: "server.introduction",
  kind: "reference-index",
  path: "/docs/reference/server",
  markdownPath: "/docs/reference/server.md",
  title: "Server Client Library",
  description: "Framework-agnostic Supabase Auth and client utilities for server-side JavaScript.",
  composesWith: ["server.installation", ...SERVER_ITEM_RECORDS.slice(0, 2).map(({ id }) => id)],
  precededBy: [],
  requiresSetup: [],
  errors: [],
  usedInGuides: [],
  recordsUsed: SERVER_ITEM_RECORDS.map(({ id }) => id),
  body: renderServerIndex(),
}

export const SERVER_INSTALLATION_AGENT_RECORD: AgentDocumentRecord = {
  id: "server.installation",
  kind: "guide",
  path: "/docs/reference/server/installation",
  markdownPath: "/docs/reference/server/installation.md",
  title: "Install the Server SDK",
  description: "Install @supabase/server with an agent, a package manager, Deno, or Bun.",
  composesWith: SERVER_ITEM_RECORDS.slice(0, 2).map(({ id }) => id),
  precededBy: ["server.introduction"],
  requiresSetup: [],
  errors: [],
  usedInGuides: [],
  recordsUsed: SERVER_ITEM_RECORDS.slice(0, 2).map(({ id }) => id),
  body: `# Installation

Install \`@supabase/server\` using one of the following methods.

## Agent setup

\`\`\`text
Set up Supabase for me.
Fetch https://supabase.com/.well-known/agent-skills/get-started/SKILL.md and follow it.
\`\`\`

## Package manager

\`\`\`sh
npm install @supabase/server
\`\`\`

## JSR

\`\`\`sh
deno add jsr:@supabase/server
bunx jsr add @supabase/server
\`\`\`
`,
}

export const AGENT_DOCUMENT_RECORDS: AgentDocumentRecord[] = [
  DOCS_AGENT_RECORD,
  SERVER_INTRODUCTION_AGENT_RECORD,
  SERVER_INSTALLATION_AGENT_RECORD,
  ...SERVER_ITEM_RECORDS,
]

const normalizePath = (path: string) => {
  const withoutQuery = path.split(/[?#]/, 1)[0]
  const withoutTrailingSlash = withoutQuery.replace(/\/+$/, "")
  return withoutTrailingSlash || "/"
}

const findAgentDocumentByPath = (path: string) => {
  const normalizedPath = normalizePath(path)
  return AGENT_DOCUMENT_RECORDS.find(
    (record) => record.path === normalizedPath || record.markdownPath === normalizedPath,
  )
}

export const getAgentDocumentByServerSlug = (slug: string[]) => {
  const directRecord = findAgentDocumentByPath(`/docs/reference/server/${slug.join("/")}`)
  if (directRecord) return directRecord

  const requestedReferenceId = slug.join("/")
  for (const group of SERVER_REFERENCE_GROUPS) {
    const item = group.items.find(
      (candidate) => getReferenceItemId(group.category, candidate.name) === requestedReferenceId,
    )
    if (item) {
      return findAgentDocumentByPath(
        `/docs/reference/server/${getReferenceItemSlug(group.category, item.name)}`,
      )
    }
  }

  return undefined
}

export const getAgentDocumentByPath = (path: string) => {
  const directRecord = findAgentDocumentByPath(path)
  if (directRecord) return directRecord

  const normalizedPath = normalizePath(path)
  const serverReferencePrefix = "/docs/reference/server/"
  if (!normalizedPath.startsWith(serverReferencePrefix)) return undefined

  return getAgentDocumentByServerSlug(
    normalizedPath.slice(serverReferencePrefix.length).replace(/\.md$/, "").split("/"),
  )
}

const yamlArray = (items: string[]) => JSON.stringify(items)

const escapeYamlString = (value: string) => JSON.stringify(value)

export const estimateAgentTokens = (value: string) =>
  Math.max(100, Math.round(value.length / 4 / 100) * 100)

export const renderAgentMarkdown = (record: AgentDocumentRecord) => {
  const preliminary = `${record.title}\n${record.description}\n${record.body}`
  const tokens = estimateAgentTokens(preliminary)
  const frontmatter = [
    "---",
    `id: ${escapeYamlString(record.id)}`,
    `kind: ${escapeYamlString(record.kind)}`,
    `composes_with: ${yamlArray(record.composesWith)}`,
    `preceded_by: ${yamlArray(record.precededBy)}`,
    `requires_setup: ${yamlArray(record.requiresSetup)}`,
    `errors: ${yamlArray(record.errors)}`,
    `used_in_guides: ${yamlArray(record.usedInGuides)}`,
    `records_used: ${yamlArray(record.recordsUsed)}`,
    `tokens: ${tokens}`,
    `tokens_method: ${escapeYamlString(AGENT_TOKENS_METHOD)}`,
    `date_modified: ${escapeYamlString(AGENT_DATE_MODIFIED)}`,
    "---",
  ].join("\n")

  return { markdown: `${frontmatter}\n\n${record.body.trim()}\n`, tokens }
}

export const getAgentDocumentIdFromReferenceId = (referenceId: string) => {
  if (referenceId === "introduction") return SERVER_INTRODUCTION_AGENT_RECORD.id
  if (referenceId === "installation") return SERVER_INSTALLATION_AGENT_RECORD.id

  for (const group of SERVER_REFERENCE_GROUPS) {
    for (const item of group.items) {
      if (getReferenceItemId(group.category, item.name) === referenceId) {
        return toServerRecordId(group.category, item.name)
      }
    }
  }

  return null
}
