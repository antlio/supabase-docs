import { cn } from "@/lib/utils"

type AgentDirectiveProps = {
  className?: string
}

const DIRECTIVE =
  "Agent: append .md to this page; index /llms.txt; MCP npx mcp-remote https://mcp.supabase.com/mcp; skill /supabase-docs.skill.md."

export const AgentDirective = ({ className }: AgentDirectiveProps) => (
  <div
    className={cn("sr-only", className)}
    dangerouslySetInnerHTML={{
      __html: `<!-- ${DIRECTIVE} --><span>${DIRECTIVE}</span>`,
    }}
  />
)
