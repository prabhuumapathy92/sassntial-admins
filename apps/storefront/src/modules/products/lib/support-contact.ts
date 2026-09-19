/**
 * Booking support details shown on the webinar sidebar. Override per
 * environment with NEXT_PUBLIC_SUPPORT_* so nothing is hard-coded per product.
 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@ignitevisibility.com"

export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE || "(619) 752-1955"

export const SUPPORT_PHONE_HREF = `tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`

export const REFUND_POLICY_URL =
  process.env.NEXT_PUBLIC_REFUND_POLICY_URL || "/company/refund-policy"
