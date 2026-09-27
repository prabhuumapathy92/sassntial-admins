import Image from "next/image"
import {
  createElement,
  type CSSProperties,
  type ReactNode,
} from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CmsLeadForm from "@modules/cms/components/lead-form"
import type { CmsBlock } from "@lib/data/cms"

/**
 * Renders the sections an editor assembled in Medusa Admin.
 *
 * Each block type maps to one component here. An unknown type renders nothing
 * rather than throwing, so a page saved against a newer block catalogue still
 * shows every section this build does understand.
 */

type BlockProps = { data: Record<string, any> }

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <section className={`content-container py-10 small:py-14 ${className}`}>
    {children}
  </section>
)

const Eyebrow = ({ children }: { children?: string }) =>
  children ? (
    <p className="text-[11px] font-semibold uppercase text-[#f59e0b]">
      {children}
    </p>
  ) : null

const Heading = ({ children }: { children?: string }) =>
  children ? (
    <h2 className="mt-2 text-[1.6rem] font-bold leading-tight text-[#0f172a] small:text-[2rem]">
      {children}
    </h2>
  ) : null

const Lead = ({ children }: { children?: string }) =>
  children ? (
    <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#667085]">
      {children}
    </p>
  ) : null

const Hero = ({ data }: BlockProps) => (
  <section className="bg-[#0d1220]">
    <div className="content-container grid gap-8 py-12 small:grid-cols-2 small:py-16">
      <div className="min-w-0">
        {data.eyebrow ? (
          <p className="text-[11px] font-semibold uppercase text-[#f8c86f]">
            {data.eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-[2rem] font-bold leading-tight text-white small:text-[2.6rem]">
          {data.title}
        </h1>
        {data.description ? (
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/70">
            {data.description}
          </p>
        ) : null}
        {Array.isArray(data.actions) && data.actions.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {data.actions
              .filter((action: any) => action?.label)
              .map((action: any, index: number) => (
                <LocalizedClientLink
                  key={index}
                  href={action.href || "#"}
                  className={
                    index === 0
                      ? "inline-flex min-h-11 items-center bg-brand-cta px-5 text-sm font-semibold text-white"
                      : "inline-flex min-h-11 items-center border border-white/25 px-5 text-sm font-semibold text-white"
                  }
                >
                  {action.label}
                </LocalizedClientLink>
              ))}
          </div>
        ) : null}
        {data.note ? (
          <p className="mt-4 text-[12px] text-white/50">{data.note}</p>
        ) : null}
      </div>

      {data.image ? (
        <div className="relative min-h-[220px] w-full">
          <Image
            src={data.image}
            alt={data.title ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      ) : null}
    </div>
  </section>
)

const ProofLogos = ({ data }: BlockProps) => {
  const logos = Array.isArray(data.logos) ? data.logos : []

  if (!logos.length) {
    return null
  }

  return (
    <Section className="border-y border-[#e5e9f0]">
      {data.title ? (
        <p className="text-center text-[11px] font-semibold uppercase text-[#94a3b8]">
          {data.title}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {logos.map((logo: any, index: number) => (
          <div key={index} className="relative h-8 w-28">
            <Image
              src={logo.src}
              alt={logo.alt ?? ""}
              fill
              className="object-contain"
              sizes="112px"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

const RichText = ({ data }: BlockProps) => (
  <Section>
    <Heading>{data.title}</Heading>
    {data.html ? (
      <div
        className="product-description mt-4 max-w-3xl text-[15px] leading-7 text-[#475569]"
        // Authored in the admin by a trusted editor, the same trust level as
        // the product description this shares styling with.
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
    ) : null}
  </Section>
)

/**
 * Tailwind only emits classes it can see in the source, so the editor's column
 * count selects from a literal map rather than being interpolated.
 */
const COLUMN_CLASS: Record<number, string> = {
  2: "xsmall:grid-cols-2",
  3: "xsmall:grid-cols-2 small:grid-cols-3",
  4: "xsmall:grid-cols-2 small:grid-cols-4",
}

const CardGrid = ({ data }: BlockProps) => {
  const cards = Array.isArray(data.cards) ? data.cards : []
  const columns = Math.min(Math.max(Number(data.columns) || 3, 2), 4)

  return (
    <Section>
      <Eyebrow>{data.eyebrow}</Eyebrow>
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>

      {cards.length ? (
        <div className={`mt-8 grid gap-4 ${COLUMN_CLASS[columns]}`}>
          {cards.map((card: any, index: number) => (
            <article
              key={index}
              className="border border-[#e5e9f0] bg-white p-5"
            >
              {card.image ? (
                <div className="relative mb-4 h-36 w-full">
                  <Image
                    src={card.image}
                    alt={card.title ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              ) : null}
              <h3 className="text-[15px] font-bold text-[#0f172a]">
                {card.title}
              </h3>
              {card.description ? (
                <p className="mt-2 text-[13px] leading-6 text-[#667085]">
                  {card.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </Section>
  )
}

const BulletList = ({ data }: BlockProps) => {
  const items = Array.isArray(data.items) ? data.items : []

  return (
    <Section>
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>
      {items.length ? (
        <ul
          className={`mt-6 grid gap-3 ${
            Number(data.columns) === 1 ? "" : "small:grid-cols-2"
          }`}
        >
          {items.map((item: string, index: number) => (
            <li
              key={index}
              className="flex gap-3 border border-[#e5e9f0] bg-white px-4 py-3 text-[14px] text-[#334155]"
            >
              <span aria-hidden className="text-[#2c7cf7]">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  )
}

const Accordion = ({ data }: BlockProps) => {
  const items = Array.isArray(data.items) ? data.items : []

  return (
    <Section>
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>
      {items.length ? (
        <div className="mt-6 flex flex-col gap-2">
          {items.map((item: any, index: number) => (
            <details
              key={index}
              className="border border-[#e5e9f0] bg-white px-4 py-3"
            >
              <summary className="cursor-pointer text-[14px] font-semibold text-[#0f172a]">
                {item.title}
              </summary>
              {item.body ? (
                <p className="mt-2 text-[14px] leading-7 text-[#667085]">
                  {item.body}
                </p>
              ) : null}
            </details>
          ))}
        </div>
      ) : null}
    </Section>
  )
}

const Faqs = ({ data }: BlockProps) => {
  const items = Array.isArray(data.items) ? data.items : []

  return (
    <Section>
      <Eyebrow>{data.eyebrow}</Eyebrow>
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>
      {items.length ? (
        <div className="mt-8 flex flex-col gap-3">
          {items.map((item: any, index: number) => (
            <details
              key={index}
              className="group border border-[#dce5f1] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.06)]"
            >
              <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden small:gap-6 small:px-8">
                <span className="flex size-14 shrink-0 items-center justify-center bg-[#eaf3ff] text-sm font-extrabold text-[#245bea]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] font-bold leading-6 text-[#0f172a] small:text-[18px]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-[30px] font-light leading-none text-[#334155] transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              {item.answer ? (
                <div className="border-t border-[#e5e9f0] py-5 pl-[5.5rem] pr-6 text-[14px] leading-7 text-[#667085] small:pl-28 small:pr-8">
                  <p className="whitespace-pre-line">{item.answer}</p>
                </div>
              ) : null}
            </details>
          ))}
        </div>
      ) : null}
    </Section>
  )
}

const LeadForm = ({ data }: BlockProps) => {
  const focus = Array.isArray(data.focusItems) ? data.focusItems : []

  return (
    <Section>
      <div className="grid gap-6 border border-[#e5e9f0] bg-white p-6 small:grid-cols-2">
        <div className="min-w-0">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <Heading>{data.heading}</Heading>
          <Lead>{data.description}</Lead>
          {focus.length ? (
            <div className="mt-5 grid gap-3 xsmall:grid-cols-2">
              {focus.map((item: any, index: number) => (
                <div key={index} className="border border-[#e5e9f0] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase text-[#94a3b8]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-[#0f172a]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <CmsLeadForm
          enquiryType={data.eyebrow || data.heading || "Lead form"}
          submitLabel={data.submitLabel || "Send"}
        />
      </div>
    </Section>
  )
}

const Cta = ({ data }: BlockProps) => (
  <Section>
    <div className="border border-[#e5e9f0] bg-[#f8fbff] px-6 py-10 text-center">
      <Heading>{data.title}</Heading>
      <Lead>{data.description}</Lead>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {[data.primary, data.secondary]
          .filter((action: any) => action?.label)
          .map((action: any, index: number) => (
            <LocalizedClientLink
              key={index}
              href={action.href || "#"}
              className={
                index === 0
                  ? "inline-flex min-h-11 items-center bg-brand-cta px-5 text-sm font-semibold text-white"
                  : "inline-flex min-h-11 items-center border border-[#cbd5e1] px-5 text-sm font-semibold text-[#0f172a]"
              }
            >
              {action.label}
            </LocalizedClientLink>
          ))}
      </div>
    </div>
  </Section>
)

const CUSTOM_SECTION_THEMES: Record<
  string,
  { section: string; eyebrow: string; heading: string; body: string; item: string }
> = {
  light: {
    section: "bg-white",
    eyebrow: "text-sky-700",
    heading: "text-slate-950",
    body: "text-slate-600",
    item: "text-slate-700",
  },
  soft: {
    section: "bg-[#f8fbff]",
    eyebrow: "text-sky-700",
    heading: "text-slate-950",
    body: "text-slate-600",
    item: "text-slate-700",
  },
  dark: {
    section: "bg-[#0d1220]",
    eyebrow: "text-[#f8c86f]",
    heading: "text-white",
    body: "text-white/75",
    item: "text-white",
  },
  brand: {
    section: "bg-[#eaf3ff]",
    eyebrow: "text-sky-700",
    heading: "text-slate-950",
    body: "text-slate-700",
    item: "text-slate-700",
  },
}

const CUSTOM_SECTION_WIDTHS: Record<string, string> = {
  narrow: "mx-auto w-full max-w-3xl px-4",
  standard: "content-container w-full",
  wide: "mx-auto w-full max-w-[1440px] px-4 small:px-6",
}

const CUSTOM_SECTION_LAYOUTS: Record<string, string> = {
  stacked: "flex flex-col gap-6",
  twoColumn: "grid gap-8 medium:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]",
}

const CUSTOM_CONTENT_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "small:grid-cols-2",
  3: "small:grid-cols-2 medium:grid-cols-3",
  4: "small:grid-cols-2 medium:grid-cols-4",
}

const CUSTOM_ROW_GAPS: Record<string, string> = {
  small: "gap-2",
  medium: "gap-4",
  large: "gap-8",
}

const CUSTOM_ROW_ALIGNMENTS: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
}

const CUSTOM_COLUMN_SPANS: Record<number, string> = {
  1: "small:col-span-1",
  2: "small:col-span-2",
  3: "small:col-span-3",
  4: "small:col-span-4",
  5: "small:col-span-5",
  6: "small:col-span-6",
  7: "small:col-span-7",
  8: "small:col-span-8",
  9: "small:col-span-9",
  10: "small:col-span-10",
  11: "small:col-span-11",
  12: "small:col-span-12",
}

const CUSTOM_COLUMN_SURFACES: Record<string, string> = {
  transparent: "bg-transparent",
  white: "border border-[#e5e9f0] bg-white shadow-sm",
  soft: "border border-[#e5e9f0] bg-[#f8fbff]",
  dark: "bg-[#0d1220] text-white",
  brand: "bg-[#eaf3ff]",
}

const CUSTOM_COLUMN_PADDINGS: Record<string, string> = {
  none: "p-0",
  small: "p-2",
  medium: "p-4",
  large: "p-6",
}

type CustomElementData = {
  type?: string
  heading?: string
  text?: string
  image?: string | null
  imageAlt?: string
  buttonLabel?: string
  buttonHref?: string
  cardTitle?: string
  cardDescription?: string
  cardImage?: string | null
  items?: string[]
  linkLabel?: string
  linkHref?: string
  quoteText?: string
  quoteAttribution?: string
  videoUrl?: string | null
  videoTitle?: string
  html?: HtmlElementData
}

type CustomBuilderColumn = {
  span?: number
  surface?: string
  padding?: string
  elements?: CustomElementData[]
}

type CustomBuilderRow = {
  gap?: string
  alignment?: string
  columns?: CustomBuilderColumn[]
}

type HtmlElementData = {
  tag?: string
  text?: string
  attributes?: Array<{ name?: string; value?: string }>
  children?: HtmlElementData[]
}

const SAFE_HTML_TAGS = new Set([
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
])

const HTML_VOID_TAGS = new Set([
  "area", "br", "col", "hr", "img", "input", "source", "track", "wbr",
])

const URL_ATTRIBUTES = new Set([
  "cite", "formaction", "href", "poster", "src", "xlink:href",
])

const BOOLEAN_ATTRIBUTES = new Set([
  "autofocus", "autoplay", "checked", "controls", "default", "defer",
  "disabled", "hidden", "loop", "multiple", "muted", "open", "playsinline",
  "readonly", "required", "reversed", "selected",
])

const ATTRIBUTE_NAMES: Record<string, string> = {
  allowfullscreen: "allowFullScreen",
  autocapitalize: "autoCapitalize",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  cellpadding: "cellPadding",
  charset: "charSet",
  cellspacing: "cellSpacing",
  class: "className",
  colspan: "colSpan",
  crossorigin: "crossOrigin",
  contenteditable: "contentEditable",
  datetime: "dateTime",
  for: "htmlFor",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  httpequiv: "httpEquiv",
  inputmode: "inputMode",
  maxlength: "maxLength",
  minlength: "minLength",
  novalidate: "noValidate",
  playsinline: "playsInline",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rowspan: "rowSpan",
  srcset: "srcSet",
  tabindex: "tabIndex",
  usemap: "useMap",
}

const SAFE_INLINE_STYLE_PROPERTIES = new Set([
  "align-content", "align-items", "align-self", "aspect-ratio", "background",
  "background-color", "border", "border-bottom", "border-color",
  "border-left", "border-radius", "border-right", "border-style",
  "border-top", "border-width", "box-shadow", "box-sizing", "color",
  "column-gap", "cursor", "display", "flex", "flex-basis", "flex-direction",
  "flex-grow", "flex-shrink", "flex-wrap", "font-family", "font-size",
  "font-style", "font-weight", "gap", "grid-auto-columns", "grid-auto-flow",
  "grid-auto-rows", "grid-column", "grid-row", "grid-template-columns",
  "grid-template-rows", "height", "justify-content", "justify-self",
  "letter-spacing", "line-height", "list-style", "list-style-position",
  "margin", "margin-bottom", "margin-left",
  "margin-right", "margin-top", "max-height", "max-width", "min-height",
  "min-width", "object-fit", "object-position", "opacity", "order", "overflow",
  "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left",
  "padding-right", "padding-top", "place-items", "row-gap", "text-align",
  "text-decoration", "text-indent", "text-overflow", "text-shadow",
  "text-transform", "vertical-align", "white-space", "word-break", "overflow-wrap",
  "width",
])

const isSafeUrl = (value: string, attribute: string) => {
  const candidate = value.trim()

  if (!candidate || /[\u0000-\u0020\\]/.test(candidate)) {
    return false
  }

  try {
    const protocol = new URL(candidate, "https://cms.invalid").protocol
    const safeProtocols =
      attribute === "href" || attribute === "cite"
        ? ["http:", "https:", "mailto:", "tel:"]
        : ["http:", "https:"]

    return safeProtocols.includes(protocol)
  } catch {
    return false
  }
}

const isSafeEmbedUrl = (value: string) => {
  if (!isSafeUrl(value, "src")) {
    return false
  }

  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const isYouTube = new Set([
      "youtube.com",
      "www.youtube.com",
      "www.youtube-nocookie.com",
    ]).has(host)
    const isVimeo = host === "player.vimeo.com"

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      ((isYouTube && /^\/embed\/[\w-]+/.test(url.pathname)) ||
        (isVimeo && /^\/video\/\d+/.test(url.pathname)))
    )
  } catch {
    return false
  }
}

const parseInlineStyle = (value: string): CSSProperties => {
  const styles: Record<string, string> = {}

  for (const declaration of value.split(";")) {
    const separator = declaration.indexOf(":")
    if (separator < 1) {
      continue
    }

    const property = declaration.slice(0, separator).trim().toLowerCase()
    const styleValue = declaration.slice(separator + 1).trim()
    if (
      !SAFE_INLINE_STYLE_PROPERTIES.has(property) ||
      !styleValue ||
      /[\\<>]|url\s*\(|expression\s*\(|@import|javascript:|vbscript:|-moz-binding|behavior\s*:/i.test(
        styleValue
      )
    ) {
      continue
    }

    const reactProperty = property.replace(/-([a-z])/g, (_match, letter: string) =>
      letter.toUpperCase()
    )
    styles[reactProperty] = styleValue
  }

  return styles as CSSProperties
}

const HtmlNodeRenderer = ({ node }: { node: HtmlElementData }) => {
  const tag = node.tag?.toLowerCase()

  if (!tag || !SAFE_HTML_TAGS.has(tag)) {
    return null
  }

  const props: Record<string, string | boolean | number | CSSProperties> = {}

  if (tag === "iframe") {
    const source = node.attributes?.find(
      (attribute) => attribute.name?.trim().toLowerCase() === "src"
    )?.value

    if (!source || !isSafeEmbedUrl(source)) {
      return null
    }
  }

  for (const attribute of node.attributes ?? []) {
    const name = attribute.name?.trim().toLowerCase()
    const value = attribute.value ?? ""

    if (
      !name ||
      !/^[a-z][a-z0-9_.:-]*$/i.test(name) ||
      name.startsWith("on") ||
      [
        "children",
        "dangerouslysetinnerhtml",
        "innerhtml",
        "key",
        "ref",
        "srcdoc",
        "suppresscontenteditablewarning",
        "suppresshydrationwarning",
      ].includes(name)
    ) {
      continue
    }

    if ((tag === "form" && name === "action") || name === "formaction") {
      continue
    }

    if (
      name === "srcset" &&
      value
        .split(",")
        .some((candidate) => !isSafeUrl(candidate.trim().split(/\s+/)[0], "src"))
    ) {
      continue
    }

    if (
      URL_ATTRIBUTES.has(name) &&
      !(tag === "iframe" && name === "src" ? isSafeEmbedUrl(value) : isSafeUrl(value, name))
    ) {
      continue
    }

    if (name === "style") {
      const style = parseInlineStyle(value)
      if (Object.keys(style).length) {
        props.style = style
      }
      continue
    }

    const reactName = ATTRIBUTE_NAMES[name] ?? name
    if (BOOLEAN_ATTRIBUTES.has(name)) {
      if (value === "" || value.toLowerCase() === "true") {
        props[reactName] = true
      }
      continue
    }

    props[reactName] = value
  }

  if (tag === "a" && props.target === "_blank") {
    const rel = typeof props.rel === "string" ? props.rel : ""
    props.rel = `${rel} noopener noreferrer`.trim()
  }

  if (tag === "iframe") {
    props.title = typeof props.title === "string" ? props.title : "Embedded video"
    props.loading = "lazy"
    props.referrerPolicy = "no-referrer"
    props.sandbox = "allow-scripts allow-same-origin allow-presentation"
    props.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"
    props.allowFullScreen = true
    props.className = ["aspect-video w-full", props.className]
      .filter(Boolean)
      .join(" ")
  }

  if (HTML_VOID_TAGS.has(tag) || tag === "iframe") {
    return createElement(tag, props)
  }

  const children: ReactNode[] = []
  if (node.text) {
    children.push(node.text)
  }
  const childElements = node.children ?? []
  for (let index = 0; index < childElements.length; index += 1) {
    children.push(
      createElement(HtmlNodeRenderer, { key: index, node: childElements[index] })
    )
  }

  if (tag === "form") {
    if (!props.role) {
      props.role = "group"
    }

    return createElement("div", props, ...children)
  }

  return createElement(tag, props, ...children)
}

const CustomElement = ({
  element,
  theme,
}: {
  element: CustomElementData
  theme: (typeof CUSTOM_SECTION_THEMES)[string]
}) => {
  switch (element.type) {
    case "heading":
      return element.heading ? (
        <h3 className={"text-xl font-bold leading-tight " + theme.heading}>
          {element.heading}
        </h3>
      ) : null

    case "text":
      return element.text ? (
        <p className={"whitespace-pre-line text-[15px] leading-7 " + theme.body}>
          {element.text}
        </p>
      ) : null

    case "image":
      return element.image ? (
        <div className="relative min-h-[220px] overflow-hidden">
          <Image
            src={element.image}
            alt={element.imageAlt ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null

    case "button":
      return element.buttonLabel ? (
        <LocalizedClientLink
          href={
            element.buttonHref && isSafeUrl(element.buttonHref, "href")
              ? element.buttonHref
              : "#"
          }
          className="inline-flex min-h-11 w-fit items-center bg-brand-cta px-5 text-sm font-semibold text-slate-950"
        >
          {element.buttonLabel}
        </LocalizedClientLink>
      ) : null

    case "link":
      return element.linkLabel ? (
        <a
          href={
            element.linkHref && isSafeUrl(element.linkHref, "href")
              ? element.linkHref
              : "#"
          }
          className="w-fit text-sky-700 underline underline-offset-4"
        >
          {element.linkLabel}
        </a>
      ) : null

    case "quote":
      return element.quoteText ? (
        <figure className="border-l-4 border-sky-600 bg-slate-50 px-5 py-4">
          <blockquote className="text-lg leading-8 text-slate-700">
            {element.quoteText}
          </blockquote>
          {element.quoteAttribution ? (
            <figcaption className="mt-3 text-sm font-semibold text-slate-500">
              {element.quoteAttribution}
            </figcaption>
          ) : null}
        </figure>
      ) : null

    case "video":
      return element.videoUrl && isSafeUrl(element.videoUrl, "src") ? (
        <video
          controls
          preload="metadata"
          aria-label={element.videoTitle || "Video"}
          className="w-full"
        >
          <source src={element.videoUrl} />
        </video>
      ) : null

    case "card":
      return element.cardTitle || element.cardDescription || element.cardImage ? (
        <article className="h-full border border-[#e5e9f0] bg-white p-5">
          {element.cardImage ? (
            <div className="relative mb-4 h-36 w-full overflow-hidden">
              <Image
                src={element.cardImage}
                alt={element.cardTitle ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ) : null}
          {element.cardTitle ? (
            <h3 className="text-[15px] font-bold text-[#0f172a]">
              {element.cardTitle}
            </h3>
          ) : null}
          {element.cardDescription ? (
            <p className="mt-2 text-[13px] leading-6 text-[#667085]">
              {element.cardDescription}
            </p>
          ) : null}
        </article>
      ) : null

    case "bulletList":
      return Array.isArray(element.items) && element.items.length ? (
        <div>
          {element.heading ? (
            <h3 className={"mb-3 font-bold " + theme.heading}>
              {element.heading}
            </h3>
          ) : null}
          <ul className="flex flex-col gap-2">
            {element.items.map((item: string, index: number) => (
              <li
                key={String(index) + "-" + item}
                className={
                  "flex gap-3 border border-current/10 px-4 py-3 text-sm " +
                  theme.item
                }
              >
                <span aria-hidden className="text-sky-500">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null

    case "spacer":
      return <div aria-hidden className="h-8" />

    case "divider":
      return <hr className="border-current/15" />

    case "html":
      return element.html ? <HtmlNodeRenderer node={element.html} /> : null

    default:
      return null
  }
}

const CustomSection = ({ data }: BlockProps) => {
  const theme =
    CUSTOM_SECTION_THEMES[data.theme] ?? CUSTOM_SECTION_THEMES.light
  const width =
    CUSTOM_SECTION_WIDTHS[data.width] ?? CUSTOM_SECTION_WIDTHS.standard
  const layout =
    CUSTOM_SECTION_LAYOUTS[data.layout] ?? CUSTOM_SECTION_LAYOUTS.stacked
  const elements = Array.isArray(data.elements) ? data.elements : []
  const hasBuilderRows = Array.isArray(data.rows)
  const rows: CustomBuilderRow[] = hasBuilderRows ? data.rows : []
  const hasHeader = !!(data.eyebrow || data.title || data.description)
  const alignment = data.alignment === "center" ? "text-center" : "text-left"
  const columns =
    Number(data.contentColumns) || (data.layout === "twoColumn" && !hasHeader ? 2 : 1)
  const contentGrid = CUSTOM_CONTENT_COLUMNS[columns] ?? CUSTOM_CONTENT_COLUMNS[1]

  return (
    <section className={["py-10 small:py-14", theme.section].join(" ")}>
      <div className={width}>
        <div
          className={
            data.layout === "twoColumn" && hasHeader
              ? layout
              : "flex flex-col gap-6"
          }
        >
          {hasHeader ? (
            <header className={alignment}>
              {data.eyebrow ? (
                <p className={"text-[11px] font-semibold uppercase " + theme.eyebrow}>
                  {data.eyebrow}
                </p>
              ) : null}
              {data.title ? (
                <h2
                  className={[
                    "mt-2 text-[1.8rem] font-bold leading-tight small:text-[2.2rem]",
                    theme.heading,
                  ].join(" ")}
                >
                  {data.title}
                </h2>
              ) : null}
              {data.description ? (
                <p className={"mt-3 text-[15px] leading-7 " + theme.body}>
                  {data.description}
                </p>
              ) : null}
            </header>
          ) : null}

          {hasBuilderRows ? (
            <div className="flex flex-col gap-8">
              {rows.map((row, rowIndex) => {
                const rowColumns = Array.isArray(row.columns) ? row.columns : []
                const hasContent = rowColumns.some(
                  (column) => Array.isArray(column.elements) && column.elements.length
                )

                if (!hasContent) {
                  return null
                }

                return (
                  <div
                    key={rowIndex}
                    className={
                      "grid min-w-0 grid-cols-1 small:grid-cols-12 " +
                      (CUSTOM_ROW_GAPS[row.gap ?? "medium"] ?? CUSTOM_ROW_GAPS.medium) +
                      " " +
                      (CUSTOM_ROW_ALIGNMENTS[row.alignment ?? "stretch"] ??
                        CUSTOM_ROW_ALIGNMENTS.stretch)
                    }
                  >
                    {rowColumns.map((column, columnIndex) => {
                      const columnElements = Array.isArray(column.elements)
                        ? column.elements
                        : []
                      const span = Number(column.span) || 12

                      return (
                        <div
                          key={columnIndex}
                          className={
                            "min-w-0 " +
                            (CUSTOM_COLUMN_SPANS[span] ?? CUSTOM_COLUMN_SPANS[12]) +
                            " " +
                            (CUSTOM_COLUMN_SURFACES[column.surface ?? "transparent"] ??
                              CUSTOM_COLUMN_SURFACES.transparent) +
                            " " +
                            (CUSTOM_COLUMN_PADDINGS[column.padding ?? "medium"] ??
                              CUSTOM_COLUMN_PADDINGS.medium)
                          }
                        >
                          <div className="flex h-full min-w-0 flex-col gap-3">
                            {columnElements.map((element, elementIndex) => (
                              <CustomElement
                                key={(element.type ?? "element") + "-" + elementIndex}
                                element={element}
                                theme={theme}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ) : elements.length ? (
            <div className={`grid gap-4 ${contentGrid}`}>
              {elements.map((element: CustomElementData, index: number) => (
                <CustomElement
                  key={(element.type ?? "element") + "-" + index}
                  element={element}
                  theme={theme}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

const RENDERERS: Record<string, (props: BlockProps) => React.ReactNode> = {
  hero: Hero,
  proofLogos: ProofLogos,
  richText: RichText,
  cardGrid: CardGrid,
  bulletList: BulletList,
  accordion: Accordion,
  faqs: Faqs,
  leadForm: LeadForm,
  cta: Cta,
  customSection: CustomSection,
}

const BlockRenderer = ({ blocks }: { blocks: CmsBlock[] }) => (
  <>
    {blocks.map((block) => {
      const Renderer = RENDERERS[block.type]

      if (!Renderer) {
        return null
      }

      return <Renderer key={block.id} data={block.data ?? {}} />
    })}
  </>
)

export default BlockRenderer
