import { defineConfig, globalIgnores } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([
  /**
   * Build output, not source. `medusa lint` runs with cwd apps/backend and lints
   * ".", which pulled in the generated admin bundles under public/admin and
   * .medusa/server. Those are minified onto single multi-megabyte lines, and
   * parsing them exhausts Node's 4GB heap — which killed `medusa develop` during
   * its lint gate before the server could start. Every warning they produced was
   * reported against generated vendor code, never against anything in src/.
   */
  globalIgnores([
    "**/.medusa/**",
    "**/public/admin/**",
    "**/dist/**",
    "**/.turbo/**",
  ]),
  ...medusa.configs.recommended,
])
