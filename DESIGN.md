# Future AI City — warm editorial workspace

Chosen by the user: Notion-inspired, light, warm, editorial.

Reference: [VoltAgent / awesome-design-md / Notion](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/notion/DESIGN.md), examined 2026-09-30. This is an independent adaptation, not a replica or an official Notion product. No Notion logo, proprietary font, illustration, or marketing copy is used.

Use a paper canvas, warm charcoal text, quiet hairline borders, pastel subject markers, an understated workspace sidebar, and one purple primary action. The reference's navy marketing hero is intentionally omitted in favor of the user's requested light treatment.

## Typography

- UI and reading text: Inter through next/font, served from the application after build.
- Editorial headings: Georgia, with Times New Roman and serif fallbacks. This is a project-specific addition to the reference's sans-serif system.
- No runtime Google Fonts CSS import. Do not reintroduce Manrope, DM Mono, or competing font stacks.
- Main title: 38–58px; reading title: 34–42px; reading copy: 13–14px with 1.8 line height.

## Tokens

- Ink #37352f; secondary text #706d66; paper #fffefa; sidebar #f6f5f2.
- Border #e5e3df; primary action #5645d4.
- Peach #ffe8d4; mint #d9f3e1; sky #dcecfa; yellow #fef7d6.
- Buttons 8px radius; cards 12px; small subject tags 4–7px.

## Layout and interaction

Desktop: fixed sidebar, breadcrumb bar, editorial introduction, interactive city plus progress panel, then ethics and reading cards. Mobile: compact navigation above content; city, zone controls, and note cards stack vertically. Keep Canvas dimensions explicit. DOM labels live in a dedicated portal above Canvas.

Use original line icons for navigation and subjects. Preserve visible keyboard focus, skip link, native dialog focus containment, Escape/backdrop dismissal, reduced-motion support, original zone content, citations, quizzes, and exploration state semantics. Progress measures visits, not quiz completion.

Validate with lint, Webpack build, and the existing three-viewport smoke test. Inspect the saved overview and reading screenshots under docs/qa.
