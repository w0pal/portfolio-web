---
name: portfolio-web
description: Personal archive portfolio with calm technical voice.
colors:
  bg-primary: "#ffffff"
  bg-secondary: "#f9fafb"
  bg-card: "#f9fafb"
  bg-header: "#ffffffcc"
  border-primary: "#e5e7eb"
  border-input: "#d1d5db"
  text-primary: "#111827"
  text-secondary: "#4b5563"
  text-muted: "#6b7280"
  text-accent: "#2563eb"
  accent-bg: "#dbeafe"
  accent-text: "#1d4ed8"
  dark-bg-primary: "#0f172a"
  dark-bg-secondary: "#1e293b"
  dark-border-primary: "#334155"
  dark-text-primary: "#f8fafc"
  dark-text-secondary: "#94a3b8"
  dark-text-accent: "#22d3ee"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.05
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  pill: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  xxl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.text-accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-secondary:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  input-default:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card-default:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  badge-default:
    backgroundColor: "{colors.accent-bg}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.5rem"
---

# Design System: portfolio-web

## Overview

**Creative North Star: "Signal Grid"**

This system is a calm technical shell for a personal archive. It uses restrained surfaces, low-noise neutrals, and precise accents to make projects and writing feel trustworthy rather than promotional. The interface should read as maintained engineering work: clear structure, visible state, and no decorative detours.

Density stays practical and compact, with cards, forms, and nav elements tuned for frequent use on both public and admin surfaces. Contrast is intentionally stronger than soft-minimal portfolios, especially in dark mode and active states, so important actions and information remain legible under varied viewing conditions.

This system explicitly rejects ultra-corporate product-marketing polish. It should not feel like a generic enterprise landing template with sterile copy and detached brand voice.

**Key Characteristics:**
- Structural clarity over ornamental styling.
- Technical color language with one active signal accent.
- Compact spacing with consistent control sizing.
- Public portfolio voice aligned with operational admin usability.

## Colors

The palette is a restrained neutral system with a single signal accent that carries interaction states and content emphasis.

### Primary
- **Signal Blue** (`#2563eb`): Primary CTA and interactive emphasis on light surfaces.
- **Signal Cyan** (`#22d3ee`): Primary interaction accent for dark mode surfaces.

### Secondary
- **Support Blue Surface** (`#dbeafe`): Tinted support background for badges and local highlights.

### Tertiary
- **Action Blue Deep** (`#1d4ed8`): Accent text for contextual chips and highlighted inline metadata.

### Neutral
- **Canvas White** (`#ffffff`): Main light-theme page background.
- **Surface Mist** (`#f9fafb`): Secondary surface, cards, and input backgrounds in light mode.
- **Graphite Border** (`#e5e7eb`): Default light-theme border and separators.
- **Slate Border** (`#334155`): Default dark-theme border and separators.
- **Ink 900** (`#111827`): Primary text on light surfaces.
- **Ink 600** (`#4b5563`): Secondary text on light surfaces.
- **Ink 500** (`#6b7280`): Muted text and metadata on light surfaces.
- **Night Base** (`#0f172a`): Main dark-theme page background.
- **Night Surface** (`#1e293b`): Secondary dark-theme surfaces and cards.
- **Cloud Text** (`#f8fafc`): Primary text on dark surfaces.
- **Cloud Muted** (`#94a3b8`): Secondary text on dark surfaces.

**The Single Signal Rule.** The interface uses one active accent family per theme; adding extra accent hues is prohibited unless a data-encoding requirement exists.

## Typography

**Display Font:** Inter (with `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` fallback)
**Body Font:** Inter (with `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` fallback)
**Label/Mono Font:** Uses the same family; no separate mono lane is defined in the current system.

**Character:** Neutral, technical, and direct. Typography should feel crisp and practical, with enough size contrast to maintain hierarchy in both content and admin contexts.

### Hierarchy
- **Display** (700, `clamp(3rem, 8vw, 6rem)`, 1.05): Home hero identity lockups.
- **Headline** (700, `1.875rem`, 1.2): Page titles and section anchors.
- **Title** (600, `1.25rem`, 1.3): Card headings and major sub-sections.
- **Body** (400, `0.875rem`, 1.75): Long-form and descriptive text blocks.
- **Label** (500, `0.75rem`, 1.2): UI labels, metadata, compact chip text.

**The Contrast Ladder Rule.** Adjacent text roles must remain visibly distinct in both size and weight; flattening heading-to-body contrast is prohibited.

## Elevation

This system is border-led and mostly flat at rest. Depth is communicated through surface contrast, thin strokes, and occasional soft shadow use in overlays and dropdowns. Heavy depth stacks are intentionally avoided to preserve the restrained technical tone.

### Shadow Vocabulary
- **Overlay Lift** (`0 20px 25px -5px rgba(0, 0, 0, 0.1)`): Dropdown containers and transient overlay menus.
- **Card Micro Lift** (`0 1px 2px rgba(0, 0, 0, 0.05)`): Admin dashboard welcome and low-elevation utility surfaces.

**The Flat-Until-Interaction Rule.** Use borders and tonal contrast at rest; reserve stronger elevation for overlay or interaction states.

## Components

### Buttons
- **Shape:** Rounded rectangle (`0.5rem`) with medium-weight labels.
- **Primary:** Signal accent fill (`#2563eb`) with white text and compact horizontal padding.
- **Hover / Focus:** Transition-led color and opacity changes; focus should remain clear and keyboard-visible.
- **Secondary / Ghost:** Neutral card-style background with border or subtle contrast shift.

### Chips
- **Style:** Pill shape (`9999px`) with small label size (`0.75rem`) and compact padding.
- **State:** Theme-aware background and text pairs; source badges may use hard contrast (e.g., black/white).

### Cards / Containers
- **Corner Style:** Medium-large rounding (`0.75rem`) for core cards.
- **Background:** Uses neutral surfaces (`#f9fafb` light, translucent/slate dark).
- **Shadow Strategy:** Optional micro-lift for utility panels; borders are the primary structure line.
- **Border:** Thin default stroke (`1px`) with theme token pairing.
- **Internal Padding:** Most content cards/forms use `1.5rem`.

### Inputs / Fields
- **Style:** Soft neutral fill (`#f9fafb`) with visible border (`#d1d5db`) and medium radius (`0.5rem`).
- **Focus:** Currently outline-suppressed in several forms; future passes should standardize strong focus-visible states.
- **Error / Disabled:** Error callouts use high-contrast red surface/text pairing.

### Navigation
- **Style:** Sticky translucent header with blur and border separator.
- **Typography:** Compact nav labels (`0.875rem`, 500 weight).
- **States:** Active route increases contrast; inactive routes use muted text tokens.
- **Mobile Treatment:** Drawer/fullscreen menu with compact icon trigger.

## Do's and Don'ts

### Do:
- **Do** preserve the one-accent strategy and use tokenized neutrals for most surfaces.
- **Do** keep border contrast explicit (`1px` token borders) so structure stays readable in both themes.
- **Do** maintain compact control sizing (`0.5rem` to `0.75rem` vertical padding) for admin efficiency.
- **Do** keep body and metadata text at accessible contrast; muted text must remain legible.
- **Do** use clear heading-to-body hierarchy and avoid collapsing scale steps.

### Don't:
- **Don't** drift into ultra-corporate styling, messaging cadence, or enterprise-template visual language.
- **Don't** introduce multiple competing accent hues for decorative variety.
- **Don't** remove visible focus treatment from interactive elements.
- **Don't** rely on heavy shadows as a default depth system.
- **Don't** replace tokenized neutrals with ad hoc hardcoded grays across components.
