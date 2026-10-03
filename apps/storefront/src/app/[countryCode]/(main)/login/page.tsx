import { redirect } from "next/navigation"

/**
 * There is no separate sign-in page: the account page shows the sign-in form to
 * signed-out visitors. Links and bookmarks to /login are sent there.
 */
export default async function LoginRedirect(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  redirect(`/${countryCode}/account`)
}
