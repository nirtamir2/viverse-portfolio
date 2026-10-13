import { useEffect, useRef } from "react";
import type { PointerEvent, RefObject } from "react";
import { emptyInput } from "../game/engine";
import type { Input } from "../game/engine";

export function TouchControls({
  input,
  active,
}: {
  input: RefObject<Input>;
  active: boolean;
}) {
  const held = useRef(new Map<number, string>());
  const apply = () => {
    const keys = [...held.current.values()];
    input.current = {
      throttle:
        Number(keys.includes("forward")) - Number(keys.includes("reverse")),
      steering: Number(keys.includes("left")) - Number(keys.includes("right")),
      brake: keys.includes("brake"),
      boost: keys.includes("boost"),
    };
  };
  useEffect(() => {
    const clear = () => {
      held.current.clear();
      input.current = emptyInput();
    };
    if (!active) clear();
    window.addEventListener("blur", clear);
    return () => window.removeEventListener("blur", clear);
  }, [active, input]);
  function release(event: PointerEvent<HTMLButtonElement>) {
    held.current.delete(event.pointerId);
    apply();
  }
  function control(action: string, glyph: string) {
    return (
      <button
        key={action}
        disabled={!active}
        aria-label={action}
        onContextMenu={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          held.current.set(event.pointerId, action);
          apply();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        {glyph}
      </button>
    );
  }
  return (
    <div className="touch-controls" aria-label="Touch driving controls">
      <div className="touch-steering">
        {[
          ["left", "←"],
          ["right", "→"],
        ].map(([action, glyph]) => control(action, glyph))}
      </div>
      <div className="touch-pedals">
        {[
          ["reverse", "↓"],
          ["brake", "Drift"],
          ["forward", "↑"],
          ["boost", "Boost"],
        ].map(([action, glyph]) => control(action, glyph))}
      </div>
    </div>
  );
}
