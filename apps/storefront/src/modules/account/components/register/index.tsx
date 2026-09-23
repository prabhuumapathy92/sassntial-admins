"use client"

import { useActionState } from "react"

import { signup } from "@lib/data/customer"
import AuthField from "@modules/account/components/auth-field"
import AuthSubmitButton from "@modules/account/components/auth-submit-button"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full" data-testid="register-page">
      <h1 className="text-[22px] font-semibold text-brand-navy">
        Create your account
      </h1>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">
        One account for booking sessions, reaching recordings and tracking
        orders.
      </p>

      <form className="mt-7 flex flex-col gap-y-4" action={formAction}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            label="First name"
            name="first_name"
            placeholder="Jane"
            autoComplete="given-name"
            required
            data-testid="first-name-input"
          />
          <AuthField
            label="Last name"
            name="last_name"
            placeholder="Doe"
            autoComplete="family-name"
            required
            data-testid="last-name-input"
          />
        </div>

        <AuthField
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          data-testid="email-input"
        />
        <AuthField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Optional"
          autoComplete="tel"
          data-testid="phone-input"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          placeholder="Choose a password"
          autoComplete="new-password"
          required
          hint="Use at least 8 characters."
          data-testid="password-input"
        />

        <ErrorMessage error={message} data-testid="register-error" />

        <p className="text-[12px] leading-5 text-slate-500">
          By creating an account you agree to our{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="text-brand-slate underline underline-offset-2 hover:text-brand-navy"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="text-brand-slate underline underline-offset-2 hover:text-brand-navy"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </p>

        <div className="mt-1">
          <AuthSubmitButton data-testid="register-button">
            Create account
          </AuthSubmitButton>
        </div>
      </form>

      <p className="mt-6 border-t border-brand-line pt-5 text-[13px] text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-semibold text-brand-slate underline underline-offset-2 transition-colors hover:text-brand-navy"
          data-testid="sign-in-button"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
