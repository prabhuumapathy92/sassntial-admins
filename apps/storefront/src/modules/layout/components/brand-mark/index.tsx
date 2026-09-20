import { clx } from "@medusajs/ui"

type BrandMarkProps = {
  className?: string
  // Sizes the box the logo is contained in. Override it where the default
  // wide box would leave the mark off-centre, such as the checkout header.
  boxClassName?: string
  variant?: "dark" | "light"
}

const BrandMark = ({
  className,
  boxClassName = "h-[40px] w-[180px] small:h-[46px] small:w-[200px]",
  variant = "dark",
}: BrandMarkProps) => {
  return (
    <div
      className={clx(
        "flex items-center",
        className
      )}
    >
      <div className={clx("relative", boxClassName)}>
        <img
          src="/logo.png"
          alt="Store Logo"
          className={clx(
            "h-full w-full object-contain object-left",
            variant === "light" && "brightness-0 invert"
          )}
        />
      </div>
    </div>
  )
}

export default BrandMark
