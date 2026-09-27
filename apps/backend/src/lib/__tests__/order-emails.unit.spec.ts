import nodemailer from "nodemailer"

import type { EmailDeliverySettings } from "../../modules/contact-page/service"
import {
  sendNewOrderAdminEmail,
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from "../order-emails"

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: { createTransport: jest.fn() },
}))

const sendMail = jest.fn()

const settings: EmailDeliverySettings = {
  enabled: true,
  smtp_host: "smtp.example.com",
  smtp_port: 587,
  smtp_secure: false,
  smtp_require_tls: true,
  smtp_username: "store@example.com",
  smtp_password: "secret",
  from_name: "Store",
  from_email: "store@example.com",
  to_emails: ["owner@example.com", "sales@example.com"],
  reply_to_submitter: true,
  subject_prefix: "[Website]",
}

// Totals arrive as BigNumber-like objects straight from Query.
const amount = (value: number) => ({ valueOf: () => value })

const order: OrderEmailData = {
  id: "order_123",
  display_id: 42,
  email: "shopper@example.com",
  currency_code: "eur",
  total: amount(55),
  subtotal: amount(50),
  shipping_total: amount(5),
  tax_total: amount(0),
  discount_total: amount(0),
  items: [
    {
      title: "Tee",
      product_title: "Tee",
      variant_title: "M / Black",
      quantity: 2,
      unit_price: 25,
      total: amount(50),
    },
  ],
  shipping_address: {
    first_name: "Asha",
    last_name: "<Rao>",
    address_1: "1 Main St",
    city: "Berlin",
    postal_code: "10115",
    country_code: "de",
  },
  shipping_methods: [{ name: "Standard" }],
}

describe("order emails", () => {
  beforeEach(() => {
    sendMail.mockReset().mockResolvedValue({ messageId: "id" })
    ;(nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail })
  })

  it("sends the confirmation only to the shopper, without the admin prefix", async () => {
    await sendOrderConfirmationEmail(settings, order)

    const mail = sendMail.mock.calls[0][0]
    expect(mail.to).toEqual(["shopper@example.com"])
    expect(mail.subject).toBe("Your order #42 is confirmed")
    expect(mail.html).toContain("€50.00")
    expect(mail.html).toContain("€55.00")
    expect(mail.html).toContain("M / Black")
    expect(mail.html).toContain("/de/order/order_123/confirmed")
    expect(mail.text).toContain("Total: €55.00")
  })

  it("alerts the admin recipients with the prefix and a reply-to", async () => {
    await sendNewOrderAdminEmail(settings, order)

    const mail = sendMail.mock.calls[0][0]
    expect(mail.to).toEqual(["owner@example.com", "sales@example.com"])
    expect(mail.subject).toBe("[Website] New order #42 from Asha <Rao> - €55.00")
    expect(mail.replyTo).toBe("shopper@example.com")
    expect(mail.html).toContain("/app/orders/order_123")
    // Customer-supplied text is escaped in the HTML body.
    expect(mail.html).toContain("Asha &lt;Rao&gt;")
    expect(mail.html).not.toContain("<Rao>")
  })

  it("refuses to send a confirmation for an order without an email", async () => {
    await expect(
      sendOrderConfirmationEmail(settings, { ...order, email: null })
    ).rejects.toThrow("has no customer email address")
    expect(sendMail).not.toHaveBeenCalled()
  })

  it("reports SMTP failures with a readable reason", async () => {
    sendMail.mockRejectedValue(
      Object.assign(new Error("Invalid login"), {
        code: "EAUTH",
        response: "535 5.7.8 Username and Password not accepted",
      })
    )

    await expect(sendNewOrderAdminEmail(settings, order)).rejects.toThrow(
      "rejected the username or password"
    )
  })
})
