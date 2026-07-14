import type { NextRequest } from "next/server"
import {
  getAgentDocumentByPath,
  renderAgentJson,
  renderAgentMarkdown,
} from "@/features/agent-docs/agent-document-records"

const getAgentResponse = (request: NextRequest, includeBody: boolean) => {
  const path =
    request.headers.get("x-agent-canonical-path") ?? request.nextUrl.searchParams.get("path") ?? ""
  const record = getAgentDocumentByPath(path)

  if (!record) {
    return new Response("Not found. Start at /llms.txt.\n", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }

  const { markdown, tokens } = renderAgentMarkdown(record)
  const responseFormat = request.headers.get("x-agent-response-format") ?? "markdown"

  if (responseFormat === "json") {
    return Response.json(renderAgentJson(record), {
      headers: {
        "cache-control": "public, max-age=300, stale-while-revalidate=3600",
        "content-location": record.path,
        "x-markdown-tokens": String(tokens),
      },
    })
  }

  return new Response(includeBody ? markdown : null, {
    headers: {
      "cache-control": "public, max-age=300, stale-while-revalidate=3600",
      "content-location": record.markdownPath,
      "content-type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokens),
    },
  })
}

export const GET = (request: NextRequest) => getAgentResponse(request, true)
export const HEAD = (request: NextRequest) => getAgentResponse(request, false)
