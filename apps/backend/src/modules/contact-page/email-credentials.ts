import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto"
import { MedusaError } from "@medusajs/framework/utils"

const getEncryptionKey = () => {
  const secret =
    process.env.EMAIL_SETTINGS_ENCRYPTION_KEY || process.env.JWT_SECRET

  if (!secret) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Set EMAIL_SETTINGS_ENCRYPTION_KEY or JWT_SECRET to store SMTP credentials securely"
    )
  }

  return createHash("sha256")
    .update(`contact-email-settings:${secret}`)
    .digest()
}

export const encryptEmailPassword = (password: string) => {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv)
  const ciphertext = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ])

  return [
    "v1",
    iv.toString("base64url"),
    cipher.getAuthTag().toString("base64url"),
    ciphertext.toString("base64url"),
  ].join(":")
}

export const decryptEmailPassword = (encrypted: string | null) => {
  if (!encrypted) {
    return ""
  }

  const [version, encodedIv, encodedTag, encodedCiphertext] = encrypted.split(":")

  if (version !== "v1" || !encodedIv || !encodedTag || !encodedCiphertext) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "The saved SMTP password has an unsupported format"
    )
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(encodedIv, "base64url")
  )
  decipher.setAuthTag(Buffer.from(encodedTag, "base64url"))

  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8")
}
