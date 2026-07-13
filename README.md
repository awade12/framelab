# FrameLab

A polished, browser-based editor for building App Store and Google Play screenshots. Pick a device, drop in your UI, style the scene, and export store-ready PNGs — no accounts, no uploads, no watermarks.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwindcss)

**Maintainer:** Andrew Wade ([@awade12](https://github.com/awade12))

## Look & Feel

FrameLab is built around a focused dark editor that stays out of your way while you design.

- **Charcoal workspace** — `#0a0a0a` canvas with zinc-muted labels and crisp white preview cards
- **Three-panel layout** — collapsible left toolbar, center screenshot carousel, right inspector
- **Instant feedback** — every slider, color pick, and drag updates the preview in real time
- **Quick actions up front** — templates, undo/redo, duplicate screen, and apply-style-to-all live in the left sidebar
- **Polished modals** — font picker, starter templates, export progress, and a post-export GitHub prompt with amber accents
- **More canvas when you need it** — collapse the left sidebar to give the preview room to breathe

Everything runs client-side. Projects auto-save to `localStorage`, so you can close the tab and pick up where you left off.

## Features

### Device Frames

- 6 realistic mockups — iPhone 15 Pro Max, iPhone 15 Pro, iPhone 14, iPad Pro 12.9", Samsung Galaxy S24 Ultra, Samsung Galaxy Tab S9
- Multiple frame colors per device
- Multi-device layouts with independent transforms, shadows, and screen images
- Cross-screen overflow — drag a device past the edge to continue it on the next screenshot
- Flat 2D and 3D rendering with Rotate X / Rotate Y controls
- Frameless mode — hide the hardware bezel and show just the screen
- Screen zoom and pan inside each device
- Status bar overlay — time, battery, signal, Wi‑Fi, light/dark style

### Backgrounds & Typography

- 60+ solid color presets plus custom picker
- 6 gradient presets — Sunset, Ocean, Mint, Berry, Royal, Rose
- Rich text for headlines and subheadlines — bold, italic, underline, color, alignment, rounded highlights
- Google Fonts catalog with categories, search, lazy loading, and live preview
- Drag headlines and subheadlines anywhere on the canvas

### Overlays & Layout

- Unlimited overlay images with resize, rotation, layer order, and per-image shadows
- 8 layout presets — Centered, Bleed Bottom, Bleed Top, Float Center, Float Bottom, Tilt Left, Tilt Right, Perspective
- Device scale, vertical offset, rotation, and shadow controls

### Workflow

- Starter templates — launch with pre-built screenshot sets
- Multiple projects — create, rename, switch, and delete
- Undo / redo, duplicate screen, apply style to all screenshots
- Multi-screenshot carousel for full store sets
- Auto-save to `localStorage`

### Export

- Batch export — ZIP for multiple screenshots, PNG for one
- App Store sizes — 6.9", 6.7", and landscape presets at exact Apple pixel dimensions
- iPad and Play Store phone sizes
- Quality tiers for non-App Store exports — Standard, High (2×), Ultra (3×)
- Live export progress modal
- Pixel-perfect output with 3D, status bars, and cross-screen layouts preserved

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
git clone https://github.com/awade12/framelab.git
cd framelab
bun install
bun run dev
```

Open `http://localhost:5173`

### Production Build

```bash
bun run build
```

Output lands in `dist/`.

## Tech Stack

- **React 19** + **TanStack Router**
- **Tailwind CSS 4**
- **Vite 7**
- **Vitest**
- **Bun**
- **JSZip** for batch export
- **Canvas API** for rendering and export

## Project Structure

```
src/
├── components/
│   ├── CanvasPreview/       # Screenshot carousel and device rendering
│   ├── DeviceFrame/         # Flat, 3D, and frameless device mockups
│   ├── FontPicker/          # Google Fonts catalog UI
│   ├── LeftSidebar/         # Devices, quick actions, export
│   ├── RightSidebar/        # Layout, appearance, status bar, overlays
│   ├── TemplatesModal.tsx   # Starter screenshot templates
│   ├── ExportProgressModal.tsx
│   └── GitHubStarModal.tsx
├── context/
│   └── EditorContext.tsx    # Global editor state, undo/redo, export
├── lib/
│   ├── export-utils.ts      # Canvas export pipeline
│   ├── templates.ts         # Built-in screenshot templates
│   ├── status-bar.ts        # Status bar rendering helpers
│   └── device-overflow.ts   # Cross-screen device math
├── routes/
│   └── index.tsx
└── constants.ts             # Devices, colors, gradients, export sizes
```

## Usage

1. Open **Templates** or pick a device from the left sidebar
2. Upload your app screenshot into the device screen
3. Add more devices, overlays, and text as needed
4. Tune background, fonts, layout, shadows, and 3D angles in the right sidebar
5. Toggle the status bar or switch to frameless mode for cleaner compositions
6. Add more screenshots to the carousel for a full store set
7. Choose an export size and download

## License

Proprietary. All rights reserved. See [LICENSE](LICENSE).

## Contact

- GitHub: [@awade12](https://github.com/awade12)
- Email: awade75009@gmail.com
- Issues: [github.com/awade12/framelab/issues](https://github.com/awade12/framelab/issues)
