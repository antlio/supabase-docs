# Frontend architecture conventions

These rules govern how `src/` is organized. They sit on top of the global rules in `~/code/antlio/CLAUDE.md` (React 19, TypeScript strict, kebab-case files, named exports, Tailwind, etc.), read those first.

For day-one onboarding (commands, hard rules, doc map), start with [./AGENTS.md](./AGENTS.md). For PR review standards, see [./CODE_REVIEW.md](./CODE_REVIEW.md).

The migration to this layout is incremental. New code follows these rules, existing code is moved when next touched.

---

## Folder layout

```
src/
  app/
  features/
    <domain>/
      components/
      api/
      types.ts
      stores/
      hooks/
      lib/
      actions/
      providers/
  components/
    ui/
    common/
  lib/
  hooks/
  stores/
  providers/
  types/
  assets/
```

## Where new code goes

| Code                             | Location                                     |
| -------------------------------- | -------------------------------------------- |
| New domain                       | `src/features/<domain>/`                     |
| UI primitive                     | `src/components/ui/` or `components/common/` |
| Generic hook                     | `src/hooks/`                                 |
| Domain hook                      | `features/<domain>/hooks/`                   |
| Generic store                    | `src/stores/`                                |
| Domain store                     | `features/<domain>/stores/`                  |
| Generated data / large constants | `src/assets/`                                |

**When to create a feature folder:** once you have any TWO of: 5+ components, a Zustand store, an `api/` file with queryOptions. Solo files stay at the top level.

## Imports

- **No barrels.** Import directly from the file: `import { x } from '@/features/chat/api/messages'`. Do not create `index.ts` re-exports per feature. Barrels break tree-shaking and inflate Next dev/HMR times.
- **Public surface of a feature** (importable from outside): `features/<x>/components/**`, `features/<x>/api/**`, `features/<x>/types.ts`.
- **Private** (lint-banned from outside): `features/<x>/stores/**`, `features/<x>/hooks/**`, `features/<x>/lib/**`, `features/<x>/actions/**`, `features/<x>/providers/**`. If another feature needs one of these, expose it through a public component or api function, don't reach in.
- `app/` may import any public path from any feature. Features may not import from `app/`.

## Data fetching

- We use TanStack React Query. Do not add `swr`.
- Every `api/*.ts` file MUST export a `<noun>QueryOptions(args)` function alongside its fetcher.
- Components call `useQuery(fooQueryOptions(args))`. Never inline `queryKey` + `queryFn` in a component.
- Query keys live in `api/keys.ts` per feature: `chatKeys.session(id)`.
- Use `skipToken` for conditional fetching, more type-safe than `enabled`.
- Mutations live in custom hooks (`useCreateX`), not inline in components.

## Server actions

- Filename `server.ts` or suffix `.server.ts`: must start with `'use server'`.
- Filename `client.ts` or suffix `.client.ts`: client-side wrappers and cache mutators only.
- Plain helpers do NOT belong in `actions/`. Put them in `lib/`.

## Size budgets

Soft limits, reviewer-enforced until expressible in oxlint:

| File type              | Budget                                    |
| ---------------------- | ----------------------------------------- |
| Component              | ≤ 400 lines                               |
| Hook                   | ≤ 300 lines                               |
| Store                  | ≤ 600 lines                               |
| `.ts` in `components/` | ≤ 50 KB (large data belongs in `assets/`) |

Over budget? Split, don't suppress.

## Naming

- Files: `kebab-case.tsx`. Named exports. Always accept `className` on UI components and pass it via `cn()`.
- Stores: `<domain>.store.ts` inside features, `<domain>.ts` at the top level.
- Constants: `SCREAMING_SNAKE_CASE`. Group by topic in `lib/constants/<topic>.ts` (e.g. `lib/constants/api.ts`, `lib/constants/models.ts`, `lib/constants/plans.ts`).

## Libraries

Canonical choices for common needs. Don't introduce a competing library without a specific reason, and if you do, replace the existing one rather than adding a second.

| Need                   | Use                                                                                                                   | Don't use                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Data fetching / cache  | [TanStack Query](https://tanstack.com/query/latest)                                                                   | SWR                                                                       |
| Headless UI primitives | [Base UI](https://base-ui.com/)                                                                                       | Radix UI (deprecated successor, Base UI is from the same team)           |
| Icons                  | [HugeIcons](https://hugeicons.com/)                                                                                   | Lucide, react-icons (broader use is fine in legacy code, not in new code) |
| URL-synced state       | [nuqs](https://nuqs.dev/)                                                                                             | manual `useSearchParams` + `router.replace` boilerplate                   |
| Validation             | [Zod](https://zod.dev/)                                                                                               | hand-rolled type guards or `as` assertions                                |
| Forms                  | `react-hook-form` + Zod resolvers                                                                                     | uncontrolled native forms with manual state                               |
| Animation              | [Framer Motion](https://www.framer.com/motion/) for choreographed sequences, CSS transitions for simple state changes | Manual `requestAnimationFrame` loops in components                        |
| Class merging          | `cn()` (project utility wrapping `clsx`)                                                                              | string concatenation, ternary class strings                               |

**Icon rules**: HugeIcons at default `strokeWidth={2.25}`. Size with Tailwind: `<Icon className="size-4" />`, never `size={16}`.

**Headless primitive rules**: build atop Base UI, wrap in a domain-aware component in `components/common/` or `features/<x>/components/`. New `@radix-ui/*` imports require justification in the PR description.

## Code quality

- **No inline handlers in JSX.** Define handlers as named functions above the return and pass references. Inline arrow functions in markup hide intent and inflate indent levels.

  ```tsx
  // Bad
  <button onClick={() => { if (x) doA(); else doB() }} />

  // Good
  const onClick = () => { /* … */ }
  <button onClick={onClick} />
  ```

- **Event handler props use `on(Noun)(Action)`**: `onItemDelete`, `onSelect`, `onFormSubmit`. Never `setItems` / `setSelectedUser`, that leaks the parent's state shape into the child's interface.
- **List keys must be stable IDs**, never the array index. If you don't have an ID, derive a stable one, don't reach for `index`.
- **Props are an interface**, not a passthrough. Name them for what the component consumes (`user`, `onSelect`), not what the parent happens to call its variable (`selectedUser`, `setSelectedUser`).
- **`const` over `let`.** `let` is only for values that are genuinely reassigned. A `const` declaration tells the next reader (human or agent) that this binding will not change, that's a real constraint they can rely on. If you find yourself reaching for `let` to "build up" a value, prefer `reduce`, `map`, or an early-return helper.
- **Hardcoded values become named constants.** `SCREAMING_SNAKE_CASE` for module-level static values.
- **Comments describe the WHY**, never the what. If a name carries the meaning, no comment is needed.
- **Single Responsibility.** A component or function does one thing. If it's growing two concerns, split it.

## React

- **No `useEffect`.** Period. Derive state, use TanStack Query, run work in event handlers, or reach for `useMountEffect` for one-time external sync. See [NO_USE_EFFECT.md](NO_USE_EFFECT.md) for the five replacement rules.
- **Don't duplicate a prop into state.** If the value comes from a prop, use the prop directly. State is for values the component owns.
- **Lift state only as far as it needs to go**, no further. A panel's `expanded` flag belongs to the panel, not its grandparent.
- **Custom hooks do one thing**, named `use<Thing>`. Not every helper needs to be a hook, only ones that compose other hooks.
- **Context providers** sit as high as needed, not higher.
- **Always handle loading, error, empty, and forbidden states**: don't leave them implicit.

## Component design

A bulletproof component is one that's reusable in contexts you didn't anticipate, easy to test in isolation, and obvious to read. Aim for that, not maximum flexibility, not maximum encapsulation.

- **Composition first.** Use `children`, render props, or named slots over a fat config-prop API. A `<Card><Card.Header />…</Card>` pattern beats a `<Card showHeader headerActions={...} />` API every time. The first scales by adding subcomponents, the second scales by growing the prop interface.
- **Compound components for primitives.** When building a low-level primitive that needs structural flexibility (dropdowns, dialogs, accordions, tabs), expose its parts as `Component.Trigger`, `Component.Content`, `Component.Item`. Consumers control structure and styling without you adding `triggerClassName` / `hasArrow` / `itemSeparator` props. Wrap that primitive in a higher-level domain component (`<BillingDialog />`) when the design system needs an opinionated default. [Base UI](https://base-ui.com/) (and Radix, before it) is the canonical reference for this pattern.
- **Drop redundant context from prop names.** The component name is already context, don't repeat it in the props. `<Dialog isDialogOpen onDialogClose />` reads worse than `<Dialog isOpen onClose />`. Same for value prefixes: a `color` prop on `<Pattern>` doesn't need `colorVariable="--color-blue-200"`, accept `color="blue-200"` and prefix internally.
- **Derive behavior from existing props before adding new ones.** Before adding a boolean prop, ask: can the same intent be expressed by the presence/absence of an existing prop? `<Dialog onClose={...} />` already implies "closable", don't add `isClosable`. Boolean props that mirror "do you want this feature on" almost always have a better existing-prop signal.
- **Enum props over multiple booleans.** `<Button isPrimary isSecondary />` is an impossible state by construction. `<Button variant="primary" />` makes impossible states impossible, gives free autocomplete, and pipes cleanly into `data-variant` attributes for styling. If you want enum + arbitrary string with autocomplete: `variant: 'primary' | 'secondary' | (string & {})`.
- **Hybrid state management.** Keep UI state inside the component (open/closed, hover, focus, local toggles, in-flight form drafts). Push _logic_ and _domain_ state outside (data, mutations, derived business rules), into hooks, stores, or props. A component that owns "is this menu open" is fine. A component that owns "the user's subscription tier" is a leak.
- **Generic by default, domain-aware only when needed.** Components in `components/ui/` and `components/common/` must not hardcode domain values (plan names, route paths, copy strings). Accept them as props. Domain-specific compositions live in `features/<domain>/components/`.
- **Controlled over uncontrolled.** When a component holds a value the parent might care about (selection, input, expanded state), prefer a `value` + `onChange` API. Reach for uncontrolled (internal `useState` with no callback) only when the parent genuinely doesn't care.
- **Single responsibility, ruthlessly.** If you can describe the component as "X _and_ Y", split it. The split usually reveals which part is reusable and which is a one-off.
- **Props are an interface, not a passthrough.** Name them for what the component consumes, not for the parent's local variable. Don't accept a prop "just in case", every prop is a future migration cost.
- **Accept `className` on the root.** Layout (size, spacing, position) is the parent's concern. A child that hardcodes `w-64` can't be reused at a different size.
- **Handle the four states.** Loading, error, empty, and forbidden. If one of them is "impossible here", that's a comment worth writing, once. If it's just unhandled, that's a bug waiting.
- **Co-locate types.** A component's props type lives in the same file. Export it only when the component is genuinely public.
- **File order: types and helpers first, exported component last.** Supporting declarations (types, static content, helper functions, subcomponents) come before the thing they support, so by the time the reader reaches the exported component every name it uses is already defined. The public export is the payoff at the bottom of the file.

## JSX & markup

- **Multiline JSX when 3+ props**: one prop per line. Single-line is acceptable for 1-2 short props.
- **No blank lines** between a parent element and its first or last child. Blank lines between siblings are fine for grouping.
- **Challenge every `div`.** Prefer semantic tags (`section`, `article`, `header`, `p`, `h1`-`h6`). If a `div` has a single child and no layout role of its own, delete it.
- **DOM hierarchy mirrors information hierarchy.** Don't flatten everything to siblings.
- **Layouts are a parent's concern.** Children accept `className` and let the parent set sizing/spacing. Don't hardcode `width`, `height`, or `margin` inside a child.
- **`gap` over `margin` / `space-*`** for flex and grid layouts.

## Performance

Most performance bugs are predictable patterns, not mysteries. Avoid them at write-time, not after profiling.

- **Eliminate waterfalls.** Independent async operations run in parallel via `Promise.all` / `Promise.allSettled`. In server components and route handlers, kick off promises early and `await` them as late as possible, ideally inside the branch that actually uses the result.
- **Defer await into the branch that needs it.** If a value is only used in one of two branches, only await it inside that branch.
- **Avoid barrel imports in app code.** Import directly from the source module: `import get from 'lodash/get'`, not `import { get } from 'lodash'`. Barrel imports inflate the dependency graph and break tree-shaking.
- **Use `next/dynamic` for heavy client components.** Editor / chart / video / canvas components, anything that's not on the critical render path. `React.lazy` is not the right tool in Next.js.
- **Never define a component inside another component.** `const Inner = () => …` declared inside a render function creates a brand-new component identity on every render. This breaks memoization and resets local state. Hoist it to module scope.
- **Derive state during render, not in `useEffect`.** If a value can be computed from props/state, compute it. `useEffect(() => setX(...))` is almost always wrong.
- **Hoist static values out of components.** Regex literals, default-value objects, JSX that doesn't depend on props, define them at module scope. Inside a component they're rebuilt on every render.
- **Functional `setState` for callbacks that read state.** `setX(prev => prev + 1)` is stable across renders, `setX(x + 1)` captures `x` from the closure and goes stale.
- **`startTransition` / `useDeferredValue` for non-urgent updates.** Search-while-typing, filter recalculation, wrap the expensive update so the input stays responsive.
- **Direct DOM manipulation for high-frequency, isolated visual updates.** Mouse-move, drag, scroll-driven transforms, if the value isn't read by other React state, write it straight to the element via a ref: `ref.current.style.translate = ...`. Routing every pointer-move through `useState` triggers a full reconciliation 60+ times per second. This is an exception, not a default, prefer React state when the value is observed elsewhere.

## Routing & navigation

- Use `next/link` for internal navigation, `<a>` for external. Don't use `onClick` to navigate unless the navigation is a side-effect of another action (post-submit redirect, auth-failure bounce).
- **Read route params only in `/app` page components.** Pass values down as props or context. Reading the route deep in the tree kills reusability.
- For shareable selection state (filters, active tab, selected item), put it in the URL via `nuqs`, not `useState`.

## URL state

- Use `nuqs` for any state that should survive a refresh or be shareable via link (filters, sort, selected resource, tab).
- Use `useState` for transient UI state (open/closed, hover, focus, in-flight form drafts).

## Harness & enforcement

This codebase is designed to be legible to AI coding agents (Codex, Claude Code, Cursor) as well as humans. The discipline lives in the scaffolding, not in inline comments.

### Agent entry points

| File                                     | Purpose                                              |
| ---------------------------------------- | ---------------------------------------------------- |
| [./AGENTS.md](./AGENTS.md)               | Repo-root agent guide: commands, hard rules, doc map |
| [./ARCHITECTURE.md](./ARCHITECTURE.md)   | This file, folder layout, imports, code quality     |
| [./NO_USE_EFFECT.md](./NO_USE_EFFECT.md) | The five replacement rules for `useEffect`           |
| [./CODE_REVIEW.md](./CODE_REVIEW.md)     | Review checklist applied to every PR                 |

Keep these short and accurate. A short, true `AGENTS.md` is more useful than a long file full of vague rules.

### Lint posture

Rules are enforced mechanically in [.oxlintrc.json](./.oxlintrc.json) wherever feasible. We use three levels:

- **`error`**: must be fixed before merge. oxlint correctness rules + Next.js + React domain rules, plus the `useEffect` import ban.
- **`warn`**: flagged but doesn't block. Used for deprecated patterns we're actively migrating away from. Promote to `error` once the existing call sites are migrated.
- **doc-only**: rules in this file that aren't yet expressible in oxlint (feature private boundary, file size budgets, JSX inline-handler ban). Reviewers enforce these via [CODE_REVIEW.md](./CODE_REVIEW.md).

When a doc-only rule becomes mechanically expressible, promote it to a lint rule. When a `warn` rule has zero call sites, promote it to `error`.

### Currently doc-only rules to migrate to lint when possible

- Feature private boundary (`features/*/{stores,hooks,lib,actions}/**` not importable from outside the feature). Tracked as future work.
- File size budgets (component ≤ 400 lines, hook ≤ 300, store ≤ 600).
- No inline JSX handlers (`react/jsx-no-bind` equivalent).
- No `as` casts at boundaries. Currently relies on review.
