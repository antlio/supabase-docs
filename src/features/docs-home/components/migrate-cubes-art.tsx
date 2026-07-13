import Image from "next/image"
import { cn } from "@/lib/utils"

type MigrateArtworkGuide = {
  slug: string
  icon: (props: { className?: string }) => React.ReactElement
}

type MigrateCubesArtProps = {
  guides: readonly MigrateArtworkGuide[]
  activeSlug: string | null
  className?: string
}

const ORBIT_PATH =
  "M147.007 151.607C129.827 135.655 119.078 112.873 119.078 87.58C119.078 62.288 129.827 39.505 147.007 23.553C162.596 9.077 183.481 0.225 206.433 0.225C228.617 0.225 248.87 8.494 264.277 22.119C282.376 38.124 293.788 61.52 293.788 87.58C293.788 113.641 282.376 137.036 264.277 153.042C248.87 166.666 228.617 174.935 206.433 174.935C183.481 174.935 162.596 166.084 147.007 151.607Z"

export const MigrateCubesArt = ({ guides, activeSlug, className }: MigrateCubesArtProps) => (
  <div
    data-active={activeSlug ? "" : undefined}
    className={cn("group/migrate-art relative aspect-[410/176] w-full max-w-[410px]", className)}
  >
    <Image
      src="/art/migrate-cubes.svg?v=3"
      alt=""
      fill
      unoptimized
      className="pointer-events-none z-10 object-contain"
    />

    <svg
      aria-hidden
      viewBox="0 0 410 176"
      className="pointer-events-none absolute inset-0 z-10 size-full"
    >
      <defs>
        <clipPath id="migrate-right-cube-clip">
          <path d="M321.345 133.42 272.596 108.504A2.7 2.7 0 0 1 271.125 106.1V63.112l45.305-23.156a10.8 10.8 0 0 1 9.83 0l45.305 23.156V106.1c0 1.014-.568 1.943-1.471 2.404l-48.749 24.916Z" />
        </clipPath>
        <filter
          id="migrate-right-cube-glow"
          x="273.333"
          y="41.238"
          width="96.133"
          height="91.837"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g
        clipPath="url(#migrate-right-cube-clip)"
        className={cn(
          "opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "group-data-[active]/migrate-art:opacity-30 motion-reduce:transition-opacity motion-reduce:duration-150",
        )}
      >
        <path
          d="M320.953 89.58v24.774l-29.174-14.587V74.993l29.174 14.587Zm30.066 10.187-29.174 14.587V89.58l29.174-14.587v24.774Zm-.552-25.495-29.068 14.534-29.068-14.534 29.068-14.535 29.068 14.535Z"
          fill="var(--color-brand)"
          stroke="var(--color-accent)"
          strokeWidth="0.893"
          strokeLinecap="round"
          filter="url(#migrate-right-cube-glow)"
        />
      </g>
    </svg>

    {guides.map((guide) => {
      const Icon = guide.icon

      return (
        <span
          key={`${guide.slug}-glow`}
          data-migrate-icon-glow={guide.slug}
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-[21.22%] top-1/2 z-10 flex size-[52px]",
            "-translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0",
            "blur-[4.5px] transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "[&>svg]:!size-full",
            activeSlug === guide.slug && "opacity-30",
          )}
        >
          <Icon />
        </span>
      )
    })}

    {guides.map((guide) => {
      const Icon = guide.icon

      return (
        <span
          key={guide.slug}
          data-migrate-icon={guide.slug}
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-[21.22%] top-1/2 z-20 flex size-7",
            "-translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0",
            "blur-[1.8px] transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "[&>svg]:!size-full",
            activeSlug === guide.slug && "opacity-90",
          )}
        >
          <Icon />
        </span>
      )
    })}

    <svg
      aria-hidden
      viewBox="0 0 410 176"
      className="pointer-events-none absolute inset-0 z-[30] size-full"
    >
      <defs>
        <linearGradient
          id="migrate-left-cube-right-face"
          x1="87.345"
          y1="37.444"
          x2="87.345"
          y2="133.42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-foreground)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--color-foreground)" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="migrate-left-cube-left-face"
          x1="87.345"
          y1="37.444"
          x2="87.345"
          y2="133.42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-foreground)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--color-foreground)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M137.565 63.112 87.345 88.78v44.64l50.22-25.668v-44.64Z"
        fill="url(#migrate-left-cube-right-face)"
      />
      <path
        d="M87.345 88.78 37.125 63.112V106.1c0 1.014.568 1.943 1.471 2.404l48.749 24.916V88.78Z"
        fill="url(#migrate-left-cube-left-face)"
      />
      <path
        d="M87.345 88.78 37.125 63.112V106.1c0 1.014.568 1.943 1.471 2.404l48.749 24.916V88.78Z"
        fill="var(--color-black)"
        fillOpacity="0.16"
      />
      <path
        d="M87.345 133.42 38.596 108.504A2.7 2.7 0 0 1 37.125 106.1V63.112L82.43 39.956a10.8 10.8 0 0 1 9.83 0l45.305 23.156v44.64L87.345 133.42Zm50.22-70.308L87.345 88.78m0 0-50.22-25.668m50.22 25.668v44.64"
        fill="none"
        stroke="var(--color-module-cube-outline)"
        strokeWidth="0.45"
        strokeLinecap="round"
      />
    </svg>

    <svg
      aria-hidden
      viewBox="0 0 410 176"
      className="pointer-events-none absolute inset-0 z-0 size-full"
    >
      <defs>
        <mask id="migrate-orbit-reveal-mask">
          <path
            d={ORBIT_PATH}
            pathLength="1"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="1"
            strokeDashoffset="1"
            className={cn(
              "transition-[stroke-dashoffset] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]",
              "group-data-[active]/migrate-art:[stroke-dashoffset:0]",
              "motion-reduce:transition-none",
            )}
          />
        </mask>
      </defs>
      <path
        d={ORBIT_PATH}
        fill="none"
        stroke="var(--color-foreground-subtle)"
        strokeWidth="0.9"
        strokeDasharray="3.6 3.6"
        opacity="0.46"
        mask="url(#migrate-orbit-reveal-mask)"
      />
    </svg>
  </div>
)
