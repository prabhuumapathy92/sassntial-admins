import Medusa from "@medusajs/js-sdk"

// Read through `typeof` so a bundler that stops emitting one of these defines
// degrades to the default instead of throwing a ReferenceError on import.
const backendUrl = typeof __BACKEND_URL__ === "string" ? __BACKEND_URL__ : ""
const authType = typeof __AUTH_TYPE__ === "string" ? __AUTH_TYPE__ : undefined
const jwtTokenStorageKey =
  typeof __JWT_TOKEN_STORAGE_KEY__ === "string"
    ? __JWT_TOKEN_STORAGE_KEY__
    : undefined

/**
 * Shared admin client for widgets and custom routes. Going through the SDK
 * rather than a bare `fetch` keeps the backend URL, the auth scheme and the
 * error shape identical to every other request the dashboard makes.
 */
export const sdk = new Medusa({
  baseUrl: backendUrl || "/",
  debug: import.meta.env.DEV,
  auth: {
    type: authType ?? "session",
    jwtTokenStorageKey,
  },
})
