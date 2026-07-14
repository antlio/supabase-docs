import { buildLlmsIndex, textResponse } from "@/features/agent-docs/agent-protocol"

export const GET = () => textResponse(buildLlmsIndex())
