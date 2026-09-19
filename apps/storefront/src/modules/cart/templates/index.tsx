import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-2">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="mx-auto grid max-w-[1380px] gap-6 medium:grid-cols-[minmax(0,1fr)_360px] large:grid-cols-[minmax(0,1fr)_390px] large:gap-8">
            <div className="space-y-5">
              {!customer && <SignInPrompt />}
              <div className="overflow-hidden border border-slate-200/80 bg-white p-5 small:p-7">
                <ItemsTemplate cart={cart} />
              </div>
            </div>

            <div className="min-w-0">
              <div className="sticky top-24">
                {cart && cart.region && <Summary cart={cart as any} />}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[920px]">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
