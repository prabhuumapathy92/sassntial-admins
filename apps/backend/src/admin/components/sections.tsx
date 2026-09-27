import {
  ArrowDownMini,
  ArrowUpMini,
  ChevronDownMini,
  ChevronRightMini,
  DotsSix,
  Plus,
  Trash,
} from "@medusajs/icons"
import {
  Badge,
  Button,
  Drawer,
  IconButton,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  Tooltip,
  toast,
} from "@medusajs/ui"
import { useMemo, useState, type DragEvent } from "react"

import { sdk } from "../lib/sdk"

export type Block = {
  type: string
  data: Record<string, any>
  is_active?: boolean
}

type Field = {
  key: string
  label: string
  /**
   * `list` is an array of plain strings; `items` is an array of objects whose
   * shape is described by `itemFields`. Both render as reorderable rows rather
   * than a JSON textarea.
   */
  kind:
    | "text"
    | "area"
    | "number"
    | "image"
    | "list"
    | "items"
    | "group"
    | "select"
    | "elements"
  itemFields?: Field[]
  /** Label for the add button, e.g. "Add card". */
  addLabel?: string
  options?: Array<{ value: string; label: string }>
  helpText?: string
  placeholder?: string
}

type BlockDefinition = {
  label: string
  description: string
  category: string
  fields: Field[]
}

/**
 * The section catalogue as editors see it.
 *
 * The API validates against the real zod schemas; this supplies the human
 * labels, the grouping in the picker and which inputs to show, so nobody has to
 * recognise a type name like `proofLogos` or hand-write JSON. A type the API
 * reports but that is missing here still appears in the picker and falls back
 * to a JSON field, so a new block is never silently uneditable.
 */
const BLOCK_CATALOG: Record<string, BlockDefinition> = {
  hero: {
    label: "Hero",
    description: "Page header with breadcrumbs, title and call-to-action",
    category: "Header",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
      { key: "image", label: "Image", kind: "image" },
      {
        key: "actions",
        label: "Buttons",
        kind: "items",
        addLabel: "Add button",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "href", label: "Link", kind: "text" },
        ],
      },
    ],
  },
  proofLogos: {
    label: "Proof logos",
    description: "\"Our work featured on\" logo strip",
    category: "Social proof",
    fields: [
      { key: "title", label: "Title", kind: "text" },
      {
        key: "logos",
        label: "Logos",
        kind: "items",
        addLabel: "Add logo",
        itemFields: [
          { key: "src", label: "Image", kind: "image" },
          { key: "alt", label: "Alt text", kind: "text" },
        ],
      },
    ],
  },
  richText: {
    label: "Rich text",
    description: "A heading and free-form body copy",
    category: "Content",
    fields: [
      { key: "title", label: "Title", kind: "text" },
      { key: "html", label: "Content", kind: "area" },
    ],
  },
  cardGrid: {
    label: "Card grid",
    description: "Image and text cards, 2 to 4 per row",
    category: "Content",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
      { key: "columns", label: "Columns (2-4)", kind: "number" },
      {
        key: "cards",
        label: "Cards",
        kind: "items",
        addLabel: "Add card",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "image", label: "Image", kind: "image" },
        ],
      },
    ],
  },
  bulletList: {
    label: "Bullet list",
    description: "Checklist of capabilities or outcomes",
    category: "Content",
    fields: [
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
      { key: "columns", label: "Columns (1-2)", kind: "number" },
      {
        key: "items",
        label: "Bullets",
        kind: "list",
        addLabel: "Add bullet",
      },
    ],
  },
  accordion: {
    label: "Accordion",
    description: "Expandable rows, as on \"What Sets Our Services Apart\"",
    category: "Content",
    fields: [
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
      {
        key: "items",
        label: "Rows",
        kind: "items",
        addLabel: "Add row",
        itemFields: [
          { key: "title", label: "Row title", kind: "text" },
          { key: "body", label: "Body", kind: "area" },
        ],
      },
    ],
  },
  faqs: {
    label: "FAQs",
    description: "Expandable questions and answers saved on this page.",
    category: "Content",
    fields: [
      {
        key: "eyebrow",
        label: "Small label above the heading",
        kind: "text",
        placeholder: "FAQs",
      },
      { key: "title", label: "Section heading", kind: "text" },
      {
        key: "description",
        label: "Intro text",
        kind: "area",
        helpText: "Optional text displayed above the questions.",
      },
      {
        key: "items",
        label: "Questions",
        kind: "items",
        addLabel: "Add question",
        helpText: "Questions and answers belong to this page and can be reordered.",
        itemFields: [
          { key: "question", label: "Question", kind: "text" },
          { key: "answer", label: "Answer", kind: "area" },
        ],
      },
    ],
  },
  leadForm: {
    label: "Lead form",
    description: "Enquiry form with focus cards beside it",
    category: "Conversion",
    fields: [
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "heading", label: "Heading", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
      { key: "submitLabel", label: "Button label", kind: "text" },
      {
        key: "focusItems",
        label: "Focus cards",
        kind: "items",
        addLabel: "Add focus card",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "value", label: "Value", kind: "text" },
        ],
      },
    ],
  },
  customSection: {
    label: "Start with a blank section",
    description:
      "Choose the look, then add the headings, text, images, buttons, cards, or lists you need",
    category: "Start here",
    fields: [
      {
        key: "eyebrow",
        label: "Small label above the heading",
        kind: "text",
        helpText: "Optional. For example: Our approach.",
      },
      {
        key: "title",
        label: "Main heading",
        kind: "text",
        helpText: "The main title visitors will see in this section.",
      },
      {
        key: "description",
        label: "Intro text",
        kind: "area",
        helpText: "A short introduction displayed under the heading.",
      },
      {
        key: "theme",
        label: "Background color",
        kind: "select",
        helpText: "Use one of the site’s preset colors.",
        options: [
          { value: "light", label: "White" },
          { value: "soft", label: "Soft blue" },
          { value: "dark", label: "Navy" },
          { value: "brand", label: "Brand blue" },
        ],
      },
      {
        key: "alignment",
        label: "Heading alignment",
        kind: "select",
        helpText: "Choose whether the heading and intro are left-aligned or centered.",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ],
      },
      {
        key: "width",
        label: "Section width",
        kind: "select",
        helpText: "Set how much horizontal space this section uses.",
        options: [
          { value: "narrow", label: "Narrow" },
          { value: "standard", label: "Standard" },
          { value: "wide", label: "Wide" },
        ],
      },
      {
        key: "elements",
        label: "Page layout",
        kind: "elements",
        helpText:
          "Build from the outside in: set the container, add rows, choose columns, then place and edit elements.",
      },
    ],
  },
  whoWeServe: {
    label: "Who We Serve page",
    description: "The audience page template: hero, capabilities and FAQs",
    category: "Page templates",
    fields: [
      { key: "label", label: "Audience name", kind: "text" },
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "summary", label: "Summary", kind: "area" },
      { key: "intro", label: "Intro", kind: "area" },
      { key: "heroImage", label: "Hero image", kind: "image" },
      { key: "strategyImage", label: "Strategy image", kind: "image" },
      { key: "showcaseImage", label: "Showcase image", kind: "image" },
      {
        key: "highlights",
        label: "Highlights",
        kind: "list",
        addLabel: "Add highlight",
      },
      {
        key: "supportPoints",
        label: "Support points",
        kind: "list",
        addLabel: "Add support point",
      },
      {
        key: "cards",
        label: "Capability cards",
        kind: "items",
        addLabel: "Add capability card",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "image", label: "Image", kind: "image" },
        ],
      },
    ],
  },
  service: {
    label: "Services page",
    description: "The service template: hero, capabilities, sections and FAQs",
    category: "Page templates",
    fields: [
      { key: "label", label: "Service name", kind: "text" },
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text" },
      { key: "summary", label: "Summary", kind: "area" },
      { key: "intro", label: "Intro", kind: "area" },
      {
        key: "capabilities",
        label: "Capabilities",
        kind: "list",
        addLabel: "Add capability",
      },
      { key: "outcomes", label: "Outcomes", kind: "list", addLabel: "Add outcome" },
      {
        key: "sections",
        label: "Sections",
        kind: "items",
        addLabel: "Add section",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "items", label: "Bullets", kind: "list", addLabel: "Add bullet" },
          { key: "imageUrl", label: "Image", kind: "image" },
          { key: "imageAlt", label: "Image alt text", kind: "text" },
        ],
      },
      {
        key: "faqs",
        label: "FAQs",
        kind: "items",
        addLabel: "Add question",
        itemFields: [
          { key: "question", label: "Question", kind: "text" },
          { key: "answer", label: "Answer", kind: "area" },
        ],
      },
      {
        key: "supportingMessage",
        label: "Supporting message",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
        ],
      },
      {
        key: "differentiators",
        label: "Differentiators",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "items", label: "Points", kind: "list", addLabel: "Add point" },
        ],
      },
      {
        key: "aboutSection",
        label: "About section",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          {
            key: "paragraphs",
            label: "Paragraphs",
            kind: "list",
            addLabel: "Add paragraph",
          },
          {
            key: "listGroups",
            label: "List groups",
            kind: "items",
            addLabel: "Add list group",
            itemFields: [
              { key: "title", label: "Title", kind: "text" },
              { key: "items", label: "Items", kind: "list", addLabel: "Add item" },
            ],
          },
        ],
      },
      {
        key: "finalCta",
        label: "Closing call to action",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "primaryLabel", label: "Primary button", kind: "text" },
          { key: "secondaryLabel", label: "Secondary button", kind: "text" },
        ],
      },
    ],
  },
  company: {
    label: "Company page",
    description: "The company template: hero, proof, sections and about",
    category: "Page templates",
    fields: [
      { key: "label", label: "Page name", kind: "text" },
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text" },
      { key: "summary", label: "Summary", kind: "area" },
      { key: "intro", label: "Intro", kind: "area" },
      { key: "heroNote", label: "Hero note", kind: "text" },
      { key: "ctaLabel", label: "CTA label", kind: "text" },
      {
        key: "heroImage",
        label: "Hero image",
        kind: "group",
        itemFields: [
          { key: "src", label: "Image", kind: "image" },
          { key: "alt", label: "Alt text", kind: "text" },
        ],
      },
      {
        key: "highlights",
        label: "Highlights",
        kind: "list",
        addLabel: "Add highlight",
      },
      {
        key: "supportPoints",
        label: "Support points",
        kind: "list",
        addLabel: "Add support point",
      },
      { key: "proofTitle", label: "Proof title", kind: "text" },
      {
        key: "proofItems",
        label: "Proof items",
        kind: "items",
        addLabel: "Add proof item",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "title", label: "Title", kind: "text" },
          { key: "meta", label: "Meta", kind: "text" },
        ],
      },
      { key: "sectionTitle", label: "Section title", kind: "text" },
      {
        key: "sections",
        label: "Sections",
        kind: "items",
        addLabel: "Add section",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "bullets", label: "Bullets", kind: "list", addLabel: "Add bullet" },
          { key: "imageUrl", label: "Image", kind: "image" },
          { key: "imageAlt", label: "Image alt text", kind: "text" },
        ],
      },
      {
        key: "supportingMessage",
        label: "Supporting message",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
        ],
      },
      {
        key: "differentiators",
        label: "Differentiators",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "items", label: "Points", kind: "list", addLabel: "Add point" },
        ],
      },
      {
        key: "aboutSection",
        label: "About section",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          {
            key: "paragraphs",
            label: "Paragraphs",
            kind: "list",
            addLabel: "Add paragraph",
          },
          {
            key: "listGroups",
            label: "List groups",
            kind: "items",
            addLabel: "Add list group",
            itemFields: [
              { key: "title", label: "Title", kind: "text" },
              { key: "items", label: "Items", kind: "list", addLabel: "Add item" },
            ],
          },
        ],
      },
      {
        key: "finalCta",
        label: "Closing call to action",
        kind: "group",
        itemFields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "description", label: "Description", kind: "area" },
          { key: "primaryLabel", label: "Primary button", kind: "text" },
          { key: "secondaryLabel", label: "Secondary button", kind: "text" },
        ],
      },
    ],
  },
  resource: {
    label: "Resources page",
    description: "The resource template: hero, highlights and formats",
    category: "Page templates",
    fields: [
      { key: "label", label: "Resource name", kind: "text" },
      { key: "eyebrow", label: "Eyebrow", kind: "text" },
      { key: "title", label: "Title", kind: "text" },
      { key: "summary", label: "Summary", kind: "area" },
      { key: "intro", label: "Intro", kind: "area" },
      {
        key: "highlights",
        label: "Highlights",
        kind: "list",
        addLabel: "Add highlight",
      },
      { key: "formats", label: "Formats", kind: "list", addLabel: "Add format" },
    ],
  },
  cta: {
    label: "Call to action",
    description: "Closing banner with one or two buttons",
    category: "Conversion",
    fields: [
      { key: "title", label: "Title", kind: "text" },
      { key: "description", label: "Description", kind: "area" },
    ],
  },
}

export const describe = (type: string): BlockDefinition =>
  BLOCK_CATALOG[type] ?? {
    label: type,
    description: "Edit this section's content as JSON",
    category: "Other",
    fields: [],
  }

/**
 * Uploads through Medusa's File module and keeps the returned URL.
 *
 * The URL is stored on the block rather than the file id, so the storefront can
 * render straight from the payload without resolving files per request. Pasting
 * a URL stays possible for images hosted elsewhere.
 */
export const ImageField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const upload = async (file: File) => {
    setIsUploading(true)

    try {
      const { files } = await sdk.admin.upload.create({ files: [file] })
      const [uploaded] = files ?? []

      if (!uploaded?.url) {
        throw new Error("The upload returned no URL")
      }

      onChange(uploaded.url)
      toast.success("Image uploaded")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image"
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="flex items-center gap-3">
          {/* Admin-side preview of an arbitrary host, so a plain img avoids
              next/image-style host configuration. */}
          <img
            src={value}
            alt=""
            className="h-16 w-24 border border-ui-border-base object-cover"
          />
          <Button
            size="small"
            variant="transparent"
            onClick={() => onChange("")}
          >
            Remove
          </Button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button size="small" variant="secondary" isLoading={isUploading} asChild>
          <label className="cursor-pointer">
            {value ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]

                if (file) {
                  upload(file)
                }

                // Reset, so picking the same file twice still fires a change.
                event.target.value = ""
              }}
            />
          </label>
        </Button>
        <Input
          value={value}
          placeholder="or paste an image URL"
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  )
}

/** A one-line preview of a collapsed section, so the list stays readable. */
const summarize = (block: Block) => {
  const data = block.data ?? {}
  const candidate = data.title || data.heading || data.eyebrow

  return typeof candidate === "string" && candidate.trim().length
    ? candidate
    : null
}

export const move = <T,>(items: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= items.length || from === to) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  return next
}

/** Array of plain strings: bullet points, capabilities, outcomes. */
const StringList = ({
  value,
  addLabel,
  onChange,
}: {
  value: string[]
  addLabel?: string
  onChange: (next: string[]) => void
}) => (
  <div className="flex flex-col gap-2">
    {value.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <Input
          value={entry}
          onChange={(event) =>
            onChange(
              value.map((item, position) =>
                position === index ? event.target.value : item
              )
            )
          }
        />
        <IconButton
          size="small"
          variant="transparent"
          disabled={index === 0}
          onClick={() => onChange(move(value, index, index - 1))}
        >
          <ArrowUpMini />
        </IconButton>
        <IconButton
          size="small"
          variant="transparent"
          disabled={index === value.length - 1}
          onClick={() => onChange(move(value, index, index + 1))}
        >
          <ArrowDownMini />
        </IconButton>
        <IconButton
          size="small"
          variant="transparent"
          onClick={() => onChange(value.filter((_, i) => i !== index))}
        >
          <Trash />
        </IconButton>
      </div>
    ))}

    <Button
      size="small"
      variant="secondary"
      className="w-fit"
      onClick={() => onChange([...value, ""])}
    >
      <Plus /> {addLabel ?? "Add item"}
    </Button>
  </div>
)

/** One input, chosen by field kind. Shared by blocks and by repeated rows. */
const FieldInput = ({
  field,
  value,
  onChange,
}: {
  field: Field
  value: any
  onChange: (next: any) => void
}) => {
  if (field.kind === "list") {
    return (
      <StringList
        value={Array.isArray(value) ? value : []}
        addLabel={field.addLabel}
        onChange={onChange}
      />
    )
  }

  if (field.kind === "image") {
    return <ImageField value={value ?? ""} onChange={onChange} />
  }

  if (field.kind === "area") {
    return (
      <Textarea
        rows={3}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  if (field.kind === "select") {
    const selectedValue = String(value ?? field.options?.[0]?.value ?? "")

    return (
      <Select value={selectedValue} onValueChange={onChange}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {(field.options ?? []).map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    )
  }

  return (
    <Input
      type={field.kind === "number" ? "number" : "text"}
      value={value ?? ""}
      placeholder={field.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

/** Array of objects: cards, FAQs, logos, accordion rows. */
const ObjectList = ({
  value,
  fields,
  addLabel,
  maxRows,
  onChange,
}: {
  value: Record<string, any>[]
  fields: Field[]
  addLabel?: string
  maxRows?: number
  onChange: (next: Record<string, any>[]) => void
}) => {
  const patch = (index: number, key: string, next: any) =>
    onChange(
      value.map((entry, position) =>
        position === index ? { ...entry, [key]: next } : entry
      )
    )

  return (
    <div className="flex flex-col gap-3">
      {value.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 border border-ui-border-base bg-ui-bg-subtle p-3"
        >
          <div className="flex items-center justify-between">
            <Text size="small" weight="plus" className="text-ui-fg-subtle">
              {index + 1}
            </Text>
            <div className="flex items-center gap-1">
              <IconButton
                size="small"
                variant="transparent"
                disabled={index === 0}
                onClick={() => onChange(move(value, index, index - 1))}
              >
                <ArrowUpMini />
              </IconButton>
              <IconButton
                size="small"
                variant="transparent"
                disabled={index === value.length - 1}
                onClick={() => onChange(move(value, index, index + 1))}
              >
                <ArrowDownMini />
              </IconButton>
              <IconButton
                size="small"
                variant="transparent"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                <Trash />
              </IconButton>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.kind === "area" || field.kind === "image"
                    ? "md:col-span-2"
                    : ""
                }
              >
                <Label size="small" weight="plus">
                  {field.label}
                </Label>
                <FieldInput
                  field={field}
                  value={entry?.[field.key]}
                  onChange={(next) => patch(index, field.key, next)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        size="small"
        variant="secondary"
        className="w-fit"
        disabled={maxRows !== undefined && value.length >= maxRows}
        onClick={() => onChange([...value, {}])}
      >
        <Plus /> {addLabel ?? "Add row"}
      </Button>
    </div>
  )
}

/** A nested object rendered as a labelled set of its own fields. */
const GroupField = ({
  value,
  fields,
  onChange,
}: {
  value: Record<string, any>
  fields: Field[]
  onChange: (next: Record<string, any>) => void
}) => (
  <div className="grid gap-3 border border-ui-border-base bg-ui-bg-subtle p-3 md:grid-cols-2">
    {fields.map((field) => (
      <div
        key={field.key}
        className={
          field.kind === "text" || field.kind === "number"
            ? ""
            : "md:col-span-2"
        }
      >
        <Label size="small" weight="plus">
          {field.label}
        </Label>
        {field.kind === "items" ? (
          <ObjectList
            value={Array.isArray(value?.[field.key]) ? value[field.key] : []}
            fields={field.itemFields ?? []}
            addLabel={field.addLabel}
            onChange={(next) => onChange({ ...value, [field.key]: next })}
          />
        ) : (
          <FieldInput
            field={field}
            value={value?.[field.key]}
            onChange={(next) => onChange({ ...value, [field.key]: next })}
          />
        )}
      </div>
    ))}
  </div>
)

type CustomElementType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "card"
  | "bulletList"
  | "spacer"
  | "divider"
  | "link"
  | "quote"
  | "video"
  | "html"

type HtmlElementNode = {
  tag: string
  text: string
  attributes: Array<{ name: string; value: string }>
  children: HtmlElementNode[]
}

const HTML_TAGS = [
  "a", "abbr", "address", "area", "article", "aside", "audio", "b",
  "bdi", "bdo", "blockquote", "br", "button", "canvas", "caption",
  "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del",
  "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption",
  "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6",
  "header", "hgroup", "hr", "i", "iframe", "img", "input", "ins", "kbd",
  "label", "legend", "li", "main", "map", "mark", "menu", "meter", "nav",
  "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress",
  "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select",
  "small", "source", "span", "strong", "sub", "summary", "sup", "table",
  "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr",
  "track", "u", "ul", "var", "video", "wbr",
] as const

const HTML_TAG_OPTIONS = HTML_TAGS.map((tag) => ({
  value: tag,
  label: `<${tag}>`,
}))

const createHtmlNode = (tag = "div"): HtmlElementNode => ({
  tag,
  text: "",
  attributes: [],
  children: [],
})

const HTML_VOID_TAGS = new Set([
  "area", "br", "col", "hr", "img", "input", "source", "track", "wbr",
])
const HTML_LEAF_TAGS = new Set([...HTML_VOID_TAGS, "iframe"])

type BuilderElement = Record<string, any>
type BuilderColumn = {
  span: number
  surface: string
  padding: string
  elements: BuilderElement[]
}
type BuilderRow = {
  gap: string
  alignment: string
  columns: BuilderColumn[]
}

const DEFAULT_COLUMN_SPANS: Record<number, number> = {
  1: 12,
  2: 6,
  3: 4,
  4: 3,
}

const COLUMN_WIDTH_OPTIONS = [
  { value: 3, label: "1/4 width" },
  { value: 4, label: "1/3 width" },
  { value: 6, label: "1/2 width" },
  { value: 8, label: "2/3 width" },
  { value: 9, label: "3/4 width" },
  { value: 12, label: "Full width" },
]

const COLUMN_SPAN_CLASSES: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
}

const COLUMN_SURFACES = [
  { value: "transparent", label: "Transparent" },
  { value: "white", label: "White card" },
  { value: "soft", label: "Soft blue" },
  { value: "dark", label: "Navy" },
  { value: "brand", label: "Brand blue" },
]

const COLUMN_PADDING = [
  { value: "none", label: "None" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
]

const ROW_GAPS = [
  { value: "small", label: "Small gap" },
  { value: "medium", label: "Medium gap" },
  { value: "large", label: "Large gap" },
]

const ROW_ALIGNMENTS = [
  { value: "stretch", label: "Equal height" },
  { value: "start", label: "Align top" },
  { value: "center", label: "Align center" },
  { value: "end", label: "Align bottom" },
]

const createBuilderColumn = (span = 12): BuilderColumn => ({
  span,
  surface: "transparent",
  padding: "medium",
  elements: [],
})

const createBuilderRow = (count = 1): BuilderRow => ({
  gap: "medium",
  alignment: "stretch",
  columns: Array.from({ length: count }, () =>
    createBuilderColumn(DEFAULT_COLUMN_SPANS[count] ?? 12)
  ),
})

const getBuilderRows = (data: Record<string, any>): BuilderRow[] => {
  if (Array.isArray(data.rows)) {
    return data.rows.slice(0, 12).map((row: Record<string, any>) => ({
      gap: row.gap ?? "medium",
      alignment: row.alignment ?? "stretch",
      columns:
        Array.isArray(row.columns) && row.columns.length
          ? row.columns.slice(0, 4).map((column: Record<string, any>) => ({
              ...createBuilderColumn(),
              ...column,
              elements: Array.isArray(column.elements) ? column.elements : [],
            }))
          : [createBuilderColumn()],
    }))
  }

  const legacyElements = Array.isArray(data.elements) ? data.elements : []
  const legacyColumnCount = Number(data.contentColumns) ||
    (data.layout === "twoColumn" &&
    !data.eyebrow &&
    !data.title &&
    !data.description
      ? 2
      : 1)
  const count = Math.max(1, Math.min(4, legacyColumnCount))
  const row = createBuilderRow(count)

  legacyElements.forEach((element: BuilderElement, index: number) => {
    row.columns[index % count].elements.push(element)
  })

  return [row]
}

const ELEMENT_OPTIONS: Array<{
  value: CustomElementType
  label: string
  description: string
  category: "Essentials" | "Content" | "Media" | "Advanced"
}> = [
  {
    value: "heading",
    label: "Heading",
    description: "Add a subheading inside the section.",
    category: "Essentials",
  },
  {
    value: "text",
    label: "Paragraph",
    description: "Add a block of supporting text.",
    category: "Essentials",
  },
  {
    value: "image",
    label: "Image",
    description: "Upload an image or paste an image URL.",
    category: "Media",
  },
  {
    value: "video",
    label: "Video",
    description: "Embed a hosted video with playback controls.",
    category: "Media",
  },
  {
    value: "button",
    label: "Button",
    description: "Add a link that looks like a button.",
    category: "Essentials",
  },
  {
    value: "card",
    label: "Highlight card",
    description: "Show a title, description, and optional image in a card.",
    category: "Content",
  },
  {
    value: "bulletList",
    label: "Checklist",
    description: "Add a short list of points with check marks.",
    category: "Content",
  },
  {
    value: "link",
    label: "Text link",
    description: "Add a text link to another page or website.",
    category: "Content",
  },
  {
    value: "quote",
    label: "Quote",
    description: "Highlight a quote with an optional attribution.",
    category: "Content",
  },
  {
    value: "spacer",
    label: "Spacer",
    description: "Add breathing room between elements.",
    category: "Content",
  },
  {
    value: "divider",
    label: "Divider",
    description: "Add a subtle line between content.",
    category: "Content",
  },
  {
    value: "html",
    label: "HTML element",
    description: "Choose a tag, add attributes, and nest child elements.",
    category: "Advanced",
  },
]

const ELEMENT_FIELDS: Record<CustomElementType, Field[]> = {
  heading: [{ key: "heading", label: "Heading", kind: "text" }],
  text: [{ key: "text", label: "Text", kind: "area" }],
  image: [
    { key: "image", label: "Image", kind: "image" },
    { key: "imageAlt", label: "Alt text", kind: "text" },
  ],
  button: [
    { key: "buttonLabel", label: "Button label", kind: "text" },
    { key: "buttonHref", label: "Link", kind: "text" },
  ],
  card: [
    { key: "cardTitle", label: "Title", kind: "text" },
    { key: "cardDescription", label: "Description", kind: "area" },
    { key: "cardImage", label: "Image", kind: "image" },
  ],
  bulletList: [
    { key: "heading", label: "List heading", kind: "text" },
    { key: "items", label: "Items", kind: "list", addLabel: "Add item" },
  ],
  spacer: [],
  divider: [],
  link: [
    { key: "linkLabel", label: "Link text", kind: "text" },
    { key: "linkHref", label: "Destination URL", kind: "text" },
  ],
  quote: [
    { key: "quoteText", label: "Quote", kind: "area" },
    { key: "quoteAttribution", label: "Attribution", kind: "text" },
  ],
  video: [
    { key: "videoUrl", label: "Video URL", kind: "text" },
    { key: "videoTitle", label: "Accessible title", kind: "text" },
  ],
  html: [],
}

const HtmlElementEditor = ({
  value,
  onChange,
  depth = 0,
}: {
  value: HtmlElementNode
  onChange: (next: HtmlElementNode) => void
  depth?: number
}) => {
  const [childTag, setChildTag] = useState("div")
  const [tagSearch, setTagSearch] = useState("")
  const isLeaf = HTML_LEAF_TAGS.has(value.tag)
  const children = Array.isArray(value.children) ? value.children : []
  const attributes = Array.isArray(value.attributes) ? value.attributes : []
  const tagOptions = HTML_TAG_OPTIONS.filter((option) =>
    option.value.includes(tagSearch.trim().toLowerCase())
  )

  const patch = (key: keyof HtmlElementNode, next: any) =>
    onChange({ ...value, [key]: next })

  return (
    <div className="flex flex-col gap-3 border border-ui-border-base bg-ui-bg-base p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Text size="small" weight="plus">
            {depth === 0 ? "HTML element" : `Nested element ${depth + 1}`}
          </Text>
          <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
            Choose a tag, then add text, attributes, or child elements.
          </Text>
        </div>
        <Badge size="2xsmall">{`<${value.tag}>`}</Badge>
      </div>

      <Input
        value={tagSearch}
        onChange={(event) => setTagSearch(event.target.value)}
        placeholder="Find an HTML tag, for example article or button"
        aria-label="Search HTML tags"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label size="small" weight="plus">HTML tag</Label>
          <Select
            value={value.tag}
            onValueChange={(next) =>
              onChange({ ...value, tag: next })
            }
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {tagOptions.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {!isLeaf ? (
          <div>
            <Label size="small" weight="plus">Text content</Label>
            <Textarea
              rows={2}
              value={value.text ?? ""}
              onChange={(event) => patch("text", event.target.value)}
              placeholder="Text shown inside this element"
            />
          </div>
        ) : (
          <Text size="xsmall" className="self-end text-ui-fg-subtle">
            This tag does not contain text or child elements.
          </Text>
        )}
      </div>

      <div>
        <Label size="small" weight="plus">
          Attributes ({attributes.length}/30)
        </Label>
        <Text size="xsmall" className="mb-2 mt-1 text-ui-fg-subtle">
          Add class, id, title, aria-*, data-*, links, image settings, and styles.
          Example style: background-color: #f8fafc; padding: 24px; display: flex; gap: 16px.
          Styles support common layout, spacing, color, border, and typography
          rules. Scripts, event attributes, SVG, and document-level tags are
          excluded. Iframe embeds accept YouTube or Vimeo URLs. The Form tag is
          for layout only; add a Lead form section to collect enquiries.
        </Text>
        <ObjectList
          value={attributes}
          fields={[
            {
              key: "name",
              label: "Attribute name",
              kind: "text",
              placeholder: "class, href, aria-label",
            },
            {
              key: "value",
              label: "Attribute value",
              kind: "text",
              placeholder: "wide-card, /about, padding: 24px",
            },
          ]}
          addLabel="Add attribute"
          maxRows={30}
          onChange={(next) => patch("attributes", next)}
        />
      </div>

      {!isLeaf ? (
        <div className="flex flex-col gap-3 border-t border-ui-border-base pt-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Text size="small" weight="plus">Child elements</Text>
              <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
                Nest tags to build richer layouts and content.
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Select value={childTag} onValueChange={setChildTag}>
                <Select.Trigger className="w-48">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {tagOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <Button
                size="small"
                variant="secondary"
                disabled={depth >= 5 || children.length >= 12}
                onClick={() =>
                  patch("children", [...children, createHtmlNode(childTag)])
                }
              >
                <Plus /> Add child
              </Button>
            </div>
          </div>

          {children.map((child, index) => (
            <div key={index} className="relative pl-3">
              <div className="absolute bottom-0 left-0 top-0 border-l-2 border-ui-border-strong" />
              <div className="mb-2 flex items-center justify-end gap-1">
                <IconButton
                  size="small"
                  variant="transparent"
                  disabled={index === 0}
                  onClick={() => patch("children", move(children, index, index - 1))}
                  aria-label="Move nested element up"
                >
                  <ArrowUpMini />
                </IconButton>
                <IconButton
                  size="small"
                  variant="transparent"
                  disabled={index === children.length - 1}
                  onClick={() => patch("children", move(children, index, index + 1))}
                  aria-label="Move nested element down"
                >
                  <ArrowDownMini />
                </IconButton>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() =>
                    patch("children", children.filter((_, position) => position !== index))
                  }
                  aria-label="Remove nested element"
                >
                  <Trash />
                </IconButton>
              </div>
              <HtmlElementEditor
                value={child}
                depth={depth + 1}
                onChange={(next) =>
                  patch(
                    "children",
                    children.map((item, position) =>
                      position === index ? next : item
                    )
                  )
                }
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** A small visual builder for the content inside a custom page section. */
const ElementList = ({
  rows,
  onChange,
  layout,
  onLayoutChange,
}: {
  rows: BuilderRow[]
  onChange: (next: BuilderRow[]) => void
  layout: string
  onLayoutChange: (next: string) => void
}) => {
  const [search, setSearch] = useState("")
  const [activeColumn, setActiveColumn] = useState({ row: 0, column: 0 })
  const [draggedPath, setDraggedPath] = useState("")
  const [dropTarget, setDropTarget] = useState("")
  const [newRowColumns, setNewRowColumns] = useState(2)
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return ELEMENT_OPTIONS.filter(
      (option) =>
        !query ||
        `${option.label} ${option.description} ${option.category}`
          .toLowerCase()
          .includes(query)
    )
  }, [search])

  const cloneRows = () =>
    rows.map((row) => ({
      ...row,
      columns: row.columns.map((column) => ({
        ...column,
        elements: column.elements.slice(),
      })),
    }))

  const add = (
    type: CustomElementType,
    destination = activeColumn
  ) => {
    const next = cloneRows()
    if (!next.length) {
      next.push(createBuilderRow())
    }
    const rowIndex =
      destination.row >= 0 && destination.row < next.length
        ? destination.row
        : 0
    const columnIndex =
      destination.column >= 0 &&
      destination.column < next[rowIndex].columns.length
        ? destination.column
        : 0
    const element = type === "html" ? { type, html: createHtmlNode() } : { type }
    next[rowIndex].columns[columnIndex].elements.push(element)
    onChange(next)
    setActiveColumn({ row: rowIndex, column: columnIndex })
  }

  const patchElement = (
    rowIndex: number,
    columnIndex: number,
    elementIndex: number,
    key: string,
    value: any
  ) => {
    const next = cloneRows()
    next[rowIndex].columns[columnIndex].elements[elementIndex] = {
      ...next[rowIndex].columns[columnIndex].elements[elementIndex],
      [key]: value,
    }
    onChange(next)
  }

  const changeType = (
    rowIndex: number,
    columnIndex: number,
    elementIndex: number,
    nextType: string
  ) => {
    const next = cloneRows()
    const element = next[rowIndex].columns[columnIndex].elements[elementIndex]
    next[rowIndex].columns[columnIndex].elements[elementIndex] = {
      ...element,
      type: nextType,
      ...(nextType === "html" && !element.html
        ? { html: createHtmlNode() }
        : {}),
    }
    onChange(next)
  }

  const dropOn = (event: DragEvent, rowIndex: number, columnIndex: number) => {
    event.preventDefault()
    event.stopPropagation()
    const newType = event.dataTransfer.getData("application/x-cms-element")
    if (ELEMENT_OPTIONS.some((option) => option.value === newType)) {
      add(newType as CustomElementType, { row: rowIndex, column: columnIndex })
      setDropTarget("")
      return
    }

    const rawSource = event.dataTransfer.getData("application/x-cms-layout-source")
    if (!rawSource) {
      return
    }

    try {
      const source = JSON.parse(rawSource) as {
        row: number
        column: number
        element: number
      }
      const sourceElements = rows[source.row]?.columns[source.column]?.elements
      if (
        !sourceElements ||
        !Number.isInteger(source.element) ||
        source.element < 0 ||
        source.element >= sourceElements.length
      ) {
        return
      }

      const next = cloneRows()
      const [element] = next[source.row].columns[source.column].elements.splice(
        source.element,
        1
      )
      next[rowIndex].columns[columnIndex].elements.push(element)
      onChange(next)
      setActiveColumn({ row: rowIndex, column: columnIndex })
    } catch {
      return
    } finally {
      setDraggedPath("")
      setDropTarget("")
    }
  }

  const patchRow = (rowIndex: number, patch: Partial<BuilderRow>) =>
    onChange(
      rows.map((row, index) =>
        index === rowIndex ? { ...row, ...patch } : row
      )
    )

  const patchColumn = (
    rowIndex: number,
    columnIndex: number,
    patch: Partial<BuilderColumn>
  ) => {
    const next = cloneRows()
    next[rowIndex].columns[columnIndex] = {
      ...next[rowIndex].columns[columnIndex],
      ...patch,
    }
    onChange(next)
  }

  const changeColumnCount = (rowIndex: number, count: number) => {
    const next = cloneRows()
    const row = next[rowIndex]
    const previousCount = row.columns.length
    const wasBalanced = row.columns.every(
      (column) => column.span === row.columns[0]?.span
    )

    if (count < previousCount) {
      const columns = row.columns.slice(0, count)
      const movedElements = row.columns
        .slice(count)
        .flatMap((column) => column.elements)
      const lastIndex = columns.length - 1
      columns[lastIndex] = {
        ...columns[lastIndex],
        elements: [...columns[lastIndex].elements, ...movedElements],
      }
      row.columns = columns
    } else if (count > previousCount) {
      row.columns = [
        ...row.columns,
        ...Array.from({ length: count - previousCount }, () =>
          createBuilderColumn(DEFAULT_COLUMN_SPANS[count] ?? 12)
        ),
      ]
    }

    if (wasBalanced || count < previousCount) {
      row.columns = row.columns.map((column) => ({
        ...column,
        span: DEFAULT_COLUMN_SPANS[count] ?? 12,
      }))
    }

    onChange(next)
  }

  const addRow = () => {
    onChange([...rows, createBuilderRow(newRowColumns)])
    setActiveColumn({ row: rows.length, column: 0 })
  }

  const moveElement = (
    rowIndex: number,
    columnIndex: number,
    elementIndex: number,
    delta: number
  ) => {
    const next = cloneRows()
    const elements = next[rowIndex].columns[columnIndex].elements
    next[rowIndex].columns[columnIndex].elements = move(
      elements,
      elementIndex,
      elementIndex + delta
    )
    onChange(next)
  }

  const layoutOptions = [
    {
      value: "stacked",
      label: "Above content",
      description: "Place the section heading above its rows.",
    },
    {
      value: "twoColumn",
      label: "Beside content",
      description: "Place the section heading beside its rows.",
    },
  ]
  const steps = [
    { number: "1", title: "Container", text: "Set section width and background above." },
    { number: "2", title: "Rows", text: "Add horizontal bands to organize the page." },
    { number: "3", title: "Columns", text: "Choose a split and adjust each column width." },
    { number: "4", title: "Elements", text: "Place cards, text, images, and buttons inside." },
  ]

  const surfaceClasses: Record<string, string> = {
    transparent: "bg-ui-bg-base",
    white: "bg-white",
    soft: "bg-slate-50",
    dark: "bg-slate-900 text-white",
    brand: "bg-sky-50",
  }
  const paddingClasses: Record<string, string> = {
    none: "p-0",
    small: "p-2",
    medium: "p-4",
    large: "p-6",
  }
  const gapClasses: Record<string, string> = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-8",
  }
  const alignmentClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <div className="grid gap-2 border border-ui-border-base bg-ui-bg-subtle p-3 sm:grid-cols-3 xl:col-span-2">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-2">
            <Badge size="2xsmall">{step.number}</Badge>
            <div>
              <Text size="xsmall" weight="plus">{step.title}</Text>
              <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
                {step.text}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <aside className="flex flex-col gap-4 border border-ui-border-base bg-ui-bg-subtle p-3">
        <div>
          <Text size="small" weight="plus">Elements</Text>
          <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
            Click to add to the selected column, or drag into any column.
          </Text>
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search elements"
          aria-label="Search elements"
        />

        <div className="flex flex-col gap-3">
          <div>
            <Text size="xsmall" weight="plus" className="mb-2 text-ui-fg-subtle">
              Section heading position
            </Text>
            <Text size="xsmall" className="mb-2 text-ui-fg-subtle">
              This changes the heading position. Rows below control your content layout.
            </Text>
            <div className="grid grid-cols-2 gap-2">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onLayoutChange(option.value)}
                  aria-pressed={layout === option.value}
                  className={`border p-2 text-left transition-colors ${
                    layout === option.value
                      ? "border-ui-fg-interactive bg-ui-bg-base"
                      : "border-ui-border-base bg-ui-bg-base hover:bg-ui-bg-base-hover"
                  }`}
                >
                  <span className="mb-1 flex h-9 w-9 items-center justify-center border border-ui-border-base text-ui-fg-subtle">
                    <span
                      aria-hidden
                      className={
                        option.value === "stacked"
                          ? "flex h-5 w-5 flex-col gap-0.5"
                          : "grid h-5 w-5 grid-cols-2 gap-0.5"
                      }
                    >
                      <span className="border border-current" />
                      {option.value === "stacked" ? (
                        <span className="border border-current" />
                      ) : null}
                      <span className="border border-current" />
                    </span>
                  </span>
                  <span className="block text-xs font-medium text-ui-fg-base">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
            <Text size="xsmall" className="mt-2 text-ui-fg-subtle">
              {layoutOptions.find((option) => option.value === layout)?.description}
            </Text>
          </div>

          {(["Essentials", "Content", "Media", "Advanced"] as const).map((category) => {
            const options = filteredOptions.filter(
              (option) => option.category === category
            )

            if (!options.length) {
              return null
            }

            return (
              <div key={category}>
                <Text size="xsmall" weight="plus" className="mb-2 text-ui-fg-subtle">
                  {category}
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      draggable
                      onClick={() => add(option.value)}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/x-cms-element", option.value)
                        event.dataTransfer.effectAllowed = "copy"
                      }}
                      className="min-h-24 border border-ui-border-base bg-ui-bg-base p-3 text-left transition-colors hover:bg-ui-bg-base-hover"
                      title={option.description}
                    >
                      <span className="mb-1 flex h-9 w-9 items-center justify-center border border-ui-border-base text-sm font-semibold text-ui-fg-subtle">
                        {option.label === "Paragraph" ? "T" : option.label.slice(0, 1)}
                      </span>
                      <span className="block text-xs font-medium text-ui-fg-base">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-ui-fg-subtle">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
          {!filteredOptions.length ? (
            <Text size="xsmall" className="text-ui-fg-subtle">
              No elements match "{search}".
            </Text>
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-4 border-2 border-ui-fg-interactive bg-ui-bg-base p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ui-border-base pb-3">
          <div className="flex items-center gap-2">
            <Badge size="2xsmall">Container</Badge>
            <div>
              <Text size="small" weight="plus">Page content container</Text>
              <Text size="xsmall" className="mt-1 text-ui-fg-subtle">
                Rows hold columns; columns hold elements. Set width and background above.
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(newRowColumns)}
              onValueChange={(next) => setNewRowColumns(Number(next))}
            >
              <Select.Trigger className="w-32">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {[1, 2, 3, 4].map((count) => (
                  <Select.Item key={count} value={String(count)}>
                    {count} {count === 1 ? "column" : "columns"}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Button
              size="small"
              variant="secondary"
              disabled={rows.length >= 12}
              onClick={addRow}
            >
              <Plus /> Add row
            </Button>
          </div>
        </div>

        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex flex-col gap-3 border border-ui-border-base bg-ui-bg-subtle p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge size="2xsmall">Row {rowIndex + 1}</Badge>
                <Text size="xsmall" className="text-ui-fg-subtle">
                  Add content to each column below.
                </Text>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <Text size="xsmall" weight="plus">Columns</Text>
                  <Select
                    value={String(row.columns.length)}
                    onValueChange={(next) =>
                      changeColumnCount(rowIndex, Number(next))
                    }
                  >
                    <Select.Trigger className="w-20">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {[1, 2, 3, 4].map((count) => (
                        <Select.Item key={count} value={String(count)}>
                          {count}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
                <Select
                  value={row.gap}
                  onValueChange={(next) => patchRow(rowIndex, { gap: next })}
                >
                  <Select.Trigger className="w-32">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {ROW_GAPS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Select
                  value={row.alignment}
                  onValueChange={(next) =>
                    patchRow(rowIndex, { alignment: next })
                  }
                >
                  <Select.Trigger className="w-36">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {ROW_ALIGNMENTS.map((option) => (
                      <Select.Item key={option.value} value={option.value}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <IconButton
                  size="small"
                  variant="transparent"
                  disabled={rowIndex === 0}
                  onClick={() => onChange(move(rows, rowIndex, rowIndex - 1))}
                  aria-label="Move row up"
                >
                  <ArrowUpMini />
                </IconButton>
                <IconButton
                  size="small"
                  variant="transparent"
                  disabled={rowIndex === rows.length - 1}
                  onClick={() => onChange(move(rows, rowIndex, rowIndex + 1))}
                  aria-label="Move row down"
                >
                  <ArrowDownMini />
                </IconButton>
                <IconButton
                  size="small"
                  variant="transparent"
                  onClick={() => onChange(rows.filter((_, index) => index !== rowIndex))}
                  aria-label="Remove row"
                >
                  <Trash />
                </IconButton>
              </div>
            </div>

            <div
              className={
                "grid min-w-0 grid-cols-1 md:grid-cols-12 " +
                (gapClasses[row.gap] ?? gapClasses.medium) +
                " " +
                (alignmentClasses[row.alignment] ?? alignmentClasses.stretch)
              }
            >
              {row.columns.map((column, columnIndex) => {
                const targetKey = rowIndex + ":" + columnIndex
                const columnSpan = COLUMN_SPAN_CLASSES[column.span] ?? COLUMN_SPAN_CLASSES[12]
                const surface = surfaceClasses[column.surface] ?? surfaceClasses.transparent
                const padding = paddingClasses[column.padding] ?? paddingClasses.medium

                return (
                  <div
                    key={columnIndex}
                    className={
                      "min-w-0 " +
                      columnSpan +
                      (activeColumn.row === rowIndex && activeColumn.column === columnIndex
                        ? " ring-1 ring-ui-fg-interactive"
                        : "")
                    }
                    onClick={() => setActiveColumn({ row: rowIndex, column: columnIndex })}
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <Text size="xsmall" weight="plus">
                        Column {columnIndex + 1} · {column.span}/12
                      </Text>
                      <div className="flex flex-wrap items-center gap-1">
                        <Select
                          value={String(column.span)}
                          onValueChange={(next) =>
                            patchColumn(rowIndex, columnIndex, { span: Number(next) })
                          }
                        >
                          <Select.Trigger className="w-28">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {COLUMN_WIDTH_OPTIONS.map((option) => (
                              <Select.Item key={option.value} value={String(option.value)}>
                                {option.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                        <Select
                          value={column.surface}
                          onValueChange={(next) =>
                            patchColumn(rowIndex, columnIndex, { surface: next })
                          }
                        >
                          <Select.Trigger className="w-32">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {COLUMN_SURFACES.map((option) => (
                              <Select.Item key={option.value} value={option.value}>
                                {option.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                        <Select
                          value={column.padding}
                          onValueChange={(next) =>
                            patchColumn(rowIndex, columnIndex, { padding: next })
                          }
                        >
                          <Select.Trigger className="w-24">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {COLUMN_PADDING.map((option) => (
                              <Select.Item key={option.value} value={option.value}>
                                {option.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                        <IconButton
                          size="small"
                          variant="transparent"
                          disabled={columnIndex === 0}
                          onClick={() => {
                            const columns = move(row.columns, columnIndex, columnIndex - 1)
                            patchRow(rowIndex, { columns })
                            setActiveColumn({ row: rowIndex, column: columnIndex - 1 })
                          }}
                          aria-label="Move column left"
                        >
                          <ArrowUpMini className="-rotate-90" />
                        </IconButton>
                        <IconButton
                          size="small"
                          variant="transparent"
                          disabled={columnIndex === row.columns.length - 1}
                          onClick={() => {
                            const columns = move(row.columns, columnIndex, columnIndex + 1)
                            patchRow(rowIndex, { columns })
                            setActiveColumn({ row: rowIndex, column: columnIndex + 1 })
                          }}
                          aria-label="Move column right"
                        >
                          <ArrowDownMini className="-rotate-90" />
                        </IconButton>
                      </div>
                    </div>

                    <div
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDropTarget(targetKey)
                        setActiveColumn({ row: rowIndex, column: columnIndex })
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                          setDropTarget("")
                        }
                      }}
                      onDrop={(event) => dropOn(event, rowIndex, columnIndex)}
                      className={
                        "flex min-h-36 flex-col gap-3 border border-dashed p-3 transition-colors " +
                        surface +
                        " " +
                        padding +
                        (dropTarget === targetKey
                          ? " border-ui-fg-interactive ring-2 ring-ui-fg-interactive"
                          : " border-ui-border-strong")
                      }
                    >
                      {column.elements.map((element, index) => {
                        const type = ELEMENT_OPTIONS.some(
                          (option) => option.value === element.type
                        )
                          ? (element.type as CustomElementType)
                          : "text"
                        const typeLabel =
                          ELEMENT_OPTIONS.find((option) => option.value === type)?.label ??
                          "Paragraph"
                        const fields = ELEMENT_FIELDS[type]
                        const sourcePath = rowIndex + ":" + columnIndex + ":" + index

                        return (
                          <div
                            key={index}
                            className={
                              "flex flex-col gap-3 border bg-ui-bg-subtle p-3 " +
                              (draggedPath === sourcePath
                                ? "opacity-50"
                                : "border-ui-border-base")
                            }
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  draggable
                                  onDragStart={(event) => {
                                    event.dataTransfer.setData(
                                      "application/x-cms-layout-source",
                                      JSON.stringify({
                                        row: rowIndex,
                                        column: columnIndex,
                                        element: index,
                                      })
                                    )
                                    event.dataTransfer.effectAllowed = "move"
                                    setDraggedPath(sourcePath)
                                  }}
                                  onDragEnd={() => {
                                    setDraggedPath("")
                                    setDropTarget("")
                                  }}
                                  className="cursor-grab text-ui-fg-muted active:cursor-grabbing"
                                  aria-label={"Drag " + typeLabel + " to another column"}
                                >
                                  <DotsSix />
                                </span>
                                <Badge size="2xsmall">{index + 1}</Badge>
                                <Text size="small" weight="plus">{typeLabel}</Text>
                              </div>
                              <div className="flex items-center gap-1">
                                <Select
                                  value={type}
                                  onValueChange={(nextType) =>
                                    changeType(rowIndex, columnIndex, index, nextType)
                                  }
                                >
                                  <Select.Trigger className="w-36">
                                    <Select.Value />
                                  </Select.Trigger>
                                  <Select.Content>
                                    {ELEMENT_OPTIONS.map((option) => (
                                      <Select.Item key={option.value} value={option.value}>
                                        {option.label}
                                      </Select.Item>
                                    ))}
                                  </Select.Content>
                                </Select>
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  disabled={index === 0}
                                  onClick={() => moveElement(rowIndex, columnIndex, index, -1)}
                                  aria-label="Move element up in column"
                                >
                                  <ArrowUpMini />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  disabled={index === column.elements.length - 1}
                                  onClick={() => moveElement(rowIndex, columnIndex, index, 1)}
                                  aria-label="Move element down in column"
                                >
                                  <ArrowDownMini />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  variant="transparent"
                                  onClick={() => {
                                    const next = cloneRows()
                                    next[rowIndex].columns[columnIndex].elements.splice(index, 1)
                                    onChange(next)
                                  }}
                                  aria-label="Remove element"
                                >
                                  <Trash />
                                </IconButton>
                              </div>
                            </div>

                            {type === "html" ? (
                              <HtmlElementEditor
                                value={element.html ?? createHtmlNode()}
                                onChange={(next) =>
                                  patchElement(rowIndex, columnIndex, index, "html", next)
                                }
                              />
                            ) : fields.length ? (
                              <div className="grid gap-3 md:grid-cols-2">
                                {fields.map((field) => (
                                  <div
                                    key={field.key}
                                    className={
                                      field.kind === "area" ||
                                      field.kind === "image" ||
                                      field.kind === "list"
                                        ? "md:col-span-2"
                                        : ""
                                    }
                                  >
                                    <Label size="small" weight="plus">{field.label}</Label>
                                    <FieldInput
                                      field={field}
                                      value={element[field.key]}
                                      onChange={(next) =>
                                        patchElement(
                                          rowIndex,
                                          columnIndex,
                                          index,
                                          field.key,
                                          next
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Text size="xsmall" className="text-ui-fg-subtle">
                                This element does not need any content fields.
                              </Text>
                            )}
                          </div>
                        )
                      })}

                      {!column.elements.length ? (
                        <div className="flex flex-1 items-center justify-center px-3 py-6 text-center">
                          <Text size="xsmall" className="text-ui-fg-subtle">
                            Drop an element here, or click one in the library while this column is selected.
                          </Text>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {!rows.length ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 border border-dashed border-ui-border-strong bg-ui-bg-subtle p-6 text-center">
            <Text size="small" weight="plus">Your container is empty</Text>
            <Text size="xsmall" className="max-w-md text-ui-fg-subtle">
              Add a row first. Each row contains columns, and each column holds
              text, cards, media, buttons, or custom HTML.
            </Text>
            <Button
              size="small"
              variant="secondary"
              disabled={rows.length >= 12}
              onClick={addRow}
            >
              <Plus /> Add your first row
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export const SectionCard = ({
  block,
  index,
  total,
  isOpen,
  isDragging,
  isDropTarget,
  onToggle,
  onChange,
  onMove,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  block: Block
  index: number
  total: number
  isOpen: boolean
  isDragging: boolean
  isDropTarget: boolean
  onToggle: (index: number) => void
  onChange: (index: number, data: Record<string, any>) => void
  onMove: (index: number, delta: number) => void
  onRemove: (index: number) => void
  onDragStart: (index: number) => void
  onDragOver: (index: number) => void
  onDrop: (index: number) => void
  onDragEnd: () => void
}) => {
  const definition = describe(block.type)
  const preview = summarize(block)

  return (
    <div
      onDragOver={(event) => {
        // Without this the browser refuses the drop and the row springs back.
        event.preventDefault()
        onDragOver(index)
      }}
      onDrop={(event) => {
        event.preventDefault()
        onDrop(index)
      }}
      className="border border-ui-border-base bg-ui-bg-base"
      style={{
        opacity: isDragging ? 0.4 : 1,
        borderTopColor: isDropTarget ? "var(--fg-interactive)" : undefined,
        borderTopWidth: isDropTarget ? 2 : undefined,
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span
          draggable
          onDragStart={() => onDragStart(index)}
          onDragEnd={onDragEnd}
          className="cursor-grab text-ui-fg-muted active:cursor-grabbing"
          aria-label={`Drag ${definition.label} to reorder`}
        >
          <DotsSix />
        </span>

        <button
          type="button"
          onClick={() => onToggle(index)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronDownMini /> : <ChevronRightMini />}
          <Badge size="2xsmall">{index + 1}</Badge>
          <Text weight="plus" className="shrink-0">
            {definition.label}
          </Text>
          {preview && (
            <Text size="small" className="truncate text-ui-fg-subtle">
              — {preview}
            </Text>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <Tooltip content="Move up">
            <IconButton
              size="small"
              variant="transparent"
              disabled={index === 0}
              onClick={() => onMove(index, -1)}
            >
              <ArrowUpMini />
            </IconButton>
          </Tooltip>
          <Tooltip content="Move down">
            <IconButton
              size="small"
              variant="transparent"
              disabled={index === total - 1}
              onClick={() => onMove(index, 1)}
            >
              <ArrowDownMini />
            </IconButton>
          </Tooltip>
          <Tooltip content="Remove section">
            <IconButton
              size="small"
              variant="transparent"
              onClick={() => onRemove(index)}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-ui-border-base px-3 py-3">
          {block.type === "customSection" ? (
            <div className="mb-4 border border-ui-border-base bg-ui-bg-subtle p-3">
              <Text size="small" weight="plus">
                Build this section as a visual layout
              </Text>
              <Text size="small" className="mt-1 text-ui-fg-subtle">
                Set the container appearance, then add rows, choose columns,
                and place content elements inside them. Save and use Preview
                to check the finished page.
              </Text>
            </div>
          ) : null}
          {definition.fields.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {definition.fields.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.kind === "text" || field.kind === "number"
                      ? ""
                      : "md:col-span-2"
                  }
                >
                  <Label size="small" weight="plus">
                    {field.label}
                  </Label>
                  {field.helpText ? (
                    <Text size="xsmall" className="mb-2 mt-1 text-ui-fg-subtle">
                      {field.helpText}
                    </Text>
                  ) : null}
                  {field.kind === "list" ? (
                    <StringList
                      value={
                        Array.isArray(block.data?.[field.key])
                          ? block.data[field.key]
                          : []
                      }
                      addLabel={field.addLabel}
                      onChange={(next) =>
                        onChange(index, { [field.key]: next })
                      }
                    />
                  ) : field.kind === "group" ? (
                    <GroupField
                      value={
                        block.data?.[field.key] &&
                        typeof block.data[field.key] === "object"
                          ? block.data[field.key]
                          : {}
                      }
                      fields={field.itemFields ?? []}
                      onChange={(next) =>
                        onChange(index, { [field.key]: next })
                      }
                    />
                  ) : field.kind === "items" ? (
                    <ObjectList
                      value={
                        Array.isArray(block.data?.[field.key])
                          ? block.data[field.key]
                          : []
                      }
                      fields={field.itemFields ?? []}
                      addLabel={field.addLabel}
                      onChange={(next) =>
                        onChange(index, { [field.key]: next })
                      }
                    />
                  ) : field.kind === "elements" ? (
                    <ElementList
                      rows={getBuilderRows(block.data ?? {})}
                      onChange={(next) => onChange(index, { rows: next })}
                      layout={block.data?.layout ?? "stacked"}
                      onLayoutChange={(next) =>
                        onChange(index, { layout: next })
                      }
                    />
                  ) : (
                    <FieldInput
                      field={field}
                      value={block.data?.[field.key]}
                      onChange={(next) =>
                        onChange(index, { [field.key]: next })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <Label size="small" weight="plus">
                Content (JSON)
              </Label>
              <Textarea
                rows={6}
                defaultValue={JSON.stringify(block.data ?? {}, null, 2)}
                onBlur={(event) => {
                  try {
                    onChange(index, JSON.parse(event.target.value || "{}"))
                  } catch {
                    toast.error(
                      `${definition.label}: content is not valid JSON`
                    )
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const SectionPicker = ({
  types,
  onPick,
}: {
  types: string[]
  onPick: (type: string) => void
}) => {
  const [open, setOpen] = useState(false)

  const grouped = useMemo(() => {
    const groups = new Map<string, string[]>()

    for (const type of types) {
      const { category } = describe(type)
      groups.set(category, [...(groups.get(category) ?? []), type])
    }

    return [...groups.entries()].sort(([left], [right]) => {
      if (left === "Start here") {
        return -1
      }

      if (right === "Start here") {
        return 1
      }

      return 0
    })
  }, [types])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="secondary">
          <Plus /> Add a section
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Add a section</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex flex-col gap-6 overflow-y-auto">
          <Text size="small" className="text-ui-fg-subtle">
            Choose a ready-made template, or start with a blank section and add
            your own content. Use HTML element for nested tags and attributes.
          </Text>
          {grouped.map(([category, entries]) => (
            <div key={category} className="flex flex-col gap-2">
              <Text size="small" weight="plus" className="text-ui-fg-subtle">
                {category}
              </Text>
              <div className="grid gap-2 md:grid-cols-2">
                {entries.map((type) => {
                  const definition = describe(type)

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        onPick(type)
                        setOpen(false)
                      }}
                      className="border border-ui-border-base p-3 text-left transition-colors hover:bg-ui-bg-base-hover"
                    >
                      <Text weight="plus">{definition.label}</Text>
                      <Text size="small" className="text-ui-fg-subtle">
                        {definition.description}
                      </Text>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}

