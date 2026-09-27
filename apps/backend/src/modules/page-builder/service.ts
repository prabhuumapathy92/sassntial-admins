import { MedusaService } from "@medusajs/framework/utils"

import { Page } from "./models/page"
import { PageBlock } from "./models/page-block"
import { Author } from "./models/author"
import { Post } from "./models/post"
import { PostBlock } from "./models/post-block"
import { PostCategory } from "./models/post-category"

export type PageStatus = "draft" | "published"

export type PageBlockRecord = {
  id: string
  type: string
  position: number
  data: Record<string, unknown>
  is_active: boolean
}

export type PageRecord = {
  id: string
  slug: string
  title: string
  breadcrumb_label: string | null
  parent_id: string | null
  status: PageStatus
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  og_image: string | null
  blocks: PageBlockRecord[]
}

export type BreadcrumbEntry = {
  label: string
  href: string | null
}

export type PageBlockInput = {
  type: string
  position?: number
  data?: Record<string, unknown>
  is_active?: boolean
}

export type PostCategoryRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  rank: number
}

export type AuthorRecord = {
  id: string
  name: string
  role: string | null
  avatar: string | null
  bio: string | null
}

export type PostRecord = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category_id: string | null
  category: PostCategoryRecord | null
  tags: string[]
  author_id: string | null
  author: AuthorRecord | null
  status: PageStatus
  published_at: string | null
  reading_minutes: number
  seo_title: string | null
  seo_description: string | null
  blocks: PageBlockRecord[]
}

export type PostInput = {
  slug: string
  title: string
  excerpt?: string | null
  cover_image?: string | null
  category_id?: string | null
  tags?: string[]
  author_id?: string | null
  status?: PageStatus
  seo_title?: string | null
  seo_description?: string | null
  blocks?: PageBlockInput[]
}

export type PageInput = {
  slug: string
  title: string
  breadcrumb_label?: string | null
  parent_id?: string | null
  status?: PageStatus
  seo_title?: string | null
  seo_description?: string | null
  og_image?: string | null
  blocks?: PageBlockInput[]
}

/**
 * `model.json()` is typed as `Record<string, unknown>`, which rejects the
 * arrays block payloads contain. The cast is confined to the write paths.
 */
const toPersistence = (data: unknown) => data as Record<string, any>

const toBlock = (record: any): PageBlockRecord => ({
  id: record.id,
  type: record.type,
  position: record.position ?? 0,
  data:
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : {},
  is_active: record.is_active ?? true,
})

const toPage = (record: any, blocks: PageBlockRecord[]): PageRecord => ({
  id: record.id,
  slug: record.slug,
  title: record.title,
  breadcrumb_label: record.breadcrumb_label ?? null,
  parent_id: record.parent_id ?? null,
  status: (record.status ?? "draft") as PageStatus,
  published_at: record.published_at
    ? new Date(record.published_at).toISOString()
    : null,
  seo_title: record.seo_title ?? null,
  seo_description: record.seo_description ?? null,
  og_image: record.og_image ?? null,
  blocks,
})

/** Average adult reading speed; rounded up so a short post never reads "0 min". */
const WORDS_PER_MINUTE = 200

/**
 * Estimates reading time from every string in the block payloads.
 *
 * Walking the data generically means a new block type is counted without
 * anyone remembering to add it here.
 */
const estimateReadingMinutes = (blocks: PageBlockInput[]): number => {
  const collect = (value: unknown): string[] => {
    if (typeof value === "string") {
      return [value]
    }

    if (Array.isArray(value)) {
      return value.flatMap(collect)
    }

    if (value && typeof value === "object") {
      return Object.values(value as Record<string, unknown>).flatMap(collect)
    }

    return []
  }

  const words = blocks
    .flatMap((block) => collect(block.data ?? {}))
    .join(" ")
    // Markup would otherwise be counted as words.
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

const toCategory = (record: any): PostCategoryRecord => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  description: record.description ?? null,
  rank: record.rank ?? 0,
})

const toAuthor = (record: any): AuthorRecord => ({
  id: record.id,
  name: record.name,
  role: record.role ?? null,
  avatar: record.avatar ?? null,
  bio: record.bio ?? null,
})

const toPost = (
  record: any,
  blocks: PageBlockRecord[],
  category: PostCategoryRecord | null = null,
  author: AuthorRecord | null = null
): PostRecord => ({
  id: record.id,
  slug: record.slug,
  title: record.title,
  excerpt: record.excerpt ?? null,
  cover_image: record.cover_image ?? null,
  category_id: record.category_id ?? null,
  category,
  tags: Array.isArray(record.tags)
    ? record.tags.filter((tag: unknown): tag is string => typeof tag === "string")
    : [],
  author_id: record.author_id ?? null,
  author,
  status: (record.status ?? "draft") as PageStatus,
  published_at: record.published_at
    ? new Date(record.published_at).toISOString()
    : null,
  reading_minutes: record.reading_minutes ?? 1,
  seo_title: record.seo_title ?? null,
  seo_description: record.seo_description ?? null,
  blocks,
})

class PageBuilderModuleService extends MedusaService({
  Page,
  PageBlock,
  Post,
  PostBlock,
  PostCategory,
  Author,
}) {
  async listPagesWithBlocks({
    status,
  }: { status?: PageStatus } = {}): Promise<PageRecord[]> {
    const filters = status ? { status } : {}
    const pages = await this.listPages(filters, { order: { slug: "ASC" } })

    if (!pages.length) {
      return []
    }

    // One query for every block rather than one per page: a site has a few
    // hundred blocks at most, and the list screen needs all of them anyway.
    const blocks = await this.listPageBlocks(
      { page_id: pages.map((page: any) => page.id) },
      { order: { position: "ASC" } }
    )

    const byPage = new Map<string, PageBlockRecord[]>()

    for (const block of blocks) {
      const key = block.page_id
      byPage.set(key, [...(byPage.get(key) ?? []), toBlock(block)])
    }

    return pages.map((page: any) => toPage(page, byPage.get(page.id) ?? []))
  }

  async retrievePageBySlug(
    slug: string,
    { status }: { status?: PageStatus } = {}
  ): Promise<PageRecord | null> {
    const filters: Record<string, unknown> = { slug }

    if (status) {
      filters.status = status
    }

    const [page] = await this.listPages(filters, { take: 1 })

    if (!page) {
      return null
    }

    const blocks = await this.listPageBlocks(
      { page_id: page.id, is_active: true },
      { order: { position: "ASC" } }
    )

    return toPage(page, blocks.map(toBlock))
  }

  /**
   * Walks ancestors to build the breadcrumb trail.
   *
   * Derived rather than authored: a trail typed per page drifts as soon as a
   * title changes. The last entry has no href because it is the current page,
   * which is the convention the storefront's shell already renders.
   */
  async retrieveBreadcrumbs(pageId: string): Promise<BreadcrumbEntry[]> {
    const trail: BreadcrumbEntry[] = []
    const ids: string[] = []
    const seen = new Set<string>()
    let currentId: string | null = pageId

    while (currentId && !seen.has(currentId)) {
      seen.add(currentId)

      const [page] = await this.listPages({ id: currentId }, { take: 1 })

      if (!page) {
        break
      }

      ids.unshift(page.id)
      trail.unshift({
        label: page.breadcrumb_label || page.title,
        href: `/${page.slug}`,
      })

      currentId = page.parent_id ?? null
    }

    // An ancestor with no blocks is a section root that the storefront does
    // not serve, so it names the level without offering to navigate there.
    // Counted in one query rather than per level: a trail is short, but this
    // runs on every page render.
    const blocks = ids.length
      ? await this.listPageBlocks({ page_id: ids }, { select: ["page_id"] })
      : []
    const withContent = new Set(blocks.map((block: any) => block.page_id))

    for (const [index, entry] of trail.entries()) {
      if (!withContent.has(ids[index])) {
        entry.href = null
      }
    }

    if (trail.length) {
      trail[trail.length - 1].href = null
    }

    return [{ label: "Home", href: "/" }, ...trail]
  }

  /**
   * Creates or updates a page and replaces its blocks.
   *
   * Blocks are rewritten wholesale rather than diffed: the editor sends the
   * whole page, and reconciling positions row by row would add a lot of
   * bookkeeping for content that is only ever saved as a unit.
   */
  async upsertPage(
    input: PageInput,
    pageId?: string
  ): Promise<PageRecord> {
    const { blocks = [], status, ...rest } = input

    const attributes = {
      ...rest,
      status: status ?? "draft",
      // Stamped the first time a page goes live, so the storefront can sort
      // and display a real publication date.
      ...(status === "published" ? { published_at: new Date() } : {}),
    }

    const existing = pageId
      ? (await this.listPages({ id: pageId }, { take: 1 }))[0]
      : undefined

    const page = existing
      ? (await this.updatePages([
          { id: existing.id, ...toPersistence(attributes) },
        ]))[0]
      : await this.createPages(toPersistence(attributes))

    const current = await this.listPageBlocks({ page_id: page.id })

    if (current.length) {
      await this.deletePageBlocks(current.map((block: any) => block.id))
    }

    if (blocks.length) {
      await this.createPageBlocks(
        blocks.map((block, index) =>
          toPersistence({
            page_id: page.id,
            type: block.type,
            position: block.position ?? index,
            data: block.data ?? {},
            is_active: block.is_active ?? true,
          })
        )
      )
    }

    return (await this.retrievePageBySlug(page.slug))!
  }

  /** Newest first, which is the order both the blog index and the feed want. */
  async listPostsWithBlocks({
    status,
  }: { status?: PageStatus } = {}): Promise<PostRecord[]> {
    const filters = status ? { status } : {}
    const posts = await this.listPosts(filters, {
      order: { published_at: "DESC", slug: "ASC" },
    })

    if (!posts.length) {
      return []
    }

    const blocks = await this.listPostBlocks(
      { post_id: posts.map((post: any) => post.id) },
      { order: { position: "ASC" } }
    )

    const byPost = new Map<string, PageBlockRecord[]>()

    for (const block of blocks) {
      const key = block.post_id
      byPost.set(key, [...(byPost.get(key) ?? []), toBlock(block)])
    }

    const { categories, authors } = await this.relationLookups()

    return posts.map((post: any) =>
      toPost(
        post,
        byPost.get(post.id) ?? [],
        categories.get(post.category_id) ?? null,
        authors.get(post.author_id) ?? null
      )
    )
  }

  async retrievePostBySlug(
    slug: string,
    { status }: { status?: PageStatus } = {}
  ): Promise<PostRecord | null> {
    const filters: Record<string, unknown> = { slug }

    if (status) {
      filters.status = status
    }

    const [post] = await this.listPosts(filters, { take: 1 })

    if (!post) {
      return null
    }

    const blocks = await this.listPostBlocks(
      { post_id: post.id, is_active: true },
      { order: { position: "ASC" } }
    )

    const { categories, authors } = await this.relationLookups()

    return toPost(
      post,
      blocks.map(toBlock),
      categories.get(post.category_id) ?? null,
      authors.get(post.author_id) ?? null
    )
  }

  async upsertPost(input: PostInput, postId?: string): Promise<PostRecord> {
    const { blocks = [], status, ...rest } = input

    const existing = postId
      ? (await this.listPosts({ id: postId }, { take: 1 }))[0]
      : undefined

    const attributes = {
      ...rest,
      status: status ?? "draft",
      reading_minutes: estimateReadingMinutes(blocks),
      // Stamped only on the first publish, so editing a live post does not
      // reset its date and push it back to the top of the blog.
      ...(status === "published" && !existing?.published_at
        ? { published_at: new Date() }
        : {}),
    }

    const post = existing
      ? (await this.updatePosts([
          { id: existing.id, ...toPersistence(attributes) },
        ]))[0]
      : await this.createPosts(toPersistence(attributes))

    const current = await this.listPostBlocks({ post_id: post.id })

    if (current.length) {
      await this.deletePostBlocks(current.map((block: any) => block.id))
    }

    if (blocks.length) {
      await this.createPostBlocks(
        blocks.map((block, index) =>
          toPersistence({
            post_id: post.id,
            type: block.type,
            position: block.position ?? index,
            data: block.data ?? {},
            is_active: block.is_active ?? true,
          })
        )
      )
    }

    return (await this.retrievePostBySlug(post.slug))!
  }

  /**
   * Categories and authors are a handful of rows, so both sets are loaded once
   * and joined in memory rather than queried per post.
   */
  private async relationLookups() {
    const [categoryRows, authorRows] = await Promise.all([
      this.listPostCategories({}),
      this.listAuthors({}),
    ])

    return {
      categories: new Map(
        categoryRows.map((row: any) => [row.id, toCategory(row)])
      ),
      authors: new Map(authorRows.map((row: any) => [row.id, toAuthor(row)])),
    }
  }

  async listCategories(): Promise<PostCategoryRecord[]> {
    const rows = await this.listPostCategories(
      {},
      { order: { rank: "ASC", name: "ASC" } }
    )

    return rows.map(toCategory)
  }

  async upsertCategory(
    input: Partial<PostCategoryRecord> & { name: string; slug: string },
    categoryId?: string
  ): Promise<PostCategoryRecord> {
    const record = categoryId
      ? (await this.updatePostCategories([
          { id: categoryId, ...toPersistence(input) },
        ]))[0]
      : await this.createPostCategories(toPersistence(input))

    return toCategory(record)
  }

  /**
   * Posts keep their content when a category is removed; they simply lose the
   * label, which is safer than cascading a delete through published content.
   */
  async removeCategory(categoryId: string): Promise<void> {
    const posts = await this.listPosts({ category_id: categoryId })

    if (posts.length) {
      await this.updatePosts(
        posts.map((post: any) => ({ id: post.id, category_id: null }))
      )
    }

    await this.deletePostCategories([categoryId])
  }

  async listBylines(): Promise<AuthorRecord[]> {
    const rows = await this.listAuthors({}, { order: { name: "ASC" } })

    return rows.map(toAuthor)
  }

  async upsertAuthor(
    input: Partial<AuthorRecord> & { name: string },
    authorId?: string
  ): Promise<AuthorRecord> {
    const record = authorId
      ? (await this.updateAuthors([
          { id: authorId, ...toPersistence(input) },
        ]))[0]
      : await this.createAuthors(toPersistence(input))

    return toAuthor(record)
  }

  async removeAuthor(authorId: string): Promise<void> {
    const posts = await this.listPosts({ author_id: authorId })

    if (posts.length) {
      await this.updatePosts(
        posts.map((post: any) => ({ id: post.id, author_id: null }))
      )
    }

    await this.deleteAuthors([authorId])
  }

  /**
   * Publishes or unpublishes without resending the whole post.
   *
   * `published_at` is stamped only the first time a post goes live, so
   * unpublishing and republishing keeps the original date rather than making
   * an old post look new.
   */
  async setPostStatus(
    postId: string,
    status: PageStatus
  ): Promise<PostRecord> {
    const [post] = await this.listPosts({ id: postId }, { take: 1 })

    if (!post) {
      throw new Error(`Post "${postId}" not found`)
    }

    await this.updatePosts([
      {
        id: postId,
        status,
        ...(status === "published" && !post.published_at
          ? { published_at: new Date() }
          : {}),
      },
    ])

    return (await this.retrievePostBySlug(post.slug))!
  }

  async removePost(postId: string): Promise<void> {
    const blocks = await this.listPostBlocks({ post_id: postId })

    if (blocks.length) {
      await this.deletePostBlocks(blocks.map((block: any) => block.id))
    }

    await this.deletePosts([postId])
  }

/**
   * Publishes or unpublishes without resending the whole page.
   *
   * Unpublishing also removes the page from the navigation, because the store
   * navigation route hides entries pointing at unpublished pages.
   */
  async setPageStatus(
    pageId: string,
    status: PageStatus
  ): Promise<PageRecord> {
    const [page] = await this.listPages({ id: pageId }, { take: 1 })

    if (!page) {
      throw new Error(`Page "${pageId}" not found`)
    }

    await this.updatePages([
      {
        id: pageId,
        status,
        ...(status === "published" && !page.published_at
          ? { published_at: new Date() }
          : {}),
      },
    ])

    return (await this.retrievePageBySlug(page.slug))!
  }

  async removePage(pageId: string): Promise<void> {
    const blocks = await this.listPageBlocks({ page_id: pageId })

    if (blocks.length) {
      await this.deletePageBlocks(blocks.map((block: any) => block.id))
    }

    await this.deletePages([pageId])
  }
}

export default PageBuilderModuleService
