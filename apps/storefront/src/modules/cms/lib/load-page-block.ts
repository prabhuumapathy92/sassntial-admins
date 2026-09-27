import { getCmsPage, type Breadcrumb, type CmsBlock, type CmsPage } from "@lib/data/cms"

export type LoadedBlock<T> = {
  item: T | null
  page: CmsPage
  breadcrumbs: Breadcrumb[]
  additionalBlocks: CmsBlock[]
  /** True when draft mode is on, so the page can say it is showing a draft. */
  preview: boolean
  status: string
  title: string
}

/**
 * Loads one page's structured block and the context a route needs around it.
 *
 * Every migrated section does the same three things - fetch the page, find its
 * block, and report whether this is a preview - so they share this rather than
 * each keeping its own copy. Returning the preview flag is what lets a route
 * render the banner; without it an unpublished page renders silently and looks
 * like unpublishing did nothing.
 */
export const loadPageBlock = async <T>(
  slug: string,
  blockType: string
): Promise<LoadedBlock<T> | null> => {
  const result = await getCmsPage(slug)
  const block = result?.page.blocks.find((entry) => entry.type === blockType)

  if (!result) {
    return null
  }

  return {
    item: block ? (block.data as T) : null,
    page: result.page,
    breadcrumbs: result.breadcrumbs,
    additionalBlocks: block
      ? result.page.blocks.filter((entry) => entry.id !== block.id)
      : result.page.blocks,
    preview: !!result.preview,
    status: result.page.status,
    title: result.page.title,
  }
}
