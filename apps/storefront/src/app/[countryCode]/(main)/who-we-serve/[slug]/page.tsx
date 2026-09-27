import { Metadata } from "next"
import { notFound } from "next/navigation"

import CmsPageContent from "@modules/cms/components/cms-page-content"
import BlockRenderer from "@modules/cms/components/block-renderer"
import PreviewBanner from "@modules/cms/components/preview-banner"
import { loadPageBlock } from "@modules/cms/lib/load-page-block"
import type { WhoWeServeItem } from "@modules/who-we-serve/constants/who-we-serve-items"
import WhoWeServeDetailTemplate from "@modules/who-we-serve/templates/detail"

type Params = {
  params: Promise<{
    slug: string
  }>
}

/**
 * Content for these pages lives in Medusa Admin.
 *
 * The CMS stores the same fields the template already consumed, so the design
 * is unchanged. Rendered on demand, so a saved edit is live without a rebuild.
 */
export const dynamic = "force-dynamic"

const load = async (slug: string) => {
  const result = await loadPageBlock<WhoWeServeItem>(`who-we-serve/${slug}`, "whoWeServe")

  if (!result) {
    return null
  }

  return {
    ...result,
    // The block was written from the original item, so its shape matches.
    item: result.item ? ({ ...result.item, slug } as WhoWeServeItem) : null,
  }
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const result = await load(params.slug)

  if (!result) {
    return {}
  }

  if (!result.item) {
    return {
      title: result.page.seo_title || result.page.title,
      description: result.page.seo_description ?? undefined,
    }
  }

  return {
    title: result.item.label,
    description: result.item.summary,
  }
}

export default async function Page(props: Params) {
  const params = await props.params
  const result = await load(params.slug)

  if (!result) {
    notFound()
  }

  if (!result.item) {
    if (!result.preview && !result.page.blocks.length) {
      notFound()
    }

    return (
      <CmsPageContent
        page={result.page}
        breadcrumbs={result.breadcrumbs}
        preview={result.preview}
      />
    )
  }

  return (
    <>
      {result.preview && <PreviewBanner status={result.status} />}
      <WhoWeServeDetailTemplate item={result.item} />
      <BlockRenderer blocks={result.additionalBlocks} />
    </>
  )
}
