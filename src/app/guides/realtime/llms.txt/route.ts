import { textResponse } from "@/features/agent-docs/agent-protocol"

const REALTIME_INDEX = `# Supabase Realtime agent index

This prototype does not mirror the Realtime guide corpus. Continue at /llms.txt or use the canonical Realtime guide:

- realtime.overview | https://supabase.com/docs/guides/realtime | Listen to database changes, presence, and broadcast channels.
`

export const GET = () => textResponse(REALTIME_INDEX)
