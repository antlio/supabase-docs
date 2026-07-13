import { cn } from "@/lib/utils"

type ModulesCubeArtProps = {
  className?: string
}

const faceTransition =
  "transition-[fill] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[active]/module-cube:duration-400"

export const ModulesCubeArt = ({ className }: ModulesCubeArtProps) => (
  <svg aria-hidden viewBox="0 0 440 280" className={cn("h-auto w-full max-w-[440px]", className)}>
    <defs>
      <clipPath id="modules-cube-clip">
        <rect width="440" height="280" fill="var(--color-foreground)" />
      </clipPath>
    </defs>

    <g clipPath="url(#modules-cube-clip)">
      <rect
        x="86.505"
        y="57.075"
        width="66.99"
        height="195.85"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.5"
      />
      <rect
        x="220.408"
        y="19.401"
        width="122.831"
        height="260.349"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.5"
        strokeDasharray="4 4"
      />

      <path
        d="M214.633 152.683C218.012 150.994 221.988 150.994 225.367 152.683L320 200L270 225L220 250L120 200L214.633 152.683Z"
        fill="var(--color-well)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M121.658 210.829C120.642 210.321 120 209.282 120 208.146V200L220 250V260L121.658 210.829Z"
        fill="var(--color-well)"
      />
      <path d="M320 210V200L270 225L220 250V260L320 210Z" fill="var(--color-surface-raised)" />
      <path
        d="M220 260L121.658 210.829C120.642 210.321 120 209.282 120 208.146V200L214.633 152.683C218.012 150.994 221.988 150.994 225.367 152.683L320 200V210L220 260ZM320 200L270 225L220 250M220 250L120 200M220 250V260"
        fill="none"
        stroke="var(--color-module-cube-outline)"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <path
        d="M220 155L260 175L220 195L180 175L220 155Z"
        fill="var(--color-background)"
        opacity="0.4"
      />
      <path
        d="M178 179.692L218 199.692L178 219.692L138 199.692L178 179.692Z"
        fill="var(--color-background)"
        opacity="0.6"
      />
      <path
        d="M262 179.692L302 199.692L262 219.692L222 199.692L262 179.692Z"
        fill="var(--color-background)"
        opacity="0.6"
      />

      <g
        data-scroll-accent-art
        className="group/module-cube translate-y-20 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-[active]:translate-y-0 data-[active]:duration-500 motion-reduce:translate-y-0 motion-reduce:transition-colors motion-reduce:duration-150"
      >
        <path
          d="M214.633 46.683C218.012 44.994 221.988 44.994 225.367 46.683L260 64L220 84L180 64L214.633 46.683Z"
          className={cn(
            "fill-well group-data-[active]/module-cube:fill-module-cube-active-top",
            faceTransition,
          )}
        />
        <path
          d="M260 64V100L220 120V84L260 64Z"
          className={cn(
            "fill-surface-raised group-data-[active]/module-cube:fill-brand",
            faceTransition,
          )}
        />
        <path
          d="M180 64V98.146C180 99.282 180.642 100.321 181.658 100.829L200 110L220 120V84L180 64Z"
          className={cn(
            "fill-background group-data-[active]/module-cube:fill-module-cube-active-left",
            faceTransition,
          )}
        />
        <path
          d="M219.75 84.154V119.596L200.111 109.776L181.771 100.605C180.839 100.14 180.25 99.187 180.25 98.145V64.404L219.75 84.154ZM259.75 99.846L220.25 119.596V84.154L259.75 64.404V99.846ZM214.745 46.907C218.053 45.253 221.947 45.253 225.255 46.907L259.44 64L220 83.721L180.559 64L214.745 46.907Z"
          fill="none"
          strokeLinecap="round"
          strokeWidth="0.5"
          className="stroke-module-cube-outline transition-[stroke] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[active]/module-cube:stroke-firework-green group-data-[active]/module-cube:duration-400"
        />
      </g>

      <path
        d="M164.633 126.683C168.012 124.994 171.988 124.994 175.367 126.683L210 144L170 164L130 144L164.633 126.683Z"
        fill="var(--color-well)"
      />
      <path
        d="M130 144V178.146C130 179.282 130.642 180.321 131.658 180.829L170 200V164L130 144Z"
        fill="var(--color-background)"
      />
      <path d="M210 144L170 164V200L210 180V144Z" fill="var(--color-surface-raised)" />
      <path
        d="M170 200L131.658 180.829C130.642 180.321 130 179.282 130 178.146V144L164.633 126.683C168.012 124.994 171.988 124.994 175.367 126.683L210 144V180L170 200ZM210 144L170 164M170 164L130 144M170 164V200"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <path
        d="M264.633 126.683C268.012 124.994 271.988 124.994 275.367 126.683L310 144L270 164L230 144L264.633 126.683Z"
        fill="var(--color-well)"
      />
      <path d="M310 144V180L270 200V164L310 144Z" fill="var(--color-surface-raised)" />
      <path
        d="M230 144V178.146C230 179.282 230.642 180.321 231.658 180.829L270 200V164L230 144Z"
        fill="var(--color-background)"
      />
      <path
        d="M270 200L231.658 180.829C230.642 180.321 230 179.282 230 178.146V144L264.633 126.683C268.012 124.994 271.988 124.994 275.367 126.683L310 144V180L270 200ZM310 144L270 164M270 164L230 144M270 164V200"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </g>
  </svg>
)
