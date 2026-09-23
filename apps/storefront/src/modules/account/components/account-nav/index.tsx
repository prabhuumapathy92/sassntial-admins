"use client"

import { ArrowRightOnRectangle } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import React from "react"

import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import User from "@modules/common/icons/user"

const GaugeIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden>
    <path
      d="M4 19a8 8 0 1 1 16 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="m12 14 4-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

const NAV_ITEMS = [
  { href: "/account", label: "Overview", icon: GaugeIcon, testId: "overview-link" },
  { href: "/account/profile", label: "Profile", icon: User, testId: "profile-link" },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
    testId: "addresses-link",
  },
  { href: "/account/orders", label: "Orders", icon: Package, testId: "orders-link" },
]

/**
 * One list for every breakpoint. The previous version kept separate mobile and
 * desktop trees, and the mobile one replaced the page content with a menu, so
 * the overview was unreachable on a phone.
 */
const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const currentPath = route?.split(countryCode)[1]

  return (
    <nav className="flex flex-col py-3" data-testid="account-nav">
      <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-wider text-brand-slate">
        Hello {customer?.first_name || "there"}
      </p>

      <ul className="flex flex-col">
        {NAV_ITEMS.map(({ href, label, icon: Icon, testId }) => {
          const active = currentPath === href

          return (
            <li key={href}>
              <LocalizedClientLink
                href={href}
                data-testid={testId}
                aria-current={active ? "page" : undefined}
                className={clx(
                  "flex items-center gap-x-2.5 border-l-2 px-4 py-2.5 text-[13px] transition-colors",
                  active
                    ? "border-brand-ember bg-white font-semibold text-brand-navy"
                    : "border-transparent text-slate-600 hover:bg-white/60 hover:text-brand-navy"
                )}
              >
                <Icon size={18} />
                <span>{label}</span>
              </LocalizedClientLink>
            </li>
          )
        })}

        <li className="mt-1 border-t border-brand-line pt-1">
          <button
            type="button"
            onClick={handleLogout}
            data-testid="logout-button"
            className="flex w-full items-center gap-x-2.5 border-l-2 border-transparent px-4 py-2.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-white/60 hover:text-brand-navy"
          >
            <ArrowRightOnRectangle />
            <span>Log out</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default AccountNav
