import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Text,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { sdk } from "../../lib/sdk"

type EmailSettings = {
  id: string
  enabled: boolean
  smtp_host: string
  smtp_port: number
  smtp_secure: boolean
  smtp_require_tls: boolean
  smtp_username: string
  smtp_password_configured: boolean
  from_name: string
  from_email: string
  to_emails: string[]
  reply_to_submitter: boolean
  subject_prefix: string
}

type EmailSettingsPayload = Omit<EmailSettings, "id" | "smtp_password_configured" | "to_emails"> & {
  to_emails: string[]
  smtp_password?: string
  clear_smtp_password: boolean
}

const Panel = ({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) => (
  <section className="flex flex-col gap-4 border border-ui-border-base bg-ui-bg-base p-5">
    <div>
      <Heading level="h3">{title}</Heading>
      <Text size="small" className="mt-1 text-ui-fg-subtle">
        {description}
      </Text>
    </div>
    {children}
  </section>
)

const Field = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1.5">
    <Label size="small" weight="plus">{label}</Label>
    {children}
    {hint ? <Text size="xsmall" className="text-ui-fg-subtle">{hint}</Text> : null}
  </div>
)

const parseRecipients = (value: string) =>
  [...new Set(value.split(/[\s,;]+/).map((email) => email.trim()).filter(Boolean))]

const EmailSettingsPage = () => {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<EmailSettings | null>(null)
  const [recipients, setRecipients] = useState("")
  const [password, setPassword] = useState("")
  const [clearPassword, setClearPassword] = useState(false)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["email-settings"],
    queryFn: () =>
      sdk.client.fetch<{ email_settings: EmailSettings }>("/admin/email-settings"),
  })

  useEffect(() => {
    if (data?.email_settings) {
      setSettings(data.email_settings)
      setRecipients(data.email_settings.to_emails.join(", "))
    }
  }, [data])

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (email_settings: EmailSettingsPayload) =>
      sdk.client.fetch<{ email_settings: EmailSettings }>("/admin/email-settings", {
        method: "POST",
        body: { email_settings },
      }),
    onSuccess: ({ email_settings: saved }) => {
      setSettings(saved)
      setRecipients(saved.to_emails.join(", "))
      setPassword("")
      setClearPassword(false)
      queryClient.setQueryData(["email-settings"], { email_settings: saved })
      toast.success("Email settings saved", {
        description: "Contact form and order email notifications are configured.",
      })
    },
    onError: (saveError: Error) =>
      toast.error(saveError.message || "Could not save email settings"),
  })

  const patch = (values: Partial<EmailSettings>) =>
    setSettings((current) => (current ? { ...current, ...values } : current))

  const payload = (): EmailSettingsPayload | null => {
    if (!settings) {
      return null
    }

    return {
      enabled: settings.enabled,
      smtp_host: settings.smtp_host.trim(),
      smtp_port: Number(settings.smtp_port),
      smtp_secure: settings.smtp_secure,
      smtp_require_tls: settings.smtp_require_tls,
      smtp_username: settings.smtp_username.trim(),
      from_name: settings.from_name.trim(),
      from_email: settings.from_email.trim(),
      to_emails: parseRecipients(recipients),
      reply_to_submitter: settings.reply_to_submitter,
      subject_prefix: settings.subject_prefix.trim(),
      ...(password ? { smtp_password: password } : {}),
      clear_smtp_password: clearPassword,
    }
  }

  const save = async () => {
    const next = payload()
    if (next) {
      await mutateAsync(next)
    }
  }

  const sendTest = async () => {
    const next = payload()
    if (!next) {
      return
    }

    try {
      await mutateAsync(next)
      await sdk.client.fetch("/admin/email-settings/test", {
        method: "POST",
        body: {},
      })
      toast.success("Test email sent", {
        description: "Check the configured recipient inbox.",
      })
    } catch (testError) {
      toast.error(
        testError instanceof Error ? testError.message : "Could not send a test email"
      )
    }
  }

  if (isLoading || !settings) {
    if (isError) {
      return (
        <Container>
          <Text className="text-ui-fg-error">
            {(error as Error)?.message ?? "Could not load email settings"}
          </Text>
        </Container>
      )
    }

    return <Container><Text>Loading email settings...</Text></Container>
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">Email settings</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Connect an SMTP mailbox for contact form enquiries and order emails.
          </Text>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={sendTest} isLoading={isPending}>
            Save and send test
          </Button>
          <Button onClick={save} isLoading={isPending}>Save settings</Button>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 xl:grid-cols-2">
        <Panel
          title="SMTP server"
          description="These connection details come from your email provider or hosting company."
        >
          <label className="flex items-center gap-2 text-sm font-medium text-ui-fg-base">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(event) => patch({ enabled: event.target.checked })}
            />
            Send email notifications (contact enquiries and orders)
          </label>
          {!settings.enabled ? (
            <Text size="small" className="text-ui-fg-error">
              Notifications are off. Form submissions and orders are still saved, but no email is sent to you or to customers.
            </Text>
          ) : null}
          <div className="grid gap-4 md:grid-cols-[1fr_150px]">
            <Field label="SMTP host" hint="For example: smtp.your-provider.com">
              <Input
                value={settings.smtp_host}
                placeholder="smtp.example.com"
                onChange={(event) => patch({ smtp_host: event.target.value })}
              />
            </Field>
            <Field label="Port" hint="Usually 465 or 587">
              <Input
                type="number"
                min={1}
                max={65535}
                value={settings.smtp_port}
                onChange={(event) => {
                  const port = Number(event.target.value)
                  // Keep the TLS mode in step with the well-known ports so a
                  // 465 + STARTTLS pairing cannot be saved by accident.
                  patch({
                    smtp_port: port,
                    ...(port === 465
                      ? { smtp_secure: true, smtp_require_tls: false }
                      : port === 587 || port === 25
                        ? { smtp_secure: false, smtp_require_tls: true }
                        : {}),
                  })
                }}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-ui-fg-base">
            <input
              type="checkbox"
              checked={settings.smtp_secure}
              onChange={(event) => patch({ smtp_secure: event.target.checked })}
            />
            Use SSL/TLS immediately (usually port 465)
          </label>
          <label className="flex items-center gap-2 text-sm text-ui-fg-base">
            <input
              type="checkbox"
              checked={settings.smtp_require_tls}
              onChange={(event) => patch({ smtp_require_tls: event.target.checked })}
            />
            Require STARTTLS when available (usually port 587)
          </label>
        </Panel>

        <Panel
          title="SMTP authentication"
          description="Use the mailbox credentials supplied by your email provider."
        >
          <Field label="SMTP username">
            <Input
              autoComplete="username"
              value={settings.smtp_username}
              placeholder="mailbox@example.com"
              onChange={(event) => patch({ smtp_username: event.target.value })}
            />
          </Field>
          <Field
            label="SMTP password"
            hint={settings.smtp_password_configured
              ? "A password is saved. Leave this blank to keep it, or enter a new one to replace it."
              : "The password is encrypted before it is stored."}
          >
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              placeholder={settings.smtp_password_configured ? "Saved password" : "SMTP password"}
              disabled={clearPassword}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {settings.smtp_password_configured ? (
            <label className="flex items-center gap-2 text-sm text-ui-fg-base">
              <input
                type="checkbox"
                checked={clearPassword}
                onChange={(event) => {
                  setClearPassword(event.target.checked)
                  setPassword("")
                }}
              />
              Remove saved password
            </label>
          ) : null}
          <Text size="xsmall" className="text-ui-fg-subtle">
            Keep EMAIL_SETTINGS_ENCRYPTION_KEY (or JWT_SECRET) stable so the saved password can be decrypted.
          </Text>
        </Panel>

        <Panel
          title="Sender and recipients"
          description="Choose the address shown to recipients and where new enquiries and order alerts should arrive."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="From name">
              <Input
                value={settings.from_name}
                placeholder="SaaSential website"
                onChange={(event) => patch({ from_name: event.target.value })}
              />
            </Field>
            <Field label="From email address">
              <Input
                type="email"
                value={settings.from_email}
                placeholder="website@example.com"
                onChange={(event) => patch({ from_email: event.target.value })}
              />
            </Field>
          </div>
          <Field
            label="To email address(es)"
            hint="Contact enquiries and new order alerts go here. Separate multiple addresses with commas."
          >
            <Input
              type="text"
              value={recipients}
              placeholder="sales@example.com, team@example.com"
              onChange={(event) => setRecipients(event.target.value)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ui-fg-base">
            <input
              type="checkbox"
              checked={settings.reply_to_submitter}
              onChange={(event) => patch({ reply_to_submitter: event.target.checked })}
            />
            Set Reply-To to the person who submitted the form
          </label>
          <Field label="Subject prefix" hint="Optional label added before each notification subject.">
            <Input
              value={settings.subject_prefix}
              placeholder="Website enquiry"
              onChange={(event) => patch({ subject_prefix: event.target.value })}
            />
          </Field>
        </Panel>

        <Panel
          title="What happens next"
          description="Submissions and orders are saved even if email delivery is temporarily unavailable."
        >
          <Text size="small" className="text-ui-fg-subtle">
            New contact submissions include the visitor details, selected enquiry type, and message. When an order is placed, the customer receives an order confirmation and the addresses above receive a new order alert with the items, totals, and shipping address. Delivery problems are logged by the backend.
          </Text>
        </Panel>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Email settings",
  icon: DocumentText,
})

export default EmailSettingsPage
