import {
  AGENT_DOCUMENT_RECORDS,
  AGENT_TOKENS_METHOD,
  renderAgentMarkdown,
} from "./agent-document-records"

const truncate = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim()
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}…`
}

export const buildLlmsIndex = () => {
  const lines = AGENT_DOCUMENT_RECORDS.map((record) => {
    const { tokens } = renderAgentMarkdown(record)
    const edge = record.composesWith.at(0) ?? "none"
    return `- [${record.id}](${record.markdownPath}): ${truncate(record.description, 64)} (~${tokens} tokens; edge: ${edge})`
  })

  return `# Supabase Docs agent index

> Atomic Supabase documentation records with token costs and relationship edges.

If you are a coding agent: start with the smallest relevant record below, then follow its frontmatter edges. Do not fetch the full corpus.

MCP: \`npx mcp-remote https://mcp.supabase.com/mcp\`
Traversal skill: /supabase-docs.skill.md
Token estimate: ${AGENT_TOKENS_METHOD}

## Records

${lines.join("\n")}
`
}

export const buildAgentsFile = () => `# Supabase Docs agent instructions

1. Start at /llms.txt.
2. Fetch the smallest matching .md record.
3. Read YAML frontmatter before code or prose.
4. Follow requires_setup and preceded_by first.
5. Follow composes_with before writing chained APIs.
6. Use errors for failure handling and used_in_guides for examples.
7. Prefer the MCP server when tool access is available.

MCP: https://mcp.supabase.com/mcp
Skill: /supabase-docs.skill.md
`

export const buildDocsSkill = () => `# Supabase Docs traversal skill

Use this skill when answering implementation questions about Supabase.

1. Fetch /llms.txt.
2. Select the smallest record matching the task.
3. Fetch its .md URL.
4. Read frontmatter before the body.
5. Treat requires_setup as mandatory prerequisites.
6. Treat preceded_by as ordering constraints.
7. Follow composes_with before chaining APIs.
8. Read errors before proposing error handling.
9. Use used_in_guides to find longer examples.
10. Use records_used on guides to reach atomic references.
11. Keep fetches incremental; do not ingest every record.
12. Cite the canonical HTML route when answering humans.
13. Cite the .md route when showing agent provenance.
14. Prefer language-tagged examples from the record.
15. Do not infer an edge that frontmatter contradicts.
16. If a record is absent, return to /llms.txt.
17. If MCP is available, connect to https://mcp.supabase.com/mcp.
18. Otherwise continue over HTTP with the same traversal.
19. Budget using x-markdown-tokens before loading more records.
20. Stop when the task is supported by the loaded subgraph.
`

export const markdownResponse = (body: string, init?: ResponseInit) =>
  new Response(body, {
    ...init,
    headers: {
      "cache-control": "public, max-age=300, stale-while-revalidate=3600",
      "content-type": "text/markdown; charset=utf-8",
      ...init?.headers,
    },
  })

export const textResponse = (body: string, init?: ResponseInit) =>
  new Response(body, {
    ...init,
    headers: {
      "cache-control": "public, max-age=300, stale-while-revalidate=3600",
      "content-type": "text/plain; charset=utf-8",
      ...init?.headers,
    },
  })
