import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, Plus, Trash } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  IconButton,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { sdk } from "../../lib/sdk"

type ContactPageSettings = {
  id: string
  intro: string | null
  general_inquiries_email: string | null
  support_line: string | null
  availability: string | null
  focus_items: string[]
  form_eyebrow: string | null
  form_heading: string | null
  form_description: string | null
}

type FormState = {
  intro: string
  general_inquiries_email: string
  support_line: string
  availability: string
  focus_items: string[]
  form_eyebrow: string
  form_heading: string
  form_description: string
}

const EMPTY: FormState = {
  intro: "",
  general_inquiries_email: "",
  support_line: "",
  availability: "",
  focus_items: [],
  form_eyebrow: "",
  form_heading: "",
  form_description: "",
}

const toFormState = (settings?: ContactPageSettings): FormState =>
  settings
    ? {
        intro: settings.intro ?? "",
        general_inquiries_email: settings.general_inquiries_email ?? "",
        support_line: settings.support_line ?? "",
        availability: settings.availability ?? "",
        focus_items: settings.focus_items ?? [],
        form_eyebrow: settings.form_eyebrow ?? "",
        form_heading: settings.form_heading ?? "",
        form_description: settings.form_description ?? "",
      }
    : EMPTY

const Section = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => (
  <div className="border-t border-ui-border-base px-6 py-5">
    <Heading level="h3" className="text-ui-fg-base">
      {title}
    </Heading>
    <Text size="small" className="mt-1 text-ui-fg-subtle">
      {description}
    </Text>
    <div className="mt-4 flex flex-col gap-y-4">{children}</div>
  </div>
)

const Field = ({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-y-2">
    <Label htmlFor={id} size="small" weight="plus">
      {label}
    </Label>
    {children}
  </div>
)

const ContactPageSettingsPage = () => {
  const [form, setForm] = useState<FormState>(EMPTY)
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contact-page"],
    queryFn: () =>
      sdk.client.fetch<{ contact_page: ContactPageSettings }>(
        "/admin/contact-page"
      ),
  })

  useEffect(() => {
    setForm(toFormState(data?.contact_page))
  }, [data])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: FormState) =>
      sdk.client.fetch<{ contact_page: ContactPageSettings }>(
        "/admin/contact-page",
        {
          method: "POST",
          body: {
            ...payload,
            focus_items: payload.focus_items
              .map((item) => item.trim())
              .filter(Boolean),
          },
        }
      ),
    onSuccess: async ({ contact_page }) => {
      setForm(toFormState(contact_page))
      await queryClient.invalidateQueries({ queryKey: ["contact-page"] })
      toast.success("Success", { description: "Contact page updated" })
    },
    onError: (mutationError: Error) => {
      toast.error("Error", {
        description: mutationError.message || "Failed to update contact page",
      })
    },
  })

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const updateFocusItem = (index: number, value: string) =>
    setForm((current) => ({
      ...current,
      focus_items: current.focus_items.map((item, i) =>
        i === index ? value : item
      ),
    }))

  const removeFocusItem = (index: number) =>
    setForm((current) => ({
      ...current,
      focus_items: current.focus_items.filter((_, i) => i !== index),
    }))

  const handleSave = async () => {
    // onError already surfaces the failure to the merchant.
    await mutateAsync(form).catch(() => undefined)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Contact page</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Content shown on the storefront&apos;s Contact Us page.
          </Text>
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={handleSave}
          isLoading={isPending}
          disabled={isLoading || isError}
        >
          Save
        </Button>
      </div>

      {isLoading && (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-subtle">
            Loading...
          </Text>
        </div>
      )}

      {isError && (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-error">
            Could not load the contact page settings
            {error instanceof Error ? `: ${error.message}` : "."}
          </Text>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <Section
            title="Introduction"
            description="The paragraph under the Contact Us heading."
          >
            <Field id="intro" label="Intro text">
              <Textarea
                id="intro"
                rows={4}
                value={form.intro}
                placeholder="Whether you need a walkthrough, a project discussion..."
                onChange={(event) => set("intro", event.target.value)}
              />
            </Field>
          </Section>

          <Section
            title="Contact channels"
            description="The three cards down the left of the page."
          >
            <Field id="general_inquiries_email" label="General inquiries">
              <Input
                id="general_inquiries_email"
                type="email"
                value={form.general_inquiries_email}
                placeholder="hello@example.com"
                onChange={(event) =>
                  set("general_inquiries_email", event.target.value)
                }
              />
            </Field>
            <Field id="support_line" label="Support line">
              <Input
                id="support_line"
                value={form.support_line}
                placeholder="+1 (213) 456-586"
                onChange={(event) => set("support_line", event.target.value)}
              />
            </Field>
            <Field id="availability" label="Availability">
              <Input
                id="availability"
                value={form.availability}
                placeholder="Monday to Friday, 09:00 - 18:00 UTC"
                onChange={(event) => set("availability", event.target.value)}
              />
            </Field>
          </Section>

          <Section
            title="Focus areas"
            description="One card per entry, in this order."
          >
            {form.focus_items.length === 0 && (
              <Text size="small" className="text-ui-fg-subtle">
                No focus areas yet.
              </Text>
            )}

            {form.focus_items.map((item, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <Input
                  value={item}
                  placeholder="Product and training inquiries"
                  onChange={(event) => updateFocusItem(index, event.target.value)}
                />
                <IconButton
                  variant="transparent"
                  className="text-ui-fg-muted hover:text-ui-fg-error"
                  onClick={() => removeFocusItem(index)}
                >
                  <Trash />
                </IconButton>
              </div>
            ))}

            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={() =>
                  set("focus_items", [...form.focus_items, ""])
                }
              >
                <Plus />
                Add focus area
              </Button>
            </div>
          </Section>

          <Section
            title="Form panel"
            description="The headings above the enquiry form."
          >
            <Field id="form_eyebrow" label="Eyebrow">
              <Input
                id="form_eyebrow"
                value={form.form_eyebrow}
                placeholder="For More Details"
                onChange={(event) => set("form_eyebrow", event.target.value)}
              />
            </Field>
            <Field id="form_heading" label="Heading">
              <Input
                id="form_heading"
                value={form.form_heading}
                placeholder="Share your context and we'll route it to the right team."
                onChange={(event) => set("form_heading", event.target.value)}
              />
            </Field>
            <Field id="form_description" label="Description">
              <Textarea
                id="form_description"
                rows={3}
                value={form.form_description}
                placeholder="Use the form for product questions, delivery discussions, or training requests."
                onChange={(event) =>
                  set("form_description", event.target.value)
                }
              />
            </Field>
          </Section>
        </>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Contact page",
  icon: ChatBubbleLeftRight,
})

export default ContactPageSettingsPage
