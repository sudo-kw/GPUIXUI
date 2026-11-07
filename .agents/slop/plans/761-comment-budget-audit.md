# 761 — What the comment budget removed besides comments

| Field | Value |
| --- | --- |
| Status | done |
| Phase | F (code quality) |
| Depends on | 757 (the comment budget) |
| Workstream | repo tooling |

## Method

Every code file `6cd3101be` changed was parsed with `@babel/parser` before and after,
comments dropped, and the remaining tokens diffed: 2,342 files, 122 with non-comment
changes. Each removed test was then run, as the old file, against the current tree.

## Findings

| Change | Verdict |
| --- | --- |
| Native previews (92 captures, `native-captures`, `live-example`, `docs-server`, `live-frame` checks) | deliberate: its TODO section went with it |
| Related strip, Notes/Accessibility/Related sections | deliberate: the commit says so |
| Hand-rolled tabs, `smoothPath`, the sidebar rail icon | moved to `TabStrip`, `curvePath` and `panelLeft` (plan 756) |
| `packages/shell/src/window/logic.ts` imports | lost; restored on master in `322acdaf6` |
| Docs asset cache headers | lost; restored on master in `bf8a19e72` |
| Shebangs of `scripts/check-tests.ts`, `scripts/check-exports.ts`, `packages/components/scripts/surface.ts` | lost to the fixer: restored here |
| `keeps the hashed assets, including the wasm, immutable` | a behaviour guard; restored |
| `pins React, so a consumer's jsxImportSource cannot capture the file` | a behaviour guard; restored |
| 55 removed tests that fail today | they read a removed comment, page or feature |

The fixer itself removes only comments; the shebang was its one bug, and
`apps/docs/src/lib/comment-budget.test.ts` guards it.
