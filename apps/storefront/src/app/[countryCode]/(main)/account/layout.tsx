import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import LoginTemplate from "@modules/account/templates/login-template"

/**
 * Signed out, every account URL shows the sign-in / register view; signed in,
 * it shows the requested account page. This used to be done with `@dashboard`
 * and `@login` parallel-route slots, but the production build emitted no client
 * manifest for slot pages and every account URL returned a 500.
 */
export default async function AccountPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <AccountLayout customer={customer}>
      {customer ? children : <LoginTemplate />}
      <Toaster />
    </AccountLayout>
  )
}
