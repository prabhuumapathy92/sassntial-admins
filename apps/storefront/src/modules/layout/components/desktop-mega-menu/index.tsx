"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

import {
  BookOpen,
  BuildingStorefront,
  ChartBar,
  GlobeEurope,
  LightBulb,
  Newspaper,
  RocketLaunch,
  Users,
} from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type {
  MegaMenu,
  MegaMenuGroup,
  MegaMenuMedia,
  MenuItem,
} from "@modules/layout/constants/menu-items"
import { clx } from "@medusajs/ui"

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

const closeDelayMs = 120

const MegaMenuSection = ({
  group,
  onNavigate,
}: {
  group: MegaMenuGroup
  onNavigate: () => void
}) => {
  const Icon = megaMenuIconMap[group.icon]

  return (
    <div className="min-w-0">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white" />
        <h3 className="text-[1rem] font-black uppercase text-white">
          {group.label}
        </h3>
      </div>

      <ul className="mt-3 space-y-3">
        {group.items.map((item, index) => (
          <li key={`${group.label}-${item.label}-${index}`}>
            <LocalizedClientLink
              href={item.href}
              onClick={onNavigate}
              className="text-[15px] font-medium leading-6 text-white/80 transition-colors duration-200 hover:text-[#9fe4ff]"
            >
              {item.label}
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

const MegaMenuMediaPanel = ({ media }: { media: MegaMenuMedia }) => {
  return (
    <div className="flex h-full min-h-[230px] flex-col justify-between">
      <div>
        {media.eyebrow ? (
          <p className="text-[0.72rem] font-semibold uppercase text-white/55">
            {media.eyebrow}
          </p>
        ) : null}
        {media.title ? (
          <h3 className="mt-2 text-[1rem] font-black uppercase text-white">
            {media.title}
          </h3>
        ) : null}
        {media.subtitle ? (
          <p className="mt-2 max-w-[250px] text-[0.92rem] leading-6 text-white/72">
            {media.subtitle}
          </p>
        ) : null}
      </div>

      <div className="relative mt-8 flex min-h-[180px] items-center justify-center">
        <div className="relative h-[220px] w-[280px]">
          {media.images.map((image) => (
            <img
              key={image.alt}
              src={image.src}
              alt={image.alt}
              className={image.className}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const MegaMenuPanel = ({
  item,
  onNavigate,
}: {
  item: MenuItem
  onNavigate: () => void
}) => {
  const megaMenu = item.megaMenu as MegaMenu
  const hasMedia = Boolean(megaMenu.media)
  const contentGridClass =
    megaMenu.groups.length >= 3
      ? "xl:grid-cols-3 xl:gap-x-16"
      : megaMenu.groups.length === 2
      ? "xl:grid-cols-2 xl:gap-x-16"
      : "xl:grid-cols-1"

  return (
    <div className="fixed left-0 right-0 top-[84px] z-40 border-t border-white/10 bg-[#102735] shadow-[0_28px_60px_rgba(1,15,24,0.3)]">
      <div className="mx-auto max-w-[1880px] px-8 py-10 2xl:px-10">
        <div
          className={clx(
            "grid min-h-[310px] gap-10",
            hasMedia
              ? "grid-cols-[320px_minmax(0,1fr)_320px]"
              : "grid-cols-[320px_minmax(0,1fr)]"
          )}
        >
          <div className="flex items-center justify-center border-r border-white/20 px-6">
            <span className="text-center text-[1rem] font-black uppercase text-white">
              {megaMenu.label ?? item.label}
            </span>
          </div>

          <div className={clx("grid gap-10", contentGridClass)}>
            {megaMenu.groups.map((group) => (
              <MegaMenuSection
                key={group.label}
                group={group}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          {megaMenu.media ? (
            <MegaMenuMediaPanel media={megaMenu.media} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

type DesktopMegaMenuProps = {
  items: MenuItem[]
}

const DesktopMegaMenu = ({ items }: DesktopMegaMenuProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openItem = (label: string) => {
    cancelClose()
    setActiveItem(label)
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActiveItem(null)
      closeTimerRef.current = null
    }, closeDelayMs)
  }

  const closeMenu = () => {
    cancelClose()
    setActiveItem(null)
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  const activeMenuItem = items.find(
    (item) => item.label === activeItem && item.megaMenu
  )

  return (
    <div
      className="flex items-center justify-center gap-6 2xl:gap-10"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      {items.map((item) => (
        <div key={item.label} className="relative flex items-center">
          <LocalizedClientLink
            className={clx(
              "relative whitespace-nowrap text-[14px] font-semibold text-white/90 transition-colors duration-200 hover:text-white after:absolute after:-bottom-4 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#d97348] after:transition-transform after:duration-200 hover:after:scale-x-100",
              activeItem === item.label && "text-white after:scale-x-100"
            )}
            href={item.href}
            onClick={closeMenu}
            onMouseEnter={() => openItem(item.label)}
          >
            {item.label}
          </LocalizedClientLink>

          {activeMenuItem?.label === item.label ? (
            <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
              <MegaMenuPanel item={item} onNavigate={closeMenu} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default DesktopMegaMenu
