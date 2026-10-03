import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export async function generateMetadata(): Promise<Metadata> {
  // Signed out, the layout shows the sign-in view at this URL instead.
  const customer = await retrieveCustomer().catch(() => null)

  return customer
    ? { title: "Account", description: "Overview of your account activity." }
    : {
        title: "Sign in",
        description:
          "Sign in to book training sessions, reach your recordings and track your orders.",
      }
}

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
