import { UpdateSiteSettings } from "../validators"

const parse = (site_settings: Record<string, unknown>) =>
  UpdateSiteSettings.safeParse({ site_settings })

describe("UpdateSiteSettings", () => {
  it("fills every field with an empty string when nothing is sent", () => {
    const result = parse({})

    expect(result.success).toBe(true)
    expect(result.data?.site_settings).toEqual({
      google_analytics_id: "",
      google_tag_manager_id: "",
      meta_pixel_id: "",
      microsoft_clarity_id: "",
      google_site_verification: "",
      bing_site_verification: "",
      head_code: "",
      body_code: "",
    })
  })

  it("normalises tracking IDs to the provider's casing", () => {
    const result = parse({
      google_analytics_id: " g-abc123xyz ",
      google_tag_manager_id: "gtm-k9x2p7",
    })

    expect(result.data?.site_settings.google_analytics_id).toBe("G-ABC123XYZ")
    expect(result.data?.site_settings.google_tag_manager_id).toBe("GTM-K9X2P7")
  })

  it.each([
    ["google_analytics_id", "G-123');alert(1);//"],
    ["google_tag_manager_id", "GTM-ABC'+x+'"],
    ["meta_pixel_id", "123456');fbq('x"],
    ["microsoft_clarity_id", 'abc"+alert(1)+"'],
  ])("rejects a %s that could break out of the inline script", (field, value) => {
    expect(parse({ [field]: value }).success).toBe(false)
  })

  it("keeps only the code from a pasted verification meta tag", () => {
    const result = parse({
      google_site_verification:
        '<meta name="google-site-verification" content="aBc-123_XYZ" />',
      bing_site_verification: "0123456789ABCDEF0123456789ABCDEF",
    })

    expect(result.data?.site_settings.google_site_verification).toBe(
      "aBc-123_XYZ"
    )
    expect(result.data?.site_settings.bing_site_verification).toBe(
      "0123456789ABCDEF0123456789ABCDEF"
    )
  })

  it("rejects a verification code containing markup", () => {
    expect(
      parse({ google_site_verification: 'abc"><script>alert(1)</script>' })
        .success
    ).toBe(false)
  })

  it("accepts custom code verbatim", () => {
    const head_code = '<script async src="https://example.com/a.js"></script>'
    const result = parse({ head_code })

    expect(result.data?.site_settings.head_code).toBe(head_code)
  })
})
