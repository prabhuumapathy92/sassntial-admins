import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout(props: {
  params: Promise<{ countryCode: string }>
}) {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Checkout needs an account. Signed-out visitors go back to the cart, which
  // opens the sign-in popup and returns here once they are in.
  if (!customer) {
    const { countryCode } = await props.params
    redirect(`/${countryCode}/cart?sign_in=1`)
  }

  return (
    <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#eef4ff_100%)]">
      <div className="content-container py-8 small:py-10">
        <div className="grid grid-cols-1 gap-8 medium:grid-cols-[minmax(0,1fr)_390px] large:grid-cols-[minmax(0,1fr)_420px] large:gap-10">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
