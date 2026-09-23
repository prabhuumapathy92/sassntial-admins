import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import {
  ArrowDownMini,
  ArrowUpMini,
  EllipsisHorizontal,
  PencilSquare,
  Plus,
  Trash,
} from "@medusajs/icons"
import {
  Badge,
  Button,
  clx,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  FAQ_METADATA_KEY,
  parseFaqs,
  serializeFaqs,
  type ProductFaq,
} from "../lib/product-faqs"
import { sdk } from "../lib/sdk"

const createFaq = (): ProductFaq => ({
  id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  question: "",
  answer: "",
})

const ProductFaqWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [open, setOpen] = useState(false)
  const [faqs, setFaqs] = useState<ProductFaq[]>([])
  const queryClient = useQueryClient()

  const saved = parseFaqs(product?.metadata)

  useEffect(() => {
    setFaqs(parseFaqs(product?.metadata))
  }, [product?.id, product?.metadata])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (next: ProductFaq[]) =>
      sdk.admin.product.update(product.id, {
        metadata: {
          // Medusa merges metadata and treats "" as "remove this key", so an
          // emptied list clears the key instead of storing a bare [].
          [FAQ_METADATA_KEY]: next.length ? next : "",
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Failed to save FAQs",
      })
    },
  })

  const updateFaq = (id: string, updates: Partial<ProductFaq>) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, ...updates } : faq))
    )
  }

  const removeFaq = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id))
  }

  const moveFaq = (index: number, direction: -1 | 1) => {
    setFaqs((prev) => {
      const target = index + direction

      if (target < 0 || target >= prev.length) {
        return prev
      }

      const next = [...prev]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)

      return next
    })
  }

  const handleSave = async () => {
    const cleaned = serializeFaqs(faqs)

    try {
      await mutateAsync(cleaned)
      setFaqs(cleaned)
      toast.success("Success", {
        description: cleaned.length
          ? `${cleaned.length} FAQ${cleaned.length === 1 ? "" : "s"} saved`
          : "All FAQs removed",
      })
      setOpen(false)
    } catch {
      // onError already surfaced it; the modal stays open so nothing is lost.
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Remove all FAQs from this product? This cannot be undone.")) {
      return
    }

    try {
      await mutateAsync([])
      setFaqs([])
      toast.success("Success", { description: "All FAQs removed" })
    } catch {
      // onError already surfaced it.
    }
  }

  return (
    <div className="col-span-full">
      <Container className="p-0 overflow-hidden border-ui-border-base shadow-elevation-card-rest mt-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
          <div className="flex items-center gap-x-2">
            <Heading level="h2">FAQs</Heading>
            {saved.length ? (
              <Badge size="small">{saved.length}</Badge>
            ) : (
              <Badge color="orange" size="small">
                Empty
              </Badge>
            )}
          </div>

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
                Edit FAQs
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onClick={handleClearAll}
                className="gap-x-2 text-ui-fg-error"
              >
                <Trash className="text-ui-fg-error" />
                Clear all FAQs
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {saved.length > 0 ? (
          <div className="divide-y divide-ui-border-base">
            {saved.map((faq, index) => (
              <div key={faq.id} className="px-6 py-4">
                <Text
                  size="small"
                  weight="plus"
                  leading="compact"
                  className="text-ui-fg-base"
                >
                  {index + 1}. {faq.question || "Untitled question"}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="mt-1 whitespace-pre-line text-ui-fg-subtle"
                >
                  {faq.answer || "-"}
                </Text>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-y-3 px-6 py-10 text-center">
            <Text size="small" className="text-ui-fg-subtle">
              No FAQs yet. They appear on the product page in the storefront.
            </Text>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setFaqs([createFaq()])
                setOpen(true)
              }}
            >
              <Plus />
              Add a question
            </Button>
          </div>
        )}
      </Container>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex flex-col">
                <Heading level="h2">Edit FAQs</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  Shown on the product page in the storefront, in this order.
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

          <FocusModal.Body className="bg-ui-bg-subtle px-6 py-8 overflow-auto">
            <div className="mx-auto flex max-w-2xl flex-col gap-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="rounded-lg border border-ui-border-base bg-ui-bg-base shadow-elevation-card-rest"
                >
                  <div className="flex items-center justify-between border-b border-ui-border-base px-4 py-2">
                    <Text
                      size="xsmall"
                      leading="compact"
                      className="font-semibold uppercase tracking-wider text-ui-fg-muted"
                    >
                      Question {index + 1}
                    </Text>
                    <div className="flex items-center gap-x-1">
                      <IconButton
                        variant="transparent"
                        size="small"
                        disabled={index === 0}
                        onClick={() => moveFaq(index, -1)}
                      >
                        <ArrowUpMini />
                      </IconButton>
                      <IconButton
                        variant="transparent"
                        size="small"
                        disabled={index === faqs.length - 1}
                        onClick={() => moveFaq(index, 1)}
                      >
                        <ArrowDownMini />
                      </IconButton>
                      <IconButton
                        variant="transparent"
                        size="small"
                        className="text-ui-fg-muted hover:text-ui-fg-error"
                        onClick={() => removeFaq(faq.id)}
                      >
                        <Trash />
                      </IconButton>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-3 px-4 py-4">
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor={`${faq.id}-question`} size="small">
                        Question
                      </Label>
                      <Input
                        id={`${faq.id}-question`}
                        value={faq.question}
                        placeholder="e.g. Will I get a recording?"
                        onChange={(event) =>
                          updateFaq(faq.id, { question: event.target.value })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor={`${faq.id}-answer`} size="small">
                        Answer
                      </Label>
                      <Textarea
                        id={`${faq.id}-answer`}
                        rows={4}
                        value={faq.answer}
                        placeholder="Line breaks are preserved in the storefront."
                        onChange={(event) =>
                          updateFaq(faq.id, { answer: event.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="secondary"
                size="small"
                className={clx(
                  "flex w-full items-center justify-center gap-x-2 border-dashed py-6",
                  faqs.length === 0 && "mt-2"
                )}
                onClick={() => setFaqs((prev) => [...prev, createFaq()])}
              >
                <Plus />
                Add question
              </Button>
            </div>
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductFaqWidget
