"use client"

import React from "react"
import { useFormStatus } from "react-dom"

import Spinner from "@modules/common/icons/spinner"

type AuthSubmitButtonProps = {
  children: React.ReactNode
  "data-testid"?: string
}

/**
 * Uses the shared `bg-brand-cta` fill so signing in matches the header's primary
 * call to action. The checkout `SubmitButton` renders a @medusajs/ui `Button`,
 * which is themed for the admin palette and shows up unstyled here.
 */
const AuthSubmitButton = ({
  children,
  "data-testid": dataTestId,
}: AuthSubmitButtonProps) => {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      data-testid={dataTestId}
      className="inline-flex min-h-12 w-full items-center justify-center gap-x-2 bg-brand-cta px-6 text-[14px] font-bold text-white shadow-[0_16px_32px_rgba(217,115,72,0.22)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending && <Spinner size="16" />}
      {children}
    </button>
  )
}

export default AuthSubmitButton
