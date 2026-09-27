import type { Breadcrumb, CmsPage } from "@lib/data/cms"
import BlockRenderer from "@modules/cms/components/block-renderer"
import Breadcrumbs from "@modules/cms/components/breadcrumbs"
import PreviewBanner from "@modules/cms/components/preview-banner"

const CmsPageContent = ({
  page,
  breadcrumbs,
  preview,
}: {
  page: CmsPage
  breadcrumbs: Breadcrumb[]
  preview: boolean
}) => (
  <>
    {preview ? <PreviewBanner status={page.status} /> : null}
    <Breadcrumbs
      items={breadcrumbs}
      baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
    />
    <BlockRenderer blocks={page.blocks} />
  </>
)

export default CmsPageContent
