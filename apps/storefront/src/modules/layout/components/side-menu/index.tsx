"use client"

import { Disclosure } from "@headlessui/react"
import {
  BookOpen,
  BuildingStorefront,
  ChevronDown,
  ChartBar,
  GlobeEurope,
  LightBulb,
  Newspaper,
  RocketLaunch,
  ShoppingBag,
  User,
  Users,
  XMark,
} from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BrandMark from "@modules/layout/components/brand-mark"
import {
  ctaMenuItem,
  primaryMenuItems,
  type MegaMenuGroup,
} from "@modules/layout/constants/menu-items"

const megaMenuIconMap = {
  users: Users,
  storefront: BuildingStorefront,
  globe: GlobeEurope,
  chart: ChartBar,
  newspaper: Newspaper,
  rocket: RocketLaunch,
  book: BookOpen,
  lightbulb: LightBulb,
} as const

const MegaMenuGroupList = ({
  group,
  onItemClick,
}: {
  group: MegaMenuGroup
  onItemClick: () => void
}) => {
  const Icon = megaMenuIconMap[group.icon]

  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
        <h4 className="text-[0.95rem] font-black uppercase tracking-[0.12em] text-white">
          {group.label}
        </h4>
      </div>
      <ul className="mt-3 space-y-3 pl-7">
        {group.items.map((item, index) => (
          <li key={`${group.label}-${item.label}-${index}`}>
            <LocalizedClientLink
              href={item.href}
              className="block text-[0.96rem] font-medium leading-6 text-white/75 transition-colors duration-200 hover:text-white"
              onClick={onItemClick}
            >
              {item.label}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  cartItemCount?: number
}

const MenuToggleIcon = () => {
  return (
    <span
      className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      aria-hidden="true"
    >
      <span className="block h-[2.5px] w-7 bg-white" />
      <span className="block h-[2.5px] w-7 bg-white" />
      <span className="block h-[2.5px] w-7 bg-white" />
    </span>
  )
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  cartItemCount = 0,
}: SideMenuProps) => {
  void regions
  void locales
  void currentLocale

  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <LocalizedClientLink
          href="/"
          className="inline-flex min-w-0 items-center"
          onClick={closeMenu}
        >
          <BrandMark variant="light" />
        </LocalizedClientLink>

        <div className="flex items-center gap-1">
          <LocalizedClientLink
            href="/account"
            onClick={closeMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/cart"
            onClick={closeMenu}
            className={clx(
              "relative inline-flex h-11 w-11 items-center justify-center rounded-[10px] transition-colors duration-200 hover:bg-white/10 hover:text-white",
              cartItemCount > 0 ? "text-white" : "text-white/85"
            )}
            aria-label={
              cartItemCount > 0 ? `Cart (${cartItemCount})` : "Cart"
            }
            data-testid="nav-cart-link"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center bg-[#2a83d8] px-1 text-[10px] font-semibold leading-none text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            ) : null}
          </LocalizedClientLink>

          <button
            type="button"
            data-testid="nav-menu-button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] text-white transition-colors duration-200 hover:bg-white/10 focus:outline-none"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <XMark className="h-7 w-7" /> : <MenuToggleIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="mt-4 rounded-[24px] border border-white/10 bg-[#0c1f29] px-4 py-4 shadow-[0_24px_55px_rgba(1,15,24,0.22)]"
          data-testid="nav-menu-popup"
        >
          <ul className="space-y-1">
            {primaryMenuItems.map((item) => {
              const children = item.children ?? []
              const megaMenuGroups = item.megaMenu?.groups ?? []

              return (
                <li
                  key={item.href}
                  className="border-b border-transparent last:border-none"
                >
                  {item.megaMenu ? (
                    <Disclosure>
                      {({ open: sectionOpen }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left text-[1.05rem] font-semibold tracking-[-0.02em] text-white">
                            <span>{item.label}</span>
                            <ChevronDown
                              className={clx(
                                "h-5 w-5 text-white/75 transition-transform duration-200",
                                sectionOpen && "rotate-180"
                              )}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="pb-4">
                            <div className="grid gap-3">
                              {megaMenuGroups.map((group) => (
                                <MegaMenuGroupList
                                  key={group.label}
                                  group={group}
                                  onItemClick={closeMenu}
                                />
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ) : children.length ? (
                    <Disclosure>
                      {({ open: sectionOpen }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left text-[1.05rem] font-semibold tracking-[-0.02em] text-white">
                            <span>{item.label}</span>
                            <ChevronDown
                              className={clx(
                                "h-5 w-5 text-white/75 transition-transform duration-200",
                                sectionOpen && "rotate-180"
                              )}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="pb-3">
                            <ul className="space-y-3 border-l border-white/10 pl-4">
                              {children.map((child, index) => (
                                <li key={`${item.label}-${child.label}-${index}`}>
                                  <LocalizedClientLink
                                    href={child.href}
                                    className="block text-[0.98rem] font-medium text-white/70 transition-colors duration-200 hover:text-white"
                                    onClick={closeMenu}
                                  >
                                    {child.label}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ) : (
                    <LocalizedClientLink
                      href={item.href}
                      className="block py-4 text-[1.05rem] font-semibold tracking-[-0.02em] text-white transition-colors duration-200 hover:text-[#9fe4ff]"
                      onClick={closeMenu}
                      data-testid={`${item.label.toLowerCase()}-link`}
                    >
                      {item.label}
                    </LocalizedClientLink>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-4 border-t border-white/10 pt-4">
            <LocalizedClientLink
              href={ctaMenuItem.href}
              className="mx-auto flex min-h-12 w-full max-w-[185px] items-center justify-center rounded-full bg-gradient-to-r from-[#e1b24f] to-[#d97348] px-4 py-3 text-[0.98rem] font-bold tracking-[0.01em] text-white shadow-[0_16px_32px_rgba(217,115,72,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              onClick={closeMenu}
            >
              {ctaMenuItem.label}
            </LocalizedClientLink>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default SideMenu
