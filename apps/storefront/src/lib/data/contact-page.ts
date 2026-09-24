"use server"

import { sdk } from "@lib/config"

import { getCacheOptions } from "./cookies"

export type ContactPageSettings = {
  intro: string | null
  general_inquiries_email: string | null
  support_line: string | null
  availability: string | null
  focus_items: string[]
  form_eyebrow: string | null
  form_heading: string | null
  form_description: string | null
}

/**
 * Content authored in the admin under "Contact page". Returns null when the
 * backend cannot be reached or has not been migrated yet, so the page falls
 * back to its built-in copy instead of failing to render.
 */
export const retrieveContactPage =
  async (): Promise<ContactPageSettings | null> => {
    const next = {
      ...(await getCacheOptions("contact-page")),
    }

    return sdk.client
      .fetch<{ contact_page: ContactPageSettings }>("/store/contact-page", {
        method: "GET",
        next,
      })
      .then(({ contact_page }) => contact_page)
      .catch(() => null)
  }

export type ContactFormInput = {
  full_name: string
  company: string
  email: string
  phone_number: string
  location: string
  message: string
}

export type ContactFormResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Posts an enquiry to the backend. Runs as a server action so the publishable
 * key and backend URL stay server-side, and so the browser never talks to the
 * Medusa API directly from the contact page.
 */
export const submitContactForm = async (
  input: ContactFormInput
): Promise<ContactFormResult> => {
  try {
    await sdk.client.fetch("/store/contact-submissions", {
      method: "POST",
      body: input,
    })

    return { success: true }
  } catch (error) {
    // The Medusa client throws FetchError for non-2xx; anything else is a
    // network failure. Either way the visitor gets one actionable sentence.
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Something went wrong."

    return {
      success: false,
      error: `We could not send your message. ${message}`,
    }
  }
}
