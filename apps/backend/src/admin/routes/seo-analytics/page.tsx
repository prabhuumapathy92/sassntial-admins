import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChartBar } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import { sdk } from "../../lib/sdk"

type SiteSettings = {
  google_analytics_id: string
  google_tag_manager_id: string
  meta_pixel_id: string
  microsoft_clarity_id: string
  google_site_verification: string
  bing_site_verification: string
  head_code: string
  body_code: string
}

const EMPTY_SETTINGS: SiteSettings = {
  google_analytics_id: "",
  google_tag_manager_id: "",
  meta_pixel_id: "",
  microsoft_clarity_id: "",
  google_site_verification: "",
  bing_site_verification: "",
  head_code: "",
  body_code: "",
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
  id,
  label,
  hint,
  children,
}: {
  id: string
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id} size="small" weight="plus">
      {label}
    </Label>
    {children}
    {hint ? (
      <Text size="xsmall" className="text-ui-fg-subtle">
        {hint}
      </Text>
    ) : null}
  </div>
)

const SeoAnalyticsPage = () => {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: () =>
      sdk.client.fetch<{ site_settings: SiteSettings }>("/admin/site-settings"),
  })

  useEffect(() => {
    if (data?.site_settings) {
      setSettings({ ...EMPTY_SETTINGS, ...data.site_settings })
    }
  }, [data])

  const { mutate, isPending } = useMutation({
    mutationFn: (site_settings: SiteSettings) =>
      sdk.client.fetch<{ site_settings: SiteSettings }>(
        "/admin/site-settings",
        { method: "POST", body: { site_settings } }
      ),
    onSuccess: ({ site_settings: saved }) => {
      setSettings({ ...EMPTY_SETTINGS, ...saved })
      queryClient.setQueryData(["site-settings"], { site_settings: saved })
      toast.success("SEO & analytics saved", {
        description: "The storefront picks up the change on its next page load.",
      })
    },
    onError: (saveError: Error) =>
      toast.error(saveError.message || "Could not save SEO & analytics"),
  })

  const patch = (values: Partial<SiteSettings>) =>
    setSettings((current) => ({ ...current, ...values }))

  const input = (
    field: keyof SiteSettings,
    placeholder: string
  ) => (
    <Input
      id={field}
      value={settings[field]}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck={false}
      onChange={(event) => patch({ [field]: event.target.value })}
    />
  )

  if (isLoading) {
    return (
      <Container>
        <Text>Loading SEO & analytics...</Text>
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <Text className="text-ui-fg-error">
          {(error as Error)?.message ?? "Could not load SEO & analytics"}
        </Text>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h2">SEO & analytics</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Tracking tags and search engine verification added to every
            storefront page.
          </Text>
        </div>
        <Button onClick={() => mutate(settings)} isLoading={isPending}>
          Save settings
        </Button>
      </div>

      <div className="grid gap-5 px-6 py-6 xl:grid-cols-2">
        <Panel
          title="Analytics & tracking"
          description="Paste only the ID. The storefront adds the official script for each one you fill in; leave a field blank to turn it off."
        >
          <Field
            id="google_analytics_id"
            label="Google Analytics 4 (Google tag ID)"
            hint="Google Analytics > Admin > Data streams > your web stream. Starts with G-."
          >
            {input("google_analytics_id", "G-XXXXXXXXXX")}
          </Field>
          <Field
            id="google_tag_manager_id"
            label="Google Tag Manager container ID"
            hint="Shown next to the container name in Tag Manager. Starts with GTM-. If GA4 is already set up inside Tag Manager, leave the field above blank to avoid counting visits twice."
          >
            {input("google_tag_manager_id", "GTM-XXXXXXX")}
          </Field>
          <Field
            id="meta_pixel_id"
            label="Meta (Facebook) Pixel ID"
            hint="Meta Events Manager > Data sources > your pixel. Numbers only."
          >
            {input("meta_pixel_id", "123456789012345")}
          </Field>
          <Field
            id="microsoft_clarity_id"
            label="Microsoft Clarity project ID"
            hint="Clarity > Settings > Overview."
          >
            {input("microsoft_clarity_id", "abcd1234ef")}
          </Field>
        </Panel>

        <Panel
          title="Search engine verification"
          description="Proves to search consoles that you own this site. Paste the code, or the whole <meta> tag they give you."
        >
          <Field
            id="google_site_verification"
            label="Google Search Console"
            hint="Search Console > Add property > URL prefix > HTML tag."
          >
            {input(
              "google_site_verification",
              '<meta name="google-site-verification" content="..." />'
            )}
          </Field>
          <Field
            id="bing_site_verification"
            label="Bing Webmaster Tools"
            hint="Bing Webmaster Tools > Add site > HTML Meta Tag (msvalidate.01)."
          >
            {input(
              "bing_site_verification",
              '<meta name="msvalidate.01" content="..." />'
            )}
          </Field>
        </Panel>

        <Panel
          title="Custom code in <head>"
          description="For any other provider (Hotjar, LinkedIn Insight, TikTok Pixel, schema markup, and so on). Supports <script>, <noscript>, <meta>, <link> and <style> tags."
        >
          <Field id="head_code" label="Head code">
            <Textarea
              id="head_code"
              rows={10}
              value={settings.head_code}
              spellCheck={false}
              className="font-mono text-xs"
              placeholder={"<script>\n  // tracking snippet\n</script>"}
              onChange={(event) => patch({ head_code: event.target.value })}
            />
          </Field>
        </Panel>

        <Panel
          title="Custom code before </body>"
          description="For chat widgets and snippets a provider asks you to place at the end of the page."
        >
          <Field id="body_code" label="Body code">
            <Textarea
              id="body_code"
              rows={10}
              value={settings.body_code}
              spellCheck={false}
              className="font-mono text-xs"
              placeholder={"<script src=\"https://example.com/widget.js\" async></script>"}
              onChange={(event) => patch({ body_code: event.target.value })}
            />
          </Field>
          <Text size="xsmall" className="text-ui-fg-subtle">
            Custom code runs on every page for every visitor. Only paste code
            from providers you trust.
          </Text>
        </Panel>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "SEO & analytics",
  icon: ChartBar,
})

export default SeoAnalyticsPage
