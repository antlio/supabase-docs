import { describe, expect, it } from "vitest"
import {
  getServerReferencePath,
  getServerReferenceSectionFromPathname,
  SERVER_REFERENCE_SECTIONS,
} from "./server-reference-active-section"
import {
  getAgentDocumentByPath,
  getAgentDocumentByServerSlug,
} from "@/features/agent-docs/agent-document-records"

describe("server reference path selection", () => {
  it("selects the introduction for the root path and trailing slash", () => {
    expect(getServerReferenceSectionFromPathname("/docs/reference/server").id).toBe("introduction")
    expect(getServerReferenceSectionFromPathname("/docs/reference/server/").id).toBe("introduction")
  })

  it("round-trips every reference section through its route", () => {
    for (const section of SERVER_REFERENCE_SECTIONS) {
      expect(getServerReferenceSectionFromPathname(getServerReferencePath(section))).toEqual(
        section,
      )
    }
  })

  it("falls back to the introduction for unrelated and unknown paths", () => {
    expect(getServerReferenceSectionFromPathname("/docs").id).toBe("introduction")
    expect(getServerReferenceSectionFromPathname("/docs/reference/server/not-real").id).toBe(
      "introduction",
    )
  })

  it("accepts the human-readable markdown alias for camel-case item names", () => {
    expect(getAgentDocumentByServerSlug(["middleware-with-supabase"])?.title).toBe("withSupabase")
    expect(
      getAgentDocumentByPath("/docs/reference/server/middleware-with-supabase.md")?.title,
    ).toBe("withSupabase")
  })
})
