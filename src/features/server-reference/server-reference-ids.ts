export const toReferenceId = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

export const getReferenceItemId = (category: string, name: string) =>
  `${toReferenceId(category)}-${toReferenceId(name)}`

const toReferenceSlugSegment = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

export const getReferenceItemSlug = (category: string, name: string) =>
  `${toReferenceId(category)}-${toReferenceSlugSegment(name)}`
