export default function medusaError(error: any): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const u = new URL(error.config.url, error.config.baseURL)
    console.error("Resource:", u.toString())
    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)
    console.error("Headers:", error.response.headers)

    // Extracting the error message from the response data
    const message = error.response.data.message || error.response.data

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".")
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received: " + error.request)
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error("Error setting up the request: " + error.message)
  }
}

/**
 * Turns a rejected Medusa SDK call into a message we can show, without throwing.
 *
 * The JS SDK talks over fetch, so failures arrive as a FetchError carrying
 * `status` and a flat `message` rather than the axios-shaped `{ response }`
 * that medusaError() above unwraps. Backend validation problems (4xx) explain
 * something the shopper can act on, so those are passed through; a 5xx means the
 * store backend itself failed and the raw text ("An unknown error occurred.")
 * tells a shopper nothing, so it is replaced with a support-friendly line that
 * still carries the status code for whoever reads the report.
 */
export function medusaErrorMessage(error: any): string {
  const status: number | undefined = error?.status ?? error?.response?.status

  const raw =
    error?.response?.data?.message ??
    error?.body?.message ??
    (typeof error?.message === "string" ? error.message : "")

  const message = typeof raw === "string" ? raw.trim() : ""

  if (status && status >= 400 && status < 500 && message) {
    return message.charAt(0).toUpperCase() + message.slice(1)
  }

  return `We couldn't reach the store to add this${
    status ? ` (error ${status})` : ""
  }. Please try again, or contact support if it keeps happening.`
}
