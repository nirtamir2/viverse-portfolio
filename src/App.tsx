import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { places } from "./portfolio";
import type { PanelId, PlaceId } from "./portfolio";
import {
  createGame,
  emptyInput,
  respawn,
  restartRoute,
  tokens,
} from "./game/engine";
import { readProgress, saveProgress } from "./game/storage";
import { PortfolioPanel } from "./components/PortfolioPanel";
import { TouchControls } from "./components/TouchControls";
import { WorldBoundary } from "./components/WorldBoundary";
import "./styles.css";

const World = lazy(() => import("./game/World"));
const formatTime = (time: number) =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toFixed(1).padStart(4, "0")}`;

export function App() {
  const game = useRef(createGame()),
    input = useRef(emptyInput());
  const [started, setStarted] = useState(false),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null),
    [quality, setQuality] = useState<"auto" | "low" | "high">("auto");
  const [hidden, setHidden] = useState(document.hidden),
    [progress, setProgress] = useState(readProgress);
  const [hud, setHud] = useState({
    x: 0,
    z: 8,
    heading: 0,
    speed: 0,
    rings: 0,
    elapsed: 0,
    finished: false,
    nearby: null as PlaceId | null,
  });
  const active = started && ready && !panel && !hidden && !failed;
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setFailed(true);
    setPanel("about");
  }, []);
  const onTick = useCallback(() => {
    const state = game.current;
    setHud({
      x: state.x,
      z: state.z,
      heading: state.heading,
      speed: state.speed,
      rings: state.collected.size,
      elapsed: state.elapsed,
      finished: state.finished,
      nearby: state.nearby,
    });
  }, []);
  const openPanel = useCallback((id: PanelId) => {
    input.current = emptyInput();
    setPanel(id);
    if (id !== "help")
      setProgress((previous) =>
        previous.visited.includes(id)
          ? previous
          : { ...previous, visited: [...previous.visited, id] },
      );
  }, []);
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);
  useEffect(() => {
    if (hud.finished)
      setProgress((previous) =>
        previous.best === null || hud.elapsed < previous.best
          ? { ...previous, best: hud.elapsed }
          : previous,
      );
  }, [hud.finished, hud.elapsed]);
  useEffect(() => {
    const visibility = () => {
      setHidden(document.hidden);
      input.current = emptyInput();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    const keys = new Set<string>();
    const update = () => {
      input.current = {
        throttle:
          Number(keys.has("KeyW") || keys.has("ArrowUp")) -
          Number(keys.has("KeyS") || keys.has("ArrowDown")),
        steering:
          Number(keys.has("KeyA") || keys.has("ArrowLeft")) -
          Number(keys.has("KeyD") || keys.has("ArrowRight")),
        brake: keys.has("Space"),
        boost: keys.has("ShiftLeft") || keys.has("ShiftRight"),
      };
    };
    const keydown = (event: KeyboardEvent) => {
      if (
        !active ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            'input, select, textarea, dialog, [contenteditable="true"]',
          ))
      )
        return;
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("button, a") &&
        ["Space", "Enter"].includes(event.code)
      )
        return;
      if (
        [
          "KeyW",
          "KeyS",
          "KeyA",
          "KeyD",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "ShiftLeft",
          "ShiftRight",
        ].includes(event.code)
      ) {
        event.preventDefault();
        keys.add(event.code);
        update();
      }
      if (event.repeat) return;
      if (event.code === "KeyR") {
        respawn(game.current);
        onTick();
      }
      if (event.code === "KeyJ" && game.current.height < 0.1)
        game.current.verticalSpeed = 5;
      if (["KeyE", "Enter"].includes(event.code) && game.current.nearby) {
        event.preventDefault();
        openPanel(game.current.nearby);
      }
    };
    const keyup = (event: KeyboardEvent) => {
      keys.delete(event.code);
      update();
    };
    const blur = () => {
      keys.clear();
      input.current = emptyInput();
    };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
      input.current = emptyInput();
    };
  }, [active, onTick, openPanel]);
  const nearby = places.find((place) => place.id === hud.nearby);
  return (
    <main className={`app ${started ? "is-playing" : ""}`}>
      <header className="site-header">
        <a
          className="wordmark"
          href="https://www.nirtamir.com"
          aria-label="Nir Tamir’s main website"
        >
          nir tamir<span className="wordmark-spark">✳</span>
          <small>DEVELOPER & CURIOUS HUMAN</small>
        </a>
        <nav aria-label="Main navigation">
          {places.map((place) => (
            <button key={place.id} onClick={() => openPanel(place.id)}>
              {place.id === "about"
                ? "About"
                : place.id === "work"
                  ? "Experience"
                  : place.id === "projects"
                    ? "Projects"
                    : "Writing"}
              <span
                className={
                  progress.visited.includes(place.id) ? "visited-dot" : ""
                }
              />
            </button>
          ))}
          <a className="contact-link" href="mailto:me@nirtamir.com">
            Let’s talk <span>↗</span>
          </a>
        </nav>
      </header>
      <section className="intro" aria-label="Welcome">
        <div className="eyebrow">
          <span className="status-dot" /> A PORTFOLIO YOU CAN PLAY
        </div>
        <h1>
          A little world. <br />A lot of <br />
          <em>curiosity.</em>
        </h1>
        <p>
          I’m Nir. I build interfaces, useful tools,
          <br className="desktop-break" /> and things that make you smile.
        </p>
        {!started ? (
          <>
            <button
              className="primary-button"
              disabled={!ready && !failed}
              onClick={(event) => {
                if (failed) openPanel("about");
                else setStarted(true);
                event.currentTarget.blur();
              }}
            >
              {failed
                ? "Explore the portfolio"
                : ready
                  ? "Let’s take a drive"
                  : "Preparing your ride"}
              <span>↗</span>
            </button>
            <button className="quiet-button" onClick={() => openPanel("about")}>
              Or, just have a look around ↗
            </button>
          </>
        ) : (
          <div className="playing-note">
            <span>THE WORLD IS YOURS.</span>
            <p>
              Follow your curiosity.
              <br />
              There’s something at every stop.
            </p>
          </div>
        )}
      </section>
      <div className="world" aria-label="Interactive driving playground">
        <WorldBoundary onFailure={onFailure}>
          {failed ? (
            <div className="world-fallback">
              Explore the portfolio using the navigation above.
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="world-loading">
                  <span />
                  Building a little world…
                </div>
              }
            >
              <World
                game={game}
                input={input}
                active={active}
                quality={quality}
                onTick={onTick}
                onReady={onReady}
                onFailure={onFailure}
              />
            </Suspense>
          )}
        </WorldBoundary>
      </div>
      <div className="world-caption">
        <span className="caption-line" /> BUILT TO EXPLORE. MADE TO ENJOY.
      </div>
      <aside className="exploration">
        <span className="eyebrow">YOUR FIELD NOTES</span>
        <div className="exploration-count">
          <strong>
            {progress.visited.length}
            <span>/ 4</span>
          </strong>
          <span>
            places
            <br />
            discovered
          </span>
        </div>
        <div className="discovery-dots">
          {places.map((place) => (
            <button
              key={place.id}
              onClick={() => openPanel(place.id)}
              aria-label={`Explore ${place.name}`}
              title={place.name}
              style={{
                background: progress.visited.includes(place.id)
                  ? place.color
                  : undefined,
              }}
            />
          ))}
        </div>
      </aside>
      {started && (
        <>
          <div className={`route-card ${hud.finished ? "completed" : ""}`}>
            <span className="sr-only" role="status">
              {hud.finished
                ? "Scenic route complete!"
                : `${hud.rings} of ${tokens.length} rings collected`}
            </span>
            <div>
              <span className="eyebrow">
                {hud.finished ? "SCENIC ROUTE COMPLETE" : "THE SCENIC ROUTE"}
              </span>
              <strong>
                {hud.rings}
                <span> / {tokens.length} rings</span>
              </strong>
            </div>
            <div className="route-time">
              {formatTime(hud.elapsed)}
              <small>
                {progress.best
                  ? `Best ${formatTime(progress.best)}`
                  : "Collect the gold rings"}
              </small>
            </div>
            <button
              className="restart-route"
              onClick={(event) => {
                restartRoute(game.current);
                onTick();
                event.currentTarget.blur();
              }}
              aria-label="Restart scenic route"
              title="Restart scenic route"
            >
              {hud.finished ? "Drive it again ↗" : "↺"}
            </button>
          </div>
          {nearby && !panel && (
            <button
              className="interaction-prompt"
              onClick={() => openPanel(nearby.id)}
            >
              <kbd>E</kbd>
              <span>
                Explore <strong>{nearby.name}</strong>
              </span>
              <span>↗</span>
            </button>
          )}
          <div
            className="driving-hud"
            data-x={hud.x.toFixed(3)}
            data-z={hud.z.toFixed(3)}
          >
            <div className="speed">
              <strong>{Math.round(hud.speed * 6)}</strong>
              <span>KM/H</span>
            </div>
            <div className="mini-map" aria-label="Map of the playground">
              <svg
                viewBox="-24 -23 48 46"
                role="img"
                aria-label="Your position and the four portfolio stops"
              >
                <rect
                  x="-22"
                  y="-20"
                  width="44"
                  height="40"
                  rx="4"
                  fill="#ece6d8"
                />
                <rect
                  x="-17"
                  y="-14"
                  width="34"
                  height="28"
                  rx="6"
                  fill="none"
                  stroke="#c8c0ac"
                  strokeWidth="2"
                />
                {places.map((place) => (
                  <rect
                    key={place.id}
                    x={place.x - 2}
                    y={place.z - 2}
                    width="4"
                    height="4"
                    rx="0.6"
                    fill={place.color}
                  />
                ))}
                {tokens.map(([x, z], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={z}
                    r="0.65"
                    fill={game.current.collected.has(i) ? "#c8c0ac" : "#daa842"}
                  />
                ))}
                <path
                  d="M 0 -2.5 L 1.7 1.8 L 0 1 L -1.7 1.8 Z"
                  fill="#c85d39"
                  transform={`translate(${hud.x} ${hud.z}) rotate(${(-hud.heading * 180) / Math.PI})`}
                />
              </svg>
            </div>
          </div>
          <TouchControls input={input} active={active} />
        </>
      )}
      <footer className="site-footer">
        <div className="control-hints">
          <span>
            <kbd>W A S D</kbd> / <kbd>↑ ← ↓ →</kbd> Drive
          </span>
          <span>
            <kbd>Space</kbd> Drift
          </span>
          <span>
            <kbd>Shift</kbd> Boost
          </span>
        </div>
        <div className="world-actions">
          <button
            onClick={(event) => {
              respawn(game.current);
              onTick();
              event.currentTarget.blur();
            }}
            title="Return to the start (R)"
          >
            ↺ <span>Reset car</span>
          </button>
          <button
            onClick={(event) => {
              setQuality((previous) =>
                previous === "auto"
                  ? "low"
                  : previous === "low"
                    ? "high"
                    : "auto",
              );
              event.currentTarget.blur();
            }}
            aria-label={`Quality: ${quality}. Click to change.`}
          >
            ◈{" "}
            <span>
              {quality === "auto"
                ? "Auto quality"
                : quality === "low"
                  ? "Low quality"
                  : "High quality"}
            </span>
          </button>
          <button
            className="help-button"
            onClick={() => openPanel("help")}
            aria-label="How to play"
          >
            ?
          </button>
        </div>
      </footer>
      {panel && (
        <PortfolioPanel
          panel={panel}
          onSelect={openPanel}
          onClose={() => setPanel(null)}
        />
      )}
    </main>
  );
}
