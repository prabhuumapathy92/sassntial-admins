import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCmsPage } from "@lib/data/cms"
import BlockRenderer from "@modules/cms/components/block-renderer"
import Breadcrumbs from "@modules/cms/components/breadcrumbs"
import PreviewBanner from "@modules/cms/components/preview-banner"

type Props = {
  params: Promise<{ countryCode: string; slug: string[] }>
}

/**
 * Renders any page built in Medusa Admin.
 *
 * Deliberately not statically generated: this route sits below every hand-built
 * route in the segment order, so it only receives paths nothing else claimed,
 * and rendering on demand keeps a newly published page live immediately.
 */
export const dynamic = "force-dynamic"

/**
 * A page with no blocks is a folder, not a page.
 *
 * Section roots like `services` exist so their children have a parent to hang
 * breadcrumbs from; nobody wrote anything on them, and serving an empty shell
 * at /services would be worse than not answering. Adding a block in the admin
 * makes the URL live again, so this follows the content rather than a list of
 * slugs to keep in sync.
 */
const isFolder = (page: { blocks: unknown[] }) => !page.blocks.length

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const result = await getCmsPage(slug.join("/"))

  if (!result?.page || isFolder(result.page)) {
    return {}
  }

  const { page } = result

  return {
    title: page.seo_title || page.title,
    description: page.seo_description ?? undefined,
    ...(page.og_image
      ? { openGraph: { images: [{ url: page.og_image }] } }
      : {}),
  }
}

export default async function CmsPageRoute(props: Props) {
  const { slug } = await props.params
  const result = await getCmsPage(slug.join("/"))

  // Preview still renders a folder, so a page being built block by block can
  // be checked before the first one lands.
  if (!result?.page || (isFolder(result.page) && !result.preview)) {
    notFound()
  }

  const { page, breadcrumbs, preview } = result

  return (
    <>
      {preview && <PreviewBanner status={page.status} />}
      <Breadcrumbs
        items={breadcrumbs}
        baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
      />
      <BlockRenderer blocks={page.blocks} />
    </>
  )
}
