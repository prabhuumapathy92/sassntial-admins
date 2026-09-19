import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

type CartButtonProps = {
  linkClassName?: string
  panelClassName?: string
  iconOnly?: boolean
}

export default async function CartButton({
  linkClassName,
  panelClassName,
  iconOnly = false,
}: CartButtonProps = {}) {
  const cart = await retrieveCart().catch(() => null)

  return (
    <CartDropdown
      cart={cart}
      linkClassName={linkClassName}
      panelClassName={panelClassName}
      iconOnly={iconOnly}
    />
  )
}
