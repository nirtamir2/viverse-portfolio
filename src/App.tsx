import { Canvas } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Scene, type WorldStatus } from "./Scene";
import { exhibits, type ExhibitId } from "./gallery/content";
import { ExhibitPanel } from "./gallery/ExhibitPanel";
import "./gallery/gallery.css";

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function App() {
  const [status, setStatus] = useState<WorldStatus>({
    ready: false,
    nearby: null,
    x: 0,
    z: 2,
    height: -2,
  });
  const [panel, setPanel] = useState<ExhibitId | null>(null);
  const [visited, setVisited] = useState<ExhibitId[]>([]);
  const [quality, setQuality] = useState<"full" | "light">("full");
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  const [reset, setReset] = useState(0);
  const [hidden, setHidden] = useState(document.hidden);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nearby = exhibits.find((item) => item.id === status.nearby);
  const open = useCallback((id: ExhibitId) => {
    setPanel(id);
    setVisited((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  }, []);
  const close = useCallback(() => {
    setPanel(null);
    requestAnimationFrame(() => canvasRef.current?.focus());
  }, []);

  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        panel ||
        (event.target instanceof HTMLElement &&
          event.target.closest("button, a, input, textarea, select"))
      )
        return;
      if (event.code === "KeyE" && status.nearby && !event.repeat) {
        event.preventDefault();
        open(status.nearby);
      }
      if (event.code === "KeyR" && !event.repeat) {
        event.preventDefault();
        setReset((value) => value + 1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [panel, status.nearby, open]);

  return (
    <main className="gallery-app">
      <SceneBoundary onFailure={fail}>
        <Canvas
          className="world-canvas"
          camera={{ fov: 58, position: [0, 3, 8], near: 0.1, far: 100 }}
          dpr={quality === "full" ? [1, 1.25] : 1}
          shadows={quality === "full"}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvasRef.current = canvas;
            canvas.setAttribute(
              "aria-label",
              "Walk through Nir Tamir’s glass gallery. WASD or arrow keys to move, Space to jump, E to explore.",
            );
            canvas.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              setFailed(true);
            });
          }}
          fallback="Your browser can’t show the 3D gallery. Browse the collection below."
        >
          <Suspense fallback={null}>
            <Scene
              paused={!!panel || hidden || failed}
              quality={quality}
              reset={reset}
              onStatus={setStatus}
              onOpen={open}
            />
          </Suspense>
        </Canvas>
      </SceneBoundary>

      <header className="gallery-header">
        <a
          className="signature"
          href="https://www.nirtamir.com"
          target="_blank"
          rel="noreferrer"
        >
          <span className="monogram">nt.</span>
          <span>
            Nir Tamir<small>DEVELOPER & MAKER</small>
          </span>
        </a>
        <nav aria-label="Portfolio links">
          <button onClick={() => open("about")}>About</button>
          <button onClick={() => open("projects")}>Selected work</button>
          <a
            href="https://github.com/nirtamir2"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <div className="gallery-caption" aria-hidden="true">
        <span className="status-dot" />
        THE GLASS GALLERY
        <span className="caption-divider" />
        <span className="caption-subtitle">AN EXPLORABLE PORTFOLIO</span>
      </div>

      {!status.ready && !failed && (
        <div className="loading-gallery" role="status">
          <span className="loading-orbit" />
          <p>
            Opening the gallery<small>A little world, made to wander.</small>
          </p>
        </div>
      )}
      {failed && (
        <div className="world-message" role="status">
          The 3D gallery is unavailable.
          <br />
          You can still explore every exhibit using the collection below.
        </div>
      )}

      <aside
        className="collection glass-surface"
        aria-label="Gallery collection"
      >
        <div className="collection-title">
          <span>THE COLLECTION</span>
          <span>{visited.length.toString().padStart(2, "0")} / 06</span>
        </div>
        <div className="collection-map" aria-hidden="true">
          <svg viewBox="0 0 164 118">
            <path d="M82 106V16M28 93H137M28 51H137M28 51V93M137 51V93" />
            <circle className="map-spawn" cx="82" cy="106" r="4" />
            {exhibits.map((item) => (
              <circle
                key={item.id}
                cx={82 + item.position[0] * 5}
                cy={106 + item.position[2] * 3.7}
                r={status.nearby === item.id ? 5 : 3}
                className={
                  visited.includes(item.id) ? "map-visited" : "map-exhibit"
                }
              />
            ))}
            <circle
              className="map-player"
              cx={Math.max(5, Math.min(159, 82 + status.x * 5))}
              cy={Math.max(5, Math.min(113, 106 + status.z * 3.7))}
              r="3.5"
            />
          </svg>
        </div>
        <ol>
          {exhibits.map((item, index) => (
            <li key={item.id}>
              <button
                onClick={() => open(item.id)}
                className={status.nearby === item.id ? "nearby" : ""}
              >
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                {item.shortTitle}
                <span
                  className="collection-check"
                  aria-label={
                    visited.includes(item.id) ? "Viewed" : "Not viewed"
                  }
                >
                  {visited.includes(item.id) ? "✓" : "↗"}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </aside>

      {status.ready && !panel && !failed && (
        <div
          className="explore-prompt glass-surface"
          key={nearby?.id ?? "wander"}
        >
          {nearby ? (
            <>
              <span className="prompt-label">YOU’VE FOUND AN EXHIBIT</span>
              <button onClick={() => open(nearby.id)}>
                <span>{nearby.title}</span>
                <span className="open-key">
                  <kbd>E</kbd> Explore <span aria-hidden="true">↗</span>
                </span>
              </button>
            </>
          ) : (
            <>
              <span className="prompt-label">TAKE YOUR TIME</span>
              <p>Walk closer. There’s more to discover.</p>
            </>
          )}
        </div>
      )}

      <footer className="gallery-footer">
        <div className="controls">
          <span>
            <kbd>WASD</kbd> / <kbd>↑↓←→</kbd> Walk
          </span>
          <span>
            <kbd>SHIFT</kbd> Run
          </span>
          <span>
            <kbd>SPACE</kbd> Jump
          </span>
          <span>Drag to look</span>
        </div>
        <div className="scene-settings">
          <button
            onClick={() => {
              setReset((value) => value + 1);
              canvasRef.current?.focus();
            }}
            aria-label="Return character to the entrance"
          >
            ↺ <span>Entrance</span>
          </button>
          <button
            onClick={() => {
              setQuality((value) => (value === "full" ? "light" : "full"));
              canvasRef.current?.focus();
            }}
            aria-label={`Visual quality: ${quality === "full" ? "full reflections" : "lighter rendering"}. Toggle visual quality.`}
          >
            {quality === "full" ? "◈" : "◇"}{" "}
            <span>{quality === "full" ? "Full" : "Light"}</span>
          </button>
        </div>
      </footer>
      <ExhibitPanel id={panel} onClose={close} onSelect={open} />
    </main>
  );
}
