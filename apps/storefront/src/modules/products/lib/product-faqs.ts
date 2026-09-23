import { HttpTypes } from "@medusajs/types"

export type ProductFaq = {
  id: string
  question: string
  answer: string
}

type ProductMetadata = Record<string, unknown> | null | undefined

const FAQ_METADATA_KEY = "faqs"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value)

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

/**
 * FAQs are authored in the admin and stored on `product.metadata.faqs`. Metadata
 * is a jsonb column, so the array normally round-trips unchanged — but a value
 * written by a CSV import or an older integration can arrive as a JSON string,
 * so both shapes are accepted. Anything unparseable yields no FAQs rather than
 * throwing, so a malformed record can never break the product page.
 */
const parseFaqs = (metadata: ProductMetadata): ProductFaq[] => {
  const raw = metadata?.[FAQ_METADATA_KEY]

  if (!raw) {
    return []
  }

  let value: unknown = raw

  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw)
    } catch {
      return []
    }
  }

  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((entry, index) => {
    if (!isRecord(entry)) {
      return []
    }

    const question = readString(entry.question)
    const answer = readString(entry.answer)

    // Only render rows a shopper can actually read.
    if (!question || !answer) {
      return []
    }

    return [
      {
        id: readString(entry.id) || `faq-${index}`,
        question,
        answer,
      },
    ]
  })
}

export const getProductFaqs = (product: HttpTypes.StoreProduct): ProductFaq[] =>
  parseFaqs(product.metadata)
