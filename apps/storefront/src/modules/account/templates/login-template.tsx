"use client"

import { useState } from "react"

import Login from "@modules/account/components/login"
import Register from "@modules/account/components/register"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const BENEFITS = [
  {
    title: "Book live sessions",
    body: "Reserve a seat on upcoming training and keep every booking in one place.",
  },
  {
    title: "Reach your recordings",
    body: "Come back to the sessions you have bought whenever you need them.",
  },
  {
    title: "Track your orders",
    body: "Review invoices and past purchases without emailing the team.",
  },
]

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
    <path
      d="m5 12.5 4.5 4.5L19 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)
  const isRegister = currentView === LOGIN_VIEW.REGISTER

  return (
    <div className="min-h-screen bg-brand-haze py-4 sm:py-6">
      <div className="content-container px-3 sm:px-4">
        <div className="mx-auto max-w-5xl">
          <div className="bg-[#102735] px-4 py-2.5 sm:px-5">
            <h2 className="text-[15px] font-semibold text-white sm:text-[16px]">
              {isRegister ? "Create an account" : "Account sign in"}
            </h2>
          </div>

          <div className="grid border border-t-0 border-brand-line bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            {/* Ordered last on small screens so the form is what you land on. */}
            <aside className="order-last hidden flex-col justify-between gap-8 border-brand-line bg-brand-mist px-5 py-8 sm:flex sm:px-8 lg:order-first lg:border-r">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-slate">
                  Your training account
                </p>
                <p className="mt-3 max-w-md text-[18px] font-semibold leading-7 text-brand-navy">
                  Everything you have booked, bought and watched — in one place.
                </p>

                <ul className="mt-7 flex flex-col gap-y-5">
                  {BENEFITS.map((benefit) => (
                    <li key={benefit.title} className="flex gap-x-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-brand-slate">
                        <CheckIcon />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-brand-navy">
                          {benefit.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-6 text-slate-600">
                          {benefit.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[13px] leading-6 text-slate-600">
                Need a hand?{" "}
                <LocalizedClientLink
                  href="/company/contact-us"
                  className="font-semibold text-brand-slate underline underline-offset-2 hover:text-brand-navy"
                >
                  Talk to the team
                </LocalizedClientLink>
                .
              </p>
            </aside>

            <div className="px-5 py-8 sm:px-8">
              {isRegister ? (
                <Register setCurrentView={setCurrentView} />
              ) : (
                <Login setCurrentView={setCurrentView} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
