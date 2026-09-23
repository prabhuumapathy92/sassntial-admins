export type ProductFaq = {
  id: string
  question: string
  answer: string
}

/** Where the storefront reads the list back from. */
export const FAQ_METADATA_KEY = "faqs"

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value)

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

/**
 * FAQs live in `product.metadata.faqs`. Metadata is a jsonb column, so the array
 * normally round-trips unchanged — but a value written by a CSV import or an
 * older integration can arrive as a JSON string, so both shapes are accepted.
 * Anything else is treated as "no FAQs" rather than throwing, because this runs
 * during render on both the admin and the storefront.
 */
export const parseFaqs = (
  metadata: Record<string, unknown> | null | undefined
): ProductFaq[] => {
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

    // A row with neither side is a leftover blank, not content.
    if (!question && !answer) {
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

/**
 * Drops rows the merchant left blank so an empty editor never persists noise.
 */
export const serializeFaqs = (faqs: ProductFaq[]) =>
  faqs
    .map((faq) => ({
      id: faq.id,
      question: faq.question.trim(),
      answer: faq.answer.trim(),
    }))
    .filter((faq) => faq.question || faq.answer)
