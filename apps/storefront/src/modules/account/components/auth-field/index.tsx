"use client"

import React, { useId, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type AuthFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "id" | "className"
> & {
  label: string
  name: string
  hint?: string
}

/**
 * The shared `@modules/common/components/input` floats its label over the field
 * but never moves it — it has no peer-state transition — so the label sits on
 * top of whatever is typed. Auth forms use a plain label above the input
 * instead: nothing overlaps, and the required marker stays legible.
 */
const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ label, name, type = "text", required, hint, ...props }, ref) => {
    const generatedId = useId()
    const id = `${name}-${generatedId}`
    const isPassword = type === "password"
    const [revealed, setRevealed] = useState(false)

    return (
      <div className="flex w-full flex-col gap-y-1.5">
        <label
          htmlFor={id}
          className="text-[12px] font-semibold uppercase tracking-wide text-brand-navy"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-brand-ember" aria-hidden>
              *
            </span>
          )}
        </label>

        <div className="relative">
          <input
            id={id}
            ref={ref}
            name={name}
            type={isPassword && revealed ? "text" : type}
            required={required}
            className={`h-11 w-full border border-brand-line bg-white px-3 text-[13px] text-brand-ink outline-none transition-colors placeholder:text-slate-400 hover:border-brand-slate/60 focus:border-brand-slate focus:ring-1 focus:ring-brand-slate ${
              isPassword ? "pr-11" : ""
            }`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setRevealed((value) => !value)}
              aria-label={revealed ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-brand-slate transition-colors hover:text-brand-navy"
            >
              {revealed ? <Eye size="18" /> : <EyeOff size="18" />}
            </button>
          )}
        </div>

        {hint && <p className="text-[12px] leading-5 text-slate-500">{hint}</p>}
      </div>
    )
  }
)

AuthField.displayName = "AuthField"

export default AuthField
