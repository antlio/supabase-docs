# Agent-facing documentation layer

This prototype gives `/docs` and the `/docs/reference/server` route family a machine-facing representation without changing the human interface. HTML, Markdown, frontmatter, indexes, and metadata derive from the records in `src/features/agent-docs/agent-document-records.ts`.

## Route contract

| Surface | Route | Contract |
| --- | --- | --- |
| Canonical HTML | `/docs` and `/docs/reference/server/<slug>` | Server-rendered HTML with canonical metadata, JSON-LD, a Markdown alternate link, and the embedded agent directive |
| Markdown twin | `<canonical>.md` | Rich Markdown with YAML relationships and `x-markdown-tokens` |
| Negotiated Markdown | Canonical route with `Accept: text/markdown` | Byte-equivalent rich Markdown and token header |
| Raw record | Canonical route with `Accept: application/json` | Structured record from the same source object, including edges, content, and token metadata |
| Global index | `/llms.txt` | Under 10 KB, valid H1/blockquote/section structure, one linked record per line |
| Index aliases | `/docs/llms.txt`, `/.well-known/llms.txt` | Same global index |
| Scoped index | `/guides/realtime/llms.txt` | Honest pointer to the implemented prototype scope; Realtime records are not present in these two pages |
| Instructions | `/agents.md` | Short traversal contract |
| Skill | `/supabase-docs.skill.md` | Twenty-step incremental retrieval workflow |
| MCP discovery | `/.well-known/mcp.json`, `/.well-known/mcp/server-card.json` | Endpoint, install command, capabilities, and discoverable tool |
| Sitemap | `/sitemap.xml` | Request-origin URLs for all 41 implemented records |
| Failure | Any unknown route | Real `404`, `text/plain`, 31-byte body pointing to `/llms.txt` |

Every Markdown document carries `id`, `kind`, `composes_with`, `preceded_by`, `requires_setup`, `errors`, `used_in_guides`, `records_used`, `tokens`, `tokens_method`, and `date_modified`. Token estimates use characters divided by four, rounded to the nearest hundred.

## Traversal demo

1. Fetch `/llms.txt` and select the smallest matching record.
2. Fetch `/docs/reference/server/middleware-createsupabasecontext.md`.
3. Read `requires_setup` before implementation.
4. Follow `composes_with` to `/docs/reference/server/middleware-withsupabase.md` when the task needs the wrapper.
5. Follow the listed error records before adding failure handling.

This is the implemented equivalent of the RFC's `llms.txt → select.md → eq.md` example. JavaScript and CLI reference routes do not exist in this prototype, so the layer does not invent records or per-command skills for them.

## Verification

Run against a production build:

```sh
bun run build
bun run start -- -p 3010
curl -H 'Accept: text/markdown' http://localhost:3010/docs
curl -H 'Accept: text/markdown' http://localhost:3010/docs/reference/server/middleware-createsupabasecontext
curl -H 'Accept: application/json' http://localhost:3010/docs/reference/server/middleware-createsupabasecontext
curl http://localhost:3010/llms.txt
curl http://localhost:3010/.well-known/mcp/server-card.json
curl -i http://localhost:3010/does-not-exist
```

The current local agentimization source was run against these route shapes on 2026-07-14:

| Route | Score | Grade |
| --- | ---: | --- |
| `/docs` | 91 | A |
| `/docs/reference/server` | 92 | A |
| `/docs/reference/server/middleware-createsupabasecontext` | 92 | A |

The built sibling CLI is older than its source and sends a Markdown-capable `Accept` header during its HTML probe. That makes it parse negotiated Markdown as HTML and produces false negatives for JSON-LD, canonical links, headings, and HTTP authentication. The scores above use the current source, whose browser probe requests HTML only.

All 41 records were also checked through both their `.md` twins and negotiated canonical URLs: all 82 responses returned `200`, `text/markdown`, a token header, and a non-empty body. A representative raw-record request returned the same record as JSON with its edges and token metadata.

### Remaining audit boundaries

- Localhost cannot pass the HTTPS check. Deployment on `https://supabase.com` supplies HTTPS and makes the production canonical URLs self-referencing.
- The human server reference intentionally renders the complete navigable reference surface. Its `.md` twins are atomic records. The auditor compares the atomic record with all human-page navigation and neighboring records, so it reports low raw text parity even though both representations derive from the same source records.
- The interactive human page contains tab panels and a Next.js RSC payload. Agent retrieval does not depend on either: the negotiated and `.md` responses serialize the selected record directly, including language-tagged code examples.
- The prototype uses the existing human UI and therefore does not attempt to reduce raw Next.js HTML below 50 KB. Agentimization's converted-content size check passes all sampled pages, and the Markdown records stay below 50 KB.
- Open Graph metadata is emitted for both page families. The FAQ schema and optional `llms-full.txt`, API catalog, content-signals declaration, and skills index remain intentionally out of scope for the two-page vertical slice.
