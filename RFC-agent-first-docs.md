# RFC: Agent-first documentation surface for Supabase Docs

| | |
|---|---|
| **Status** | Draft / take-home proposal |
| **Author** | Anthony Lionnet |
| **Date** | 2026-07-14 |
| **Companion** | Redesign prototype (demo URL + GitHub in README), `research/supabase-docs-report.md`, `research/obsidian-cherry-pick.md` |

## 0. Summary

Supabase docs already lead the industry on several agent-facing fronts: guide `.md` twins, content negotiation on guides, an MCP server, agent skills, a root `llms.txt`. This RFC proposes closing the remaining gap, the reference surface, and adding an in-band discovery layer so agents no longer depend on luck or prior knowledge of Supabase conventions. Every proposal traces to a dated, reproducible failure observed in testing (§2), and impact is measured with an open-source audit tool (§6).

---

## 1. User research findings

Quick research pass before design: informal feedback from developers in my community who have shipped with Supabase, alongside documented industry signals. Four findings shaped this RFC.

**F1. The docs' first reader is increasingly an agent, not the developer.** Community feedback described learning how Supabase works by asking Claude to explain it rather than reading the docs directly. The human's entry point to the product was an agent's summary of the documentation. This matches published telemetry: Fern reports roughly a third of quickstart page visitors are already LLMs. Docs quality now determines the quality of the explanation the agent gives, on top of the page a human reads.

**F2. Onboarding is solved. The pain is maintenance and collaboration.** Setup was consistently described as easy. Friction appears months later: multiple people on one project, inherited code, "which method does X, what does it compose with, what changed." That is precisely the phase served by reference docs, the surface this audit found weakest (§2).

**F3. Adoption travels peer-to-peer, and so do the docs.** Developers pick up Supabase because a friend or teammate used it, then reach the docs mid-task via a pasted link or an agent fetch, never through the docs' front door. Entry points are therefore arbitrary pages, which is why per-page discovery (directives, `.md` availability, routing) matters more than a well-organized homepage.

**F4. Agent-side workflows assume small, self-describing, deterministic pages.** Observed community workflows (agents fetching doc URLs mid-task from Cursor or Claude Code, teams building scaffolding agents on top of vendor docs) fail against today's reference surface: 1.67 MB CLI pages, lossy markdown renders, no stable retrieval contract. Agent-docs-spec research documents hard truncation limits (~100K chars in Claude Code, 5K in some MCP fetch tools) that make page size a correctness issue rather than a performance concern.

**Industry signal.** Mintlify, Fern, Vercel, Cloudflare, and the Agent-Friendly Docs Spec converged in 2025–26 on the same stack: markdown-first delivery, per-page token economy, llms.txt discovery, and agents as a measured audience (full synthesis in `research/supabase-docs-report.md` §3).

---

## 2. Current state (tested 2026-07-09/10, all reproducible)

| # | Finding | Evidence |
|---|---|---|
| 1 | Guides have `.md` twins and AI affordances. Reference pages have neither | `select.md` → empty/404, 0 AI-affordance hits in reference HTML |
| 2 | CLI reference ships the entire reference per command URL | `/docs/reference/cli/supabase-link` → 1.67 MB HTML (spec limit: 50 KB) |
| 3 | Content negotiation exists on guides but serves the lossy render. Reference serves HTML only | canonical `getting-started` → `text/markdown` with bare links, `select` → `text/html` |
| 4 | No agent directive anywhere: no in-HTML pointer to `.md`, llms.txt, or MCP | 0 hits in raw HTML |
| 5 | `llms.txt` is a bare sitemap that never mentions ai-tools/MCP. `/docs/llms.txt` → 404 | direct fetch |
| 6 | Method relationships exist only implicitly in example code | no chaining/composition data on any reference page |
| 7 | Task routing dead-ends: `getting-started` → "set up Realtime" has zero links to Realtime | direct fetch |

---

## 3. Proposal

### 3.1 Reference parity: one method = one record, with `.md` (P0)

Every reference endpoint (SDK method, CLI command, REST operation) becomes an atomic, addressable unit served in three renders from one source (the existing SDKSpec/CLISpec/OpenAPI files):

- `/docs/reference/javascript/select` for the human UI
- `/docs/reference/javascript/select.md` for markdown with frontmatter (below)
- `Accept: application/json` for the raw spec record

This also fixes the CLI reference by construction: per-command pages replace the 1.67 MB monolith.

### 3.2 Typed relationships in frontmatter (P0, the point-of-view piece)

The knowledge "what goes with what" is today locked in example code. Make it data:

```yaml
id: js.database.select
kind: method
composes_with: [eq, neq, order, limit, range, single]
preceded_by: [from]
requires_setup: [initializing]
errors: [PGRST116, PGRST301]
used_in_guides: [database/joins, api/quickstart]
tokens: ~1200
```

Edges are generatable from spec files plus example parsing. An agent resolving "select who's online, teammates only" traverses llms.txt (2 KB) → `select.md` (1.2k tokens) → `eq.md` (0.6k). Three fetches, about 4 KB, with composition rules stated instead of guessed. This replaces both the 125 KB per-SDK dump and the 9.47 MB `llms-full.txt` for task-time use. Model and UI implications (backlinks, composition strip, local graph) are covered in `research/obsidian-cherry-pick.md`.

### 3.3 Discovery layer (P0)

- **Embedded agent directive** on every page (HTML comment plus visible-to-parsers block): rich `.md` at `+.md`, index at `/llms.txt`, MCP server available and how to install it. Cloudflare ships this today and the cost is near zero.
- **llms.txt as router (MOC), not sitemap.** It opens with an agent-directed block ("If you are a coding agent: Supabase ships an MCP server and skills, install via ..."), then one line per record/section with description, token cost, and key edges. Alias at `/docs/llms.txt` (today a 404). Per-product scoped indexes (`/docs/guides/realtime/llms.txt`).
- **`.well-known/` endpoints** (emerging conventions, adopt defensively): `/.well-known/llms.txt` alias, and MCP server advertisement so agents can discover Supabase's MCP without reading prose. These specs are young, so ship them as cheap aliases rather than load-bearing infrastructure.

### 3.4 One markdown pipeline, the rich one (P1)

Unify the two current renders (lossy negotiated vs richer `.md` twin) into one, keeping card descriptions and adding Fern-style `llms-only` blocks where agent-facing scaffolding helps. Add a Cloudflare-style `x-markdown-tokens` response header so agents can budget before fetching.

### 3.5 Teach the traversal: skills (P1)

Following Obsidian's playbook (skills over servers, kepano/obsidian-skills): ship `supabase-docs.skill.md`, roughly 30 lines teaching any agent the traversal contract (start at llms.txt, fetch records by id, follow `composes_with` before chaining). Per-CLI-command `skill.md` downloads mirror Fern's CLI thesis.

### 3.6 Hygiene fixes (P0, trivial)

Redirect or serve `/docs/llms.txt`. Return light 404s (today's 404 page is 97 KB of HTML). Repair reference slug fragility (`/reference/javascript/start` → 404).

---

## 4. Rollout

| Phase | Scope | Effort signal |
|---|---|---|
| 1 | Hygiene fixes (§3.6) + agent directive (§3.3) | days |
| 2 | Reference `.md` + per-command CLI pages (§3.1), generated from existing specs | 1–2 sprints |
| 3 | Edge frontmatter + MOC llms.txt (§3.2, §3.3) | 1–2 sprints, edges incrementally |
| 4 | Unified render, tokens header, skills, `.well-known` (§3.4, §3.5) | follow-on |

The take-home prototype implements a vertical slice of phases 1–3 for `select`, `supabase link`, and the Realtime guide.

## 5. Alternatives considered

- **MCP-only** (Mintlify's bet): excludes fetch-based and terminal-native agents, and MCP tool-loading has its own context cost. Chosen instead: serve `.md`/JSON/UI from one source, with MCP as one consumer among several.
- **Better llms-full.txt only**: 9.47 MB doesn't fit any context window, and chunking it recreates the routing problem without the edges.
- **RAG/search endpoint**: valuable later, but non-deterministic and unauditable. Typed edges give correct chaining by construction and are diffable in git.

## 6. Measurement

Adopt agent-readiness scoring in CI using [agentimization](https://github.com/antlio/agentimization) (`npx agentimization <url>`): 36 checks across 8 categories including GEO signals and agent protocols, a 0–100 score with per-failure fix suggestions, and a superset of the [Agent-Friendly Docs Spec](https://agentdocsspec.com/)'s 23 checks. Disclosure: I'm the author. The prototype README publishes before/after scores comparing the current `supabase.com/docs/reference/javascript/select` with the redesigned record page, plus a scripted traversal demo (3 fetches vs a 125 KB dump).

## 7. Open questions

- Edge taxonomy governance: who owns `composes_with` semantics as SDKs evolve? (Proposal: generated from spec and examples, human-reviewed in docs CI.)
- Should token counts use a canonical tokenizer (cl100k? Claude's?) or a neutral estimate? The header should state which.
- `.well-known` conventions are pre-standard: revisit quarterly, keep as aliases.
- Do guides adopt edge frontmatter too (`records_used`), completing the guide↔reference graph? (Prototype says yes. Validate with the content team.)
