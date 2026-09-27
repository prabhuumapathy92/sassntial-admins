import "server-only"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type FooterLink = { label: string; href: string }
export type FooterGroup = { title: string; links: FooterLink[] }
export type FooterSocialLink = FooterLink & { platform: string }
export type FooterLocation = { city: string; address: string }
export type FooterConfig = {
  theme: "navy" | "dark" | "light"
  logo_url: string
  logo_alt: string
  groups: FooterGroup[]
  social_links: FooterSocialLink[]
  cta: FooterLink
  locations: FooterLocation[]
  phone_label: string
  phone_href: string
  copyright_text: string
  legal_links: FooterLink[]
}

const EMPTY_FOOTER: FooterConfig = {
  theme: "navy",
  logo_url: "",
  logo_alt: "",
  groups: [],
  social_links: [],
  cta: { label: "", href: "" },
  locations: [],
  phone_label: "",
  phone_href: "",
  copyright_text: "",
  legal_links: [],
}

export const retrieveFooterConfig = async (): Promise<FooterConfig> => {
  try {
    const next = await getCacheOptions("footer")

    const { footer } = await sdk.client.fetch<{ footer: FooterConfig }>(
      "/store/footer",
      {
        method: "GET",
        next,
        cache: "force-cache",
      },
    )

    return {
      ...EMPTY_FOOTER,
      ...footer,
      groups: Array.isArray(footer.groups) ? footer.groups : [],
      social_links: Array.isArray(footer.social_links)
        ? footer.social_links
        : [],
      locations: Array.isArray(footer.locations) ? footer.locations : [],
      legal_links: Array.isArray(footer.legal_links) ? footer.legal_links : [],
    }
  } catch (error) {
    console.error("Failed to load footer configuration", error)
    return EMPTY_FOOTER
  }
}
