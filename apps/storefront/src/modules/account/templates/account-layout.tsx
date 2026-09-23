import { HttpTypes } from "@medusajs/types"
import React from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  /**
   * Signed out, the only child is the sign-in / register view, which brings its
   * own full-width layout. Wrapping it in the dashboard shell left an empty
   * 240px nav column beside it and a "Got questions?" block underneath.
   */
  if (!customer) {
    return <div data-testid="account-page">{children}</div>
  }

  return (
    <div
      className="min-h-screen bg-brand-haze py-4 sm:py-6"
      data-testid="account-page"
    >
      <div className="content-container px-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#102735] px-4 py-2.5 sm:px-5">
          <h1 className="text-[15px] font-semibold text-white sm:text-[16px]">
            My account
          </h1>
          {/* The one place the signed-in address is shown, so the pages inside
              do not each repeat it. */}
          <p className="text-[12px] text-white/70">
            Signed in as{" "}
            <span
              className="font-semibold text-white"
              data-testid="customer-email"
              data-value={customer.email}
            >
              {customer.email}
            </span>
          </p>
        </div>

        <div className="grid border border-t-0 border-brand-line bg-white lg:grid-cols-[232px_minmax(0,1fr)]">
          <div className="border-b border-brand-line bg-brand-mist lg:border-b-0 lg:border-r">
            <AccountNav customer={customer} />
          </div>
          <div className="min-w-0 px-4 py-6 sm:px-6 sm:py-7">{children}</div>
        </div>

        <div className="mt-4 flex flex-col gap-4 border border-brand-line bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold text-brand-navy">
              Got questions?
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-slate-600">
              We can help with bookings, invoices and access to your recordings.
            </p>
          </div>
          <LocalizedClientLink
            href="/company/contact-us"
            className="inline-flex min-h-10 shrink-0 items-center justify-center border border-brand-line px-5 text-[13px] font-semibold text-brand-navy transition-colors hover:border-brand-slate hover:text-brand-slate"
          >
            Contact us
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
