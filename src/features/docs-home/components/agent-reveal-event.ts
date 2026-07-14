export const AGENT_REVEAL_CHANGE_EVENT = "supabase-agent-reveal-change"

export const dispatchAgentRevealChange = (active: boolean): void => {
  window.dispatchEvent(
    new CustomEvent<boolean>(AGENT_REVEAL_CHANGE_EVENT, {
      detail: active,
    }),
  )
}
