# Agent guide

Supabase `/docs` revamp, a Next.js App Router project implementing the Paper design
["supabase doc v2 (review fixes)"](https://app.paper.design/file/01KX3TB05NJMABJD6V07JMZ8GV/1-0/ELD-0).
Light and dark themes, with all colors defined as oklch tokens in [src/app/theme.css](src/app/theme.css).

## Commands

| Task       | Command             |
| ---------- | ------------------- |
| Dev server | `bun dev`           |
| Lint       | `bun run lint`      |
| Format     | `bun run format`    |
| Typecheck  | `bun run typecheck` |
| Build      | `bun run build`     |

Pre-commit (husky + lint-staged) runs oxlint + oxfmt on staged files, then `tsc --noEmit`. Don't bypass it.

## Hard rules

1. **No `useEffect`**: enforced by oxlint. See [NO_USE_EFFECT.md](NO_USE_EFFECT.md) for the five replacements, `useMountEffect` ([src/hooks/use-mount-effect.ts](src/hooks/use-mount-effect.ts)) is the only escape hatch.
2. **Base UI for headless primitives** (`@base-ui-components/react`), never Radix. Wrap primitives in `src/components/ui/`.
3. **Named exports, arrow functions, kebab-case files, no barrels.** `ref` is a regular prop (React 19), no `forwardRef`.
4. **Every UI component accepts `className`** merged via `cn()` from [src/lib/utils.ts](src/lib/utils.ts).
5. **Colors only through tokens**: never hardcode a hex/oklch value in a component. Add missing tokens to `globals.css`.
6. **Server Components by default**, `"use client"` only for interactivity.

## Doc map

| File                                 | Purpose                                             |
| ------------------------------------ | --------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)   | Folder layout, imports, data fetching, code quality |
| [NO_USE_EFFECT.md](NO_USE_EFFECT.md) | The five replacement rules for `useEffect`          |
| [CODE_REVIEW.md](CODE_REVIEW.md)     | Checklist applied to every PR                       |
| [COMMITS.md](COMMITS.md)             | Conventional commits, one line, and doc prose style |

## Skills

Load the matching skill before starting the work it covers:

| Skill                | When                                                          |
| -------------------- | ------------------------------------------------------------- |
| `/better-ui`         | Any component build or polish pass (shadows, borders, states) |
| `/better-colors`     | Adding or adjusting color tokens (oklch, contrast checks)     |
| `/better-typography` | Type scale, letter-spacing, line-height, font features        |
| `/emil-design-eng`   | Interaction & animation decisions, component API design       |
| `/stop-slop`         | Writing or editing any prose (docs, UI copy, PR descriptions) |

## Design source

The Paper file is the source of truth. When implementing a section, pull exact values with
`get_jsx` / `get_computed_styles` from the Paper MCP, never eyeball a screenshot.
The sibling repo `../supabase` holds the original docs implementation for behavioral reference.
