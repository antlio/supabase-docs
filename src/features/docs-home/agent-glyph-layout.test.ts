import { describe, expect, it } from "vitest"
import { AGENT_PHRASE, getAgentPhraseLayout } from "./agent-glyph-layout"

describe("getAgentPhraseLayout", () => {
  it("keeps the desktop phrase on one centered row", () => {
    const layout = getAgentPhraseLayout(24)

    expect(layout.rowCount).toBe(1)
    expect(layout.fillRows).toBe(true)
    expect(layout.placements.at(0)).toEqual({ column: 2, phraseIndex: 0, row: 0 })
    expect(layout.placements.at(-1)).toEqual({ column: 21, phraseIndex: 19, row: 0 })
  })

  it("wraps the phrase across two centered rows at compact widths", () => {
    const layout = getAgentPhraseLayout(18)

    expect(layout.rowCount).toBe(2)
    expect(layout.placements.find(({ phraseIndex }) => phraseIndex === 0)).toEqual({
      column: 3,
      phraseIndex: 0,
      row: 0,
    })
    expect(layout.placements.find(({ phraseIndex }) => phraseIndex === 12)).toEqual({
      column: 5,
      phraseIndex: 12,
      row: 1,
    })
  })

  it("stacks the middle words vertically on narrow canvases", () => {
    const layout = getAgentPhraseLayout(14)

    expect(layout.rowCount).toBe(7)
    expect(layout.fillRows).toBe(false)
    expect(
      layout.placements.filter(({ phraseIndex }) => phraseIndex >= 7 && phraseIndex < 11),
    ).toEqual([
      { column: 5, phraseIndex: 7, row: 1 },
      { column: 5, phraseIndex: 8, row: 2 },
      { column: 5, phraseIndex: 9, row: 3 },
      { column: 5, phraseIndex: 10, row: 4 },
    ])
  })

  it.each([1, 4, 7, 8, 14, 16, 19, 20, 30])(
    "keeps every visible character inside a %i-column canvas",
    (columns) => {
      const layout = getAgentPhraseLayout(columns)
      const placedCharacters = layout.placements.map(({ phraseIndex }) =>
        AGENT_PHRASE.at(phraseIndex),
      )

      expect(layout.placements.every(({ column }) => column >= 0 && column < columns)).toBe(true)
      expect(placedCharacters.filter((character) => character !== " ")).toHaveLength(16)
    },
  )
})
