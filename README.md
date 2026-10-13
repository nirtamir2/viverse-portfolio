# Nir’s little world

A playful driving portfolio inspired by Bruno Simon’s explorable website: a small low-poly island, four portfolio destinations, a gold-ring challenge, and a car with arcade handling.

## Run

Use Node 22.12+ and the pnpm version specified in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check       # TypeScript, behavior tests, formatting
pnpm build       # TypeScript + production bundle
pnpm preview     # Serve the production build
pnpm audit       # Check dependency advisories
```

`pnpm deploy` retains the existing Viverse publishing command. Build first; deployment needs the existing environment configuration and `viverse-cli` available in the shell.

## Play

| Input | Action |
| --- | --- |
| W / ↑ | Accelerate |
| S / ↓ | Brake and reverse |
| A D / ← → | Steer |
| Space | Handbrake / drift |
| Shift | Boost |
| J | Hop |
| R | Respawn, keeping route progress |
| E / Enter | Open a nearby portfolio stop |
| Escape | Close a panel |

Touch devices have controls that support holding multiple buttons together. Input resets on window blur, pointer cancellation, and opening a panel. The simulation pauses while reading a panel or when the tab is hidden.

Collect the ten gold rings in any order. The timer starts at the first ring and stops at the last. Restarting the scenic route clears the current attempt. Best times and discovered sections are saved locally, with a graceful fallback if storage is blocked. No account or server is needed.

Every section is also available through navigation. A readable portfolio remains available when WebGL cannot start or its context is lost.

## Edit

- `src/portfolio.ts`: biography destinations, career dates, projects, and writing links.
- `src/components/PortfolioPanel.tsx`: readable portfolio content and control guide.
- `src/game/engine.ts`: deterministic 120 Hz simulation, grip, drifting, collisions, ramp, collectibles, and route timing.
- `src/game/World.tsx`: scene, car, camera, and rendering quality.
- `src/components/TouchControls.tsx`: pointer input.
- `src/styles.css`: responsive interface.

The former walking prototype and its assets are retained, including the existing floor and career timeline edits. They are not imported by the new entry point. `@react-three/viverse`, Drei, and Three stdlib remain available for those components; the unused UIKit dependency was removed.

## Content sources

The requested `../blog` directory was absent. The biography was found at `../blogs/nirtamir.com/src/pages/about.md`. Current details were checked against [About](https://www.nirtamir.com/about), [Projects](https://www.nirtamir.com/projects), [Writing](https://www.nirtamir.com/articles), [Talks](https://www.nirtamir.com/talks), and the [career list](https://www.nirtamir.com) on October 13, 2026. The app contains a curated selection, with links to the full portfolio.

## Performance choices

The interface loads separately from the 3D scene. The scene uses procedural geometry and local canvas text textures, so startup requires no avatar, model, animation, environment, decoder, or external font downloads. Static objects are merged into vertex-colored batches; trees and dust use instancing. Simulation updates mutate refs, and the DOM HUD updates at 10 Hz. The introductory and paused scenes render on demand.

Auto quality caps pixel density at 1.5 and reduces it to 1 when sustained frame time is high. Low quality uses pixel density 1 and disables shadows; high quality caps it at 2. A single 1024² shadow map is used. Frame catch-up is limited to 100 ms to avoid jumps after stalls.

The original build shipped approximately 1.27 MB of gzipped JavaScript across the app and animation chunks. The new build is approximately 324 KB across the interface and world chunks (about 74% less), before any hosting-specific compression. These are bundle-size measurements, not a universal frame-rate claim.

The behavior tests cover driving, reverse steering, boost, drift grip, frame-rate independence, bounded catch-up, island and building collisions, movable blocks, the ramp, route completion/reset, and corrupt or denied browser storage. Browser checks cover the production build, keyboard input, ring collection, modal pause/resume and focus, simulated multi-pointer controls, responsive layouts, and WebGL fallback.

Dependency overrides select patched compatible versions of PostCSS, Nano ID, fflate, source-map-js, and YAML needed by retained prototype/tooling dependencies. The complete dependency audit passes.
