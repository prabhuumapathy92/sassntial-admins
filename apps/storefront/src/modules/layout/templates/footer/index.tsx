import Image from "next/image"
import type { ReactNode } from "react"

import BrandMark from "@modules/layout/components/brand-mark"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  retrieveFooterConfig,
  type FooterGroup,
  type FooterLink,
} from "@lib/data/footer"

const safeHref = (href: string) => {
  const value = href.trim()

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value
  }

  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(value)) {
    return value
  }

  return "#"
}

const FOOTER_PALETTES = {
  navy: {
    footer: "bg-[#173141] text-white",
    heading: "text-white",
    link: "text-white/82 hover:text-[#f8c86f]",
    social:
      "border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-[#f8c86f]",
    address: "text-white/78",
    border: "border-white/10",
    phone: "text-white hover:text-[#f8c86f]",
    copyright: "text-white/72",
    legal: "text-white/50",
    separator: "bg-white/30",
  },
  dark: {
    footer: "bg-[#0d1220] text-white",
    heading: "text-white",
    link: "text-white/82 hover:text-[#f8c86f]",
    social:
      "border-white/20 bg-white/5 text-white hover:bg-white/12 hover:text-[#f8c86f]",
    address: "text-white/78",
    border: "border-white/10",
    phone: "text-white hover:text-[#f8c86f]",
    copyright: "text-white/72",
    legal: "text-white/50",
    separator: "bg-white/30",
  },
  light: {
    footer: "bg-white text-slate-900",
    heading: "text-slate-900",
    link: "text-slate-600 hover:text-sky-700",
    social:
      "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-sky-700",
    address: "text-slate-600",
    border: "border-slate-200",
    phone: "text-slate-900 hover:text-sky-700",
    copyright: "text-slate-600",
    legal: "text-slate-500",
    separator: "bg-slate-300",
  },
} as const

type FooterPalette = (typeof FOOTER_PALETTES)[keyof typeof FOOTER_PALETTES]

const FooterAnchor = ({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) => {
  const destination = safeHref(href)

  if (destination.startsWith("/")) {
    return (
      <LocalizedClientLink href={destination} className={className}>
        {children}
      </LocalizedClientLink>
    )
  }

  const external = /^https?:\/\//i.test(destination)

  return (
    <a
      href={destination}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
    </a>
  )
}

const FooterLinkColumn = ({
  group,
  palette,
}: {
  group: FooterGroup
  palette: FooterPalette
}) => {
  const links = group.links.filter((link) => link.label.trim())

  if (!group.title.trim() && !links.length) {
    return null
  }

  return (
    <div>
      {group.title ? (
        <h3 className={`text-sm font-bold uppercase ${palette.heading}`}>
          {group.title}
        </h3>
      ) : null}
      {links.length ? (
        <ul className="mt-5 space-y-2.5">
          {links.map((link, index) => (
            <li key={`${group.title}-${link.label}-${index}`}>
              <FooterAnchor
                href={link.href}
                className={`text-[0.95rem] leading-6 transition-colors duration-200 ${palette.link}`}
              >
                {link.label}
              </FooterAnchor>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

const SocialIcon = ({
  platform,
  label,
}: {
  platform: string
  label: string
}) => {
  const iconClass = "h-4 w-4"

  switch (platform) {
    case "linkedin":
      return (
        <svg
          viewBox="0 0 24 24"
          className={iconClass}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.94 6.5A1.94 1.94 0 1 1 3.06 6.5a1.94 1.94 0 0 1 3.88 0ZM3.4 8.75h3.08V20.6H3.4V8.75Zm5.1 0h2.95v1.62h.04c.41-.77 1.42-1.58 2.92-1.58 3.12 0 3.7 2.05 3.7 4.71v7.1h-3.08v-6.3c0-1.5-.02-3.43-2.09-3.43-2.1 0-2.42 1.64-2.42 3.32v6.41H8.5V8.75Z" />
        </svg>
      )
    case "facebook":
      return (
        <svg
          viewBox="0 0 24 24"
          className={iconClass}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.1 1.5-4.1 4.3V11H8v3h2.2v8h3.3Z" />
        </svg>
      )
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          className={iconClass}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          className={iconClass}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26.7 26.7 0 0 0 2 12a26.7 26.7 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26.7 26.7 0 0 0 22 12a26.7 26.7 0 0 0-.4-4.8ZM10 15.2V8.8l5.6 3.2-5.6 3.2Z" />
        </svg>
      )
    default:
      return (
        <span className="text-xs font-bold" aria-hidden="true">
          {platform === "x" ? "X" : label.slice(0, 1).toUpperCase()}
        </span>
      )
  }
}

const isSafeImageUrl = (value: string) =>
  /^https:\/\//i.test(value) ||
  (value.startsWith("/") && !value.startsWith("//"))

export default async function Footer() {
  const footer = await retrieveFooterConfig()
  const palette = FOOTER_PALETTES[footer.theme] ?? FOOTER_PALETTES.navy
  const year = new Date().getFullYear()
  const logo = isSafeImageUrl(footer.logo_url.trim())
    ? footer.logo_url.trim()
    : ""
  const groups = footer.groups.filter(
    (group) =>
      group.title.trim() || group.links.some((link) => link.label.trim())
  )
  const socialLinks = footer.social_links.filter(
    (social) => social.label.trim() && social.href.trim()
  )
  const locations = footer.locations.filter(
    (location) => location.city.trim() || location.address.trim()
  )
  const legalLinks = footer.legal_links.filter((link) => link.label.trim())
  const cta = footer.cta as FooterLink

  return (
    <footer className={palette.footer}>
      <div className="content-container py-12 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_320px]">
          {groups.map((group, index) => (
            <FooterLinkColumn
              key={`${group.title}-${index}`}
              group={group}
              palette={palette}
            />
          ))}

          <div className="flex flex-col items-start gap-6 xl:items-center">
            <LocalizedClientLink
              href="/"
              className="inline-flex min-h-12 items-center"
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={footer.logo_alt || "Site logo"}
                  width={160}
                  height={64}
                  unoptimized
                  className="max-h-16 w-auto object-contain"
                />
              ) : (
                <BrandMark
                  alt={footer.logo_alt || "Site logo"}
                  variant={footer.theme === "light" ? "dark" : "light"}
                  className="scale-[0.92] origin-left xl:origin-center"
                />
              )}
            </LocalizedClientLink>

            {socialLinks.length ? (
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social, index) => (
                  <FooterAnchor
                    key={`${social.label}-${index}`}
                    href={social.href}
                    className={`inline-flex h-10 w-10 items-center justify-center border transition-colors duration-200 ${palette.social}`}
                  >
                    <span className="sr-only">{social.label}</span>
                    <SocialIcon
                      platform={social.platform}
                      label={social.label}
                    />
                  </FooterAnchor>
                ))}
              </div>
            ) : null}

            {cta.label.trim() ? (
              <FooterAnchor
                href={cta.href}
                className="inline-flex min-h-11 items-center justify-center bg-gradient-to-r from-[#f3c04f] to-[#e07b4c] px-5 text-[0.88rem] font-bold uppercase text-white shadow-[0_14px_30px_rgba(224,123,76,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {cta.label}
              </FooterAnchor>
            ) : null}
          </div>
        </div>

        {locations.length ? (
          <div className={`mt-12 border-t pt-10 ${palette.border}`}>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
              {locations.map((location, index) => (
                <div
                  key={`${location.city}-${index}`}
                  className="text-center xl:text-left"
                >
                  {location.city ? (
                    <h4
                      className={`text-sm font-bold uppercase ${palette.heading}`}
                    >
                      {location.city}
                    </h4>
                  ) : null}
                  {location.address ? (
                    <p
                      className={`mx-auto mt-4 max-w-[220px] whitespace-pre-line text-[0.92rem] leading-7 xl:mx-0 ${palette.address}`}
                    >
                      {location.address}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div
          className={`mt-12 flex flex-col items-center gap-4 border-t pt-8 text-center ${palette.border}`}
        >
          {footer.phone_label.trim() ? (
            <FooterAnchor
              href={footer.phone_href}
              className={`text-xl font-black transition-colors duration-200 ${palette.phone}`}
            >
              {footer.phone_label}
            </FooterAnchor>
          ) : null}
          <p className={`text-sm font-medium ${palette.copyright}`}>
            {footer.copyright_text.trim()
              ? `© ${year} ${footer.copyright_text}`
              : `© ${year}`}
          </p>
          {legalLinks.length ? (
            <div
              className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs ${palette.legal}`}
            >
              {legalLinks.map((link, index) => (
                <span key={`${link.label}-${index}`} className="contents">
                  {index ? (
                    <span
                      className={`h-1 w-1 ${palette.separator}`}
                      aria-hidden="true"
                    />
                  ) : null}
                  <FooterAnchor
                    href={link.href}
                    className="transition-colors duration-200 hover:opacity-70"
                  >
                    {link.label}
                  </FooterAnchor>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
