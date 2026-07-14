import { AgentJsonLd } from "@/features/agent-docs/agent-json-ld"
import type { AgentDocumentRecord } from "@/features/agent-docs/agent-document-records"
import { DocsShell } from "@/features/docs-home/components/docs-shell"
import { SidebarNav } from "@/features/docs-home/components/sidebar-nav"
import { TopNav } from "@/features/docs-home/components/top-nav"
import { ServerReferenceArticle } from "./server-reference-article"
import { ServerReferenceMobileNav, ServerReferenceToc } from "./server-reference-toc"

type ServerReferencePageProps = {
  agentRecord: AgentDocumentRecord
}

export const ServerReferencePage = ({ agentRecord }: ServerReferencePageProps) => (
  <>
    <AgentJsonLd record={agentRecord} />
    <TopNav variant="server-reference" />
    <DocsShell
      sidebar={<SidebarNav activeHref="/docs/reference/server" />}
      rightRail={<ServerReferenceToc />}
      mainClassName="xl:border-x xl:border-border"
    >
      <ServerReferenceMobileNav />
      <ServerReferenceArticle />
    </DocsShell>
  </>
)
