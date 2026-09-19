import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import WebinarPurchasePanel from "@modules/products/components/webinar-purchase-panel"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  isTrainingTemplate,
}: {
  id: string
  region: HttpTypes.StoreRegion
  isTrainingTemplate?: boolean
}) {
  const product = await listProducts({
    queryParams: { id: [id] },
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  if (isTrainingTemplate) {
    return <WebinarPurchasePanel product={product} />
  }

  return <ProductActions product={product} region={region} />
}
