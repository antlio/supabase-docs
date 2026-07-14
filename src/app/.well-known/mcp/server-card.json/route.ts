export const GET = () =>
  Response.json(
    {
      name: "Supabase Docs MCP",
      description: "Official Supabase documentation and project tooling for coding agents.",
      url: "https://mcp.supabase.com/mcp",
      transport: "streamable-http",
      tools: [
        {
          name: "search_docs",
          description: "Search the Supabase documentation for implementation guidance.",
        },
      ],
    },
    {
      headers: {
        "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  )
