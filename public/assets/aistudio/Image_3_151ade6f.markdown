---
name: Financial Terminal
colors:
  surface: '#faf8ff'
  surface-dim: '#d6d9e9'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedfd'
  surface-container-high: '#e5e7f7'
  surface-container-highest: '#dfe2f2'
  on-surface: '#171b26'
  on-surface-variant: '#434656'
  inverse-surface: '#2c303c'
  inverse-on-surface: '#eef0ff'
  outline: '#737687'
  outline-variant: '#c3c5d8'
  surface-tint: '#004ee8'
  primary: '#0049db'
  on-primary: '#ffffff'
  primary-container: '#2962ff'
  on-primary-container: '#f7f5ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006b59'
  on-secondary: '#ffffff'
  secondary-container: '#84f7db'
  on-secondary-container: '#00725f'
  tertiary: '#b40024'
  on-tertiary: '#ffffff'
  tertiary-container: '#da2237'
  on-tertiary-container: '#fff4f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001550'
  on-primary-fixed-variant: '#003ab3'
  secondary-fixed: '#84f7db'
  secondary-fixed-dim: '#66dabf'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005143'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#92001b'
  background: '#faf8ff'
  on-background: '#171b26'
  surface-variant: '#dfe2f2'
  surface-bg: '#FFFFFF'
  surface-subtle: '#F0F3FA'
  surface-muted: '#E0E3EB'
  market-up: '#089981'
  market-down: '#F23645'
  market-up-soft: rgba(8, 153, 129, 0.12)
  market-down-soft: rgba(242, 54, 69, 0.12)
  brand-accent-soft: rgba(41, 98, 255, 0.10)
  text-primary: '#131722'
  text-secondary: '#787B86'
  border-grid: '#E0E3EB'
  border-subtle: '#F0F3FA'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  tabular-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  tabular-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system embodies the high-velocity, analytical precision of modern global capital markets. Tailored for retail traders, institutional analysts, quantitative researchers, and active market participants, the interface prioritizes extreme data clarity, legibility, and rapid scannability over decorative embellishment.

The visual style blends **High-Density Corporate Minimalism** with the utilitarian rigor of specialized trading terminals. It relies on razor-thin micro-borders, clean tabular data streams, muted background tiers, and purposeful, high-contrast chromatic accents that immediately convey directional market shifts (bullish/bearish states). The UI inspires confidence, discipline, and frictionless execution.

## Colors

The palette is engineered around high-legibility financial standards:
- **Primary (`#2962FF`):** The signature electric cobalt blue, reserved for primary interactive triggers, active navigation tabs, selected states, and focused data points.
- **Secondary / Market Up (`#089981`):** The distinct market green signifying positive delta, bids, buy signals, and upward momentum.
- **Tertiary / Market Down (`#F23645`):** The high-visibility crimson red indicating negative delta, asks, sell orders, and downward momentum.
- **Neutral (`#131722`):** Pure carbon obsidian for high-contrast primary typography, icons, and prominent headers.
- **Subtle Surface & Structure (`#F0F3FA` and `#E0E3EB`):** Crisp, cool slate tones deployed across backgrounds, search containers, segmented bar tracks, and dividers without visually muddying dense rows.

## Typography

Typography relies on **Inter** with native OpenType tabular figures (`tnum`) activated across all financial tickers, percentages, orderbook metrics, and coordinate displays to prevent layout jittering during real-time web-socket updates.

- **Headlines & Market Banners:** Strong, compact, and tracking-tightened (`-0.02em` to `-0.03em`) for a confident editorial stance.
- **Data & Tables:** Regular and Medium weights set strictly at 12px and 14px with fixed numeric baseline alignment.
- **Labels & Micro-data:** Crisp uppercase or small-caps 11px badges providing immediate hierarchy for tickers, exchanges, and timeframes (`1D`, `5D`, `1M`, `1Y`, `ALL`).

## Layout & Spacing

The layout model favors ultra-dense, modular grid systems capable of accommodating multi-pane financial charts, order ladders, and sidebars.

- **Grid Architecture:** 12-column fluid grid system across desktop screens (breakpoint: 1280px+), scaling down to an 8-column layout for tablets (768px - 1279px) and a single or dual-column stacked layout for mobile (<768px).
- **Data Density:** Component paddings use compact increments (`0.25rem` to `0.75rem`) to maximize visible real estate on screen. Outer layouts maintain comfortable padding (`1.5rem` to `3rem`) to frame the dense analytical tools gracefully.
- **Horizontal Scrolling:** Market lists and filter tags overflow horizontally on compact viewports with invisible scroll indicators to maintain continuous edge-to-edge swiping.

## Elevation & Depth

Visual hierarchy is maintained through **flat structural containment** and **low-contrast micro-borders** rather than heavy drop shadows:

- **Surface Tiers:**
  - Base canvas: `#FFFFFF`
  - Subtle modules & control wells: `#F0F3FA`
  - Hover highlights: `rgba(41, 98, 255, 0.04)` or `#F8F9FD`
- **Borders & Gridlines:** 1px hairline dividers using `#E0E3EB` demarcate columns, table cells, and module boundaries.
- **Overlays & Popovers:** Dropdowns, contextual menus, and tooltip inspect bars use an ambient elevation: `0 4px 16px rgba(19, 23, 34, 0.08)`, combined with a 1px solid `#E0E3EB` border.

## Shapes

The geometric identity balances industrial precision with ergonomic touch points:
- **Base Geometry (`roundedness: 1`):** Micro-radii (`0.25rem` / 4px) across table rows, dropdowns, chart tools, and cards to maintain maximum screen packing without feeling sharp.
- **Pill Badges & Buttons:** Quick-filter chips, user profile buttons, and search capsules utilize full rounded corners (`9999px`) to distinguish actionable navigation controls from structured data cards.

## Components

### Buttons
- **Primary:** Background `#2962FF`, text `#FFFFFF`, rounded 6px or pill (`9999px`), 10px vertical padding, font-weight 600. Hover state: `#1E53E5`. Active state: `#1848CC`.
- **Secondary / Ghost:** Background `#F0F3FA`, text `#131722`, border 1px solid transparent. Hover: background `#E0E3EB`.
- **Action Dark:** Solid `#131722` pill button with `#FFFFFF` text, typically reserved for global primary calls-to-action like "Get started".

### Market Chips & Badges
- **Index / Ticker Badges:** Circular or pill emblem containing the ticker prefix, followed by symbol and live value.
- **Delta Indicator Badges:** Compact pill format. Green gainers use background `rgba(8, 153, 129, 0.12)` with `#089981` text. Red decliners use background `rgba(242, 54, 69, 0.12)` with `#F23645` text.

### Tables & Data Lists
- **Rows:** Fixed height (36px for ultra-dense, 48px for standard), separated by 1px bottom borders in `#F0F3FA`.
- **Numeric Cells:** Right-aligned, utilizing `tabular-md` or `tabular-sm` tokens for instant vertical scanning. Hover triggers `#F8F9FD` row tint.

### Inputs & Global Search Bar
- **Global Search:** Capsule pill shape with background `#F0F3FA`, borderless or hairline `#E0E3EB`, prepended with an icon and keyboard shortcut badge (`Ctrl+K` or `⌘K`).
- **Form Inputs:** 4px radius, 1px border `#E0E3EB`, `#131722` text. Focus state triggers a 2px outer outline in `#2962FF`.

### Cards & Sparkline Modules
- **Container:** Background `#FFFFFF` or `#F0F3FA`, border 1px solid `#E0E3EB`, internal padding `0.75rem` to `1.25rem`.
- **Sparkline Visual:** Vector SVG stroke line (1.5px width) colored either `#089981` or `#F23645` based on interval delta, accompanied by an optional subtle vertical gradient fade to transparent beneath the line.