import { z } from "@medusajs/framework/zod"

/** Empty strings clear a field, so they normalize to null rather than "". */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional()

const text = z.string().trim().default("")
const link = z.object({ label: text, href: text })

/** Safe HTML5 content tags; document, script, styling, and SVG tags stay excluded. */
const SAFE_HTML_TAGS = [
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

type SafeHtmlTag = (typeof SAFE_HTML_TAGS)[number]

type HtmlElementData = {
  tag: SafeHtmlTag
  text: string
  attributes: Array<{ name: string; value: string }>
  children: HtmlElementData[]
}

const HtmlAttribute = z
  .object({
    name: z.string().trim().max(80).default(""),
    value: text,
  })
  .refine(
    ({ name }) =>
      !name ||
      (/^[a-z][a-z0-9_.:-]*$/i.test(name) &&
        !/^on/i.test(name) &&
        !["srcdoc", "innerhtml", "dangerouslysetinnerhtml"].includes(
          name.toLowerCase()
        )),
    {
      path: ["name"],
      message: "Use a standard attribute name. Event attributes are not allowed.",
    }
  )

const htmlElementSchema = (depth = 0): z.ZodType<HtmlElementData> => {
  const children =
    depth < 5
      ? z.array(htmlElementSchema(depth + 1)).max(12).default([])
      : z.array(z.never()).default([])

  return z.object({
    tag: z.enum(SAFE_HTML_TAGS),
    text,
    attributes: z.array(HtmlAttribute).max(30).default([]),
    children,
  }) as z.ZodType<HtmlElementData>
}

const HtmlElement = htmlElementSchema()

const CustomSectionElement = z.object({
  type: z
    .enum([
      "heading",
      "text",
      "image",
      "button",
      "card",
      "bulletList",
      "spacer",
      "divider",
      "link",
      "quote",
      "video",
      "html",
    ])
    .default("text"),
  heading: text,
  text: text,
  image: optionalText,
  imageAlt: text,
  buttonLabel: text,
  buttonHref: text,
  cardTitle: text,
  cardDescription: text,
  cardImage: optionalText,
  items: z.array(text).default([]),
  linkLabel: text,
  linkHref: text,
  quoteText: text,
  quoteAttribution: text,
  videoUrl: optionalText,
  videoTitle: text,
  html: HtmlElement.optional(),
})

const CustomSectionColumn = z.object({
  span: z.coerce.number().int().min(1).max(12).default(12),
  surface: z.enum(["transparent", "white", "soft", "dark", "brand"]).default("transparent"),
  padding: z.enum(["none", "small", "medium", "large"]).default("medium"),
  elements: z.array(CustomSectionElement).max(40).default([]),
})

const CustomSectionRow = z.object({
  gap: z.enum(["small", "medium", "large"]).default("medium"),
  alignment: z.enum(["start", "center", "end", "stretch"]).default("stretch"),
  columns: z.array(CustomSectionColumn).min(1).max(4),
})

/**
 * The block catalogue.
 *
 * Each entry is one designed section of the site. Most are reusable design
 * system blocks; customSection also supports nested safe HTML elements and
 * attributes for layouts that need more control. New top-level block types need
 * a schema and storefront renderer, never a migration, because the payload
 * lives in one jsonb column.
 *
 * Where a section has more than one legitimate look, it is exposed as a named
 * `variant` or a `columns` count rather than free styling: editors get real
 * control, and nothing they choose can look broken.
 */
export const BLOCK_SCHEMAS = {
  hero: z.object({
    variant: z.enum(["default", "immersive"]).default("default"),
    eyebrow: text,
    title: text,
    description: text,
    image: optionalText,
    note: optionalText,
    actions: z.array(link).default([]),
  }),

  proofLogos: z.object({
    title: text,
    logos: z.array(z.object({ src: text, alt: text })).default([]),
  }),

  richText: z.object({
    title: text,
    html: text,
  }),

  cardGrid: z.object({
    eyebrow: text,
    title: text,
    description: text,
    columns: z.coerce.number().int().min(2).max(4).default(3),
    cards: z
      .array(
        z.object({
          title: text,
          description: text,
          image: optionalText,
        })
      )
      .default([]),
  }),

  bulletList: z.object({
    title: text,
    description: text,
    columns: z.coerce.number().int().min(1).max(2).default(2),
    items: z.array(text).default([]),
  }),

  accordion: z.object({
    title: text,
    description: text,
    items: z
      .array(z.object({ title: text, body: text }))
      .default([]),
  }),

  faqs: z.object({
    eyebrow: text,
    title: text,
    description: text,
    items: z.array(z.object({ question: text, answer: text })).max(100).default([]),
  }),

  leadForm: z.object({
    eyebrow: text,
    heading: text,
    description: text,
    submitLabel: text,
    focusItems: z.array(z.object({ label: text, value: text })).default([]),
  }),

  customSection: z.object({
    eyebrow: text,
    title: text,
    description: text,
    layout: z.enum(["stacked", "twoColumn"]).default("stacked"),
    theme: z.enum(["light", "soft", "dark", "brand"]).default("light"),
    alignment: z.enum(["left", "center"]).default("left"),
    width: z.enum(["narrow", "standard", "wide"]).default("standard"),
    contentColumns: z.coerce.number().int().min(1).max(4).optional(),
    elements: z.array(CustomSectionElement).default([]),
    rows: z.array(CustomSectionRow).max(12).optional(),
  }),

  /**
   * The Who We Serve page template, kept as one structured block rather than
   * free-form sections: the design is fixed and the fields it needs are known,
   * so an editor fills a form instead of reassembling a layout.
   */
  whoWeServe: z.object({
    label: text,
    eyebrow: text,
    summary: text,
    intro: text,
    highlights: z.array(text).default([]),
    supportPoints: z.array(text).default([]),
    // Previously hardcoded in the template, so the three images on these pages
    // could not be changed without a deploy. Empty falls back to the defaults.
    heroImage: optionalText,
    strategyImage: optionalText,
    showcaseImage: optionalText,
    // The capability cards. Previously generated from highlights and support
    // points with four fixed illustrations cycled behind them, so neither the
    // copy nor the artwork could be changed per page.
    cards: z
      .array(
        z.object({
          title: text,
          description: text,
          image: optionalText,
        })
      )
      .default([]),
  }),

  /**
   * The Services page template.
   *
   * Mirrors the shape the storefront template already consumed, so migrating
   * the content did not require touching the design.
   */
  service: z.object({
    label: text,
    eyebrow: text,
    title: text,
    summary: text,
    intro: text,
    capabilities: z.array(text).default([]),
    outcomes: z.array(text).default([]),
    sections: z
      .array(
        z.object({
          title: text,
          description: text,
          items: z.array(text).default([]),
          imageUrl: optionalText,
          imageAlt: optionalText,
        })
      )
      .default([]),
    supportingMessage: z
      .object({ title: text, description: text })
      .partial()
      .optional(),
    differentiators: z
      .object({ title: text, items: z.array(text).default([]) })
      .partial()
      .optional(),
    aboutSection: z
      .object({
        title: text,
        paragraphs: z.array(text).default([]),
        listGroups: z
          .array(z.object({ title: text, items: z.array(text).default([]) }))
          .default([]),
      })
      .partial()
      .optional(),
    faqs: z
      .array(z.object({ question: text, answer: text }))
      .default([]),
    finalCta: z
      .object({
        title: text,
        description: text,
        primaryLabel: text,
        secondaryLabel: optionalText,
      })
      .partial()
      .optional(),
  }),

  /** The Company page template. Same idea, with its own extra sections. */
  company: z.object({
    label: text,
    eyebrow: text,
    title: text,
    summary: text,
    intro: text,
    heroNote: optionalText,
    ctaLabel: optionalText,
    heroImage: z.object({ src: text, alt: text }).partial().optional(),
    highlights: z.array(text).default([]),
    supportPoints: z.array(text).default([]),
    proofTitle: optionalText,
    proofItems: z
      .array(z.object({ label: text, title: text, meta: text }))
      .default([]),
    sectionTitle: optionalText,
    seoCards: z
      .array(
        z.object({
          title: text,
          icon: text,
          segments: z
            .array(z.object({ text: text, accent: z.boolean().optional() }))
            .default([]),
        })
      )
      .default([]),
    sections: z
      .array(
        z.object({
          title: text,
          description: text,
          bullets: z.array(text).default([]),
          imageUrl: optionalText,
          imageAlt: optionalText,
        })
      )
      .default([]),
    supportingMessage: z
      .object({ title: text, description: text })
      .partial()
      .optional(),
    differentiators: z
      .object({ title: text, items: z.array(text).default([]) })
      .partial()
      .optional(),
    aboutSection: z
      .object({
        title: text,
        paragraphs: z.array(text).default([]),
        listGroups: z
          .array(z.object({ title: text, items: z.array(text).default([]) }))
          .default([]),
      })
      .partial()
      .optional(),
    finalCta: z
      .object({
        title: text,
        description: text,
        primaryLabel: text,
        secondaryLabel: optionalText,
      })
      .partial()
      .optional(),
  }),

  /** The Resources page template. */
  resource: z.object({
    label: text,
    eyebrow: text,
    title: text,
    summary: text,
    intro: text,
    highlights: z.array(text).default([]),
    formats: z.array(text).default([]),
  }),

  cta: z.object({
    title: text,
    description: text,
    primary: link.optional(),
    secondary: link.optional(),
  }),
} as const

export type BlockType = keyof typeof BLOCK_SCHEMAS

export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMAS) as [
  BlockType,
  ...BlockType[]
]

/**
 * Validates `data` against the schema for its own `type`, so a payload is
 * rejected at the API rather than reaching a renderer that cannot draw it.
 */
const PageBlockInput = z
  .object({
    type: z.enum(BLOCK_TYPES),
    data: z.record(z.string(), z.unknown()).default({}),
    is_active: z.boolean().optional(),
  })
  .transform((block, ctx) => {
    const parsed = BLOCK_SCHEMAS[block.type].safeParse(block.data)

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["data", ...issue.path],
          message: issue.message,
        })
      }

      return z.NEVER
    }

    return { ...block, data: parsed.data as Record<string, unknown> }
  })

const slug = z
  .string()
  .trim()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/,
    "Use lowercase words separated by - or /, with no leading or trailing slash"
  )

export const UpsertPage = z.object({
  slug,
  title: z.string().trim().min(1),
  breadcrumb_label: optionalText,
  parent_id: optionalText,
  status: z.enum(["draft", "published"]).optional(),
  seo_title: optionalText,
  seo_description: optionalText,
  og_image: optionalText,
  blocks: z.array(PageBlockInput).default([]),
})

export type UpsertPageBody = z.infer<typeof UpsertPage>

/**
 * Posts reuse the page block catalogue: a post is assembled from the same
 * designed sections, and only the surrounding metadata differs.
 */
export const UpsertPost = z.object({
  slug,
  title: z.string().trim().min(1),
  excerpt: optionalText,
  cover_image: optionalText,
  category_id: optionalText,
  tags: z
    .array(z.string().trim())
    .transform((items) => items.filter((item) => item.length > 0))
    .optional(),
  author_id: optionalText,
  status: z.enum(["draft", "published"]).optional(),
  seo_title: optionalText,
  seo_description: optionalText,
  blocks: z.array(PageBlockInput).default([]),
})

export type UpsertPostBody = z.infer<typeof UpsertPost>

export const SetPageStatus = z.object({
  status: z.enum(["draft", "published"]),
})

export type SetPageStatusBody = z.infer<typeof SetPageStatus>

export const SetPostStatus = z.object({
  status: z.enum(["draft", "published"]),
})

export type SetPostStatusBody = z.infer<typeof SetPostStatus>

export const UpsertBlogCategory = z.object({
  name: z.string().trim().min(1),
  slug,
  description: optionalText,
  rank: z.coerce.number().int().min(0).optional(),
})

export const UpsertBlogAuthor = z.object({
  name: z.string().trim().min(1),
  role: optionalText,
  avatar: optionalText,
  bio: optionalText,
})
