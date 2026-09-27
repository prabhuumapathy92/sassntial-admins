import Script from "next/script"

import type { SiteSettings } from "@lib/data/site-settings"
import { parseHeadCode, toReactProps } from "@lib/util/parse-head-code"

/**
 * Tracking tags and custom code managed in Medusa Admin > SEO & analytics.
 *
 * The IDs are re-checked against each provider's format even though the admin
 * validates them on save: they are written into inline scripts, and a value
 * that slipped past the backend must not be able to break out of the string.
 */
const GA_ID = /^(G|GT|AW)-[A-Z0-9]{4,20}$/
const GTM_ID = /^GTM-[A-Z0-9]{4,12}$/
const PIXEL_ID = /^\d{5,20}$/
const CLARITY_ID = /^[a-z0-9]{6,20}$/i

const validId = (value: string, pattern: RegExp) =>
  pattern.test(value) ? value : null

/** Custom head code, rendered into the server HTML inside <head>. */
export const SiteHeadCode = ({ code }: { code: string }) => (
  <>
    {parseHeadCode(code).map((tag, index) => {
      const key = `site-head-${index}`
      // The props are whatever the snippet's tag carried, so they are typed as
      // the union of every HTML attribute rather than one element's set.
      const props = toReactProps(
        tag.attributes
      ) as React.AllHTMLAttributes<HTMLElement>

      switch (tag.name) {
        case "script":
          return tag.content.trim() ? (
            <script
              key={key}
              {...props}
              dangerouslySetInnerHTML={{ __html: tag.content }}
            />
          ) : (
            <script key={key} {...props} />
          )
        case "style":
          return (
            <style
              key={key}
              {...props}
              dangerouslySetInnerHTML={{ __html: tag.content }}
            />
          )
        case "noscript":
          return (
            <noscript
              key={key}
              {...props}
              dangerouslySetInnerHTML={{ __html: tag.content }}
            />
          )
        case "meta":
          return <meta key={key} {...props} />
        case "link":
          return <link key={key} {...props} />
      }
    })}
  </>
)

/** No-JavaScript fallbacks, which providers ask for right after <body>. */
export const SiteBodyStartTags = ({ settings }: { settings: SiteSettings }) => {
  const gtmId = validId(settings.google_tag_manager_id, GTM_ID)
  const pixelId = validId(settings.meta_pixel_id, PIXEL_ID)

  return (
    <>
      {gtmId ? (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      ) : null}
      {pixelId ? (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          />
        </noscript>
      ) : null}
    </>
  )
}

/**
 * The provider snippets, loaded through next/script so each runs once per
 * visit rather than again on every client-side navigation. GA4, Meta Pixel and
 * Clarity all record in-app navigations themselves by watching the History
 * API; with Tag Manager that is configured in the container.
 */
export const SiteTrackingScripts = ({
  settings,
}: {
  settings: SiteSettings
}) => {
  const gaId = validId(settings.google_analytics_id, GA_ID)
  const gtmId = validId(settings.google_tag_manager_id, GTM_ID)
  const pixelId = validId(settings.meta_pixel_id, PIXEL_ID)
  const clarityId = validId(settings.microsoft_clarity_id, CLARITY_ID)

  return (
    <>
      {gtmId ? (
        <Script id="site-gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}
      {gaId ? (
        <>
          <Script
            id="site-ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="site-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      ) : null}
      {pixelId ? (
        <Script id="site-meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}
      {clarityId ? (
        <Script id="site-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
    </>
  )
}

/**
 * Custom code for the end of <body>. Scripts inside server-rendered HTML run
 * when the browser parses the page, and the root layout never re-renders on
 * client navigation, so each snippet runs exactly once per page load. The
 * wrapper keeps arbitrary markup (a widget's mount point, say) intact.
 */
export const SiteBodyEndCode = ({ code }: { code: string }) =>
  code.trim() ? (
    <div
      id="site-body-code"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  ) : null
