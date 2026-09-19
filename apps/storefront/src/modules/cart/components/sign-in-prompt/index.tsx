import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="overflow-hidden border border-slate-200/80 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_100%)] p-4">
      <div className="flex flex-col gap-4 medium:flex-row medium:items-center medium:justify-between">
        <div className="max-w-xl">       
          <Heading
            level="h2"
            className="text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-950"
          >
          Already have an account?
          </Heading>
          <Text className="mt-2 text-sm leading-7 text-slate-600">
            Sign in to use saved details, track orders, and move through
            checkout with fewer steps.
          </Text>
        </div>

        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-11 border border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
            data-testid="sign-in-button"
          >
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
