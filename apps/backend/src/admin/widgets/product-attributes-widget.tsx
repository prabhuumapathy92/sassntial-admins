import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import {
  Button,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState, type InputHTMLAttributes } from "react"
import { useTranslation } from "react-i18next"

import { hasLabel, hideDefaultSections } from "../lib/hide-default-section"
import { sdk } from "../lib/sdk"

const WIDGET_CLASS = "custom-product-attributes-widget"

type ProductMetadata = Record<string, unknown> | null | undefined

type AttributeField = "start_date" | "end_date" | "duration" | "time_zone"

type AttributeFormState = Record<AttributeField, string>

const ATTRIBUTE_FIELDS: {
  key: AttributeField
  label: string
  type: InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder: string
  readOnly?: boolean
}[] = [
  {
    key: "start_date",
    label: "Start date & time",
    type: "datetime-local",
    placeholder: "Select start date and time",
  },
  {
    key: "end_date",
    label: "End date & time",
    type: "datetime-local",
    placeholder: "Select end date and time",
  },
  {
    key: "duration",
    label: "Duration",
    type: "text",
    placeholder: "Calculated automatically",
    readOnly: true,
  },
  {
    key: "time_zone",
    label: "Time zone",
    type: "text",
    placeholder: "e.g. Asia/Kolkata",
  },
]

const DEFAULT_STATE: AttributeFormState = {
  start_date: "",
  end_date: "",
  duration: "",
  time_zone: "",
}

const readMetadataValue = (
  metadata: ProductMetadata,
  key: AttributeField
): string => {
  const value = metadata?.[key]

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number") {
    return String(value)
  }

  return ""
}

const normalizeDateTimeInputValue = (value: string) => {
  if (!value.trim()) {
    return ""
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return value
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00`
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return ""
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")
  const hours = String(parsed.getHours()).padStart(2, "0")
  const minutes = String(parsed.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return ""
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return ""
  }

  const difference = end.getTime() - start.getTime()

  if (difference <= 0) {
    return ""
  }

  const totalMinutes = Math.floor(difference / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days) {
    parts.push(`${days}d`)
  }

  if (hours) {
    parts.push(`${hours}h`)
  }

  if (minutes || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(" ")
}

const metadataToFormState = (metadata: ProductMetadata): AttributeFormState => {
  const startDate = normalizeDateTimeInputValue(
    readMetadataValue(metadata, "start_date")
  )
  const endDate = normalizeDateTimeInputValue(
    readMetadataValue(metadata, "end_date")
  )

  return {
    start_date: startDate,
    end_date: endDate,
    duration:
      calculateDuration(startDate, endDate) ||
      readMetadataValue(metadata, "duration"),
    time_zone: readMetadataValue(metadata, "time_zone"),
  }
}

const formatDateValue = (value: string) => {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed)
}

const formatFieldValue = (key: AttributeField, value: string) => {
  if (!value.trim()) {
    return "-"
  }

  if (key === "start_date" || key === "end_date") {
    return formatDateValue(value)
  }

  return value
}

/**
 * The dashboard renders its attributes section as a `Container` carrying
 * `divide-y p-0`, whose first row holds an `h2` with the section title. Matching
 * that heading and hiding its own container keeps every sibling section — and
 * the page grid around them — intact.
 */
const findDefaultAttributeSections = (labels: string[]) =>
  Array.from(document.querySelectorAll("h2")).flatMap((heading) => {
    if (heading.closest(`.${WIDGET_CLASS}`) || !hasLabel(heading, labels)) {
      return []
    }

    const container = heading.closest<HTMLElement>("div.divide-y")

    return container ? [container] : []
  })

const ProductAttributesWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<AttributeFormState>(DEFAULT_STATE)
  const queryClient = useQueryClient()

  useEffect(() => {
    setFormState(metadataToFormState(product?.metadata))
  }, [product?.id, product?.metadata])

  // The dashboard's own translation of the heading, so the section is still
  // found in a non-English locale. The literal is the fallback for when the
  // i18n instance has not resolved the key.
  const labels = useMemo(() => [t("products.attributes"), "Attributes"], [t])

  useEffect(
    () => hideDefaultSections(() => findDefaultAttributeSections(labels)),
    [labels]
  )

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (metadata: Record<string, unknown>) =>
      sdk.admin.product.update(product.id, { metadata }),
    onSuccess: async ({ product: updated }) => {
      setFormState(metadataToFormState(updated?.metadata))
      await queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success("Success", { description: "Attributes updated" })
      setOpen(false)
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to update attributes",
      })
    },
  })

  const handleChange = (key: AttributeField, value: string) => {
    setFormState((current) => {
      const nextState = {
        ...current,
        [key]: value,
      }

      if (key === "start_date" || key === "end_date") {
        nextState.duration = calculateDuration(
          nextState.start_date,
          nextState.end_date
        )
      }

      return nextState
    })
  }

  const handleSave = async () => {
    // Medusa merges metadata into what is already stored, so only the fields
    // this widget owns are sent. An empty string is the documented sentinel for
    // removing a key — omitting it would leave the previous value in place.
    const metadata = Object.fromEntries(
      ATTRIBUTE_FIELDS.map(({ key }) => [key, formState[key].trim()])
    )

    // onError already surfaces the failure to the merchant; catching here stops
    // it from also surfacing as an unhandled rejection.
    await mutateAsync(metadata).catch(() => undefined)
  }

  return (
    <div className={WIDGET_CLASS}>
      <Container className="p-0 overflow-hidden border-ui-border-base shadow-elevation-card-rest">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
          <Heading level="h2">Attributes</Heading>

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
                Edit attributes
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        <div className="divide-y divide-ui-border-base">
          {ATTRIBUTE_FIELDS.map((field) => (
            <div
              key={field.key}
              className="grid grid-cols-2 items-center gap-4 px-6 py-5"
            >
              <Text size="base" className="font-medium text-ui-fg-base">
                {field.label}
              </Text>
              <Text size="base" className="text-ui-fg-subtle">
                {formatFieldValue(field.key, formState[field.key])}
              </Text>
            </div>
          ))}
        </div>
      </Container>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-between w-full pr-4">
              <div>
                <Heading level="h2">Edit Attributes</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  Update the schedule details shown in the product attributes
                  section.
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
                  isLoading={isPending}
                >
                  Save
                </Button>
              </div>
            </div>
          </FocusModal.Header>

          <FocusModal.Body className="bg-ui-bg-subtle px-6 py-8">
            <div className="mx-auto grid max-w-2xl gap-5 md:grid-cols-2">
              {ATTRIBUTE_FIELDS.map((field) => (
                <div key={field.key} className="flex flex-col gap-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formState[field.key]}
                    readOnly={field.readOnly}
                    disabled={field.readOnly}
                    onChange={(event) =>
                      handleChange(field.key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductAttributesWidget
