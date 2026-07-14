import { buildAgentsFile, markdownResponse } from "@/features/agent-docs/agent-protocol"

export const GET = () => markdownResponse(buildAgentsFile())
