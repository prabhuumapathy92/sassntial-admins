import { defineWidgetConfig } from "@medusajs/admin-sdk"
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
import { useEffect, useState, type InputHTMLAttributes } from "react"

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

const metadataToFormState = (metadata: ProductMetadata): AttributeFormState => {
  const startDate = readMetadataValue(metadata, "start_date")
  const endDate = readMetadataValue(metadata, "end_date")
  const normalizedStartDate = normalizeDateTimeInputValue(startDate)
  const normalizedEndDate = normalizeDateTimeInputValue(endDate)

  return {
    start_date: normalizedStartDate,
    end_date: normalizedEndDate,
    duration:
      calculateDuration(normalizedStartDate, normalizedEndDate) ||
      readMetadataValue(metadata, "duration"),
    time_zone: readMetadataValue(metadata, "time_zone"),
  }
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

const formatDateValue = (value: string) => {
  if (!value.trim()) {
    return "-"
  }

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

const hideDefaultAttributesCard = () => {
  const headings = document.querySelectorAll("h1, h2, h3, h4, span, p, div")

  headings.forEach((node) => {
    const element = node as HTMLElement

    if (element.closest(".custom-product-attributes-widget")) {
      return
    }

    if (element.textContent?.trim() !== "Attributes") {
      return
    }

    const container =
      element.closest(".shadow-elevation-card-rest") ??
      element.closest("[class*='shadow-elevation-card-rest']") ??
      element.closest(".border-ui-border-base")

    if (container instanceof HTMLElement) {
      container.style.display = "none"
    }
  })
}

const ProductAttributesWidget = ({ data: product }: { data: any }) => {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formState, setFormState] = useState<AttributeFormState>(DEFAULT_STATE)

  useEffect(() => {
    setFormState(metadataToFormState(product?.metadata))
  }, [product?.id, product?.metadata])

  useEffect(() => {
    hideDefaultAttributesCard()

    const observer = new MutationObserver(() => {
      hideDefaultAttributesCard()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

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
    setIsSaving(true)

    const currentMetadata =
      product?.metadata && typeof product.metadata === "object"
        ? { ...product.metadata }
        : {}

    ATTRIBUTE_FIELDS.forEach(({ key }) => {
      const value = formState[key].trim()

      if (value) {
        currentMetadata[key] = value
      } else {
        delete currentMetadata[key]
      }
    })

    try {
      const response = await fetch(`/admin/products/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: currentMetadata,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update product attributes")
      }

      const payload = await response.json()
      setFormState(metadataToFormState(payload.product?.metadata ?? currentMetadata))
      toast.success("Success", {
        description: "Attributes updated",
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Error", {
        description: "Failed to update attributes",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="custom-product-attributes-widget">
      <Container className="p-0 overflow-hidden border-ui-border-base shadow-elevation-card-rest">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
          <Heading level="h2">Attributes</Heading>

          <FocusModal open={open} onOpenChange={setOpen}>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton variant="transparent">
                  <EllipsisHorizontal />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => setOpen(true)} className="gap-x-2">
                  <PencilSquare className="text-ui-fg-subtle" />
                  Edit attributes
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>

            <FocusModal.Content>
              <FocusModal.Header>
                <div className="flex items-center justify-between w-full pr-4">
                  <div>
                    <Heading level="h2">Edit Attributes</Heading>
                    <Text size="small" className="text-ui-fg-subtle">
                      Update the schedule details shown in the product attributes section.
                    </Text>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setOpen(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleSave}
                      isLoading={isSaving}
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
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
})

export default ProductAttributesWidget
