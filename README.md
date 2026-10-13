# Nir Tamir · Glass gallery

An explorable portfolio built on the original `main` scene: Nir’s VRM avatar, refractive glass platforms, reflective floor, floating bubbles, and sculpted name.

## Run

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Walk with WASD or arrows, hold Shift to run, press Space to jump, and drag to look around. Approach an exhibit and press E to open it. R or Entrance returns the character to the start. Touch devices have a joystick and jump button. The collection also opens every exhibit directly.

The six exhibits cover about, projects, toolkit, career, writing/talks, and contact. Biography and project descriptions come from the adjacent blog repositories. Original logo and character assets remain in use.

## Rendering and controls

Glass objects share one scene capture. Floor reflection resolution is 512 instead of 2048; bubble caustics render once at 256. DPR is capped, glass sampling is reduced, and the name uses fewer geometry segments. Light mode reduces glass capture resolution and replaces the floor reflection with a standard material. The scene is memoized so map updates do not rebuild the world.

The character controller clamps frame catch-up and pauses while reading an exhibit or when the page is hidden. Closing an exhibit restores keyboard focus to the canvas. The DOM collection remains available if WebGL fails.

`@react-three/viverse` is upgraded to 0.2.29. Its React timeline dependency is pinned to 0.3.7 because later 0.3.x releases remove the `GrapthState` export required by that release. The vanilla character controller runs the original avatar and animations; React manages its lifecycle and input bindings.

## Branch

`feature/glass-world-exploration` starts at local `main` (`95b314c`). The rejected driving experiment remains on its separate branch. Pre-existing `ai-changes` floor and timeline edits are preserved in the stash named “Preserve ai-changes floor and timeline edits before glass exploration”.
