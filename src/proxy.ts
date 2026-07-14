import { type NextRequest, NextResponse } from "next/server"

const MARKDOWN_ACCEPT_TYPES = ["text/markdown", "text/x-markdown"]

const isSupportedDocsPath = (pathname: string) =>
  pathname === "/docs" || pathname.startsWith("/docs/reference/server")

const normalizePathname = (pathname: string) => pathname.replace(/\/+$/, "") || "/"

export const proxy = (request: NextRequest) => {
  const pathname = normalizePathname(request.nextUrl.pathname)
  const isMarkdownTwin = pathname.endsWith(".md")
  const canonicalPath = isMarkdownTwin ? pathname.slice(0, -3) : pathname
  const acceptsMarkdown = MARKDOWN_ACCEPT_TYPES.some((type) =>
    request.headers.get("accept")?.includes(type),
  )
  const acceptsJson = request.headers.get("accept")?.includes("application/json") ?? false

  if (isSupportedDocsPath(canonicalPath) && (isMarkdownTwin || acceptsMarkdown || acceptsJson)) {
    const rewriteUrl = request.nextUrl.clone()
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-agent-canonical-path", canonicalPath)
    requestHeaders.set(
      "x-agent-response-format",
      isMarkdownTwin || acceptsMarkdown ? "markdown" : "json",
    )
    rewriteUrl.pathname = "/agent-markdown"
    rewriteUrl.search = ""
    rewriteUrl.searchParams.set("path", canonicalPath)
    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
  }

  const response = NextResponse.next()
  if (isSupportedDocsPath(pathname)) {
    response.headers.set("link", `<${pathname}.md>; rel="alternate"; type="text/markdown"`)
  }

  return response
}

export const config = {
  matcher: ["/docs", "/docs.md", "/docs/:path*"],
}
