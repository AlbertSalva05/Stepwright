# Stepwright · v2.7.0

AI prompts, anti-slop rules and a workflow composer for frontend work. Static site, ready for Render.

## Files

```
├── index.html            the site (markup, styles, logic) with static SEO tags in <head>
├── support.js            runtime (do not edit)
├── prompts-data.js       25 prompts and 6 anti-slop files
├── site.webmanifest      install name, colours, 192/512/maskable icons
├── sitemap.xml
├── robots.txt            allows all, points to sitemap.xml
├── render.yaml           Render Blueprint: static hosting, security and cache headers
├── README.md
└── assets/
    ├── og-image.png      1200×630 social sharing image
    ├── logo/             mark, symbol and lockups (SVG), favicon-32, apple-touch-icon, icon-192, icon-512, icon-maskable-512
    └── icons/            7 category + 14 interface icons (SVG)
```

## Deploy on Render

1. Push this folder to its own GitHub repository (files at the repository root).
2. In Render choose **New > Blueprint** and pick the repository. Render reads `render.yaml`.
3. Or choose **New > Static Site**, leave the build command empty and set the publish directory to `.`.

Hash routes (`#/prompts`, `#/workflow`, `#/antislop`, `#/design-system`, `#/faq`, `#/settings`, `#/privacy`, `#/terms`) need no rewrite rules.

## Before launch

- The site URL is set to `https://stepwright.onrender.com`. If Render gives a different URL or you add a domain, replace it in `index.html` (canonical, og:url, og:image, twitter:image), `robots.txt` and `sitemap.xml`.
- Run PageSpeed Insights on the live URL (https://pagespeed.web.dev).

## Updating content

Prompt and anti-slop text is compiled into `index.html`. Edit the source files in the design project, rebuild, and replace `index.html`.

## Fonts

IBM Plex Sans and IBM Plex Mono, SIL Open Font License 1.1, loaded from Google Fonts.

## Changelog

### v2.7.0

- Breadcrumb bar under the header on every page except Home: Back button plus a Home › section › page trail. Replaces the separate breadcrumbs that sat on each page
- New `sitemap.xml`; `robots.txt` points to it
- Absolute `og:image`, `og:url`, `twitter:image` and a canonical link
- Manifest: `id`, `scope`, `lang`, 192 px and maskable icons; theme colour matches the page
- Deploy is no longer a single bundled file: `index.html` loads `support.js` and `prompts-data.js`, so crawlers see the title and meta tags without running JavaScript, and nothing has to be unpacked first (about 377 KB instead of 1 MB)
- Text files normalized: LF line endings, no trailing spaces, final newline

### v2.6.0

- Icons: phase cards get their phase icon and a prompt-count badge; hero and Workflow intro get icon badges; arrow icons on primary links
- Less dense copy: hero, section intros and Workflow steps cut to two lines or less; a "New" eyebrow in the hero
- Loading: thin progress bar and a short fade on page change; search shows a spinner and dims results while you type; skeletons pulse while prompts load. All motion is off with reduced motion
- Responsive: hero file tree truncates comments instead of scrolling sideways; info button no longer pokes outside the Workflow sidebar
- New 1200×630 social image (eight-step staircase), web manifest, `lang="en"` on the page
- Removed: unused `favicon-32.png` (the favicon is inlined in `index.html`)


### v2.5.0

- Header: light and dark theme toggle beside the menu (sun and moon icon, 44 px, saved on the device). High contrast stays available in Settings

### v2.4.0

- Footer legal links: Privacy policy (`#/privacy`), Terms and conditions (`#/terms`) and a Cookie settings dialog
- Cookie settings control local storage: display settings and workflow answers can each be turned off (the saved copy is deleted)
- Footer call-to-action buttons no longer wrap at mid widths

### v2.3.0

- Header: fixed on scroll. On the home page it drops in once the hero has scrolled past; on other pages it is fixed with a shadow after scrolling
- Footer: dark band with call-to-action row, brand column, Build and Learn link groups and a bottom bar
- Back to top: floating button after 600 px, hidden when the footer is visible; a docked button sits on the footer edge. Respects reduced motion

### v2.2.0

- Workflow file opens with a Lead brief (section 1), editable on the Workflow page (item 08) with Restore default and auto-filled tags
- New "Pages and their parts" field
- Continuous run: the AI no longer stops between steps or asks questions; missing values are marked "Suggested:". The only pause is the logo concept pick
- Display button removed from the header; new Settings page (`#/settings`) for theme, text size and saved data

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
