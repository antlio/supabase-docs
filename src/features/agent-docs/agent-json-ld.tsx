import type { AgentDocumentRecord } from "./agent-document-records"
import { AGENT_DATE_MODIFIED } from "./agent-document-records"

type AgentJsonLdProps = {
  record: AgentDocumentRecord
  className?: string
}

export const AgentJsonLd = ({ record, className }: AgentJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": record.kind === "reference" ? "APIReference" : "TechArticle",
    headline: record.title,
    description: record.description,
    dateModified: AGENT_DATE_MODIFIED,
    author: {
      "@type": "Organization",
      name: "Supabase",
      url: "https://supabase.com",
    },
    mainEntityOfPage: `https://supabase.com${record.path}`,
  }

  return (
    <script
      className={className}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
    />
  )
}
