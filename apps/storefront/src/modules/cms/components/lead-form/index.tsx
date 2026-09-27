"use client"

import { useState, type FormEvent } from "react"

import { submitContactForm } from "@lib/data/contact-page"

const inputClassName =
  "h-12 border border-[#e3e3e3] px-4 text-[14px] outline-none"

/**
 * The form half of the page builder's "Lead form" block. It goes through the
 * same server action as every other enquiry form, so a submission is stored in
 * Contact submissions and triggers the admin email notification.
 */
const CmsLeadForm = ({
  enquiryType,
  submitLabel,
}: {
  enquiryType: string
  submitLabel: string
}) => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus("sending")
    setError(null)

    const result = await submitContactForm({
      full_name: String(data.get("full_name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone_number: "",
      location: "",
      enquiry_type: enquiryType,
      message: String(data.get("message") ?? ""),
    })

    if (result.success) {
      form.reset()
      setStatus("sent")
      return
    }

    setStatus("idle")
    setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="full_name"
        required
        placeholder="Full name"
        aria-label="Full name"
        className={inputClassName}
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        aria-label="Email"
        className={inputClassName}
      />
      <input
        name="company"
        placeholder="Company"
        aria-label="Company"
        className={inputClassName}
      />
      {/* The backend requires a message, so the field is required here too
          rather than letting the request fail after the visitor clicks send. */}
      <textarea
        name="message"
        rows={4}
        required
        placeholder="Anything else we should know?"
        aria-label="Message"
        className="border border-[#e3e3e3] px-4 py-3 text-[14px] outline-none"
      />
      {error ? (
        <p className="text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
      {status === "sent" ? (
        <p className="text-sm font-semibold text-emerald-700" role="status">
          Thanks, your enquiry has been sent.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 items-center justify-center bg-brand-cta px-5 text-sm font-semibold text-white disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : submitLabel}
      </button>
    </form>
  )
}

export default CmsLeadForm
