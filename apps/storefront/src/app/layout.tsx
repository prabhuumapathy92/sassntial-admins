import { retrieveSiteSettings } from "@lib/data/site-settings"
import { getBaseURL } from "@lib/util/env"
import {
  SiteBodyEndCode,
  SiteBodyStartTags,
  SiteHeadCode,
  SiteTrackingScripts,
} from "@modules/layout/components/site-scripts"
import { Metadata } from "next"
import "../styles/globals.css"

/**
 * Search console verification goes through the metadata API so the tags are
 * in the server-rendered <head>, where the verifiers look for them. The
 * settings fetch is shared with the layout below, so this costs no extra
 * request.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await retrieveSiteSettings()
  const google = settings.google_site_verification || undefined
  const bing = settings.bing_site_verification

  return {
    metadataBase: new URL(getBaseURL()),
    ...(google || bing
      ? {
          verification: {
            google,
            ...(bing ? { other: { "msvalidate.01": bing } } : {}),
          },
        }
      : {}),
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const settings = await retrieveSiteSettings()

  return (
    <html lang="en" data-mode="light">
      <head>
        <SiteHeadCode code={settings.head_code} />
      </head>
      <body>
        <SiteBodyStartTags settings={settings} />
        <main className="relative">{props.children}</main>
        <SiteTrackingScripts settings={settings} />
        <SiteBodyEndCode code={settings.body_code} />
      </body>
    </html>
  )
}
