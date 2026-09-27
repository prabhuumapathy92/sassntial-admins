"use client"

import { useState, type FormEvent } from "react"

import { submitContactForm } from "@lib/data/contact-page"

type AiSeoLeadFormProps = {
  title: string
  description: string
  primaryLabel: string
  focusItems: string[]
  eyebrow?: string
  formIdPrefix?: string
}

const fieldClassName =
  "h-12 w-full border border-white/15 bg-white px-4 text-sm text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-[#f4bf4f]"

const LeadField = ({
  name,
  placeholder,
  type = "text",
  className = "",
  required = false,
}: {
  name: string
  placeholder: string
  type?: string
  className?: string
  required?: boolean
}) => {
  return (
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
        className={`${fieldClassName} ${className}`.trim()}
      />
    </>
  )
}

const AiSeoLeadForm = ({
  title,
  description,
  primaryLabel,
  focusItems,
  eyebrow = "AI SEO Proposal",
  formIdPrefix = "ai-seo",
}: AiSeoLeadFormProps) => {
  const highlightPhrase = "AI Search Results?"
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
      website: String(data.get("website") ?? ""),
      email: String(data.get("email") ?? ""),
      phone_number: String(data.get("phone") ?? ""),
      location: "",
      enquiry_type: eyebrow,
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

  const titleParts = title.includes(highlightPhrase)
    ? title.split(highlightPhrase)
    : null
  const focusCards = focusItems.slice(0, 4)
  const messageFieldId = `${formIdPrefix}-message`

  return (
    <section className="mx-auto">
      <article className="grid overflow-hidden bg-white shadow-[0_20px_44px_rgba(15,23,42,0.08)] medium:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="bg-[linear-gradient(180deg,#0f2942_0%,#153957_100%)] px-6 py-7 small:px-8 small:py-8">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <LeadField name="full_name" placeholder="Full Name *" required />

            <div className="grid gap-4 small:grid-cols-2">
              <LeadField name="company" placeholder="Company *" required />
              <LeadField
                name="website"
                type="url"
                placeholder="Website *"
                required
              />
            </div>

            <div className="grid gap-4 small:grid-cols-2">
              <LeadField
                name="email"
                type="email"
                placeholder="Email *"
                required
              />
              <LeadField
                name="phone"
                type="tel"
                placeholder="Phone *"
                required
              />
            </div>

            <div>
              <label htmlFor={messageFieldId} className="sr-only">
                Anything else we should know?
              </label>
              <textarea
                id={messageFieldId}
                name="message"
                rows={4}
                required
                placeholder="Anything else we should know?"
                className="min-h-[128px] w-full border border-white/15 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-[#f4bf4f]"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-200" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 items-center justify-center bg-[linear-gradient(135deg,#f4bf4f_0%,#ea7a3d_100%)] px-6 py-3 text-sm font-bold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {status === "sending" ? "Sending..." : primaryLabel}
              </button>
            </div>
          </form>
          {status === "sent" && (
            <p className="mt-4 text-sm font-semibold text-emerald-300" role="status">
              Thanks, your enquiry has been sent.
            </p>
          )}
        </div>

        <div className="bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] px-6 py-7 small:px-8 small:py-8">
          <div className="max-w-[32rem]">
            <p className="text-[11px] font-semibold uppercase text-[#0b78b5]">
              {eyebrow}
            </p>

            <div className="mt-5 text-[2.2rem] font-black leading-[0.96] text-slate-900 small:text-[2.75rem]">
              {titleParts ? (
                <>
                  <span className="block">{titleParts[0].trim()}</span>
                  <span className="mt-3 inline-block bg-[linear-gradient(135deg,#f4bf4f_0%,#ea7a3d_100%)] px-4 py-2 text-slate-950 shadow-[0_12px_24px_rgba(234,122,61,0.24)]">
                    {highlightPhrase}
                  </span>
                </>
              ) : (
                title
              )}
            </div>

            <p className="mt-5 max-w-[30rem] text-[15px] leading-7 text-slate-600">
              {description}
            </p>
          </div>

          <div className="mt-8 grid gap-3 small:grid-cols-2">
            {focusCards.map((item, index) => (
              <article
                key={item}
                className="border border-[#dce7f1] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                <p className="text-[11px] font-semibold uppercase text-[#0b78b5]">
                  Focus {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[1rem] font-bold leading-6 text-slate-900">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </div>
      </article>
    </section>
  )
}

export default AiSeoLeadForm
