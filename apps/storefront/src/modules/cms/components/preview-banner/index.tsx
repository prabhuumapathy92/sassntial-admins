/**
 * Makes it obvious the page is a preview, not the live site, and offers a way
 * out. Without it an editor can forget draft mode is on and mistake unpublished
 * content for what visitors see.
 */
const PreviewBanner = ({ status }: { status: string }) => (
  <div className="bg-[#0d1220] px-4 py-2 text-center text-[13px] text-white">
    Previewing {status} content.{" "}
    <a href="/api/preview?exit=1" className="underline underline-offset-2">
      Exit preview
    </a>
  </div>
)

export default PreviewBanner
