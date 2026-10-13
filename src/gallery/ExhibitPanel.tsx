import { useEffect, useRef } from "react";
import { companies, exhibits, projects, type ExhibitId } from "./content";

const external = { target: "_blank", rel: "noreferrer" };

export function ExhibitPanel({
  id,
  onClose,
  onSelect,
}: {
  id: ExhibitId | null;
  onClose: () => void;
  onSelect: (id: ExhibitId) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = exhibits.find((exhibit) => exhibit.id === id);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (id && !dialog.open) dialog.showModal();
    if (!id && dialog.open) dialog.close();
    dialog.querySelector(".panel-content")?.scrollTo(0, 0);
  }, [id]);
  return (
    <dialog
      ref={ref}
      className="exhibit-panel"
      aria-labelledby="exhibit-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      {item && (
        <>
          <header className="panel-header">
            <span>
              THE COLLECTION /{" "}
              {(exhibits.indexOf(item) + 1).toString().padStart(2, "0")}
            </span>
            <button
              className="panel-close"
              aria-label="Close exhibit and return to walking"
              onClick={onClose}
            >
              ×
            </button>
          </header>
          <div className="panel-content">
            <p className="eyebrow">{item.subtitle}</p>
            <h1 id="exhibit-title">{item.title}</h1>
            <div className="panel-rule" style={{ background: item.color }} />
            {id === "about" && (
              <>
                <p className="panel-lead">
                  Hi, I’m Nir. I build interfaces, tools, and little worlds.
                </p>
                <p>
                  I’m a frontend developer from Israel, with a soft spot for
                  thoughtful UI, React, TypeScript, and Solid.js.
                </p>
                <p>
                  I love making things feel effortless. Sometimes that means a
                  polished interface. Sometimes it’s a browser extension, a CLI,
                  or a tiny open-source tool that makes the day a little easier.
                </p>
                <p>
                  Off the canvas, I’m usually organizing ideas in Obsidian,
                  exploring a new tool, or finding another keyboard shortcut.
                </p>
                <a
                  className="panel-link"
                  href="https://www.nirtamir.com/about"
                  {...external}
                >
                  A little more about me <span>↗</span>
                </a>
              </>
            )}
            {id === "projects" && (
              <>
                <p className="panel-lead">
                  Things I made because I wanted them to exist.
                </p>
                <div className="project-list">
                  {projects.map((project) => (
                    <a key={project.title} href={project.href} {...external}>
                      <small>{project.kind}</small>
                      <h2>
                        {project.title}
                        <span>↗</span>
                      </h2>
                      <p>{project.description}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
            {id === "skills" && (
              <>
                <p className="panel-lead">
                  Good tools leave more room for the idea.
                </p>
                <h2>Interfaces</h2>
                <div className="tool-tags">
                  {[
                    "TypeScript",
                    "React",
                    "Solid.js",
                    "Next.js",
                    "Tailwind CSS",
                  ].map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
                <h2>Little worlds</h2>
                <div className="tool-tags">
                  {[
                    "Three.js",
                    "React Three Fiber",
                    "Animation",
                    "Interaction design",
                  ].map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
                <h2>Everyday craft</h2>
                <div className="tool-tags">
                  {[
                    "WebStorm",
                    "Git",
                    "Obsidian",
                    "Developer experience",
                    "Open source",
                  ].map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </div>
                <p>
                  I care about expressive interfaces and code that stays easy to
                  work with.
                </p>
              </>
            )}
            {id === "career" && (
              <>
                <p className="panel-lead">
                  Different teams. Different problems. Always building.
                </p>
                <p>
                  A few places along the way, represented by the original
                  company logos in this gallery.
                </p>
                <ol className="career-list">
                  {companies.map((company, index) => (
                    <li key={company.name}>
                      <span>{(index + 1).toString().padStart(2, "0")}</span>
                      <h2>{company.name}</h2>
                    </li>
                  ))}
                </ol>
                <a
                  className="panel-link"
                  href="https://www.linkedin.com/in/nirtamir2"
                  {...external}
                >
                  The full story on LinkedIn <span>↗</span>
                </a>
              </>
            )}
            {id === "notes" && (
              <>
                <p className="panel-lead">
                  Build something. Learn something. Pass it on.
                </p>
                <p>
                  I write about frontend development, tools, and the ideas I’m
                  exploring. I also give talks on React, TypeScript, and
                  bringing 3D to the web.
                </p>
                <a
                  className="panel-link"
                  href="https://www.nirtamir.com/articles"
                  {...external}
                >
                  Read my articles <span>↗</span>
                </a>
                <a
                  className="panel-link"
                  href="https://www.nirtamir.com/talks"
                  {...external}
                >
                  Watch a talk <span>↗</span>
                </a>
                <a
                  className="panel-link"
                  href="https://nirtamir.substack.com"
                  {...external}
                >
                  Notes in your inbox <span>↗</span>
                </a>
              </>
            )}
            {id === "contact" && (
              <>
                <p className="panel-lead">Have an idea? I’d love to hear it.</p>
                <p>
                  Whether it’s a product, an interesting frontend challenge, or
                  a small experiment, let’s start a conversation.
                </p>
                <a
                  className="panel-link"
                  href="https://www.linkedin.com/in/nirtamir2"
                  {...external}
                >
                  Connect on LinkedIn <span>↗</span>
                </a>
                <a
                  className="panel-link"
                  href="https://github.com/nirtamir2"
                  {...external}
                >
                  Find me on GitHub <span>↗</span>
                </a>
                <a
                  className="panel-link"
                  href="https://twitter.com/NirTamir"
                  {...external}
                >
                  Say hello on X <span>↗</span>
                </a>
              </>
            )}
          </div>
          <footer className="panel-footer">
            <button
              onClick={() =>
                onSelect(
                  exhibits[(exhibits.indexOf(item) + 1) % exhibits.length].id,
                )
              }
            >
              Next exhibit <span>→</span>
            </button>
            <button onClick={onClose}>Back to the gallery</button>
          </footer>
        </>
      )}
    </dialog>
  );
}
