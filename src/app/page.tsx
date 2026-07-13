import { AskSection } from "@/features/docs-home/components/ask-section"
import { ClientLibrariesSection } from "@/features/docs-home/components/client-libraries-section"
import { DocsShell } from "@/features/docs-home/components/docs-shell"
import { Hero } from "@/features/docs-home/components/hero"
import { MigrateSection } from "@/features/docs-home/components/migrate-section"
import { ModulesSection } from "@/features/docs-home/components/modules-section"
import { ProductsSection } from "@/features/docs-home/components/products-section"
import { ResourcesSection } from "@/features/docs-home/components/resources-section"
import { SelfHostingSection } from "@/features/docs-home/components/self-hosting-section"
import { SidebarNav } from "@/features/docs-home/components/sidebar-nav"
import { SiteFooter } from "@/features/docs-home/components/site-footer"
import { TopNav } from "@/features/docs-home/components/top-nav"

const Home = () => (
  <>
    <TopNav />
    <DocsShell sidebar={<SidebarNav />}>
      <Hero />
      <AskSection />
      <ProductsSection />
      <ModulesSection />
      <ClientLibrariesSection />
      <MigrateSection />
      <ResourcesSection />
      <SelfHostingSection />
    </DocsShell>
    <SiteFooter />
  </>
)

export default Home
