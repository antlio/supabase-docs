import { buildDocsSkill, markdownResponse } from "@/features/agent-docs/agent-protocol"

export const GET = () => markdownResponse(buildDocsSkill())
