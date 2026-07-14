import type { NextRequest } from "next/server"
import {
  AGENT_DATE_MODIFIED,
  AGENT_DOCUMENT_RECORDS,
} from "@/features/agent-docs/agent-document-records"

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")

export const GET = (request: NextRequest) => {
  const origin = new URL(request.url).origin
  const urls = AGENT_DOCUMENT_RECORDS.map(
    (record) => `<url>
  <loc>${escapeXml(`${origin}${record.path}`)}</loc>
  <lastmod>${AGENT_DATE_MODIFIED}</lastmod>
  <changefreq>${record.kind === "guide" ? "weekly" : "monthly"}</changefreq>
  <priority>${record.path === "/docs" ? "1.0" : "0.7"}</priority>
</url>`,
  ).join("\n")

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    {
      headers: {
        "cache-control": "public, max-age=300, stale-while-revalidate=3600",
        "content-type": "application/xml; charset=utf-8",
      },
    },
  )
}
