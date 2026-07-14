import { describe, expect, it } from "vitest"
import { getReferenceItemId, getReferenceItemSlug, toReferenceId } from "./server-reference-ids"

describe("server reference identifiers", () => {
  it("normalizes camel case and punctuation for document IDs", () => {
    expect(toReferenceId("VerifyAuthOptions")).toBe("verify-auth-options")
    expect(toReferenceId("  Auth / Error  ")).toBe("auth-error")
  })

  it("keeps item slugs compatible with production reference routes", () => {
    expect(getReferenceItemId("Primitives", "createAdminClient")).toBe(
      "primitives-create-admin-client",
    )
    expect(getReferenceItemSlug("Primitives", "createAdminClient")).toBe(
      "primitives-createadminclient",
    )
  })
})
