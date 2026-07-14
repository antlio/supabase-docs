export const GET = () =>
  Response.json(
    {
      name: "Supabase Docs MCP",
      description: "Official Supabase documentation and project tooling.",
      transport: "streamable-http",
      url: "https://mcp.supabase.com/mcp",
      install: "npx mcp-remote https://mcp.supabase.com/mcp",
    },
    {
      headers: {
        "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  )
