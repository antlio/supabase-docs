# No useEffect

Never call `useEffect` directly. Use derived state, event handlers, data-fetching libraries, or `useMountEffect` instead.

This is the long-form companion to the hard rule in [AGENTS.md](AGENTS.md) and the React section of [ARCHITECTURE.md](ARCHITECTURE.md). It is referenced by [CODE_REVIEW.md](CODE_REVIEW.md).

## Quick reference

- React docs: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- Origin: [alvinsng on X](https://x.com/alvinsng/status/2033969062834045089)

| Instead of useEffect for...           | Use                                  |
| ------------------------------------- | ------------------------------------ |
| Deriving state from other state/props | Inline computation (Rule 1)          |
| Fetching data                         | TanStack Query / `useQuery` (Rule 2) |
| Responding to user actions            | Event handlers (Rule 3)              |
| One-time external sync on mount       | `useMountEffect` (Rule 4)            |
| Resetting state when a prop changes   | `key` prop on parent (Rule 5)        |

## When this applies

- Writing new React components.
- Refactoring existing `useEffect` calls when you touch a file.
- Reviewing PRs (human or agent) that introduce `useEffect`.
- An agent adds `useEffect` "just in case", push back.

## Workflow

1. **Identify what the effect is doing**: deriving state, fetching, responding to an event, syncing with an external system, or resetting state.
2. **Apply the matching rule below.**
3. **Verify**: `bun run lint` and `bunx tsc --noEmit` pass for the changed files.

## The escape hatch: `useMountEffect`

For the rare case where you genuinely need to sync with an external system on mount, use the sanctioned helper at [src/hooks/use-mount-effect.ts](src/hooks/use-mount-effect.ts). It wraps `useEffect` with an empty dependency array so intent is explicit, and it carries the lone exemption from the `no-restricted-imports` oxlint rule that bans `useEffect` everywhere else.

```ts
import { useMountEffect } from "@/hooks/use-mount-effect"

useMountEffect(() => {
  doSomethingOnce()
  return () => cleanup()
})
```

Reach for this only after Rules 1–3 and 5 don't apply.

## Replacement patterns

### Rule 1: Derive state, do not sync it

Most effects that set state from other state are unnecessary and add an extra render cycle.

```tsx
// bad: two renders, first stale then filtered
const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    setFilteredProducts(products.filter((p) => p.inStock))
  }, [products])
}

// good: compute inline in one render
const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const filteredProducts = products.filter((p) => p.inStock)
}
```

**Smell test:** you are about to write `useEffect(() => setX(deriveFromY(y)), [y])`, or you have state that only mirrors other state or props.

### Rule 2: Use a data-fetching library

Effect-based fetching creates race conditions and forces you to re-implement caching, cancellation, and staleness.

```tsx
// bad: race condition risk
const ProductPage = ({ productId }: { productId: string }) => {
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetchProduct(productId).then(setProduct)
  }, [productId])
}

// good: TanStack Query handles cancellation, caching, staleness
const ProductPage = ({ productId }: { productId: string }) => {
  const { data: product } = useQuery(productQueryOptions(productId))
}
```

**Smell test:** your effect does `fetch(...)` then `setState(...)`, or you are reinventing cache/retry/cancellation logic.

### Rule 3: Event handlers, not effects

If a user action triggers the work, do the work in the handler.

```tsx
// bad: effect as an action relay
const LikeButton = () => {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (liked) {
      postLike()
      setLiked(false)
    }
  }, [liked])

  return <button onClick={() => setLiked(true)}>Like</button>
}

// good: direct event-driven action
const LikeButton = () => {
  const onLike = () => postLike()
  return <button onClick={onLike}>Like</button>
}
```

**Smell test:** state is used as a flag so an effect can do the real action, or you are building "set flag → effect runs → reset flag" mechanics.

### Rule 4: `useMountEffect` for one-time external sync

Good uses: DOM integration (focus, scroll), third-party widget lifecycles, browser API subscriptions.

```tsx
// bad: guard inside effect
const VideoPlayer = ({ isLoading }: { isLoading: boolean }) => {
  useEffect(() => {
    if (!isLoading) playVideo()
  }, [isLoading])
}

// good: only mount when preconditions are met
const VideoPlayerWrapper = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) return <LoadingScreen />
  return <VideoPlayer />
}

const VideoPlayer = () => {
  useMountEffect(() => playVideo())
}
```

`useMountEffect` is also the right call for stable dependencies (singletons, refs, context values that never change):

```tsx
// bad: useEffect with a dep that never changes
useEffect(() => {
  connectionManager.on("connected", handleConnect)
  return () => connectionManager.off("connected", handleConnect)
}, [connectionManager]) // singleton from context

// Good
useMountEffect(() => {
  connectionManager.on("connected", handleConnect)
  return () => connectionManager.off("connected", handleConnect)
})
```

**Smell test:** you are syncing with an external system, and the behavior is naturally "setup on mount, cleanup on unmount."

### Rule 5: Reset with `key`, not dependency choreography

```tsx
// bad: effect emulates remount
const VideoPlayer = ({ videoId }: { videoId: string }) => {
  useEffect(() => {
    loadVideo(videoId)
  }, [videoId])
}

// good: key forces a clean remount
const VideoPlayer = ({ videoId }: { videoId: string }) => {
  useMountEffect(() => loadVideo(videoId))
}

const VideoPlayerWrapper = ({ videoId }: { videoId: string }) => (
  <VideoPlayer key={videoId} videoId={videoId} />
)
```

**Smell test:** you are writing an effect whose only job is to reset local state when an ID/prop changes, or you want the component to behave like a brand-new instance per entity.

## Component structure convention

Computed values come after hooks and local state, never via `useEffect`:

```tsx
export const FeatureComponent = ({ featureId }: FeatureComponentProps) => {
  // Hooks first
  const { data, isLoading } = useFeature(featureId)

  // Local state
  const [isOpen, setIsOpen] = useState(false)

  // Derived values (NOT useEffect + setState)
  const displayName = data?.name ?? "Unknown"

  // Event handlers
  const onOpen = () => setIsOpen(true)

  // Early returns
  if (isLoading) return <Loading />

  // Render
  return <section>{/* … */}</section>
}
```
