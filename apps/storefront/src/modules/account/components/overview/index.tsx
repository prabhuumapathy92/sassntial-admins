import { HttpTypes } from "@medusajs/types"
import React from "react"

import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const SectionHeading = ({
  children,
  action,
}: {
  children: React.ReactNode
  action?: React.ReactNode
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-line bg-brand-mist px-4 py-2.5">
    <h2 className="text-[14px] font-semibold text-brand-navy">{children}</h2>
    {action}
  </div>
)

const StatCard = ({
  label,
  value,
  caption,
  children,
  href,
  linkLabel,
}: {
  label: string
  value: React.ReactNode
  caption: string
  children?: React.ReactNode
  href: string
  linkLabel: string
}) => (
  <div className="flex flex-col justify-between gap-4 border border-brand-line p-4">
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-slate">
        {label}
      </p>
      <p className="mt-2 flex items-end gap-x-2">
        <span className="text-[30px] font-semibold leading-none text-brand-navy">
          {value}
        </span>
        <span className="pb-0.5 text-[12px] uppercase tracking-wide text-slate-500">
          {caption}
        </span>
      </p>
      {children}
    </div>
    <LocalizedClientLink
      href={href}
      className="text-[13px] font-semibold text-brand-slate underline underline-offset-2 transition-colors hover:text-brand-navy"
    >
      {linkLabel}
    </LocalizedClientLink>
  </div>
)

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)
  const addressCount = customer?.addresses?.length || 0
  const recentOrders = orders?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-y-6" data-testid="overview-page-wrapper">
      <div>
        <h2
          className="text-[20px] font-semibold text-brand-navy"
          data-testid="welcome-message"
          data-value={customer?.first_name}
        >
          Hello {customer?.first_name}
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-slate-600">
          Track your bookings, keep your details current and pick up where you
          left off.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Profile"
          value={
            <span
              data-testid="customer-profile-completion"
              data-value={completion}
            >
              {completion}%
            </span>
          }
          caption="Completed"
          href="/account/profile"
          linkLabel={completion === 100 ? "View profile" : "Complete profile"}
        >
          <div
            className="mt-3 h-1.5 w-full overflow-hidden bg-brand-mist"
            role="progressbar"
            aria-valuenow={completion}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className="h-full bg-brand-cta transition-[width] duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </StatCard>

        <StatCard
          label="Addresses"
          value={
            <span data-testid="addresses-count" data-value={addressCount}>
              {addressCount}
            </span>
          }
          caption="Saved"
          href="/account/addresses"
          linkLabel={addressCount ? "Manage addresses" : "Add an address"}
        />
      </div>

      <section className="border border-brand-line">
        <SectionHeading
          action={
            recentOrders.length ? (
              <LocalizedClientLink
                href="/account/orders"
                className="text-[13px] font-semibold text-brand-slate underline underline-offset-2 transition-colors hover:text-brand-navy"
              >
                View all
              </LocalizedClientLink>
            ) : undefined
          }
        >
          Recent orders
        </SectionHeading>

        <ul className="divide-y divide-brand-line" data-testid="orders-wrapper">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <li key={order.id} data-testid="order-wrapper" data-value={order.id}>
                <LocalizedClientLink
                  href={`/account/orders/details/${order.id}`}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-brand-haze"
                  data-testid="open-order-button"
                >
                  <div className="grid min-w-0 flex-1 gap-x-4 gap-y-1 sm:grid-cols-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Date placed
                      </p>
                      <p
                        className="text-[13px] text-brand-ink"
                        data-testid="order-created-date"
                      >
                        {new Date(order.created_at).toDateString()}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Order number
                      </p>
                      <p
                        className="text-[13px] text-brand-ink"
                        data-testid="order-id"
                        data-value={order.display_id}
                      >
                        #{order.display_id}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Total amount
                      </p>
                      <p
                        className="text-[13px] font-semibold text-brand-navy"
                        data-testid="order-amount"
                      >
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="sr-only">
                    Go to order #{order.display_id}
                  </span>
                  <ChevronDown className="-rotate-90 shrink-0 text-brand-slate" />
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li className="flex flex-col items-start gap-3 px-4 py-8">
              <p
                className="text-[13px] text-slate-600"
                data-testid="no-orders-message"
              >
                No recent orders. Your bookings will show up here once you
                complete a purchase.
              </p>
              <LocalizedClientLink
                href="/training"
                className="inline-flex min-h-10 items-center justify-center bg-brand-cta px-5 text-[13px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                Browse training
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
