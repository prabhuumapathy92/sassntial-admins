/// <reference types="vite/client" />

/**
 * Injected by @medusajs/admin-bundler as Vite `define` globals. Admin
 * extensions read them so they talk to the same backend, with the same auth
 * scheme, as the dashboard itself.
 */
declare const __BACKEND_URL__: string
declare const __AUTH_TYPE__: "jwt" | "session" | undefined
declare const __JWT_TOKEN_STORAGE_KEY__: string | undefined
