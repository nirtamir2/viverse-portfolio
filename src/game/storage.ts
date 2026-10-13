import type { PlaceId } from "../portfolio";

const key = "nir-playground-v1";
export interface Progress {
  visited: PlaceId[];
  best: number | null;
}
export function readProgress(): Progress {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!data || typeof data !== "object") return { visited: [], best: null };
    const value = data as Record<string, unknown>;
    return {
      visited: Array.isArray(value.visited)
        ? [
            ...new Set(
              value.visited.filter((id): id is PlaceId =>
                ["about", "work", "projects", "notes"].includes(id),
              ),
            ),
          ]
        : [],
      best:
        typeof value.best === "number" &&
        Number.isFinite(value.best) &&
        value.best > 0
          ? value.best
          : null,
    };
  } catch {
    return { visited: [], best: null };
  }
}
export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    /* Gameplay also works with storage disabled. */
  }
}
