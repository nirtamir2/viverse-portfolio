import { useEffect, useRef } from "react";
import { career, places, projects, writing } from "../portfolio";
import type { PanelId } from "../portfolio";

export function PortfolioPanel({
  panel,
  onSelect,
  onClose,
}: {
  panel: PanelId;
  onSelect: (id: PanelId) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      focused?.focus();
    };
  }, []);
  useEffect(() => {
    dialog.current?.scrollTo({ top: 0 });
  }, [panel]);
  return (
    <dialog
      ref={dialog}
      className="portfolio-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      aria-labelledby="panel-title"
    >
      <div className="panel-top">
        <span className="eyebrow">NIR’S LITTLE WORLD</span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>
      <div className="panel-tabs" aria-label="Portfolio sections">
        {places.map((place) => (
          <button
            key={place.id}
            className={panel === place.id ? "selected" : ""}
            aria-pressed={panel === place.id}
            onClick={() => onSelect(place.id)}
          >
            {place.id === "projects"
              ? "Projects"
              : place.id === "notes"
                ? "Writing"
                : place.id === "work"
                  ? "Experience"
                  : "About"}
          </button>
        ))}
      </div>
      <div className="panel-content">
        {panel === "about" && (
          <>
            <span className="section-number">01 / THE STUDIO</span>
            <h2 id="panel-title">
              Curiosity is
              <br />
              my compass.
            </h2>
            <p className="large-copy">
              I’m Nir, a frontend developer in Israel. I make interfaces, tools,
              and little worlds that feel good to use.
            </p>
            <p>
              I started programming at 16 and graduated from Bar-Ilan University
              with a BSc in Applied Mathematics at 19. Since then, I’ve been
              turning complicated ideas into thoughtful, accessible interfaces.
            </p>
            <p>
              I’m drawn to 3D, AI, smooth animation, and open source. When the
              right tool doesn’t exist, I like to build it.
            </p>
            <div className="tags">
              {[
                "React",
                "TypeScript",
                "Solid.js",
                "Three.js",
                "AI",
                "Accessibility",
                "Developer experience",
              ].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="contact-card">
              <span className="eyebrow">LET’S MAKE SOMETHING</span>
              <a href="mailto:me@nirtamir.com">me@nirtamir.com ↗</a>
              <div>
                <a
                  href="https://github.com/nirtamir2"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/nirtamir2"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://www.nirtamir.com/about"
                  target="_blank"
                  rel="noreferrer"
                >
                  More about me ↗
                </a>
              </div>
            </div>
          </>
        )}
        {panel === "work" && (
          <>
            <span className="section-number">02 / CAREER AVENUE</span>
            <h2 id="panel-title">
              A few stops
              <br />
              along the way.
            </h2>
            <p className="large-copy">
              From small teams to complex products. Always focused on making the
              frontend feel right.
            </p>
            <div className="timeline">
              {career.map((item, index) => (
                <div className="career-item" key={item.name}>
                  <span className="career-index">0{index + 1}</span>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.role}</p>
                    <span>{item.dates}</span>
                  </div>
                </div>
              ))}
            </div>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/nirtamir2"
              target="_blank"
              rel="noreferrer"
            >
              Find me on LinkedIn ↗
            </a>
          </>
        )}
        {panel === "projects" && (
          <>
            <span className="section-number">03 / THE PLAYGROUND</span>
            <h2 id="panel-title">
              Made out
              <br />
              of curiosity.
            </h2>
            <p className="large-copy">
              Experiments, useful tools, and things that exist simply because
              they’re fun.
            </p>
            <div className="article-list">
              {projects.map((project) => (
                <a
                  className="article-card"
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="eyebrow">{project.category}</span>
                  <h3>
                    {project.name}
                    <span>↗</span>
                  </h3>
                  <p>{project.description}</p>
                </a>
              ))}
            </div>
            <a
              className="text-link"
              href="https://www.nirtamir.com/projects"
              target="_blank"
              rel="noreferrer"
            >
              All projects ↗
            </a>
          </>
        )}
        {panel === "notes" && (
          <>
            <span className="section-number">04 / THE READING ROOM</span>
            <h2 id="panel-title">
              Build. Learn.
              <br />
              Pass it on.
            </h2>
            <p className="large-copy">
              Notes from the workbench, and ideas I’ve shared on stage.
            </p>
            <div className="article-list">
              {writing.map((article) => (
                <a
                  className="article-card"
                  key={article.name}
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="eyebrow">{article.category}</span>
                  <h3>
                    {article.name}
                    <span>↗</span>
                  </h3>
                  <p>{article.description}</p>
                </a>
              ))}
            </div>
            <a
              className="text-link"
              href="https://www.nirtamir.com/articles"
              target="_blank"
              rel="noreferrer"
            >
              Visit the blog ↗
            </a>
          </>
        )}
        {panel === "help" && (
          <>
            <span className="section-number">A SMALL FIELD GUIDE</span>
            <h2 id="panel-title">
              Take it
              <br />
              for a spin.
            </h2>
            <p className="large-copy">
              There’s no wrong turn. Drive to a building, then press E or Enter
              to peek inside.
            </p>
            <dl className="control-list">
              <div>
                <dt>
                  <kbd>W</kbd> <kbd>↑</kbd>
                </dt>
                <dd>Accelerate</dd>
              </div>
              <div>
                <dt>
                  <kbd>S</kbd> <kbd>↓</kbd>
                </dt>
                <dd>Brake, then reverse</dd>
              </div>
              <div>
                <dt>
                  <kbd>A</kbd> <kbd>D</kbd> / <kbd>←</kbd> <kbd>→</kbd>
                </dt>
                <dd>Steer</dd>
              </div>
              <div>
                <dt>
                  <kbd>Space</kbd>
                </dt>
                <dd>Handbrake / drift</dd>
              </div>
              <div>
                <dt>
                  <kbd>Shift</kbd>
                </dt>
                <dd>Boost</dd>
              </div>
              <div>
                <dt>
                  <kbd>J</kbd>
                </dt>
                <dd>Hop</dd>
              </div>
              <div>
                <dt>
                  <kbd>R</kbd>
                </dt>
                <dd>Return to the start</dd>
              </div>
              <div>
                <dt>
                  <kbd>E</kbd> / <kbd>Enter</kbd>
                </dt>
                <dd>Explore a nearby stop</dd>
              </div>
              <div>
                <dt>
                  <kbd>Esc</kbd>
                </dt>
                <dd>Close a panel</dd>
              </div>
            </dl>
            <p>
              Collect all ten gold rings in any order to complete the scenic
              route. Your best time stays on this device. Push the blocks
              around, find the ramp, or just wander.
            </p>
            <p>
              On a phone or tablet, hold the on-screen controls. You can steer
              and accelerate together. The top navigation opens every section
              without driving.
            </p>
            <button className="primary-button" onClick={onClose}>
              Got it. Let’s go ↗
            </button>
          </>
        )}
      </div>
      <div className="panel-footer">
        <span>Thanks for stopping by.</span>
        <button onClick={onClose}>Back to the world ↗</button>
      </div>
    </dialog>
  );
}
