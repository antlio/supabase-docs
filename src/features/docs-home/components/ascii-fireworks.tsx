"use client"

import { useRef } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"

type AsciiFireworksProps = {
  onDone: () => void
  className?: string
}

type ParticleBase = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  gravity: number
  drag: number
  color: string
}

type Particle = ParticleBase &
  (
    | {
        kind: "ray"
        length: number
      }
    | {
        kind: "glyph"
        glyph: string
      }
  )

type Shell = {
  x: number
  y: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  startedAt: number
  duration: number
  lastTrailAt: number
  color: string
  colorIndex: number
}

type SideBurst = {
  x: number
  y: number
  at: number
  color: string
}

const COLOR_TOKENS = [
  "--color-firework-green",
  "--color-accent",
  "--color-firework-mint",
  "--color-firework-pink",
  "--color-firework-blue",
  "--color-firework-yellow",
  "--color-firework-purple",
] as const
const GLYPHS = ["*", "+", ".", "o", "x", "'"] as const
const SHELL_LAUNCHES = [
  { delay: 0, x: 0.28, targetY: 0.24, duration: 760, drift: -0.035, color: 0 },
  { delay: 620, x: 0.68, targetY: 0.31, duration: 820, drift: 0.045, color: 3 },
  { delay: 1240, x: 0.48, targetY: 0.18, duration: 880, drift: -0.025, color: 4 },
  { delay: 1900, x: 0.78, targetY: 0.25, duration: 780, drift: 0.03, color: 5 },
] as const
const FRAME_MS = 1000 / 60
const TRAIL_INTERVAL_MS = 34
const SIDE_BURST_DELAY_MS = 170
const MAX_DURATION_MS = 5200
const REDUCED_DURATION_MS = 900

export const AsciiFireworks = ({ onDone, className }: AsciiFireworksProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useMountEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const styles = getComputedStyle(document.documentElement)
    const colors = COLOR_TOKENS.map((token) => styles.getPropertyValue(token).trim())
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const particles: Particle[] = []
    const shells: Shell[] = []
    const sideBursts: SideBurst[] = []
    const start = performance.now()
    let nextLaunch = 0
    let lastFrame = start
    let raf = 0

    const burst = (x: number, y: number, color: string, count: number, strength: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const speed = strength
        particles.push({
          kind: "ray",
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012,
          gravity: 0,
          drag: 0.985,
          color,
          length: strength * 3.15,
        })
      }
    }

    const explodeShell = (shell: Shell, now: number, width: number) => {
      burst(shell.x, shell.y, shell.color, 34, 4.2)
      const offset = Math.min(72, width * 0.065)
      sideBursts.push(
        {
          x: shell.x - offset,
          y: shell.y + 24,
          at: now + SIDE_BURST_DELAY_MS,
          color: colors[(shell.colorIndex + 2) % colors.length],
        },
        {
          x: shell.x + offset,
          y: shell.y + 18,
          at: now + SIDE_BURST_DELAY_MS + 70,
          color: colors[(shell.colorIndex + 4) % colors.length],
        },
      )
    }

    const drawReducedCelebration = (elapsed: number, width: number, height: number) => {
      const life = Math.max(0, 1 - elapsed / REDUCED_DURATION_MS)
      ctx.globalAlpha = Math.min(1, life * 2)
      for (let ring = 1; ring <= 3; ring++) {
        const count = ring * 10
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count
          ctx.fillStyle = colors[(i + ring) % colors.length]
          ctx.fillText(
            GLYPHS[(i + ring) % GLYPHS.length],
            width / 2 + Math.cos(angle) * ring * 34,
            height * 0.34 + Math.sin(angle) * ring * 34,
          )
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const elapsed = now - start
      const frameScale = Math.min(2, (now - lastFrame) / FRAME_MS)
      lastFrame = now

      ctx.clearRect(0, 0, w, h)
      ctx.font = "16px ui-monospace, monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (reduceMotion) {
        drawReducedCelebration(elapsed, w, h)
        if (elapsed >= REDUCED_DURATION_MS) {
          onDone()
          return
        }
        raf = requestAnimationFrame(frame)
        return
      }

      while (nextLaunch < SHELL_LAUNCHES.length && elapsed >= SHELL_LAUNCHES[nextLaunch].delay) {
        const launch = SHELL_LAUNCHES[nextLaunch]
        const startX = w * launch.x
        shells.push({
          x: startX,
          y: h + 12,
          startX,
          startY: h + 12,
          targetX: startX + w * launch.drift,
          targetY: h * launch.targetY,
          startedAt: now,
          duration: launch.duration,
          lastTrailAt: now - TRAIL_INTERVAL_MS,
          color: colors[launch.color],
          colorIndex: launch.color,
        })
        nextLaunch++
      }

      for (let i = shells.length - 1; i >= 0; i--) {
        const shell = shells[i]
        const progress = Math.min(1, (now - shell.startedAt) / shell.duration)
        const eased = 1 - (1 - progress) ** 3
        shell.x = shell.startX + (shell.targetX - shell.startX) * eased
        shell.y = shell.startY + (shell.targetY - shell.startY) * eased

        if (now - shell.lastTrailAt >= TRAIL_INTERVAL_MS) {
          particles.push({
            kind: "glyph",
            x: shell.x,
            y: shell.y + 8,
            vx: 0,
            vy: 0.35,
            life: 0.62,
            decay: 0.035,
            gravity: 0.004,
            drag: 0.99,
            color: shell.color,
            glyph: progress > 0.7 ? "+" : ".",
          })
          shell.lastTrailAt = now
        }

        ctx.globalAlpha = 0.9
        ctx.fillStyle = shell.color
        ctx.fillText("|", shell.x, shell.y)

        if (progress >= 1) {
          explodeShell(shell, now, w)
          shells.splice(i, 1)
        }
      }

      for (let i = sideBursts.length - 1; i >= 0; i--) {
        const sideBurst = sideBursts[i]
        if (now < sideBurst.at) continue
        burst(sideBurst.x, sideBurst.y, sideBurst.color, 12, 2.2)
        sideBursts.splice(i, 1)
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.vx *= particle.drag ** frameScale
        particle.vy = particle.vy * particle.drag ** frameScale + particle.gravity * frameScale
        particle.x += particle.vx * frameScale
        particle.y += particle.vy * frameScale
        particle.life -= particle.decay * frameScale
        if (particle.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.globalAlpha = particle.life
        if (particle.kind === "ray") {
          const speed = Math.hypot(particle.vx, particle.vy) || 1
          const unitX = particle.vx / speed
          const unitY = particle.vy / speed
          ctx.beginPath()
          ctx.moveTo(particle.x - unitX * particle.length, particle.y - unitY * particle.length)
          ctx.lineTo(particle.x, particle.y)
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 1.25
          ctx.stroke()
        } else {
          ctx.fillStyle = particle.color
          ctx.fillText(particle.glyph, particle.x, particle.y)
        }
      }
      ctx.globalAlpha = 1

      const finished =
        nextLaunch === SHELL_LAUNCHES.length &&
        shells.length === 0 &&
        sideBursts.length === 0 &&
        particles.length === 0
      if (elapsed > MAX_DURATION_MS || finished) {
        onDone()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  })

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[100] animate-[fade-in_200ms_ease-out] motion-reduce:animate-none",
        className,
      )}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
