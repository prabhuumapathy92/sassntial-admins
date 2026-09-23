"use client"

import { useActionState } from "react"

import { login } from "@lib/data/customer"
import AuthField from "@modules/account/components/auth-field"
import AuthSubmitButton from "@modules/account/components/auth-submit-button"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full" data-testid="login-page">
      <h1 className="text-[22px] font-semibold text-brand-navy">Welcome back</h1>
      <p className="mt-2 text-[13px] leading-6 text-slate-600">
        Sign in to register for sessions, reach your recordings and review past
        orders.
      </p>

      <form className="mt-7 flex flex-col gap-y-4" action={formAction}>
        <AuthField
          label="Email"
          name="email"
          type="email"
          placeholder="you@company.com"
          title="Enter a valid email address."
          autoComplete="email"
          required
          data-testid="email-input"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          data-testid="password-input"
        />

        <ErrorMessage error={message} data-testid="login-error-message" />

        <div className="mt-2">
          <AuthSubmitButton data-testid="sign-in-button">
            Sign in
          </AuthSubmitButton>
        </div>
      </form>

      <p className="mt-6 border-t border-brand-line pt-5 text-[13px] text-slate-600">
        Not a member yet?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-semibold text-brand-slate underline underline-offset-2 transition-colors hover:text-brand-navy"
          data-testid="register-button"
        >
          Create an account
        </button>
      </p>
    </div>
  )
}

export default Login
