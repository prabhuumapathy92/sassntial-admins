"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import { useState } from "react"

import CheckoutAuthModal from "@modules/cart/components/checkout-auth-modal"

const SignInPrompt = ({ checkoutPath }: { checkoutPath: string }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <div className="overflow-hidden border border-slate-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] p-4">
      <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between">
        <div className="max-w-xl">
          <Heading
            level="h2"
            className="text-[1.55rem] font-semibold text-slate-950"
          >
          Already have an account?
          </Heading>
          <Text className="mt-2 text-sm leading-7 text-slate-600">
            Sign in to use saved details, track orders, and move through
            checkout with fewer steps.
          </Text>
        </div>

        <Button
          variant="secondary"
          className="h-11 border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
          onClick={() => setIsAuthOpen(true)}
          data-testid="sign-in-button"
        >
          Sign in
        </Button>
      </div>

      <CheckoutAuthModal
        isOpen={isAuthOpen}
        close={() => setIsAuthOpen(false)}
        checkoutPath={checkoutPath}
      />
    </div>
  )
}

export default SignInPrompt
