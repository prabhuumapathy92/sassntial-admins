import { User } from "@medusajs/icons"
import { retrieveCustomer } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type AccountButtonProps = {
  className?: string
}

export default async function AccountButton({
  className,
}: AccountButtonProps = {}) {
  const customer = await retrieveCustomer().catch(() => null)
  const ariaLabel = customer
    ? `Account for ${customer.first_name || customer.email || "customer"}`
    : "Sign in"

  return (
    <LocalizedClientLink
      href="/account"
      className={className}
      aria-label={ariaLabel}
      data-testid="nav-account-link"
    >
      <User className="h-5 w-5" />
    </LocalizedClientLink>
  )
}
