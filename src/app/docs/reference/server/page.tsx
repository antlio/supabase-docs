import type { Metadata } from "next"
import {
  getAgentMetaDescription,
  SERVER_INTRODUCTION_AGENT_RECORD,
} from "@/features/agent-docs/agent-document-records"
import { ServerReferencePage } from "@/features/server-reference/components/server-reference-page"

export const metadata: Metadata = {
  title: "Server Client Library | Supabase Docs",
  description: getAgentMetaDescription(SERVER_INTRODUCTION_AGENT_RECORD),
  alternates: {
    canonical: SERVER_INTRODUCTION_AGENT_RECORD.path,
    types: { "text/markdown": SERVER_INTRODUCTION_AGENT_RECORD.markdownPath },
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Server Client Library | Supabase Docs",
    description: getAgentMetaDescription(SERVER_INTRODUCTION_AGENT_RECORD),
    url: SERVER_INTRODUCTION_AGENT_RECORD.path,
    type: "article",
    images: [{ url: "/favicon.ico", width: 256, height: 256, alt: "Supabase" }],
  },
}

const ServerReferenceRoute = () => (
  <ServerReferencePage agentRecord={SERVER_INTRODUCTION_AGENT_RECORD} />
)

export default ServerReferenceRoute
