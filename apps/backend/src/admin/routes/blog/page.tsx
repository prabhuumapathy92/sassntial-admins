import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Newspaper, Plus, Trash } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"

import {
  ImageField,
  SectionCard,
  SectionPicker,
  move,
  type Block,
} from "../../components/sections"
import { sdk } from "../../lib/sdk"

type Post = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  cover_image: string | null
  category_id: string | null
  category: { id: string; name: string; slug: string } | null
  tags: string[]
  author_id: string | null
  author: { id: string; name: string; role: string | null } | null
  status: "draft" | "published"
  published_at: string | null
  reading_minutes: number
  seo_description: string | null
  blocks: Block[]
}

type Draft = Omit<
  Post,
  "id" | "published_at" | "reading_minutes" | "category" | "author"
> & { id?: string }

type CmsSettings = { storefront_url: string | null; preview_enabled: boolean }

/**
 * Opens a preview in a new tab.
 *
 * The link is minted by the backend and signed there, so the shared secret
 * never enters this bundle. The window is opened first and its location set
 * once the link arrives, because opening it after the await would be treated
 * as a popup rather than a click.
 */
const usePreview = () => {
  const { data } = useQuery({
    queryKey: ["cms-settings"],
    queryFn: () => sdk.client.fetch<CmsSettings>("/admin/cms-settings"),
  })

  const enabled = !!data?.storefront_url && !!data.preview_enabled

  const open = async (slug: string, type: "page" | "post") => {
    const tab = window.open("", "_blank")

    try {
      const params = new URLSearchParams({ slug, type })
      const { url } = await sdk.client.fetch<{ url: string }>(
        `/admin/preview-token?${params.toString()}`
      )

      if (tab) {
        tab.location.href = url
      }
    } catch (error) {
      tab?.close()
      toast.error(
        error instanceof Error ? error.message : "Could not open the preview"
      )
    }
  }

  return { enabled, open }
}

/**
 * Only the fields the API owns; see the same helper in the Pages editor. A post
 * loaded from the API also carries `published_at`, `reading_minutes` and block
 * ids, none of which the upsert schema accepts.
 */
const toBody = (draft: Draft) => ({
  slug: draft.slug,
  title: draft.title,
  excerpt: draft.excerpt,
  cover_image: draft.cover_image,
  category_id: draft.category_id,
  tags: draft.tags,
  author_id: draft.author_id,
  status: draft.status,
  seo_description: draft.seo_description,
  blocks: draft.blocks.map((block) => ({
    type: block.type,
    data: block.data ?? {},
    is_active: block.is_active ?? true,
  })),
})

const emptyDraft = (): Draft => ({
  slug: "",
  title: "",
  excerpt: null,
  cover_image: null,
  category_id: null,
  tags: [],
  author_id: null,
  status: "draft",
  seo_description: null,
  blocks: [],
})

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : "Not published"

const BlogPage = () => {
  const queryClient = useQueryClient()
  const preview = usePreview()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [openBlocks, setOpenBlocks] = useState<Record<number, boolean>>({})
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cms-posts"],
    queryFn: () =>
      sdk.client.fetch<{ posts: Post[]; block_types: string[] }>(
        "/admin/posts"
      ),
  })

  const posts = data?.posts ?? []
  const blockTypes = useMemo(() => data?.block_types ?? [], [data])

  const { data: taxonomy } = useQuery({
    queryKey: ["blog-taxonomy"],
    queryFn: async () => {
      const [categories, authors] = await Promise.all([
        sdk.client.fetch<{ categories: { id: string; name: string }[] }>(
          "/admin/blog-categories"
        ),
        sdk.client.fetch<{ authors: { id: string; name: string }[] }>(
          "/admin/blog-authors"
        ),
      ])

      return { categories: categories.categories, authors: authors.authors }
    },
  })

  const { mutateAsync: setStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Post["status"] }) =>
      sdk.client.fetch(`/admin/posts/${id}/status`, {
        method: "POST",
        body: { status },
      }),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cms-posts"] })
      toast.success(
        variables.status === "published"
          ? "Post published"
          : "Post unpublished"
      )
    },
    onError: (error: Error) =>
      toast.error(error.message || "Could not change the status"),
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: Draft) =>
      sdk.client.fetch<{ post: Post }>(
        payload.id ? `/admin/posts/${payload.id}` : "/admin/posts",
        { method: "POST", body: toBody(payload) }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-posts"] })
      toast.success("Post saved")
      setDraft(null)
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message || "Could not save the post")
    },
  })

  const { mutateAsync: removePost } = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/posts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-posts"] })
      toast.success("Post deleted")
    },
  })

  const setBlocks = (next: Block[]) =>
    setDraft((current) => (current ? { ...current, blocks: next } : current))

  const patchBlock = (index: number, patch: Record<string, any>) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            blocks: current.blocks.map((block, position) =>
              position === index
                ? { ...block, data: { ...block.data, ...patch } }
                : block
            ),
          }
        : current
    )

  if (isLoading) {
    return (
      <Container>
        <Text>Loading posts...</Text>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <Text className="text-ui-fg-error">
          {(error as Error)?.message ?? "Could not load posts"}
        </Text>
      </Container>
    )
  }

  if (draft) {
    return (
      <Container className="divide-y p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Heading level="h2">
            {draft.id ? `Edit ${draft.title || draft.slug}` : "New post"}
          </Heading>
          <div className="flex items-center gap-2">
            {draft.id && preview.enabled && (
              <Button
                variant="secondary"
                onClick={() => preview.open(draft.slug, "post")}
              >
                Preview
              </Button>
            )}
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={() => mutateAsync(draft)} isLoading={isPending}>
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-3 px-6 py-4 md:grid-cols-2">
          <div>
            <Label size="small" weight="plus">
              Title
            </Label>
            <Input
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Slug
            </Label>
            <Input
              value={draft.slug}
              placeholder="how-ai-search-is-changing-seo"
              onChange={(event) =>
                setDraft({ ...draft, slug: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label size="small" weight="plus">
              Cover image
            </Label>
            <ImageField
              value={draft.cover_image ?? ""}
              onChange={(next) => setDraft({ ...draft, cover_image: next })}
            />
            <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
              Shown on the blog listing, the article header and link previews.
            </Text>
          </div>
          <div className="md:col-span-2">
            <Label size="small" weight="plus">
              Excerpt
            </Label>
            <Textarea
              rows={2}
              value={draft.excerpt ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, excerpt: event.target.value })
              }
            />
            <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
              Shown on the blog index and in link previews.
            </Text>
          </div>
          <div>
            <Label size="small" weight="plus">
              Category
            </Label>
            <Select
              value={draft.category_id ?? "none"}
              onValueChange={(value) =>
                setDraft({
                  ...draft,
                  category_id: value === "none" ? null : value,
                })
              }
            >
              <Select.Trigger>
                <Select.Value placeholder="No category" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">No category</Select.Item>
                {(taxonomy?.categories ?? []).map((category) => (
                  <Select.Item key={category.id} value={category.id}>
                    {category.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
              Also a breadcrumb. Managed under Blog categories.
            </Text>
          </div>
          <div>
            <Label size="small" weight="plus">
              Tags
            </Label>
            <Input
              value={draft.tags.join(", ")}
              placeholder="geo, aeo, structured data"
              onChange={(event) =>
                setDraft({
                  ...draft,
                  tags: event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Author
            </Label>
            <Select
              value={draft.author_id ?? "none"}
              onValueChange={(value) =>
                setDraft({
                  ...draft,
                  author_id: value === "none" ? null : value,
                })
              }
            >
              <Select.Trigger>
                <Select.Value placeholder="No author" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">No author</Select.Item>
                {(taxonomy?.authors ?? []).map((author) => (
                  <Select.Item key={author.id} value={author.id}>
                    {author.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
              Role and avatar are managed under Blog authors.
            </Text>
          </div>
          <div>
            <Label size="small" weight="plus">
              Status
            </Label>
            <Select
              value={draft.status}
              onValueChange={(value) =>
                setDraft({ ...draft, status: value as Draft["status"] })
              }
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="draft">Draft</Select.Item>
                <Select.Item value="published">Published</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <Label size="small" weight="plus">
              SEO description
            </Label>
            <Input
              value={draft.seo_description ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, seo_description: event.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Heading level="h3">Sections</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                Drag the handle to reorder, or use the arrows. Reading time is
                calculated from this content when you save.
              </Text>
            </div>
            <SectionPicker
              types={blockTypes}
              onPick={(type) =>
                setBlocks([...draft.blocks, { type, data: {} }])
              }
            />
          </div>

          {draft.blocks.length ? (
            <div
              className="flex flex-col gap-2"
              onDragLeave={() => setOverIndex(null)}
            >
              {draft.blocks.map((block, index) => (
                <SectionCard
                  key={index}
                  block={block}
                  index={index}
                  total={draft.blocks.length}
                  isOpen={!!openBlocks[index]}
                  isDragging={dragIndex === index}
                  isDropTarget={overIndex === index && dragIndex !== index}
                  onToggle={(position) =>
                    setOpenBlocks((current) => ({
                      ...current,
                      [position]: !current[position],
                    }))
                  }
                  onChange={patchBlock}
                  onMove={(position, delta) => {
                    setBlocks(move(draft.blocks, position, position + delta))
                    setOpenBlocks({})
                  }}
                  onRemove={(position) => {
                    setBlocks(draft.blocks.filter((_, i) => i !== position))
                    setOpenBlocks({})
                  }}
                  onDragStart={setDragIndex}
                  onDragOver={setOverIndex}
                  onDrop={(target) => {
                    if (dragIndex === null) {
                      return
                    }

                    setBlocks(move(draft.blocks, dragIndex, target))
                    setDragIndex(null)
                    setOverIndex(null)
                    setOpenBlocks({})
                  }}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setOverIndex(null)
                  }}
                />
              ))}
            </div>
          ) : (
            <Text size="small" className="text-ui-fg-subtle">
              No sections yet. Add one to start writing.
            </Text>
          )}
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Blog</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Write posts from the same sections as pages.
          </Text>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft())
            setOpenBlocks({})
          }}
        >
          <Plus /> New post
        </Button>
      </div>

      <div className="flex flex-col divide-y">
        {posts.length ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
            >
              <div className="min-w-0">
                <Text weight="plus">{post.title}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  /{post.slug} · {formatDate(post.published_at)} ·{" "}
                  {post.reading_minutes} min read
                  {post.category ? ` · ${post.category.name}` : ""}
                  {post.author ? ` · ${post.author.name}` : ""}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  size="2xsmall"
                  color={post.status === "published" ? "green" : "grey"}
                >
                  {post.status}
                </Badge>
                {preview.enabled && (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => preview.open(post.slug, "post")}
                  >
                    Preview
                  </Button>
                )}
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() =>
                    setStatus({
                      id: post.id,
                      status:
                        post.status === "published" ? "draft" : "published",
                    })
                  }
                >
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    const {
                      published_at,
                      reading_minutes,
                      category,
                      author,
                      ...rest
                    } = post
                    setDraft({ ...rest })
                    setOpenBlocks({})
                  }}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() => removePost(post.id)}
                >
                  <Trash />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8">
            <Text size="small" className="text-ui-fg-subtle">
              No posts yet. Write one to get started.
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog",
  icon: Newspaper,
})

export default BlogPage
