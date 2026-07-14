export const REFERENCE_CONTEXT_QUESTION_EVENT = "supabase-reference-context-question"

export type ReferenceContextQuestionDetail = {
  question: string
  context: string
  sectionId: string
  pathname: string
}

export const dispatchReferenceContextQuestion = (detail: ReferenceContextQuestionDetail): boolean =>
  window.dispatchEvent(
    new CustomEvent<ReferenceContextQuestionDetail>(REFERENCE_CONTEXT_QUESTION_EVENT, {
      detail,
      cancelable: true,
    }),
  )
