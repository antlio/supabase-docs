// oxlint-disable-next-line no-restricted-imports -- the one sanctioned useEffect wrapper, see NO_USE_EFFECT.md
import { useEffect, type EffectCallback } from "react"

/** one-time external sync on mount, the only sanctioned useEffect entry point (see NO_USE_EFFECT.md) */
export const useMountEffect = (effect: EffectCallback): void => {
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- empty deps is the point, run once on mount
  useEffect(effect, [])
}
