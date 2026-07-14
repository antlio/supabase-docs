"use client"

import { CollapsiblePanel, CollapsibleRoot, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export type ReferenceDetailRow = {
  name: string
  type: string
  description?: string
}

type ReferenceDetailDisclosureProps = {
  details: ReferenceDetailRow[]
  className?: string
}

export const ReferenceDetailDisclosure = ({
  details,
  className,
}: ReferenceDetailDisclosureProps) => (
  <CollapsibleRoot className={cn("mt-4", className)}>
    <CollapsibleTrigger
      indicator={false}
      className={cn(
        "relative h-7 w-fit gap-0 rounded-xs bg-surface-raised px-2.5 py-1 text-left text-[13px] font-medium",
        "text-foreground-subtle shadow-raised transition-[background-color,color,transform] duration-150 ease-out",
        "before:absolute before:-inset-y-1.5 before:inset-x-0",
        "hover:bg-surface hover:text-foreground-soft active:scale-[0.96]",
        "data-[panel-open]:text-brand-foreground",
      )}
    >
      Details
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <div className="pt-2">
        <dl className="divide-y divide-border rounded-xs border border-border">
          {details.map((detail) => (
            <div key={`${detail.name}-${detail.type}`} className="px-5 py-3">
              <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-[13px] font-medium leading-5 text-brand-foreground">
                  {detail.name}
                </span>
                <span className="min-w-0 break-words text-[13px] leading-5 text-foreground-muted">
                  {detail.type}
                </span>
              </dt>
              <dd className="m-0 text-[13px] leading-5 text-foreground-muted empty:hidden [&:not(:empty)]:mt-1">
                {detail.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </CollapsiblePanel>
  </CollapsibleRoot>
)
