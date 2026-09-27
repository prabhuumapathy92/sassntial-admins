"use server"

import { draftMode } from "next/headers"

import { getCacheOptions } from "./cookies"

export type CmsBlock = {
  id: string
  type: string
  position: number
  data: Record<string, any>
}

export type Breadcrumb = {
  label: string
  href: string | null
}

export type CmsPage = {
  id: string
  slug: string
  title: string
  status: "draft" | "published"
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  blocks: CmsBlock[]
}

export type CmsAuthor = {
  id: string
  name: string
  role: string | null
  avatar: string | null
  bio: string | null
}

export type CmsCategory = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type CmsPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category: CmsCategory | null
  tags: string[]
  author: CmsAuthor | null
  status: "draft" | "published"
  published_at: string | null
  reading_minutes: number
  seo_description: string | null
  blocks: CmsBlock[]
}

const backendUrl = () =>
  (process.env.MEDUSA_BACKEND_URL ?? "http://localhost:9000").replace(
    /\/+$/,
    ""
  )

/**
 * Draft content is only fetched while Next's draft mode is on, and the secret
 * travels in a header from this server component - never to the browser. A
 * preview request also skips the cache, so an editor sees the save they just
 * made rather than a stored copy.
 */
const requestInit = async (tag: string) => {
  let isDraft = false

  try {
    isDraft = (await draftMode()).isEnabled
  } catch {
    // draftMode() throws outside a request scope, such as during static
    // generation; that path is never a preview.
  }

  const headers: Record<string, string> = {
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
  }

  if (isDraft && process.env.PREVIEW_SECRET) {
    headers["x-preview-secret"] = process.env.PREVIEW_SECRET
  }

  return {
    headers,
    ...(isDraft
      ? { cache: "no-store" as const }
      : {
          cache: "force-cache" as const,
          next: { ...(await getCacheOptions(tag)) },
        }),
  }
}

const read = async <T,>(path: string, tag: string): Promise<T | null> => {
  try {
    const response = await fetch(`${backendUrl()}${path}`, {
      ...(await requestInit(tag)),
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as T
  } catch (error) {
    console.error(`CMS request failed for ${path}`, error)
    return null
  }
}

export const getCmsPage = async (slug: string) =>
  read<{ page: CmsPage; breadcrumbs: Breadcrumb[]; preview: boolean }>(
    `/store/pages/${encodeURIComponent(slug)}`,
    "cms-pages"
  )

export const getCmsPost = async (slug: string) =>
  read<{ post: CmsPost; breadcrumbs: Breadcrumb[]; preview: boolean }>(
    `/store/posts/${encodeURIComponent(slug)}`,
    "cms-posts"
  )

/** Published children of a page, for the section index listings. */
export const listCmsChildren = async (parentSlug: string) =>
  read<{ pages: CmsPage[] }>(
    `/store/page-children?parent=${encodeURIComponent(parentSlug)}`,
    "cms-pages"
  )

export const listCmsPosts = async (category?: string) =>
  read<{ posts: CmsPost[]; count: number; categories: CmsCategory[] }>(
    `/store/posts${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    "cms-posts"
  )
