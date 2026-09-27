import { MedusaService } from "@medusajs/framework/utils"

import { FooterSettings } from "./models/footer-settings"
import { NavItem } from "./models/nav-item"

export type FooterLink = { label: string; href: string }

export type FooterLinkGroup = {
  title: string
  links: FooterLink[]
}

export type FooterSocialLink = FooterLink & { platform: string }

export type FooterLocation = { city: string; address: string }

export type FooterConfig = {
  theme: "navy" | "dark" | "light"
  logo_url: string
  logo_alt: string
  groups: FooterLinkGroup[]
  social_links: FooterSocialLink[]
  cta: FooterLink
  locations: FooterLocation[]
  phone_label: string
  phone_href: string
  copyright_text: string
  legal_links: FooterLink[]
}

/** Initial values appear in admin on first use and are editable after saving. */
export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  theme: "navy",
  logo_url: "",
  logo_alt: "SaaSential",
  groups: [
    {
      title: "Services",
      links: [
        { label: "SEO", href: "/services/seo" },
        { label: "Local SEO", href: "/services/local-seo" },
        { label: "AI SEO", href: "/services/ai-seo" },
        { label: "Paid Media", href: "/services/paid-social-advertising" },
        {
          label: "Social Media Marketing",
          href: "/services/social-media-management",
        },
        { label: "Email Marketing", href: "/services/email-sms-marketing" },
        {
          label: "Conversion Rate Optimization",
          href: "/services/conversion-rate-optimization",
        },
        {
          label: "Website Design & Development",
          href: "/services/website-development",
        },
        { label: "Digital PR", href: "/services/digital-pr" },
        {
          label: "Analytics & Attribution",
          href: "/services/reporting-data-analytics",
        },
      ],
    },
    {
      title: "Industries",
      links: [
        {
          label: "Consumer Franchise Marketing",
          href: "/who-we-serve/franchise-marketing",
        },
        {
          label: "Franchise Development",
          href: "/who-we-serve/franchise-development",
        },
        {
          label: "Multi Location",
          href: "/who-we-serve/multi-location-businesses",
        },
        { label: "ECommerce", href: "/who-we-serve/ecommerce" },
        { label: "B2B", href: "/who-we-serve/b2b-marketing" },
        {
          label: "Healthcare & Medical",
          href: "/who-we-serve/healthcare-practices",
        },
        { label: "Home Services", href: "/who-we-serve/home-services" },
        {
          label: "Financial Services",
          href: "/who-we-serve/financial-services",
        },
        { label: "View More Industries", href: "/who-we-serve/industries" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "About Us", href: "/company/our-story" },
        { label: "Our Team", href: "/company/our-team" },
        { label: "Awards", href: "/company/our-awards" },
        { label: "Clients", href: "/company/clients" },
        { label: "Case Studies", href: "/company/blog" },
        { label: "Blog", href: "/company/blog" },
        { label: "Whitepaper", href: "/resources/whitepaper" },
        { label: "Blogs", href: "/resources/blogs" },
        { label: "Webinars", href: "/resources/webinars" },
        { label: "Contact Us", href: "/company/contact-us" },
        { label: "Marketing Resources", href: "/resources/whitepaper" },
        {
          label: "Franchise Marketing Resources",
          href: "/resources/whitepaper",
        },
      ],
    },
  ],
  social_links: [
    {
      label: "LinkedIn",
      platform: "linkedin",
      href: "https://www.linkedin.com",
    },
    {
      label: "Facebook",
      platform: "facebook",
      href: "https://www.facebook.com",
    },
    {
      label: "Instagram",
      platform: "instagram",
      href: "https://www.instagram.com",
    },
    { label: "YouTube", platform: "youtube", href: "https://www.youtube.com" },
  ],
  cta: { label: "Request a Free Proposal", href: "/company/contact-us" },
  locations: [
    {
      city: "San Diego",
      address:
        "4370 La Jolla Village Drive Suite 320, San Diego, California 92122",
    },
    {
      city: "Irvine",
      address: "7700 Irvine Center Drive Suite 430, Irvine, CA 92618",
    },
    { city: "Orlando", address: "100 East Pine St, Orlando, FL 32801" },
    {
      city: "New York",
      address: "14 Wall Street, 20th Floor New York, NY 10005",
    },
  ],
  phone_label: "(619) 752-1955",
  phone_href: "tel:6197521955",
  copyright_text: "Ignite Visibility. All Rights Reserved.",
  legal_links: [
    { label: "Privacy Policy", href: "/content/privacy-policy" },
    { label: "Terms of Service", href: "/content/terms-of-use" },
  ],
}

export type NavMenuKey = "primary" | "secondary" | "cta"

export type NavMediaImage = {
  src: string
  alt: string
  className?: string
}

export type NavMedia = {
  eyebrow?: string
  title?: string
  subtitle?: string
  images: NavMediaImage[]
}

/** A node as the storefront consumes it, children already nested and ordered. */
export type NavNode = {
  id: string
  label: string
  href: string | null
  icon: string | null
  media: NavMedia | null
  /** Returned so the admin can round-trip the toggle; the store tree only
   *  ever contains active items. */
  is_active: boolean
  children: NavNode[]
}

export type NavTree = Record<NavMenuKey, NavNode[]>

export type NavItemInput = {
  id?: string
  menu?: NavMenuKey
  parent_id?: string | null
  label: string
  href?: string | null
  icon?: string | null
  media?: NavMedia | null
  rank?: number
  is_active?: boolean
}

const MENU_KEYS: NavMenuKey[] = ["primary", "secondary", "cta"]

/**
 * `model.json()` is typed as `Record<string, unknown>`, so the generated create
 * and update signatures reject the media object's `images` array. The cast is
 * confined to the write paths, which keeps `NavMedia` a precise type elsewhere.
 */
const toPersistence = (data: NavItemInput) => data as Record<string, any>

const normalizeMedia = (value: unknown): NavMedia | null => {
  if (!value || typeof value !== "object") {
    return null
  }

  const record = value as Record<string, unknown>
  const images = Array.isArray(record.images) ? record.images : []

  const cleaned = images.flatMap((image): NavMediaImage[] => {
    if (!image || typeof image !== "object") {
      return []
    }

    const { src, alt, className } = image as Record<string, unknown>

    return typeof src === "string" && src.length
      ? [
          {
            src,
            alt: typeof alt === "string" ? alt : "",
            ...(typeof className === "string" ? { className } : {}),
          },
        ]
      : []
  })

  if (!cleaned.length) {
    return null
  }

  return {
    ...(typeof record.eyebrow === "string" ? { eyebrow: record.eyebrow } : {}),
    ...(typeof record.title === "string" ? { title: record.title } : {}),
    ...(typeof record.subtitle === "string"
      ? { subtitle: record.subtitle }
      : {}),
    images: cleaned,
  }
}

const toNode = (record: any): NavNode => ({
  id: record.id,
  label: record.label,
  href: record.href ?? null,
  icon: record.icon ?? null,
  media: normalizeMedia(record.media),
  is_active: record.is_active ?? true,
  children: [],
})

class NavigationModuleService extends MedusaService({
  NavItem,
  FooterSettings,
}) {
  async retrieveFooterConfig(): Promise<FooterConfig> {
    const [existing] = await this.listFooterSettings(
      { key: "default" },
      { take: 1 },
    )

    if (existing) {
      return normalizeFooterConfig(existing.data)
    }

    return DEFAULT_FOOTER_CONFIG
  }

  async replaceFooterConfig(data: FooterConfig): Promise<FooterConfig> {
    const [existing] = await this.listFooterSettings(
      { key: "default" },
      { take: 1 },
    )
    const payload = toFooterPersistence(data)

    if (existing) {
      const [updated] = await this.updateFooterSettings([
        { id: existing.id, ...payload },
      ])

      return normalizeFooterConfig(updated.data)
    }

    const [created] = await this.createFooterSettings([payload])
    return normalizeFooterConfig(created.data)
  }

  /**
   * Returns every menu as a nested, ordered tree.
   *
   * The whole table is read once and assembled in memory rather than queried
   * per level: the navigation is a few dozen rows, and recursive queries would
   * cost more round trips than the data is worth. Inactive items are dropped
   * along with their descendants, so hiding a group hides its links too.
   */
  async retrieveTree({
    includeInactive = false,
  }: { includeInactive?: boolean } = {}): Promise<NavTree> {
    const filters = includeInactive ? {} : { is_active: true }
    const records = await this.listNavItems(filters, {
      order: { rank: "ASC" },
    })

    const nodes = new Map<string, NavNode>()
    const childIds = new Map<string | null, string[]>()

    for (const record of records) {
      nodes.set(record.id, toNode(record))
    }

    for (const record of records) {
      // A child whose parent was filtered out would otherwise be promoted to a
      // root and appear in the top-level nav.
      if (record.parent_id && !nodes.has(record.parent_id)) {
        continue
      }

      const key = record.parent_id ?? null
      childIds.set(key, [...(childIds.get(key) ?? []), record.id])
    }

    const attach = (id: string): NavNode => {
      const node = nodes.get(id)!
      node.children = (childIds.get(id) ?? []).map(attach)
      return node
    }

    const rootsByMenu = new Map<string, NavNode[]>()

    for (const id of childIds.get(null) ?? []) {
      const record = records.find((entry: any) => entry.id === id)
      const menu = String(record?.menu ?? "primary")
      rootsByMenu.set(menu, [...(rootsByMenu.get(menu) ?? []), attach(id)])
    }

    return MENU_KEYS.reduce<NavTree>(
      (tree, key) => ({ ...tree, [key]: rootsByMenu.get(key) ?? [] }),
      { primary: [], secondary: [], cta: [] },
    )
  }

  /**
   * Replaces a menu wholesale from a nested payload.
   *
   * The admin screen edits a tree, so reconciling individual rows would mean
   * diffing parents and ranks on every save. Deleting the menu and rewriting it
   * keeps the write path simple; ids are not stable across saves, which is fine
   * because nothing else references them.
   */
  async replaceMenu(menu: NavMenuKey, items: NavItemInput[]): Promise<NavTree> {
    const existing = await this.listNavItems({ menu })

    if (existing.length) {
      await this.deleteNavItems(existing.map((item: any) => item.id))
    }

    const insert = async (
      entries: NavItemInput[],
      parentId: string | null,
    ): Promise<void> => {
      for (const [index, entry] of entries.entries()) {
        const [created] = await this.createNavItems([
          toPersistence({
            menu,
            parent_id: parentId,
            label: entry.label,
            href: entry.href ?? null,
            icon: entry.icon ?? null,
            media: entry.media ?? null,
            rank: entry.rank ?? index,
            is_active: entry.is_active ?? true,
          }),
        ])

        const children = (entry as { children?: NavItemInput[] }).children

        if (children?.length) {
          await insert(children, created.id)
        }
      }
    }

    await insert(items, null)

    return this.retrieveTree({ includeInactive: true })
  }
}

const toFooterPersistence = (data: FooterConfig) =>
  ({ key: "default", data }) as Record<string, any>

const normalizeFooterConfig = (value: unknown): FooterConfig => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_FOOTER_CONFIG
  }

  return { ...DEFAULT_FOOTER_CONFIG, ...(value as Partial<FooterConfig>) }
}

export default NavigationModuleService
