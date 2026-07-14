export type AgentPhrasePlacement = {
  column: number
  phraseIndex: number
  row: number
}

export type AgentPhraseLayout = {
  fillRows: boolean
  placements: AgentPhrasePlacement[]
  rowCount: number
}

export const AGENT_PHRASE = "or let your agent do"

const COMPACT_COLUMN_COUNT = 16
const WIDE_COLUMN_COUNT = AGENT_PHRASE.length

const createHorizontalPlacements = (
  columns: number,
  row: number,
  phraseStartIndex: number,
  phraseEndIndex: number,
): AgentPhrasePlacement[] => {
  const characterCount = phraseEndIndex - phraseStartIndex
  const startColumn = Math.floor((columns - characterCount) / 2)

  return Array.from({ length: characterCount }, (_, offset) => ({
    column: startColumn + offset,
    phraseIndex: phraseStartIndex + offset,
    row,
  }))
}

const createVerticalPlacements = (
  column: number,
  startRow: number,
  phraseStartIndex: number,
  phraseEndIndex: number,
): AgentPhrasePlacement[] =>
  Array.from({ length: phraseEndIndex - phraseStartIndex }, (_, offset) => ({
    column,
    phraseIndex: phraseStartIndex + offset,
    row: startRow + offset,
  }))

const createFallbackLayout = (columns: number): AgentPhraseLayout => {
  const visibleCharacterIndices = Array.from(
    { length: AGENT_PHRASE.length },
    (_, phraseIndex) => phraseIndex,
  ).filter((phraseIndex) => AGENT_PHRASE.at(phraseIndex) !== " ")

  return {
    fillRows: false,
    placements: visibleCharacterIndices.map((phraseIndex, index) => ({
      column: index % columns,
      phraseIndex,
      row: Math.floor(index / columns),
    })),
    rowCount: Math.ceil(visibleCharacterIndices.length / columns),
  }
}

export const getAgentPhraseLayout = (columnCount: number): AgentPhraseLayout => {
  const columns = Math.max(1, Math.floor(columnCount))

  if (columns >= WIDE_COLUMN_COUNT) {
    return {
      fillRows: true,
      placements: createHorizontalPlacements(columns, 0, 0, AGENT_PHRASE.length),
      rowCount: 1,
    }
  }

  if (columns >= COMPACT_COLUMN_COUNT) {
    return {
      fillRows: true,
      placements: [
        ...createHorizontalPlacements(columns, 0, 0, 11),
        ...createHorizontalPlacements(columns, 1, 12, AGENT_PHRASE.length),
      ],
      rowCount: 2,
    }
  }

  if (columns < 8) return createFallbackLayout(columns)

  const middleColumn = Math.floor(columns / 2)

  return {
    fillRows: false,
    placements: [
      ...createHorizontalPlacements(columns, 0, 0, 6),
      ...createVerticalPlacements(middleColumn - 2, 1, 7, 11),
      ...createVerticalPlacements(middleColumn + 2, 1, 12, 17),
      ...createHorizontalPlacements(columns, 6, 18, AGENT_PHRASE.length),
    ],
    rowCount: 7,
  }
}
