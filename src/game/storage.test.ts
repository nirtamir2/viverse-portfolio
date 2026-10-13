import { afterEach, describe, expect, it, vi } from "vitest";
import { readProgress, saveProgress } from "./storage";

afterEach(() => vi.unstubAllGlobals());
describe("local progress", () => {
  it("returns safe defaults for corrupt data", () => {
    vi.stubGlobal("localStorage", { getItem: () => "{not json" });
    expect(readProgress()).toEqual({ visited: [], best: null });
  });
  it("filters invalid destinations, duplicate visits, and invalid times", () => {
    vi.stubGlobal("localStorage", {
      getItem: () =>
        JSON.stringify({
          visited: ["about", "about", "invalid", null, "work"],
          best: -1,
        }),
    });
    expect(readProgress()).toEqual({ visited: ["about", "work"], best: null });
  });
  it("round-trips a completed route", () => {
    let saved: string | null = null;
    vi.stubGlobal("localStorage", {
      getItem: () => saved,
      setItem: (_: string, data: string) => {
        saved = data;
      },
    });
    saveProgress({ visited: ["projects"], best: 42.5 });
    expect(readProgress()).toEqual({ visited: ["projects"], best: 42.5 });
  });
  it("works when the browser denies storage access", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    });
    expect(readProgress()).toEqual({ visited: [], best: null });
    expect(() => saveProgress({ visited: [], best: 10 })).not.toThrow();
  });
});
