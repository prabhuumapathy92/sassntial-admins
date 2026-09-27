"use server"

import { sdk } from "@lib/config"

import type {
  MegaMenu,
  MegaMenuGroup,
  MegaMenuIcon,
  MegaMenuMedia,
  MenuItem,
  MenuLink,
} from "@modules/layout/constants/menu-items"
import {
  ctaMenuItem as fallbackCta,
  primaryMenuItems as fallbackPrimary,
} from "@modules/layout/constants/menu-items"

import { getCacheOptions } from "./cookies"

type NavNode = {
  id: string
  label: string
  href: string | null
  icon: string | null
  media: MegaMenuMedia | null
  children: NavNode[]
}

type NavTree = {
  primary: NavNode[]
  secondary: NavNode[]
  cta: NavNode[]
}

export type Navigation = {
  primary: MenuItem[]
  cta: MenuLink
}

const ICONS: MegaMenuIcon[] = [
  "users",
  "storefront",
  "globe",
  "chart",
  "newspaper",
  "rocket",
  "book",
  "lightbulb",
]

const toIcon = (value: string | null): MegaMenuIcon =>
  ICONS.includes(value as MegaMenuIcon) ? (value as MegaMenuIcon) : "book"

const toLink = (node: NavNode): MenuLink => ({
  label: node.label,
  href: node.href ?? "#",
})

/**
 * A top-level item becomes a mega menu when its children are headings (no
 * href) and a plain dropdown when they are links, so the layout follows from
 * the content rather than from a separate setting that could contradict it.
 */
const toMenuItem = (node: NavNode): MenuItem => {
  // No destination means the label opens the mega menu rather than linking.
  const base = {
    label: node.label,
    ...(node.href ? { href: node.href } : {}),
  }

  if (!node.children.length) {
    return base
  }

  const groups = node.children.filter((child) => !child.href)

  if (!groups.length) {
    return { ...base, children: node.children.map(toLink) }
  }

  const megaMenu: MegaMenu = {
    label: node.label,
    groups: groups.map(
      (group): MegaMenuGroup => ({
        label: group.label,
        icon: toIcon(group.icon),
        items: group.children.map(toLink),
      })
    ),
    ...(node.media ? { media: node.media } : {}),
  }

  return { ...base, megaMenu }
}

/**
 * Reads the navigation managed in Medusa Admin.
 *
 * The hardcoded menu is kept as a fallback for an unreachable backend only:
 * the header renders on every page, so a request failure should degrade to the
 * previous menu rather than leave the site without navigation. An empty menu
 * that the API returned successfully is passed through, because that is an
 * editor hiding entries on purpose.
 */
export const listNavigation = async (): Promise<Navigation> => {
  const fallback: Navigation = {
    primary: fallbackPrimary,
    cta: fallbackCta,
  }

  const next = {
    ...(await getCacheOptions("navigation")),
  }

  return sdk.client
    .fetch<{ navigation: NavTree }>("/store/navigation", {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ navigation }) => {
      const primary = (navigation?.primary ?? []).map(toMenuItem)
      const [cta] = (navigation?.cta ?? []).map(toLink)

      // An empty menu is a deliberate editorial state, not a failure: hiding
      // every entry must actually hide them rather than snap the site back to
      // the built-in menu. The fallback is for an unreachable backend only.
      return {
        primary,
        cta: cta ?? fallback.cta,
      }
    })
    .catch((e) => {
      console.error("Failed to load navigation, using the built-in menu", e)
      return fallback
    })
}
