import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Plus, Trash, User } from "@medusajs/icons"
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

import { ImageField } from "../../../components/sections"
import { sdk } from "../../../lib/sdk"

type Author = {
  id: string
  name: string
  role: string | null
  avatar: string | null
  bio: string | null
}

type Draft = Partial<Author> & { name: string }

const AuthorsPage = () => {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Draft | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["blog-authors"],
    queryFn: () =>
      sdk.client.fetch<{ authors: Author[] }>("/admin/blog-authors"),
  })

  const authors = data?.authors ?? []

  const { mutateAsync: save, isPending } = useMutation({
    mutationFn: (payload: Draft) =>
      sdk.client.fetch(
        payload.id
          ? `/admin/blog-authors/${payload.id}`
          : "/admin/blog-authors",
        { method: "POST", body: payload }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-authors"] })
      toast.success("Author saved")
      setDraft(null)
    },
    onError: (error: Error) =>
      toast.error(error.message || "Could not save the author"),
  })

  const { mutateAsync: remove } = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/blog-authors/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-authors"] })
      // Posts keep their content but lose the byline, so the list is stale.
      queryClient.invalidateQueries({ queryKey: ["cms-posts"] })
      toast.success("Author deleted")
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Blog authors</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            A role or avatar corrected here updates every post by that author.
          </Text>
        </div>
        <Button onClick={() => setDraft({ name: "" })}>
          <Plus /> New author
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
                setDraft({ ...draft, name: event.target.value })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Role
            </Label>
            <Input
              value={draft.role ?? ""}
              placeholder="Head of Platform"
              onChange={(event) =>
                setDraft({ ...draft, role: event.target.value })
              }
            />
          </div>
          <div>
            <Label size="small" weight="plus">
              Avatar
            </Label>
            <ImageField
              value={draft.avatar ?? ""}
              onChange={(next) => setDraft({ ...draft, avatar: next })}
            />
          </div>
          <div className="md:col-span-3">
            <Label size="small" weight="plus">
              Bio
            </Label>
            <Input
              value={draft.bio ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, bio: event.target.value })
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
            <Text>Loading authors...</Text>
          </div>
        ) : authors.length ? (
          authors.map((author) => (
            <div
              key={author.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
            >
              <div className="min-w-0">
                <Text weight="plus">{author.name}</Text>
                <Text size="small" className="text-ui-fg-subtle">
                  {author.role ?? "No role set"}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => setDraft({ ...author })}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() => remove(author.id)}
                >
                  <Trash />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8">
            <Text size="small" className="text-ui-fg-subtle">
              No authors yet.
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog authors",
  icon: User,
})

export default AuthorsPage
