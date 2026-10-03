"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

import Login from "@modules/account/components/login"
import Register from "@modules/account/components/register"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Modal from "@modules/common/components/modal"
import X from "@modules/common/icons/x"

type CheckoutAuthModalProps = {
  isOpen: boolean
  close: () => void
  /** Checkout path without the country code, e.g. `/checkout?step=address`. */
  checkoutPath: string
}

/**
 * Sign in or create an account without leaving the cart. Either form sends the
 * shopper straight on to checkout once it succeeds.
 */
const CheckoutAuthModal = ({
  isOpen,
  close,
  checkoutPath,
}: CheckoutAuthModalProps) => {
  const { countryCode } = useParams()
  const [view, setView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)
  const redirectTo = `/${countryCode}${checkoutPath}`

  return (
    <Modal isOpen={isOpen} close={close} data-testid="checkout-auth-modal">
      <div className="-mb-2 flex justify-end">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="p-1 text-slate-500 transition-colors hover:text-brand-navy"
          data-testid="close-modal-button"
        >
          <X size={20} />
        </button>
      </div>
      <div className="px-1 pb-2 sm:px-3">
        {view === LOGIN_VIEW.REGISTER ? (
          <Register setCurrentView={setView} redirectTo={redirectTo} />
        ) : (
          <Login setCurrentView={setView} redirectTo={redirectTo} />
        )}
      </div>
    </Modal>
  )
}

export default CheckoutAuthModal
