import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Plus, Tag, Trash } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { sdk } from "../../../lib/sdk"

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  rank: number
}

type Draft = Partial<Category> & { name: string; slug: string }

/** Suggests a slug while the name is typed, but never overwrites an edited one. */
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const CategoriesPage = () => {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () =>
      sdk.client.fetch<{ categories: Category[] }>("/admin/blog-categories"),
  })

  const categories = data?.categories ?? []

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: (payload: Draft) =>
      sdk.client.fetch(
        payload.id
          ? `/admin/blog-categories/${payload.id}`
          : "/admin/blog-categories",
        { method: "POST", body: payload }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
      toast.success("Category saved")
      setDraft(null)
      setSlugTouched(false)
    },
    onError: (error: Error) =>
      toast.error(error.message || "Could not save the category"),
  })

  const { mutateAsync: remove } = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/blog-categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] })
      queryClient.invalidateQueries({ queryKey: ["cms-posts"] })
      toast.success("Category deleted")
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Blog categories</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Posts keep their content if a category is removed — they just lose
            the label.
          </Text>
        </div>
        <Button
          onClick={() => {
            setDraft({ name: "", slug: "" })
            setSlugTouched(false)
          }}
        >
          <Plus /> New category
        </Button>
      </div>

      {draft && (
        <div className="grid gap-3 px-6 py-4 md:grid-cols-3">
          <div>
            <Label size="small" weight="plus">
              Name
            </Label>
            <Input
              value={draft.name}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  name: event.target.value,
                  ...(slugTouched || draft.id
                    ? {}
                    : { slug: slugify(event.target.value) }),
                })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Slug
            </Label>
            <Input
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true)
                setDraft({ ...draft, slug: event.target.value })
              }}
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Description
            </Label>
            <Input
              value={draft.description ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
            />
          </div>
          <div className="flex items-end gap-2 md:col-span-3">
            <Button onClick={() => save(draft)} isLoading={isPending}>
              Save
            </Button>
            <Button variant="secondary" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y">
        {isLoading ? (
          <div className="px-6 py-6">
            <Text>Loading categories...</Text>
          </div>
        ) : categories.length ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
            >
              <div className="min-w-0">
                <Text weight="plus">{category.name}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  /{category.slug}
                  {category.description ? ` · ${category.description}` : ""}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setDraft({ ...category })
                    setSlugTouched(true)
                  }}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() => remove(category.id)}
                >
                  <Trash />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8">
            <Text size="small" className="text-ui-fg-subtle">
              No categories yet.
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog categories",
  icon: Tag,
})

export default CategoriesPage
