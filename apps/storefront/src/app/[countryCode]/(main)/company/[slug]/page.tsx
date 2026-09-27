import { Metadata } from "next"
import { notFound } from "next/navigation"

import CmsPageContent from "@modules/cms/components/cms-page-content"
import BlockRenderer from "@modules/cms/components/block-renderer"
import PreviewBanner from "@modules/cms/components/preview-banner"
import { loadPageBlock } from "@modules/cms/lib/load-page-block"
import type { CompanyItem } from "@modules/company/constants/company-items"
import CompanyDetailTemplate from "@modules/company/templates/detail"
import { listCmsPosts } from "@lib/data/cms"
import { retrieveContactPage } from "@lib/data/contact-page"

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
  const result = await loadPageBlock<CompanyItem>(`company/${slug}`, "company")

  if (!result) {
    return null
  }

  return {
    ...result,
    // The block was written from the original item, so its shape matches.
    item: result.item ? ({ ...result.item, slug } as CompanyItem) : null,
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

export default async function CompanyDetailPage(props: Params) {
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

  // Only the contact page reads admin-authored settings; every other slug is
  // page content, so nothing else pays for the request.
  const contactSettings =
    params.slug === "contact-us" ? await retrieveContactPage() : null

  // The blog listing comes from the CMS, so posts written in Medusa Admin show
  // up here without a code change. Other slugs skip the request.
  const posts =
    params.slug === "blog" ? ((await listCmsPosts())?.posts ?? []) : []

  return (
    <>
      {result.preview && <PreviewBanner status={result.status} />}
      <CompanyDetailTemplate
        item={result.item}
        contactSettings={contactSettings}
        posts={posts}
      />
      <BlockRenderer blocks={result.additionalBlocks} />
    </>
  )
}
