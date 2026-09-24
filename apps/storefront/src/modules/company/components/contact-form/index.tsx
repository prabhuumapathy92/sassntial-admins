"use client"

import { useState } from "react"

import { submitContactForm } from "@lib/data/contact-page"

const inputClassName =
  "h-12 w-full border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-sky-400"

const ContactField = ({
  name,
  placeholder,
  type = "text",
  required = false,
  className = "",
}: {
  name: string
  placeholder: string
  type?: string
  required?: boolean
  className?: string
}) => (
  <>
    <label htmlFor={name} className="sr-only">
      {placeholder}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className={`${inputClassName} ${className}`.trim()}
    />
  </>
)

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    setStatus("sending")
    setError(null)

    const result = await submitContactForm({
      full_name: String(data.get("full_name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone_number: String(data.get("phone_number") ?? ""),
      location: String(data.get("location") ?? ""),
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

  if (status === "sent") {
    return (
      <div
        className="mt-6 border border-emerald-200 bg-emerald-50 px-5 py-6"
        data-testid="contact-form-success"
        role="status"
      >
        <p className="text-sm font-semibold text-emerald-900">
          Thanks — your message is with us.
        </p>
        <p className="mt-2 text-sm leading-6 text-emerald-800">
          We&apos;ll come back to you at the address you gave us.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-emerald-900 underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      className="mt-6 grid gap-3 small:grid-cols-2"
      onSubmit={handleSubmit}
      data-testid="contact-form"
    >
      <ContactField name="full_name" placeholder="Full Name" required />
      <ContactField name="company" placeholder="Company" />
      <ContactField name="email" type="email" placeholder="Email" required />
      <ContactField name="phone_number" type="tel" placeholder="Phone number" />
      <ContactField
        name="location"
        placeholder="Location"
        className="small:col-span-2"
      />
      <div className="small:col-span-2">
        <label htmlFor="message" className="sr-only">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Your message"
          className="min-h-[148px] w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-sky-400"
        />
      </div>

      {error && (
        <p
          className="small:col-span-2 text-sm text-rose-600"
          role="alert"
          data-testid="contact-form-error"
        >
          {error}
        </p>
      )}

      <div className="small:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 items-center justify-center bg-brand-cta px-6 py-3 font-[family-name:var(--font-tech)] text-sm uppercase text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  )
}

export default ContactForm
