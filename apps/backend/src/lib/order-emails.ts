import { MedusaError } from "@medusajs/framework/utils"

import type { EmailDeliverySettings } from "../modules/contact-page/service"
import { escapeHtml, sendConfiguredEmail } from "./email"
import { storefrontUrl } from "./preview"

/**
 * Query returns totals as BigNumber instances, and they become plain numbers
 * once a step output is serialized, so amounts are accepted in either shape.
 */
type Amount = number | string | { valueOf(): number } | null | undefined

type OrderEmailAddress = {
  first_name?: string | null
  last_name?: string | null
  company?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
  phone?: string | null
}

export type OrderEmailData = {
  id: string
  display_id?: number | null
  email?: string | null
  currency_code: string
  total?: Amount
  subtotal?: Amount
  shipping_total?: Amount
  tax_total?: Amount
  discount_total?: Amount
  items?: Array<{
    title?: string | null
    product_title?: string | null
    variant_title?: string | null
    quantity?: Amount
    unit_price?: Amount
    total?: Amount
  } | null> | null
  shipping_address?: OrderEmailAddress | null
  shipping_methods?: Array<{ name?: string | null } | null> | null
}

const toAmount = (value: Amount) => {
  const amount = Number(value ?? 0)

  return Number.isFinite(amount) ? amount : 0
}

const formatMoney = (value: Amount, currencyCode: string) => {
  const amount = toAmount(value)

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currencyCode.toUpperCase()}`
  }
}

const orderLabel = (order: OrderEmailData) =>
  order.display_id ? `#${order.display_id}` : order.id

const customerName = (order: OrderEmailData) =>
  [order.shipping_address?.first_name, order.shipping_address?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()

const addressLines = (address?: OrderEmailAddress | null) =>
  address
    ? [
        [address.first_name, address.last_name].filter(Boolean).join(" "),
        address.company,
        address.address_1,
        address.address_2,
        [address.postal_code, address.city].filter(Boolean).join(" "),
        address.province,
        address.country_code?.toUpperCase(),
        address.phone,
      ].filter((line): line is string => Boolean(line?.trim()))
    : []

const lineItems = (order: OrderEmailData) =>
  (order.items ?? [])
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((item) => {
      const name = item.product_title || item.title || "Item"
      const variant =
        item.variant_title && item.variant_title !== name
          ? item.variant_title
          : null
      const quantity = toAmount(item.quantity)
      // Item totals are only decorated when the order query asks for totals;
      // fall back to price x quantity rather than printing a zero.
      const total =
        item.total !== null && item.total !== undefined
          ? item.total
          : toAmount(item.unit_price) * quantity

      return { name, variant, quantity, total }
    })

const totalRows = (order: OrderEmailData) => {
  const rows: Array<[string, Amount]> = [
    ["Subtotal", order.subtotal],
    ["Shipping", order.shipping_total],
  ]

  if (toAmount(order.discount_total) > 0) {
    rows.push(["Discount", -toAmount(order.discount_total)])
  }

  if (toAmount(order.tax_total) > 0) {
    rows.push(["Tax", order.tax_total])
  }

  return rows
}

const shippingMethod = (order: OrderEmailData) =>
  (order.shipping_methods ?? [])
    .map((method) => method?.name)
    .filter(Boolean)
    .join(", ")

const backendUrl = () =>
  (
    process.env.MEDUSA_BACKEND_URL ??
    `http://localhost:${process.env.PORT || 9000}`
  ).replace(/\/+$/, "")

const orderPageUrl = (order: OrderEmailData) => {
  const base = storefrontUrl()

  if (!base) {
    return null
  }

  const countryCode = order.shipping_address?.country_code?.toLowerCase()

  return `${base}${countryCode ? `/${countryCode}` : ""}/order/${order.id}/confirmed`
}

const renderItemsHtml = (order: OrderEmailData) => {
  const rows = lineItems(order)
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e9f0;font-size:14px;color:#0f172a">
          <strong>${escapeHtml(item.name)}</strong>${item.variant ? `<br><span style="color:#64748b;font-size:13px">${escapeHtml(item.variant)}</span>` : ""}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e9f0;font-size:14px;color:#475569;text-align:center;white-space:nowrap">x ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e9f0;font-size:14px;color:#0f172a;text-align:right;white-space:nowrap">${escapeHtml(formatMoney(item.total, order.currency_code))}</td>
      </tr>`
    )
    .join("")

  const totals = totalRows(order)
    .map(
      ([label, value]) => `<tr>
        <td colspan="2" style="padding:6px 0;font-size:14px;color:#475569">${escapeHtml(label)}</td>
        <td style="padding:6px 0;font-size:14px;color:#0f172a;text-align:right;white-space:nowrap">${escapeHtml(formatMoney(value, order.currency_code))}</td>
      </tr>`
    )
    .join("")

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows}
    ${totals}
    <tr>
      <td colspan="2" style="padding:12px 0 0;font-size:16px;font-weight:bold;color:#0f172a;border-top:2px solid #0f172a">Total</td>
      <td style="padding:12px 0 0;font-size:16px;font-weight:bold;color:#0f172a;text-align:right;white-space:nowrap;border-top:2px solid #0f172a">${escapeHtml(formatMoney(order.total, order.currency_code))}</td>
    </tr>
  </table>`
}

const renderDetailsHtml = (details: Array<[string, string[]]>) =>
  details
    .filter(([, lines]) => lines.length)
    .map(
      ([label, lines]) => `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#0f172a">
        <strong>${escapeHtml(label)}</strong><br>${lines.map(escapeHtml).join("<br>")}
      </p>`
    )
    .join("")

const renderEmailHtml = ({
  heading,
  intro,
  order,
  details,
  action,
  footer,
}: {
  heading: string
  intro: string
  order: OrderEmailData
  details: Array<[string, string[]]>
  action: { label: string; url: string } | null
  footer?: string
}) => `<div style="background:#f4f6f8;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e9f0">
    <tr><td style="padding:28px 28px 4px">
      <h1 style="margin:0 0 10px;font-size:22px;line-height:1.3;color:#0f172a">${escapeHtml(heading)}</h1>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#475569">${escapeHtml(intro)}</p>
    </td></tr>
    <tr><td style="padding:20px 28px">${renderItemsHtml(order)}</td></tr>
    <tr><td style="padding:4px 28px 8px">${renderDetailsHtml(details)}</td></tr>
    ${action ? `<tr><td style="padding:0 28px 28px"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#0f2942;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;padding:12px 20px">${escapeHtml(action.label)}</a></td></tr>` : ""}
    ${footer ? `<tr><td style="padding:16px 28px 24px;border-top:1px solid #e5e9f0;font-size:12px;line-height:1.6;color:#64748b">${escapeHtml(footer)}</td></tr>` : ""}
  </table>
</div>`

const renderEmailText = ({
  heading,
  intro,
  order,
  details,
  action,
  footer,
}: Parameters<typeof renderEmailHtml>[0]) =>
  [
    heading,
    intro,
    lineItems(order)
      .map(
        (item) =>
          `${item.name}${item.variant ? ` (${item.variant})` : ""} x ${item.quantity}: ${formatMoney(item.total, order.currency_code)}`
      )
      .join("\n"),
    [
      ...totalRows(order).map(
        ([label, value]) => `${label}: ${formatMoney(value, order.currency_code)}`
      ),
      `Total: ${formatMoney(order.total, order.currency_code)}`,
    ].join("\n"),
    ...details
      .filter(([, lines]) => lines.length)
      .map(([label, lines]) => `${label}:\n${lines.join("\n")}`),
    action ? `${action.label}: ${action.url}` : "",
    footer ?? "",
  ]
    .filter(Boolean)
    .join("\n\n")

/**
 * Confirmation sent to the shopper who placed the order. Async so every
 * failure, including the missing-address check, surfaces as a rejection that
 * the caller's Promise.allSettled can isolate from the admin alert.
 */
export const sendOrderConfirmationEmail = async (
  settings: EmailDeliverySettings,
  order: OrderEmailData
) => {
  const label = orderLabel(order)

  // Without an address, `to` would be empty and sendConfiguredEmail would fall
  // back to the admin recipients - the shopper's receipt must never go there.
  if (!order.email) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Order ${label} has no customer email address`
    )
  }

  const name = order.shipping_address?.first_name?.trim()
  const pageUrl = orderPageUrl(order)
  const content = {
    heading: "Thank you for your order",
    intro: `Hi ${name || "there"}, we have received your order ${label} and it is now being processed. Here is a summary for your records.`,
    order,
    details: [
      ["Order number", [label]],
      ["Shipping address", addressLines(order.shipping_address)],
      ["Delivery method", shippingMethod(order) ? [shippingMethod(order)] : []],
    ] as Array<[string, string[]]>,
    action: pageUrl ? { label: "View your order", url: pageUrl } : null,
    footer: "Questions about your order? Just reply to this email.",
  }

  return sendConfiguredEmail(settings, {
    to: order.email,
    subject: `Your order ${label} is confirmed`,
    text: renderEmailText(content),
    html: renderEmailHtml(content),
  })
}

/** Alert sent to the store's configured admin recipients. */
export const sendNewOrderAdminEmail = async (
  settings: EmailDeliverySettings,
  order: OrderEmailData
) => {
  const label = orderLabel(order)
  const name = customerName(order) || order.email || "A customer"
  const total = formatMoney(order.total, order.currency_code)
  const content = {
    heading: `New order ${label}`,
    intro: `${name}${order.email && name !== order.email ? ` (${order.email})` : ""} placed an order for ${total}.`,
    order,
    details: [
      ["Customer", [customerName(order), order.email ?? "", order.shipping_address?.phone ?? ""].filter(Boolean)],
      ["Shipping address", addressLines(order.shipping_address)],
      ["Delivery method", shippingMethod(order) ? [shippingMethod(order)] : []],
    ] as Array<[string, string[]]>,
    action: {
      label: "Open in Medusa Admin",
      url: `${backendUrl()}/app/orders/${order.id}`,
    },
  }

  return sendConfiguredEmail(settings, {
    subject: `New order ${label} from ${name} - ${total}`,
    text: renderEmailText(content),
    html: renderEmailHtml(content),
    // Replying to the alert reaches the shopper directly.
    reply_to: order.email ?? undefined,
  })
}
