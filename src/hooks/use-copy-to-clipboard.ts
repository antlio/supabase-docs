"use client"

import { useRef, useState } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"

export const COPY_FEEDBACK_MS = 2000

type UseCopyToClipboardOptions = {
  feedbackMs?: number
}

export const useCopyToClipboard = ({
  feedbackMs = COPY_FEEDBACK_MS,
}: UseCopyToClipboardOptions = {}) => {
  const [copied, setCopied] = useState(false)
  const feedbackTimerRef = useRef<number | undefined>(undefined)

  useMountEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current)
  })

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      window.clearTimeout(feedbackTimerRef.current)
      setCopied(true)
      feedbackTimerRef.current = window.setTimeout(() => setCopied(false), feedbackMs)
      return true
    } catch {
      window.clearTimeout(feedbackTimerRef.current)
      setCopied(false)
      return false
    }
  }

  return { copied, copy }
}
