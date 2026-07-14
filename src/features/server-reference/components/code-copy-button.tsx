"use client"

import { CopyStateIcon } from "@/components/common/copy-state-icon"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

type CodeCopyButtonProps = {
  code: string
  className?: string
}

export const CodeCopyButton = ({ code, className }: CodeCopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard()

  const onCopy = async () => {
    await copy(code)
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied code" : "Copy code"}
      className={cn(
        "flex size-7 items-center justify-center rounded-xs bg-surface-raised text-foreground-muted shadow-raised outline-none",
        "transition-[color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-foreground-soft active:scale-[0.96] active:duration-[220ms] motion-reduce:active:scale-100",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
        className,
      )}
    >
      <CopyStateIcon copied={copied} />
    </button>
  )
}
