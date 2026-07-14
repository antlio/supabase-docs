import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAgentDocumentByServerSlug,
  getAgentMetaDescription,
} from "@/features/agent-docs/agent-document-records"
import { ServerReferencePage } from "@/features/server-reference/components/server-reference-page"

type ServerReferenceRecordPageProps = {
  params: Promise<{ slug: string[] }>
}

export const generateMetadata = async ({
  params,
}: ServerReferenceRecordPageProps): Promise<Metadata> => {
  const { slug } = await params
  const record = getAgentDocumentByServerSlug(slug)

  if (!record) return {}

  return {
    title: `${record.title} | Supabase Server SDK Reference`,
    description: getAgentMetaDescription(record),
    alternates: {
      canonical: record.path,
      types: { "text/markdown": record.markdownPath },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${record.title} | Supabase Server SDK Reference`,
      description: getAgentMetaDescription(record),
      url: record.path,
      type: "article",
      images: [{ url: "/favicon.ico", width: 256, height: 256, alt: "Supabase" }],
    },
  }
}

const ServerReferenceRecordPage = async ({ params }: ServerReferenceRecordPageProps) => {
  const { slug } = await params
  const record = getAgentDocumentByServerSlug(slug)

  if (!record) notFound()

  return <ServerReferencePage agentRecord={record} />
}

export default ServerReferenceRecordPage
