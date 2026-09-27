import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText, Plus, Trash } from "@medusajs/icons"
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
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useState } from "react"

import {
  SectionCard,
  SectionPicker,
  move,
  type Block,
} from "../../components/sections"
import { sdk } from "../../lib/sdk"

type Page = {
  id: string
  slug: string
  title: string
  breadcrumb_label: string | null
  parent_id: string | null
  status: "draft" | "published"
  seo_title: string | null
  seo_description: string | null
  blocks: Block[]
}

type Draft = Omit<Page, "id"> & { id?: string }

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

  const open = async (
    slug: string,
    type: "page" | "post",
    tab = window.open("", "_blank")
  ) => {

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
 * Only the fields the API owns.
 *
 * The editor loads a page straight from the API, so the draft also carries
 * server-side values - `id`, `published_at`, and an `id`/`position` on every
 * block. The upsert schema rejects unknown fields, so sending the draft as-is
 * failed with "Unrecognized fields".
 */
const toBody = (draft: Draft) => ({
  slug: draft.slug,
  title: draft.title,
  breadcrumb_label: draft.breadcrumb_label,
  parent_id: draft.parent_id,
  status: draft.status,
  seo_title: draft.seo_title,
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
  breadcrumb_label: null,
  parent_id: null,
  status: "draft",
  seo_title: null,
  seo_description: null,
  blocks: [],
})

const PagesPage = () => {
  const queryClient = useQueryClient()
  const preview = usePreview()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [openBlocks, setOpenBlocks] = useState<Record<number, boolean>>({})
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cms-pages"],
    queryFn: () =>
      sdk.client.fetch<{ pages: Page[]; block_types: string[] }>(
        "/admin/pages"
      ),
  })

  const pages = data?.pages ?? []
  const blockTypes = useMemo(() => data?.block_types ?? [], [data])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: Draft) =>
      sdk.client.fetch<{ page: Page }>(
        payload.id ? `/admin/pages/${payload.id}` : "/admin/pages",
        { method: "POST", body: toBody(payload) }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-pages"] })
      toast.success("Page saved")
      setDraft(null)
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message || "Could not save the page")
    },
  })

  const { mutateAsync: setStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Page["status"] }) =>
      sdk.client.fetch(`/admin/pages/${id}/status`, {
        method: "POST",
        body: { status },
      }),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cms-pages"] })
      toast.success(
        variables.status === "published" ? "Page published" : "Page unpublished"
      )
    },
    onError: (error: Error) =>
      toast.error(error.message || "Could not change the status"),
  })

  const { mutateAsync: removePage } = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/pages/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-pages"] })
      toast.success("Page deleted")
    },
  })

  const setBlocks = (next: Block[]) =>
    setDraft((current) => (current ? { ...current, blocks: next } : current))

  const addFaqs = () => {
    if (!draft) {
      return
    }

    const newIndex = draft.blocks.length
    setBlocks([
      ...draft.blocks,
      {
        type: "faqs",
        data: {
          eyebrow: "FAQs",
          title: "Frequently asked questions",
          description: "",
          items: [],
        },
      },
    ])
    setOpenBlocks((current) => ({ ...current, [newIndex]: true }))
  }

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

  const handleDrop = (target: number) => {
    if (dragIndex === null || !draft) {
      return
    }

    setBlocks(move(draft.blocks, dragIndex, target))
    setDragIndex(null)
    setOverIndex(null)
    setOpenBlocks({})
  }

  const handlePreview = async () => {
    if (!draft || !preview.enabled) {
      return
    }

    // Reserve the tab during the click gesture so the browser does not block
    // it while the page is being saved.
    const tab = window.open("", "_blank")

    if (!tab) {
      toast.error("Allow pop-ups to open the page preview")
      return
    }

    try {
      const { page } = await mutateAsync(draft)
      await preview.open(page.slug, "page", tab)
    } catch {
      tab.close()
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Text>Loading pages...</Text>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <Text className="text-ui-fg-error">
          {(error as Error)?.message ?? "Could not load pages"}
        </Text>
      </Container>
    )
  }

  if (draft) {
    return (
      <Container className="divide-y p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Heading level="h2">
            {draft.id ? `Edit ${draft.title || draft.slug}` : "New page"}
          </Heading>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={!preview.enabled || !draft.slug.trim() || isPending}
              onClick={handlePreview}
              title={
                preview.enabled
                  ? "Save and preview this page"
                  : "Preview needs a storefront URL and PREVIEW_SECRET in the backend, with the same secret in the storefront"
              }
              isLoading={isPending}
            >
              Preview
            </Button>
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button onClick={() => mutateAsync(draft)} isLoading={isPending}>
              Save
            </Button>
          </div>
        </div>
        {!preview.enabled ? (
          <div className="px-6 pb-3">
            <Text size="xsmall" className="text-ui-fg-subtle">
              To enable previews, set STOREFRONT_URL (or add the storefront
              origin to STORE_CORS) and PREVIEW_SECRET in the backend, then set
              the same PREVIEW_SECRET in the storefront environment.
            </Text>
          </div>
        ) : null}

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
              placeholder="services/ai-seo"
              onChange={(event) =>
                setDraft({ ...draft, slug: event.target.value })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Breadcrumb label
            </Label>
            <Input
              value={draft.breadcrumb_label ?? ""}
              placeholder="Shorter form used in the trail"
              onChange={(event) =>
                setDraft({ ...draft, breadcrumb_label: event.target.value })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Parent page
            </Label>
            <Select
              value={draft.parent_id ?? "none"}
              onValueChange={(value) =>
                setDraft({
                  ...draft,
                  parent_id: value === "none" ? null : value,
                })
              }
            >
              <Select.Trigger>
                <Select.Value placeholder="No parent" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="none">No parent</Select.Item>
                {pages
                  .filter((page) => page.id !== draft.id)
                  .map((page) => (
                    <Select.Item key={page.id} value={page.id}>
                      {page.title}
                    </Select.Item>
                  ))}
              </Select.Content>
            </Select>
            <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
              Sets the breadcrumb trail.
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
                Each section is saved on this page. Add FAQs to manage this
                page's questions and answers, or choose another section type.
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={addFaqs}>
                <Plus /> Add FAQs
              </Button>
              <SectionPicker
                types={blockTypes}
                onPick={(type) => {
                  const newIndex = draft.blocks.length
                  setBlocks([...draft.blocks, { type, data: {} }])
                  setOpenBlocks((current) => ({
                    ...current,
                    [newIndex]: true,
                  }))
                }}
              />
            </div>
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
                  onDrop={handleDrop}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setOverIndex(null)
                  }}
                />
              ))}
            </div>
          ) : (
            <Text size="small" className="text-ui-fg-subtle">
              No sections yet. Add one to start building the page.
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
          <Heading level="h2">Pages</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Build storefront pages from designed sections.
          </Text>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft())
            setOpenBlocks({})
          }}
        >
          <Plus /> New page
        </Button>
      </div>

      <div className="flex flex-col divide-y">
        {pages.length ? (
          pages.map((page) => (
            <div
              key={page.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
            >
              <div className="min-w-0">
                <Text weight="plus">{page.title}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  /{page.slug} · {page.blocks.length} section
                  {page.blocks.length === 1 ? "" : "s"}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  size="2xsmall"
                  color={page.status === "published" ? "green" : "grey"}
                >
                  {page.status}
                </Badge>
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() =>
                    setStatus({
                      id: page.id,
                      status:
                        page.status === "published" ? "draft" : "published",
                    })
                  }
                >
                  {page.status === "published" ? "Unpublish" : "Publish"}
                </Button>
                {preview.enabled && (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => preview.open(page.slug, "page")}
                  >
                    Preview
                  </Button>
                )}
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setDraft({ ...page })
                    setOpenBlocks({})
                  }}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() => removePage(page.id)}
                >
                  <Trash />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8">
            <Text size="small" className="text-ui-fg-subtle">
              No pages yet. Create one to get started.
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Pages",
  icon: DocumentText,
})

export default PagesPage
