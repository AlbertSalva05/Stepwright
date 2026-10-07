# Stepwright · v2.1.0

AI prompts, anti-slop rules and a workflow composer for frontend work. Formerly Frontend UI Design Agents Collection.

Static site, ready for Render.

## Contents

- `index.html`: the whole site in one self-contained file (styles, scripts, 25 prompts in project order, the 8-phase workflow composer (framework list you can extend, file attachments for content and design direction), and 6 anti-slop files plus the combined summary inlined)
- `assets/logo/`: 4 SVG logo files (tile mark and light, dark and one-colour lockups) plus 3 PNG icons (32 px favicon, 180 px Apple touch icon, 512 px social image)
- `assets/icons/`: 7 category icons and 14 interface icons (SVG), linked for download
- `render.yaml`: Render Blueprint with security and cache headers
- `robots.txt`

## Deploy on Render

1. Push this folder to its own GitHub or GitLab repository (the files at the repository root).
2. In Render, choose **New > Blueprint** and select the repository. Render reads `render.yaml`.
3. Alternatively choose **New > Static Site**, leave the build command empty and set the publish directory to `.`.

The site uses hash routes (`#/prompts`, `#/workflow`, `#/antislop`, `#/design-system`, `#/faq`), so no rewrite rules are needed.

## Updating content

Prompt and anti-slop text is compiled into `index.html`. Edit the source `.md` files in the design project, rebuild, and replace `index.html`.

## Fonts

IBM Plex Sans and IBM Plex Mono, SIL Open Font License 1.1, loaded from Google Fonts.

## Changelog

### v2.1.0

- New name and mark: Stepwright. New favicon, Apple touch icon and lockups
- Workflow: question file export, AI-answer import (file or pasted text) with undo, copy questions per phase
- Workflow: every field is a text area; choose more than one framework
- Prompt pages: plain-language field labels with matching placeholders, aligned rows, question export and answer import (file or pasted text)
- Phase icons; imported fields briefly highlight
- Mobile menu: backdrop, page scroll locked while open
- Anti-slop rules: Website Audit checklist (mobile, header, navigation, footer, mobile menu)

### v2.0.0

- Workflow: form panels have no background; spacing reworked
- 04 Choose a framework: add and remove your own frameworks (saved on the device)
- 06 Gather real content and 07 Pick a design direction: attach or drop files. Text files are inlined into the export; images and PDFs are listed by name
- New FAQ page (`#/faq`) with search, topic filters and a four-step overview
- Anti-slop options info window: fixed height, centred, wider
- Personality settings: one row per dial, label left, 1 to 3 buttons right-aligned
- Workflow steps: removed per-phase and per-step fill counters (the sidebar progress bar remains)
