import { HttpTypes } from "@medusajs/types"

export type TrainingCatalogOption = {
  label: string
  value: string
}

type ProductMetadata = Record<string, unknown> | null | undefined

const speakerKeys = [
  "speaker",
  "speaker_name",
  "speakerName",
  "speakers",
  "presenter",
  "host",
  "instructor",
  "trainer",
  "facilitator",
]

const speakerRoleKeys = [
  "speaker_role",
  "speakerRole",
  "speaker_title",
  "speakerTitle",
  "role",
  "designation",
  "job_title",
  "jobTitle",
  "position",
]

const monthKeys = [
  "month",
  "session_month",
  "sessionMonth",
  "event_month",
  "eventMonth",
  "start_month",
  "startMonth",
]

const dateKeys = [
  "date",
  "event_date",
  "eventDate",
  "session_date",
  "sessionDate",
  "start_date",
  "startDate",
]

const timeKeys = [
  "time",
  "event_time",
  "eventTime",
  "session_time",
  "sessionTime",
  "start_time",
  "startTime",
]

const formatKeys = [
  "format",
  "training_format",
  "trainingFormat",
  "session_type",
  "sessionType",
  "training_type",
  "trainingType",
  "content_type",
  "contentType",
]

const levelKeys = [
  "level",
  "training_level",
  "trainingLevel",
  "skill_level",
  "skillLevel",
  "difficulty",
]

const durationKeys = [
  "duration",
  "training_duration",
  "trainingDuration",
  "time_duration",
  "timeDuration",
  "length",
]

const titleCase = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())

const toText = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length ? trimmed : null
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value)) {
    const combined = value.map(toText).filter(Boolean).join(", ")
    return combined.length ? combined : null
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>

    for (const key of ["label", "name", "title", "value"]) {
      const resolved = toText(record[key])

      if (resolved) {
        return resolved
      }
    }
  }

  return null
}

const getMetadataValue = (
  metadata: ProductMetadata,
  keys: string[]
): string | null => {
  if (!metadata) {
    return null
  }

  for (const key of keys) {
    const resolved = toText(metadata[key])

    if (resolved) {
      return resolved
    }
  }

  return null
}

/** Reads the first populated value among `keys`, for any metadata-ish record. */
export const getMetadataText = (
  metadata: ProductMetadata,
  keys: string[]
): string | null => getMetadataValue(metadata, keys)

const formatMonthValue = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  return titleCase(value)
}

export const getTrainingSpeaker = (product: HttpTypes.StoreProduct) => {
  const metadataSpeaker = getMetadataValue(product.metadata, speakerKeys)

  if (metadataSpeaker) {
    return metadataSpeaker
  }

  // The product type is the speaker: it is labelled "Speaker name" in the admin
  // and is the field merchants actually fill in, so it wins over the older
  // tag/collection conventions below, which stay for products not migrated yet.
  if (product.type?.value) {
    return product.type.value
  }

  const speakerTag = product.tags?.find((tag) =>
    tag.value.toLowerCase().startsWith("speaker:")
  )

  if (speakerTag) {
    return titleCase(speakerTag.value.split(":").slice(1).join(":"))
  }

  if (product.collection?.title) {
    return product.collection.title
  }

  return null
}

export const getTrainingMonth = (product: HttpTypes.StoreProduct) => {
  const metadataMonth = getMetadataValue(product.metadata, monthKeys)

  if (metadataMonth) {
    return formatMonthValue(metadataMonth)
  }

  const metadataDate = getMetadataValue(product.metadata, dateKeys)

  if (metadataDate) {
    return formatMonthValue(metadataDate)
  }

  return formatMonthValue(product.created_at)
}

export const getTrainingTime = (product: HttpTypes.StoreProduct) => {
  return getMetadataValue(product.metadata, timeKeys)
}

export const getTrainingFormat = (product: HttpTypes.StoreProduct) => {
  const metadataFormat = getMetadataValue(product.metadata, formatKeys)

  if (metadataFormat) {
    return titleCase(metadataFormat)
  }

  const webinarTag = product.tags?.find((tag) =>
    tag.value.toLowerCase().includes("webinar")
  )

  if (webinarTag) {
    return titleCase(webinarTag.value)
  }

  return null
}

export const getTrainingCategory = (product: HttpTypes.StoreProduct) => {
  // No `product.type` fallback: the type holds the speaker name, which would
  // show up here as a category chip.
  return (
    product.categories?.[0]?.name ??
    product.collection?.title ??
    "General Training"
  )
}

/** The speaker's job title, when the product carries one. */
export const getTrainingSpeakerRole = (product: HttpTypes.StoreProduct) => {
  return getMetadataValue(product.metadata, speakerRoleKeys)
}

export const getTrainingSummary = (product: HttpTypes.StoreProduct) => {
  return product.subtitle || product.description || null
}

export const getTrainingLevel = (product: HttpTypes.StoreProduct) => {
  // No `product.type` fallback: the type holds the speaker name, which would
  // show up here as the level badge.
  return getMetadataValue(product.metadata, levelKeys) || "Beginner"
}

export const getTrainingDuration = (product: HttpTypes.StoreProduct) => {
  return getMetadataValue(product.metadata, durationKeys) || getTrainingTime(product)
}

export const getTrainingInitials = (value: string) => {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export const buildCategoryOptions = (
  products: HttpTypes.StoreProduct[]
): TrainingCatalogOption[] => {
  const optionMap = new Map<string, TrainingCatalogOption>()

  products.forEach((product) => {
    product.categories?.forEach((category) => {
      if (category.id && category.name) {
        optionMap.set(category.id, {
          value: category.id,
          label: category.name,
        })
      }
    })
  })

  return Array.from(optionMap.values()).sort((left, right) =>
    left.label.localeCompare(right.label)
  )
}

const buildUniqueOptions = (
  values: Array<string | null | undefined>
): TrainingCatalogOption[] => {
  const options = new Map<string, TrainingCatalogOption>()

  values.forEach((value) => {
    if (!value) {
      return
    }

    options.set(value.toLowerCase(), {
      value,
      label: value,
    })
  })

  return Array.from(options.values()).sort((left, right) =>
    left.label.localeCompare(right.label)
  )
}

export const buildSpeakerOptions = (products: HttpTypes.StoreProduct[]) =>
  buildUniqueOptions(products.map(getTrainingSpeaker))

export const buildMonthOptions = (products: HttpTypes.StoreProduct[]) =>
  buildUniqueOptions(products.map(getTrainingMonth))

const getSearchableText = (product: HttpTypes.StoreProduct) => {
  const metadataValues = Object.values(product.metadata ?? {})
    .map(toText)
    .filter(Boolean)
    .join(" ")

  return [
    product.title,
    product.subtitle,
    product.description,
    getTrainingSpeaker(product),
    getTrainingMonth(product),
    getTrainingCategory(product),
    getTrainingFormat(product),
    product.tags?.map((tag) => tag.value).join(" "),
    product.categories?.map((category) => category.name).join(" "),
    metadataValues,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export const filterTrainingProducts = ({
  products,
  query,
  categoryId,
  speaker,
  month,
}: {
  products: HttpTypes.StoreProduct[]
  query?: string
  categoryId?: string
  speaker?: string
  month?: string
}) => {
  const normalizedQuery = query?.trim().toLowerCase()
  const normalizedSpeaker = speaker?.trim().toLowerCase()
  const normalizedMonth = month?.trim().toLowerCase()

  return products.filter((product) => {
    if (
      categoryId &&
      !product.categories?.some((category) => category.id === categoryId)
    ) {
      return false
    }

    if (
      normalizedSpeaker &&
      getTrainingSpeaker(product)?.toLowerCase() !== normalizedSpeaker
    ) {
      return false
    }

    if (
      normalizedMonth &&
      getTrainingMonth(product)?.toLowerCase() !== normalizedMonth
    ) {
      return false
    }

    if (normalizedQuery && !getSearchableText(product).includes(normalizedQuery)) {
      return false
    }

    return true
  })
}
