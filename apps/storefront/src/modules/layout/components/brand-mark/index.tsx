import { clx } from "@medusajs/ui"

type BrandMarkProps = {
  className?: string
  variant?: "dark" | "light"
}

const BrandMark = ({ className, variant = "dark" }: BrandMarkProps) => {
  return (
    <div
      className={clx(
        "flex items-center",
        className
      )}
    >
      <div className="relative h-[40px] w-[180px] small:h-[46px] small:w-[200px]">
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
