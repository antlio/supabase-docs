import type { Metadata } from "next"
import Home from "../page"
import {
  DOCS_AGENT_RECORD,
  getAgentMetaDescription,
} from "@/features/agent-docs/agent-document-records"
import { AgentJsonLd } from "@/features/agent-docs/agent-json-ld"

export const metadata: Metadata = {
  title: "Supabase Docs",
  description: getAgentMetaDescription(DOCS_AGENT_RECORD),
  alternates: {
    canonical: DOCS_AGENT_RECORD.path,
    types: { "text/markdown": DOCS_AGENT_RECORD.markdownPath },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Supabase Docs",
    description: getAgentMetaDescription(DOCS_AGENT_RECORD),
    url: DOCS_AGENT_RECORD.path,
    type: "article",
    images: [{ url: "/favicon.ico", width: 256, height: 256, alt: "Supabase" }],
  },
}

const DocsPage = () => (
  <>
    <AgentJsonLd record={DOCS_AGENT_RECORD} />
    <Home />
  </>
)

export default DocsPage
