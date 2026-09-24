import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    cookieOptions: {
      secure: false,
      sameSite: "lax",
    },

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  modules: [
    {
      resolve: "./src/modules/contact-page",
    },
  ],

  admin: {
    /**
     * The repo root pins react/react-dom 19 for the Next.js storefront, so npm
     * nests react 18 under apps/backend and under @medusajs/dashboard. Without
     * deduping, the admin bundle ends up with three React copies: the dashboard
     * renders with one, widgets import hooks from another, and packages hoisted
     * to the root (tiptap, lucide-react) bind to React 19. Hooks then hit a null
     * dispatcher and React 19 elements reach the React 18 renderer, which fails
     * with error #31. Deduping resolves every `react`/`react-dom` import from the
     * Vite root (.medusa/client), collapsing them onto apps/backend's React 18 --
     * the version @medusajs/ui and @medusajs/dashboard declare.
     */
    vite: () => ({
      resolve: {
        dedupe: ["react", "react-dom"],
      },
      optimizeDeps: {
        include: [
          "@medusajs/icons",
          "lucide-react",
          "@tiptap/react",
          "@tiptap/starter-kit",
          "@tiptap/extension-link",
          "@tiptap/extension-underline",
        ],
      },
    }),
  },
})
