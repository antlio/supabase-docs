# Frontend code review checklist

This is the checklist that every PR (human or agent-authored) is reviewed against. It pairs with [ARCHITECTURE.md](ARCHITECTURE.md). The architecture doc says how things should be, this doc says what reviewers actively check.

If a checkbox below is failing on a PR, the PR is not mergeable. Fix the underlying issue, do not suppress the rule.

---

## Correctness

- [ ] `bun run lint` passes for the changed files.
- [ ] `bunx tsc --noEmit` passes for the changed files.
- [ ] For UI changes: the feature was exercised in a real browser. Type-checks alone are not sufficient.
- [ ] No new `useEffect`. Derive state, use TanStack Query, run work in event handlers, or use `useMountEffect` for one-time external sync. See [NO_USE_EFFECT.md](NO_USE_EFFECT.md).
- [ ] No new `as` casts at boundaries. Validate with Zod (`schema.parse` / `safeParse`) when crossing an external trust boundary (API, URL params, localStorage, postMessage).
- [ ] No non-null assertions (`!`). Handle `null` / `undefined` explicitly.
- [ ] No `any`. Function parameters and exported function return types are explicitly typed. Use `unknown` and narrow when the type is genuinely unknown.
- [ ] Loading, error, empty, and forbidden states are all handled (or the absence is justified).

## Architecture & boundaries

- [ ] New domain code lives in `src/features/<domain>/`, not at the top level.
- [ ] No imports from another feature's private dirs (`stores/`, `hooks/`, `lib/`, `actions/`, `providers/`). If you needed one, expose it through a public component or `api/` function.
- [ ] No barrel files (`index.ts` re-exports per feature).
- [ ] Server actions (`'use server'`) live in `actions/` only. Plain helpers belong in `lib/`.
- [ ] Vendor SDK imports (Clerk, Supabase, Stripe, …) go through the project's `lib/` wrapper, features don't import vendor packages directly.

## Data fetching

- [ ] Every `api/*.ts` file exports a `<noun>QueryOptions(args)` function alongside its fetcher.
- [ ] Components consume queries via custom hooks (`useFoo`), not inline `useQuery({ queryKey, queryFn })`.
- [ ] Conditional fetching uses `skipToken`, not `enabled` alone.
- [ ] Mutations live in `useCreateX` / `useUpdateX` / `useDeleteX` hooks with `onSuccess` invalidation, not inline.

## Code quality

- [ ] No inline arrow functions in JSX handlers, handlers are named, defined above the return.
- [ ] Event handler props named `on(Noun)(Action)`. No `setSelectedX` / `setItems` passed as props.
- [ ] List `key` is a stable ID. Never the array index.
- [ ] Props are named for what the component consumes, not for the parent's variable name.
- [ ] `const` is used for all bindings that are not reassigned. `let` only when reassignment is genuinely needed.
- [ ] Hardcoded values are extracted into module-scope `SCREAMING_SNAKE_CASE` constants.
- [ ] No commented-out code. No "removed: …" placeholder comments. Git remembers.
- [ ] Comments only explain non-obvious WHY. No "this function sorts names" on `sortNames`.
- [ ] Functions and components do one thing. If two concerns are growing in one file, split them.

## Component design

- [ ] Reusable components (`components/ui/`, `components/common/`, public feature components) are generic, no hardcoded domain values, copy strings, or route paths.
- [ ] Composition with `children` / slots is preferred over fat config-prop APIs.
- [ ] UI state (open/closed, hover, focus, local toggles) is internal. Domain state (data, business rules, mutations) comes from props, hooks, or stores.
- [ ] Components that hold a parent-relevant value expose `value` + `onChange` (controlled), not just internal state.
- [ ] No prop is accepted "just in case", every prop is justified by an actual call site.
- [ ] Prop names don't duplicate the component's own context (`<Dialog isOpen />`, not `<Dialog isDialogOpen />`).
- [ ] No new boolean prop that could be derived from an existing prop's presence/absence (e.g. `isClosable` when `onClose` already encodes the same intent).
- [ ] Mutually exclusive states use a single `variant` enum prop, not multiple booleans (`<Button variant="primary" />`, not `<Button isPrimary isSecondary />`).
- [ ] Component file order: exported component → subcomponents → helpers → static content → types.

## React 19 & Next.js

- [ ] No `forwardRef`. `ref` is a regular prop.
- [ ] No `React.lazy` for client components, use `next/dynamic`.
- [ ] No `function` declarations for components or helpers, arrow functions.
- [ ] Server Components by default, `'use client'` only when interactivity, hooks, or browser APIs are needed.
- [ ] Route params are read in `/app` page components only, values are passed down as props.
- [ ] Internal navigation uses `next/link`, external uses `<a>`. `onClick` for navigation only as a side-effect of another event.

## JSX & markup

- [ ] 3+ props → multiline JSX, one prop per line.
- [ ] No blank lines between a parent and its first/last child.
- [ ] Semantic tags (`section`, `article`, `header`, `p`, `h*`) preferred over `div`. Every `div` has been challenged.
- [ ] Layout (size, spacing, margin) is set by the parent via `className`, not hardcoded inside the child.
- [ ] `gap` for flex/grid spacing, not `margin` / `space-*`.

## Performance

- [ ] Independent async operations are parallelized with `Promise.all`. No serial `await`s where parallel would work.
- [ ] No `await` of a value that's only used in one branch, push the `await` into the branch.
- [ ] No new barrel imports in app code (`import { x } from 'lodash'`). Import from the source module path.
- [ ] No component is defined inside another component's render function.
- [ ] Heavy client-only components are loaded via `next/dynamic`, not eagerly imported.
- [ ] Static values (regex, default objects, large arrays) are at module scope, not redefined on each render.

## State

- [ ] No prop is duplicated into `useState`. Derived values are variables, not state.
- [ ] State lives at the lowest level that needs it.
- [ ] Shareable / refresh-survivable state (filters, tabs, selection) is in the URL via `nuqs`.

## Styling

- [ ] `cn(...)` used for conditional classes. No string concatenation.
- [ ] Components accept `className` and pass it to the root via `cn()`.
- [ ] Icons come from [HugeIcons](https://hugeicons.com/), not Lucide / react-icons. Default `strokeWidth={2.25}`.
- [ ] Icon sizing uses Tailwind: `<Icon className="size-4" />`, not `size={16}`.
- [ ] New headless primitives use [Base UI](https://base-ui.com/), not Radix. Existing Radix usage in untouched code is fine, don't add new `@radix-ui/*` imports without a justified note in the PR.
- [ ] Variants are semantic (`destructive`, `success`), not color-based (`purple`).
- [ ] Images use `next/image`, not raw `<img>` tags.

## Tests

- [ ] If you added a non-trivial pure helper, it has a Vitest test.
- [ ] Tests assert behavior, not implementation details.
- [ ] No `.skip` / `.only` left in committed tests.

---

## Reviewer mindset

When reviewing and especially when reviewing an agent's PR your job is not to verify that the code "looks plausible." Your job is to verify each line above. If the agent's summary says "X is done" but the diff doesn't show X, the summary is wrong.

Trust the diff, not the description.
