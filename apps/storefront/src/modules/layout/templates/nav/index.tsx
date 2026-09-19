import { retrieveCart } from "@lib/data/cart"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AccountButton from "@modules/layout/components/account-button"
import CartButton from "@modules/layout/components/cart-button"
import BrandMark from "@modules/layout/components/brand-mark"
import DesktopMegaMenu from "@modules/layout/components/desktop-mega-menu"
import SideMenu from "@modules/layout/components/side-menu"
import { ctaMenuItem, primaryMenuItems } from "@modules/layout/constants/menu-items"

export default async function Nav() {
  const [regions, locales, currentLocale, mobileCart] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions).catch(() => null),
    listLocales().catch(() => null),
    getLocale().catch(() => null),
    retrieveCart().catch(() => null),
  ])

  const mobileCartItemCount =
    mobileCart?.items?.reduce((total, item) => total + item.quantity, 0) || 0

  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-[#102735] text-white shadow-[0_12px_30px_rgba(1,15,24,0.2)]">
      <header className="mx-auto max-w-[1880px]">
        <div className="px-4 py-3 xl:hidden">
          <SideMenu
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
            cartItemCount={mobileCartItemCount}
          />
        </div>

        <nav className="hidden h-[84px] items-center px-4 xl:grid xl:grid-cols-[auto_1fr_auto] xl:px-8 2xl:px-10">
          <div className="flex items-center">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center"
              data-testid="nav-store-link"
            >
              <BrandMark variant="light" />
            </LocalizedClientLink>
          </div>

          <DesktopMegaMenu items={primaryMenuItems} />

          <div className="ml-auto flex items-center gap-3">
            <AccountButton className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white" />
            <CartButton
              iconOnly
              linkClassName="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-white"
              panelClassName="top-[calc(100%+16px)] rounded-[24px] shadow-[0_24px_55px_rgba(15,23,42,0.12)]"
            />
            <LocalizedClientLink
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#e1b24f] to-[#d97348] px-6 text-[14px] font-bold tracking-[0.02em] text-white shadow-[0_16px_32px_rgba(217,115,72,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
              href={ctaMenuItem.href}
            >
              {ctaMenuItem.label}
            </LocalizedClientLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
