import { HttpTypes } from "@medusajs/types"
import {
  getTrainingSpeaker,
  getTrainingDuration,
  getTrainingCategory,
  getMetadataText,
} from "@modules/store/lib/training-catalog"

export type WebinarBlock = {
  id: string
  title: string | null
  html: string
}

export type WebinarFact = {
  label: string
  value: string
  icon: "clock" | "level" | "hash" | "calendar" | "tag"
}

export type WebinarFaculty = {
  name: string
  bio: string | null
  image: string | null
}

/* -------------------------------------------------------------------------- */
/*                              HTML block parsing                            */
/* -------------------------------------------------------------------------- */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&ndash;": "–",
  "&mdash;": "—",
}

const decodeEntities = (value: string) =>
  value.replace(/&[a-z#0-9]+;/gi, (match) => ENTITIES[match.toLowerCase()] ?? match)

export const stripHtml = (html: string) =>
  decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

const VOID_TAG = /\/>$/

/**
 * Walks forward from `fromIndex` (which must sit just after an opening `<tag>`)
 * and returns the boundaries of its matching closing tag, honouring nesting.
 */
const findMatchingClose = (html: string, tag: string, fromIndex: number) => {
  const pattern = new RegExp(String.raw`<${tag}\b[^>]*>|</${tag}\s*>`, "gi")
  pattern.lastIndex = fromIndex

  let depth = 1
  let match: RegExpExecArray | null

  while ((match = pattern.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1

      if (depth === 0) {
        return { contentEnd: match.index, end: pattern.lastIndex }
      }
    } else if (!VOID_TAG.test(match[0])) {
      depth += 1
    }
  }

  return null
}

const extractHeading = (html: string) => {
  const match = html.match(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/i)

  if (!match) {
    return { title: null, rest: html }
  }

  return {
    title: stripHtml(match[2]) || null,
    rest: html.replace(match[0], ""),
  }
}

const extractBlockContent = (html: string) => {
  const opening = /<div\b[^>]*>/gi
  let match: RegExpExecArray | null

  while ((match = opening.exec(html))) {
    if (!/block-content/i.test(match[0])) {
      continue
    }

    const closed = findMatchingClose(html, "div", opening.lastIndex)

    if (closed) {
      return html.slice(opening.lastIndex, closed.contentEnd)
    }
  }

  return null
}

/**
 * Admin-authored descriptions arrive as a list of
 * `<section class="description-block">` wrappers, each holding a
 * `<h2 class="block-title">` and a `<div class="block-content">`.
 */
const parseDescriptionSections = (html: string): WebinarBlock[] => {
  const blocks: WebinarBlock[] = []
  const opening = /<section\b[^>]*>/gi
  let match: RegExpExecArray | null

  while ((match = opening.exec(html))) {
    if (!/description-block/i.test(match[0])) {
      continue
    }

    const closed = findMatchingClose(html, "section", opening.lastIndex)

    if (!closed) {
      continue
    }

    const inner = html.slice(opening.lastIndex, closed.contentEnd)
    const { title, rest } = extractHeading(inner)
    const content = extractBlockContent(inner) ?? rest
    const idMatch = match[0].match(/data-block-id=["']([^"']+)["']/i)

    if (stripHtml(content) || title) {
      blocks.push({
        id: idMatch?.[1] ?? `block-${blocks.length}`,
        title,
        html: content.trim(),
      })
    }

    opening.lastIndex = closed.end
  }

  return blocks
}

/** Fallback for plain rich text: split on the headings the editor produced. */
const parseHeadingSections = (html: string): WebinarBlock[] => {
  const headings = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi
  const blocks: WebinarBlock[] = []
  const matches: Array<{ title: string; start: number; end: number }> = []
  let match: RegExpExecArray | null

  while ((match = headings.exec(html))) {
    matches.push({
      title: stripHtml(match[2]),
      start: match.index,
      end: headings.lastIndex,
    })
  }

  if (!matches.length) {
    return []
  }

  const lead = html.slice(0, matches[0].start)

  if (stripHtml(lead)) {
    blocks.push({ id: "block-lead", title: null, html: lead.trim() })
  }

  matches.forEach((heading, index) => {
    const next = matches[index + 1]
    const content = html.slice(heading.end, next ? next.start : html.length)

    blocks.push({
      id: `block-${index}`,
      title: heading.title || null,
      html: content.trim(),
    })
  })

  return blocks
}

export const parseWebinarBlocks = (
  description?: string | null
): WebinarBlock[] => {
  const html = description?.trim()

  if (!html) {
    return []
  }

  const sections = parseDescriptionSections(html)

  if (sections.length) {
    return sections
  }

  const headingBlocks = parseHeadingSections(html)

  if (headingBlocks.length) {
    return headingBlocks
  }

  return [{ id: "block-0", title: null, html }]
}

/* -------------------------------------------------------------------------- */
/*                            Metadata driven facts                           */
/* -------------------------------------------------------------------------- */

const webinarIdKeys = [
  "webinar_id",
  "webinarId",
  "webinar_code",
  "course_id",
  "courseId",
  "course_code",
  "session_id",
  "sessionId",
  "reference",
  "code",
]

const facultyBioKeys = [
  "faculty_bio",
  "facultyBio",
  "speaker_bio",
  "speakerBio",
  "instructor_bio",
  "presenter_bio",
  "about_speaker",
  "aboutSpeaker",
  "bio",
]

const facultyImageKeys = [
  "faculty_image",
  "facultyImage",
  "faculty_photo",
  "speaker_image",
  "speakerImage",
  "speaker_photo",
  "instructor_image",
  "presenter_image",
]

const recordingKeys = [
  "recording_url",
  "recordingUrl",
  "preview_url",
  "previewUrl",
  "video_url",
  "videoUrl",
  "replay_url",
  "demo_url",
]

const languageKeys = ["language", "languages", "locale_label"]

/** `metadata.webinar` holds the session schedule; top level keys are the fallback. */
const getWebinarScope = (product: HttpTypes.StoreProduct) => {
  const webinar = product.metadata?.webinar

  return webinar && typeof webinar === "object" && !Array.isArray(webinar)
    ? (webinar as Record<string, unknown>)
    : null
}

const readScoped = (product: HttpTypes.StoreProduct, keys: string[]) =>
  getMetadataText(getWebinarScope(product), keys) ??
  getMetadataText(product.metadata, keys)

export const getWebinarId = (product: HttpTypes.StoreProduct) =>
  readScoped(product, webinarIdKeys)

export const getWebinarLanguage = (product: HttpTypes.StoreProduct) =>
  readScoped(product, languageKeys)

export const getWebinarRecordingUrl = (product: HttpTypes.StoreProduct) =>
  readScoped(product, recordingKeys)

// No `product.type` fallback: the type holds the speaker name, which would show
// up here as the level.
export const getWebinarLevel = (product: HttpTypes.StoreProduct) =>
  readScoped(product, ["level", "training_level", "skill_level", "difficulty"]) ??
  null

export type WebinarSchedule = {
  start: string | null
  end: string | null
  timeZone: string | null
  label: string | null
  isUpcoming: boolean
}

const parseDate = (value: string | null) => {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatSessionDate = (value: string | null, timeZone: string | null) => {
  const parsed = parseDate(value)

  if (!parsed) {
    return null
  }

  const formatted = parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return timeZone ? `${formatted} ${timeZone}` : formatted
}

export const getWebinarSchedule = (
  product: HttpTypes.StoreProduct
): WebinarSchedule => {
  const start = readScoped(product, ["start_date", "startDate", "date"])
  const end = readScoped(product, ["end_date", "endDate"])
  const timeZone = readScoped(product, ["time_zone", "timeZone", "timezone"])
  const parsedStart = parseDate(start)

  return {
    start,
    end,
    timeZone,
    label: formatSessionDate(start, timeZone),
    isUpcoming: parsedStart ? parsedStart.getTime() > Date.now() : false,
  }
}

export const getWebinarFaculty = (
  product: HttpTypes.StoreProduct
): WebinarFaculty | null => {
  const name = getTrainingSpeaker(product)?.trim()

  if (!name) {
    return null
  }

  return {
    name,
    bio: getMetadataText(product.metadata, facultyBioKeys),
    image: getMetadataText(product.metadata, facultyImageKeys),
  }
}

/** Only facts backed by real data are returned, so the strip never shows blanks. */
export const getWebinarFacts = (
  product: HttpTypes.StoreProduct
): WebinarFact[] => {
  const facts: Array<WebinarFact | null> = [
    duration(product),
    level(product),
    schedule(product),
    webinarId(product),
    category(product),
  ]

  return facts.filter((fact): fact is WebinarFact => fact !== null)
}

const duration = (product: HttpTypes.StoreProduct): WebinarFact | null => {
  const value = getTrainingDuration(product)
  return value ? { label: "Duration", value, icon: "clock" } : null
}

const level = (product: HttpTypes.StoreProduct): WebinarFact | null => {
  const value = getWebinarLevel(product)
  return value ? { label: "Level", value, icon: "level" } : null
}

const schedule = (product: HttpTypes.StoreProduct): WebinarFact | null => {
  const { label } = getWebinarSchedule(product)
  return label ? { label: "Session", value: label, icon: "calendar" } : null
}

const webinarId = (product: HttpTypes.StoreProduct): WebinarFact | null => {
  const value = getWebinarId(product)
  return value ? { label: "Webinar ID", value, icon: "hash" } : null
}

const category = (product: HttpTypes.StoreProduct): WebinarFact | null => {
  const value = getTrainingCategory(product)
  return value ? { label: "Category", value, icon: "tag" } : null
}

/* -------------------------------------------------------------------------- */
/*                             Purchase option groups                         */
/* -------------------------------------------------------------------------- */

export type WebinarVariantGroup = {
  key: string
  title: string
  variants: HttpTypes.StoreProductVariant[]
}

const GROUP_ORDER = ["Live Options", "Recorded Options", "Value Packs", "Options"]

const classifyVariant = (variant: HttpTypes.StoreProductVariant) => {
  const explicit = getMetadataText(variant.metadata, [
    "group",
    "option_group",
    "optionGroup",
    "section",
  ])

  if (explicit) {
    return explicit
  }

  const title = variant.title?.toLowerCase() ?? ""

  if (title.includes("+") || /pack|bundle|combo/.test(title)) {
    return "Value Packs"
  }

  if (/live|classroom|in-person|instructor/.test(title)) {
    return "Live Options"
  }

  if (/record|transcript|dvd|usb|download|replay|digital|on-demand/.test(title)) {
    return "Recorded Options"
  }

  return "Options"
}

export const groupWebinarVariants = (
  product: HttpTypes.StoreProduct
): WebinarVariantGroup[] => {
  const groups = new Map<string, WebinarVariantGroup>()

  ;(product.variants ?? []).forEach((variant) => {
    const title = classifyVariant(variant)
    const key = title.toLowerCase()
    const group = groups.get(key)

    if (group) {
      group.variants.push(variant)
    } else {
      groups.set(key, { key, title, variants: [variant] })
    }
  })

  return Array.from(groups.values()).sort((left, right) => {
    const leftRank = GROUP_ORDER.indexOf(left.title)
    const rightRank = GROUP_ORDER.indexOf(right.title)

    if (leftRank !== -1 && rightRank !== -1) {
      return leftRank - rightRank
    }

    if (leftRank !== -1) return -1
    if (rightRank !== -1) return 1

    return left.title.localeCompare(right.title)
  })
}

export const getVariantInfo = (variant: HttpTypes.StoreProductVariant) =>
  getMetadataText(variant.metadata, ["description", "info", "tooltip", "note"])

export const hasLiveOption = (product: HttpTypes.StoreProduct) =>
  (product.variants ?? []).some(
    (variant) => classifyVariant(variant) === "Live Options"
  )
