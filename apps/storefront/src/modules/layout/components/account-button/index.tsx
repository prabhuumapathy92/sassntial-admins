import { User } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type AccountButtonProps = {
  className?: string
  /** First name of the signed-in customer; omitted when signed out. */
  customerName?: string | null
}

export default function AccountButton({
  className,
  customerName,
}: AccountButtonProps = {}) {
  return (
    <LocalizedClientLink
      href="/account"
      // Signed in, the icon widens into a chip that carries the first name.
      className={clx(
        className,
        customerName && "w-auto max-w-[200px] gap-2 px-3"
      )}
      aria-label={customerName ? `Account for ${customerName}` : "Sign in"}
      data-testid="nav-account-link"
    >
      <User className="h-5 w-5 shrink-0" />
      {customerName ? (
        <span
          className="truncate text-sm font-semibold"
          data-testid="nav-account-name"
        >
          {customerName}
        </span>
      ) : null}
    </LocalizedClientLink>
  )
}
