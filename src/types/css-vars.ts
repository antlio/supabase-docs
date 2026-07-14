import type { CSSProperties } from "react"

export type CSSVars = CSSProperties & {
  [property: `--${string}`]: string | number | undefined
}
