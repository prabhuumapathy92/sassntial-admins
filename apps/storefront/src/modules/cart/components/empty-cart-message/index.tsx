import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="overflow-hidden border border-slate-200/80 bg-white px-6 py-14 shadow-[0_18px_45px_rgba(15,23,42,0.06)] small:px-10 small:py-16"
      data-testid="empty-cart-message"
    >
      <p className="font-[family-name:var(--font-tech)] text-xs uppercase tracking-[0.28em] text-sky-700">
        Cart
      </p>
      <Heading
        level="h1"
        className="mt-3 font-[family-name:var(--font-brand)] text-[2.4rem] font-semibold leading-none tracking-[0.01em] text-slate-950"
      >
        Your cart is empty.
      </Heading>
      <Text className="mt-4 mb-6 max-w-[36rem] text-base leading-8 text-slate-600">
        You don&apos;t have anything in your cart yet. Explore the catalog and
        add products when you&apos;re ready to continue.
      </Text>
      <div className="inline-flex border border-slate-200 bg-slate-50 px-4 py-3">
        <InteractiveLink href="/training">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
