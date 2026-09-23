import en from "./json/en.json" with { type: "json" }

/**
 * The dashboard deep-merges these over its built-in translations, so listing a
 * key here relabels it everywhere that key is used. This store puts the speaker
 * name in the product type, so the product-type wording is renamed to match.
 *
 * Only product-type-specific keys are overridden. The product detail page's
 * "Organize" row reads the generic `fields.type`, which API keys, campaigns,
 * promotions and tax regions share — renaming that would mislabel those pages.
 */
export default {
  en: {
    translation: en,
  },
}
