import { defineConfig, globalIgnores } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([
  /**
   * Build output, not source. Without this, `medusa lint` parses the minified
   * admin bundles under .medusa/server/public/admin — hundreds of files whose
   * single-line contents blow past Node's 4GB heap, which takes `medusa develop`
   * down with it before the server ever starts. Every warning they produced was
   * reported against generated vendor code, never against anything in src/.
   */
  globalIgnores([
    "**/.medusa/**",
    "**/public/admin/**",
    "**/dist/**",
    "**/.next/**",
    "**/out/**",
    "**/.turbo/**",
  ]),
  ...medusa.configs.recommended,
])
