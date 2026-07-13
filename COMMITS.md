# Commit conventions

Every commit message is a single line following [Conventional Commits](https://www.conventionalcommits.org/).

```text
<type>(<scope>): <subject>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `chore`
- Scope is optional and lowercase. It names the area touched (`ui`, `tokens`, `lint`, `hero`)
- Subject is imperative mood, lowercase, no trailing period, 72 chars max
- One line only. No body, no footers, no `Co-Authored-By` or generated-with trailers

Examples:

```text
feat(ui): add button primitive with brand and outline variants
fix(hero): align agent panel with section border
docs: add commit conventions
chore: bump oxlint to 1.74
```

## Prose style for docs

Markdown prose in this repo uses no em dashes, no `-` as a clause separator, and no semicolons. Rewrite with a comma, colon, or period instead. This also applies to code comments, including comments inside doc code examples. Actual code syntax is exempt.

Before writing or editing prose (docs, UI copy, PR descriptions), load the `/stop-slop` skill and apply it. It removes predictable AI writing patterns, which includes the em dash rule above.
