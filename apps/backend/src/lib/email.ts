import nodemailer from "nodemailer"
import { MedusaError } from "@medusajs/framework/utils"

import type {
  ContactSubmissionRecord,
  EmailDeliverySettings,
} from "../modules/contact-page/service"

export const escapeHtml = (value: string | null | undefined) =>
  (value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entities[character]
  })

/**
 * Port 465 only speaks implicit TLS and 587/25 only upgrade via STARTTLS, so
 * the checkbox is ignored on those ports: a mismatch never errors cleanly, it
 * just stalls until the greeting timeout. Other ports follow the setting.
 */
const resolveSecure = (port: number, secure: boolean) => {
  if (port === 465) {
    return true
  }

  if (port === 587 || port === 25) {
    return false
  }

  return secure
}

const isGmailHost = (host: string) =>
  /(^|\.)(gmail|googlemail)\.com$/i.test(host.trim())

/**
 * Google displays App Passwords in four space-separated groups, and pasting
 * them verbatim is the most common way they end up stored with spaces. They
 * never contain real spaces, so stripping them for Gmail is always safe.
 */
const resolvePassword = (host: string, password: string) =>
  isGmailHost(host) ? password.replace(/\s+/g, "") : password

type SmtpError = Error & {
  code?: string
  responseCode?: number
  response?: string
}

/**
 * Nodemailer throws plain Errors, which Medusa's error handler replaces with
 * "An unknown error occurred." Re-throwing as a MedusaError keeps the reason
 * visible in the admin's test toast, and the wording tells the admin what to
 * change instead of echoing a raw SMTP transcript.
 */
const toDeliveryError = (error: unknown, settings: EmailDeliverySettings) => {
  const smtpError = error as SmtpError
  const detail = smtpError.response || smtpError.message || "Unknown SMTP error"
  const server = `${settings.smtp_host}:${settings.smtp_port}`
  let message: string

  switch (smtpError.code) {
    case "EAUTH":
      message = isGmailHost(settings.smtp_host)
        ? `Gmail rejected the SMTP username or password. Gmail does not accept your normal account password here: turn on 2-Step Verification for the Google account, create an App Password at https://myaccount.google.com/apppasswords, and paste that 16-letter password into SMTP password. (${detail})`
        : `The SMTP server rejected the username or password. (${detail})`
      break
    case "ECONNECTION":
    case "ESOCKET":
    case "ETIMEDOUT":
    case "EDNS":
    case "ECONNREFUSED":
      message = `Could not connect to ${server}. Check the host, the port, and the SSL/TLS setting, and that this server allows outbound SMTP connections. (${detail})`
      break
    case "EENVELOPE":
      message = `The SMTP server refused the sender or recipient address. (${detail})`
      break
    default:
      message = `The email could not be sent through ${server}. (${detail})`
  }

  return new MedusaError(MedusaError.Types.UNEXPECTED_STATE, message)
}

/**
 * Sends through the SMTP mailbox configured in Admin > Email settings. Without
 * `to` the message is an admin notification: it goes to the configured
 * recipients and carries the subject prefix. With `to` it is customer-facing,
 * so it goes only to that address and the internal prefix is left off.
 */
export const sendConfiguredEmail = async (
  settings: EmailDeliverySettings,
  email: {
    subject: string
    text: string
    html: string
    reply_to?: string
    to?: string
  }
) => {
  const recipients = email.to ? [email.to] : settings.to_emails
  const prefix = email.to ? "" : settings.subject_prefix

  if (
    !settings.enabled ||
    !settings.smtp_host ||
    !settings.from_email ||
    !recipients.length
  ) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Enable email notifications and provide an SMTP host, sender address, and recipient"
    )
  }

  const secure = resolveSecure(settings.smtp_port, settings.smtp_secure)
  const transporter = nodemailer.createTransport({
    host: settings.smtp_host,
    port: settings.smtp_port,
    secure,
    requireTLS: !secure && settings.smtp_require_tls,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: settings.smtp_username
      ? {
          user: settings.smtp_username,
          pass: resolvePassword(settings.smtp_host, settings.smtp_password),
        }
      : undefined,
  })

  const from = settings.from_name
    ? `${settings.from_name} <${settings.from_email}>`
    : settings.from_email

  try {
    return await transporter.sendMail({
      from,
      to: recipients,
      replyTo: email.reply_to,
      subject: `${prefix ? `${prefix} ` : ""}${email.subject}`,
      text: email.text,
      html: email.html,
    })
  } catch (error) {
    throw toDeliveryError(error, settings)
  }
}

export const sendContactSubmissionNotification = async (
  settings: EmailDeliverySettings,
  submission: ContactSubmissionRecord
) => {
  const fields: Array<[string, string | null | undefined]> = [
    ["Name", submission.full_name],
    ["Company", submission.company],
    ["Website", submission.website],
    ["Email", submission.email],
    ["Phone", submission.phone_number],
    ["Location", submission.location],
    ["Enquiry type", submission.enquiry_type],
    ["Message", submission.message],
  ]
  const visibleFields = fields.filter(([, value]) => value?.trim())
  const text = visibleFields.map(([label, value]) => `${label}: ${value}`).join("\n\n")
  const html = visibleFields
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 16px"><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value)}</p>`
    )
    .join("")

  return sendConfiguredEmail(settings, {
    subject: submission.enquiry_type?.trim()
      ? `New ${submission.enquiry_type.trim()} enquiry from ${submission.full_name}`
      : `New contact enquiry from ${submission.full_name}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.5">${html}</div>`,
    reply_to: settings.reply_to_submitter ? submission.email : undefined,
  })
}

export const sendEmailSettingsTest = (settings: EmailDeliverySettings) =>
  sendConfiguredEmail(settings, {
    subject: "Email settings test",
    text: "This test message confirms that your email settings can send mail for contact enquiries and orders.",
    html: "<p>This test message confirms that your email settings can send mail for contact enquiries and orders.</p>",
  })
