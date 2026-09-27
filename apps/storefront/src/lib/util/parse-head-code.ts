/**
 * Turns the "Custom code in <head>" snippet from Medusa Admin into elements
 * React can render.
 *
 * <head> cannot take a raw HTML string, so the snippet is split into its
 * top-level tags. Only the tags that belong in <head> are kept - script,
 * noscript, style, meta and link - which covers every tracking snippet and
 * schema block in practice. Comments and stray text are dropped.
 *
 * Rendering these on the server puts them in the initial HTML, so the browser
 * runs the scripts in order exactly as if they had been pasted into the page.
 */

export type HeadTagName = "script" | "noscript" | "style" | "meta" | "link"

export type HeadTag = {
  name: HeadTagName
  attributes: Record<string, string | true>
  content: string
}

// Attribute runs skip over quoted values, so a ">" inside quotes cannot end
// the tag early.
const ATTRIBUTES = `((?:[^>"']|"[^"]*"|'[^']*')*?)`
const TAG_PATTERN = new RegExp(
  `<!--[\\s\\S]*?-->|<(script|noscript|style)\\b${ATTRIBUTES}>([\\s\\S]*?)<\\/\\1\\s*>|<(meta|link)\\b${ATTRIBUTES}\\/?>`,
  "gi"
)
const ATTRIBUTE_PATTERN =
  /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
}

/** React re-escapes attribute values, so they must be decoded first. */
const decodeEntities = (value: string) =>
  value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,
    (match, entity: string) => {
      const lower = entity.toLowerCase()

      try {
        if (lower.startsWith("#x")) {
          return String.fromCodePoint(parseInt(lower.slice(2), 16))
        }

        if (lower.startsWith("#")) {
          return String.fromCodePoint(parseInt(lower.slice(1), 10))
        }
      } catch {
        return match
      }

      return NAMED_ENTITIES[lower] ?? match
    }
  )

const parseAttributes = (source: string) => {
  const attributes: Record<string, string | true> = {}

  for (const match of Array.from(source.matchAll(ATTRIBUTE_PATTERN))) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match
    const value = doubleQuoted ?? singleQuoted ?? unquoted

    attributes[name.toLowerCase()] =
      value === undefined ? true : decodeEntities(value)
  }

  return attributes
}

export const parseHeadCode = (code: string): HeadTag[] => {
  if (!code.trim()) {
    return []
  }

  const tags: HeadTag[] = []

  for (const match of Array.from(code.matchAll(TAG_PATTERN))) {
    const [, pairedName, pairedAttributes, content, voidName, voidAttributes] =
      match

    if (pairedName) {
      tags.push({
        name: pairedName.toLowerCase() as HeadTagName,
        attributes: parseAttributes(pairedAttributes ?? ""),
        content: content ?? "",
      })
    } else if (voidName) {
      tags.push({
        name: voidName.toLowerCase() as HeadTagName,
        attributes: parseAttributes(voidAttributes ?? ""),
        content: "",
      })
    }
  }

  return tags
}

const PROP_ALIASES: Record<string, string> = {
  class: "className",
  charset: "charSet",
  crossorigin: "crossOrigin",
  fetchpriority: "fetchPriority",
  hreflang: "hrefLang",
  "http-equiv": "httpEquiv",
  imagesizes: "imageSizes",
  imagesrcset: "imageSrcSet",
  itemprop: "itemProp",
  nomodule: "noModule",
  referrerpolicy: "referrerPolicy",
}

const BOOLEAN_PROPS = new Set(["async", "defer", "noModule"])

/**
 * Maps HTML attribute names onto React props. Inline event handlers and style
 * strings are dropped: React only accepts functions and objects for those,
 * and would throw on the strings a snippet contains.
 */
export const toReactProps = (attributes: HeadTag["attributes"]) => {
  const props: Record<string, string | boolean> = {}

  for (const [name, value] of Object.entries(attributes)) {
    if (name.startsWith("on") || name === "style") {
      continue
    }

    const prop = PROP_ALIASES[name] ?? name

    props[prop] = value === true ? (BOOLEAN_PROPS.has(prop) ? true : "") : value
  }

  return props
}
