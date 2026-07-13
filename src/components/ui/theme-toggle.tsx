"use client"

import { useState } from "react"
import { MoonIcon } from "@/components/icons/moon"
import { SunIcon } from "@/components/icons/sun"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { cn } from "@/lib/utils"
import { Toggle } from "./toggle"

type Theme = "dark" | "light"

type ThemeToggleProps = {
  className?: string
}

const THEME_STORAGE_KEY = "supabase-docs-theme"
const THEME_CHANGE_EVENT = "supabase-theme-change"

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("dark")
  const isDark = theme === "dark"

  useMountEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark")

    const onThemeChange = (event: Event) => {
      setTheme((event as CustomEvent<Theme>).detail)
    }
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange)

    return () => window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange)
  })

  const onPressedChange = (pressed: boolean) => {
    const nextTheme: Theme = pressed ? "dark" : "light"
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.style.colorScheme = nextTheme
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    setTheme(nextTheme)
    window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: nextTheme }))
  }

  return (
    <Toggle
      pressed={isDark}
      onPressedChange={onPressedChange}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={cn("relative", className)}
    >
      <MoonIcon
        className={cn(
          "absolute transition-[opacity,transform,filter] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
          isDark ? "scale-100 opacity-100 blur-0" : "scale-25 opacity-0 blur-[4px]",
        )}
      />
      <SunIcon
        className={cn(
          "absolute transition-[opacity,transform,filter] duration-150 ease-[cubic-bezier(0.2,0,0,1)]",
          isDark ? "scale-25 opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-0",
        )}
      />
    </Toggle>
  )
}
