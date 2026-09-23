import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import {
  Badge,
  Button,
  clx,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  FileText,
  Heading1,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Redo,
  Save,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { hasLabel, hideDefaultSections } from "../lib/hide-default-section"
import { sdk } from "../lib/sdk"

const WIDGET_CLASS = "product-description-widget-container"

type Section = {
  id: string
  title: string
  content: string
}

type MenuItem =
  | { type: "separator" }
  | {
      type: "button"
      icon: typeof Bold
      title: string
      action: () => void
      isActive?: () => boolean
    }

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const items: MenuItem[] = [
    {
      type: "button",
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      type: "button",
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      type: "button",
      icon: UnderlineIcon,
      title: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
    },
    { type: "separator" },
    {
      type: "button",
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      type: "button",
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    { type: "separator" },
    {
      type: "button",
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      type: "button",
      icon: ListOrdered,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    { type: "separator" },
    {
      type: "button",
      icon: LinkIcon,
      title: "Link",
      action: () => {
        const url = window.prompt("URL")

        if (url) {
          editor.chain().focus().setLink({ href: url }).run()
        }
      },
      isActive: () => editor.isActive("link"),
    },
    { type: "separator" },
    {
      type: "button",
      icon: Undo,
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      type: "button",
      icon: Redo,
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
  ]

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-ui-bg-subtle border-ui-border-base sticky top-0 z-10">
      {items.map((item, index) =>
        item.type === "separator" ? (
          <div
            key={index}
            className="w-px h-6 bg-ui-border-base mx-1 self-center"
          />
        ) : (
          <button
            key={index}
            type="button"
            onClick={(event) => {
              event.preventDefault()
              item.action()
            }}
            className={clx(
              "p-2 rounded hover:bg-ui-bg-base transition-colors",
              item.isActive?.()
                ? "bg-ui-bg-base text-ui-fg-interactive"
                : "text-ui-fg-subtle"
            )}
            title={item.title}
          >
            <item.icon size={18} />
          </button>
        )
      )}
    </div>
  )
}

const SectionItem = ({
  section,
  index,
  onUpdate,
  onRemove,
}: {
  section: Section
  index: number
  onUpdate: (id: string, updates: Partial<Section>) => void
  onRemove: (id: string) => void
}) => {
  const { title, content, id } = section

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content,
    onUpdate: ({ editor: instance }) => {
      onUpdate(id, { content: instance.getHTML() })
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none p-6 min-h-[150px] max-w-none text-ui-fg-base bg-ui-bg-base",
      },
    },
  })

  return (
    <div className="bg-ui-bg-base border border-ui-border-base rounded-xl overflow-hidden shadow-elevation-card-rest mb-6">
      <div className="bg-ui-bg-subtle px-6 py-4 flex items-center justify-between border-b border-ui-border-base">
        <div className="flex items-center gap-x-4 flex-1 font-sans">
          <div className="flex flex-col">
            <Text
              size="xsmall"
              leading="compact"
              className="text-ui-fg-muted uppercase tracking-wider font-semibold"
            >
              Block {index + 1}
            </Text>
            <input
              value={title}
              onChange={(event) => onUpdate(id, { title: event.target.value })}
              placeholder="Section Title"
              className="bg-transparent text-ui-fg-base font-medium text-base focus:outline-none w-full placeholder:text-ui-fg-muted mt-0.5 font-sans"
            />
          </div>
        </div>
        <IconButton
          variant="transparent"
          size="small"
          onClick={() => onRemove(id)}
          className="text-ui-fg-muted hover:text-ui-fg-error transition-colors"
        >
          <Trash />
        </IconButton>
      </div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

const parseDescription = (html: string): Section[] => {
  if (!html || html === "<p></p>") {
    return []
  }

  const doc = new DOMParser().parseFromString(html, "text/html")
  const sectionEls = doc.querySelectorAll(
    ".description-block, .description-section"
  )

  if (sectionEls.length === 0) {
    return [{ id: "legacy", title: "Description", content: html }]
  }

  return Array.from(sectionEls).map((el, idx) => ({
    id: el.getAttribute("data-block-id") || `sec-${idx}-${Date.now()}`,
    title:
      el.querySelector(".block-title, .section-header")?.textContent ||
      "Untitled Block",
    content:
      el.querySelector(".block-content, .section-content")?.innerHTML || "",
  }))
}

const stringifySections = (sections: Section[]): string =>
  sections
    .map(
      (section) => `
      <section class="description-block" data-block-id="${section.id}" style="margin-bottom: 3rem;">
        <h2 class="block-title" style="margin-bottom: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; font-weight: 600; font-size: 1.5rem; color: #111827;">${section.title}</h2>
        <div class="block-content" style="line-height: 1.7; color: #374151;">${section.content}</div>
      </section>
    `
    )
    .join("")

/**
 * The dashboard renders the description as a `SectionRow`: a two-column grid
 * whose first child is the field label. Hiding exactly that row is what keeps
 * this safe — walking up to an ancestor would take the whole general section,
 * or the page grid, down with it.
 */
const findDefaultDescriptionRows = (labels: string[]) =>
  Array.from(
    document.querySelectorAll<HTMLElement>("div.grid.grid-cols-2")
  ).filter(
    (row) =>
      !row.closest(`.${WIDGET_CLASS}`) && hasLabel(row.firstElementChild, labels)
  )

const ProductDescriptionWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    setSections(parseDescription(product?.description ?? ""))
  }, [product?.id, product?.description])

  // The dashboard's own translation of the field label, so the row is still
  // found in a non-English locale. The literal is the fallback for when the
  // i18n instance has not resolved the key.
  const labels = useMemo(() => [t("fields.description"), "Description"], [t])

  useEffect(
    () => hideDefaultSections(() => findDefaultDescriptionRows(labels)),
    [labels]
  )

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (description: string) =>
      sdk.admin.product.update(product.id, { description }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to save content",
      })
    },
  })

  const handleUpdateSection = (id: string, updates: Partial<Section>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    )
  }

  const handleRemoveSection = (id: string) => {
    if (confirm("Remove this section?")) {
      setSections((prev) => prev.filter((section) => section.id !== id))
    }
  }

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, title: "", content: "" },
    ])
  }

  const handleSave = async () => {
    try {
      await mutateAsync(stringifySections(sections))
      toast.success("Success", { description: "Structured description saved" })
      setOpen(false)
    } catch {
      // onError already surfaced the failure; the modal stays open so the
      // merchant does not lose the blocks they just wrote.
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Delete ALL sections? This cannot be undone.")) {
      return
    }

    try {
      await mutateAsync("")
      setSections([])
      toast.success("Success", { description: "All content cleared" })
    } catch {
      // onError already surfaced the failure.
    }
  }

  return (
    <div className="col-span-full">
      <Container
        className={clx(
          "p-0 overflow-hidden border-ui-border-base shadow-elevation-card-rest mt-4",
          WIDGET_CLASS
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b bg-ui-bg-base">
          <div className="flex items-center gap-x-2">
            <Heading
              level="h2"
              className="font-sans font-medium h2-core text-ui-fg-base"
            >
              Product Narrative
            </Heading>
            {sections.length === 0 && (
              <Badge color="orange" size="small">
                Empty
              </Badge>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton variant="transparent">
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => setOpen(true)}
                className="gap-x-2"
              >
                <PencilSquare className="text-ui-fg-subtle" />
                Edit sections
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onClick={handleClearAll}
                className="gap-x-2 text-ui-fg-error"
              >
                <Trash className="text-ui-fg-error" />
                Clear All Content
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        <div className="bg-ui-bg-base">
          {sections.length > 0 ? (
            <div className="flex flex-col">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className={clx(
                    "px-6 py-6 group/item iterate-section font-sans",
                    idx !== sections.length - 1 &&
                      "border-b border-ui-border-base"
                  )}
                >
                  <Heading
                    level="h2"
                    className="h2-core font-sans font-medium text-ui-fg-base mb-2"
                  >
                    {section.title || "Untitled Section"}
                  </Heading>
                  <div
                    className="prose prose-sm max-w-none text-ui-fg-subtle leading-normal font-sans"
                    style={{ fontSize: "13px" }}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}

              <div className="p-6 border-t border-ui-border-base bg-ui-bg-subtle/10 flex justify-center">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-x-2"
                >
                  <PencilSquare />
                  Manage Sections
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-16 px-6 text-center bg-ui-bg-subtle/20 border-t border-dashed border-ui-border-base">
              <div className="bg-ui-bg-base p-5 rounded-full shadow-elevation-card-rest mb-5">
                <FileText className="text-ui-fg-muted w-8 h-8" />
              </div>
              <Heading level="h3" className="text-ui-fg-base mb-2">
                No Content Sections
              </Heading>
              <Text className="text-ui-fg-muted mb-8 max-w-[320px] mx-auto italic">
                Build a professional, structured story by adding titles and
                detailed descriptions.
              </Text>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setOpen(true)}
                className="flex items-center gap-x-2 bg-ui-bg-base"
              >
                <Plus size={16} />
                Create Section List
              </Button>
            </div>
          )}
        </div>

        <style>{`
          .ProseMirror {
            font-family: var(--font-sans);
            color: var(--fg-base);
            outline: none;
            font-size: 13px;
            font-weight: 500;
            line-height: normal;
          }
          .ProseMirror p {
            margin-bottom: 1rem;
            font-family: var(--font-sans);
            font-weight: 500;
            font-size: 13px;
          }
          .iterate-section p {
            font-family: var(--font-sans);
            font-weight: 500;
            font-size: 13px !important;
            line-height: normal;
            margin-bottom: 0.75rem;
          }
          .ProseMirror h1, .iterate-section h1 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.75rem; color: var(--fg-base); }
          .ProseMirror h2, .iterate-section h2 { font-size: 1.125rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: var(--fg-base); }
          .ProseMirror ul, .iterate-section ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror ol, .iterate-section ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
          .ProseMirror a, .iterate-section a { color: var(--fg-interactive); text-decoration: underline; font-weight: 500; }
          .ProseMirror blockquote { border-left: 2px solid var(--border-interactive); padding-left: 1rem; font-style: italic; color: var(--fg-muted); }
        `}</style>
      </Container>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex flex-col">
                <Heading level="h2">Edit Narrative Blocks</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  Build your product story by adding structured blocks.
                </Text>
              </div>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Confirm Changes
                </Button>
              </div>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="p-0 flex flex-col overflow-hidden bg-ui-bg-subtle">
            <div className="flex-1 overflow-auto py-12 px-6">
              <div className="max-w-[850px] mx-auto">
                {sections.map((section, index) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    index={index}
                    onUpdate={handleUpdateSection}
                    onRemove={handleRemoveSection}
                  />
                ))}

                <Button
                  variant="secondary"
                  size="small"
                  className="w-full mt-2 flex items-center justify-center gap-x-2 py-6 border-dashed"
                  onClick={handleAddSection}
                >
                  <Plus size={16} />
                  Add Section
                </Button>
              </div>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductDescriptionWidget
