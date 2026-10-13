import { describe, expect, it } from "vitest";
import { places } from "../portfolio";
import {
  advanceGame,
  createGame,
  emptyInput,
  FIXED_STEP,
  respawn,
  restartRoute,
  stepGame,
  tokens,
  WORLD_LIMIT,
} from "./engine";
import type { GameState, Input } from "./engine";

function drive(game: GameState, seconds: number, changes: Partial<Input> = {}) {
  const input = { ...emptyInput(), ...changes };
  for (let i = 0; i < Math.round(seconds / FIXED_STEP); i++)
    stepGame(game, input, FIXED_STEP);
}

describe("driving", () => {
  it("accelerates forward, brakes to a stop, and reverses", () => {
    const game = createGame();
    drive(game, 0.5, { throttle: 1 });
    expect(game.z).toBeLessThan(8);
    expect(game.speed).toBeGreaterThan(3);
    drive(game, 1, { throttle: -1 });
    expect(game.vz).toBeGreaterThan(0);
    expect(game.speed).toBeLessThanOrEqual(5);
  });
  it("boost gives a faster car", () => {
    const normal = createGame(),
      boosted = createGame();
    drive(normal, 1, { throttle: 1 });
    drive(boosted, 1, { throttle: 1, boost: true });
    expect(boosted.speed).toBeGreaterThan(normal.speed * 1.3);
  });
  it("steers left when moving forward and changes steering direction in reverse", () => {
    const forward = createGame(),
      reverse = createGame();
    drive(forward, 0.7, { throttle: 1, steering: 1 });
    drive(reverse, 0.7, { throttle: -1, steering: 1 });
    expect(forward.heading).toBeGreaterThan(0);
    expect(forward.x).toBeLessThan(0);
    expect(reverse.heading).toBeLessThan(0);
  });
  it("the handbrake allows more sideways slip than normal grip", () => {
    const normal = createGame(),
      drift = createGame();
    drive(normal, 0.8, { throttle: 1 });
    drive(drift, 0.8, { throttle: 1 });
    drive(normal, 0.5, { throttle: 1, steering: 1 });
    drive(drift, 0.5, { throttle: 1, steering: 1, brake: true });
    const slip = (game: GameState) =>
      Math.abs(
        game.vx * Math.cos(game.heading) - game.vz * Math.sin(game.heading),
      );
    expect(slip(drift)).toBeGreaterThan(slip(normal) * 1.3);
  });
  it("travels the same route at 30, 60, and 144 display frames per second", () => {
    const runs = [30, 60, 144].map((fps) => {
      const game = createGame();
      for (let frame = 0; frame < fps; frame++)
        advanceGame(
          game,
          { ...emptyInput(), throttle: 1, steering: 0.4 },
          1 / fps,
        );
      return game;
    });
    for (const game of runs.slice(1)) {
      expect(game.x).toBeCloseTo(runs[0].x, 6);
      expect(game.z).toBeCloseTo(runs[0].z, 6);
      expect(game.heading).toBeCloseTo(runs[0].heading, 6);
    }
  });
  it("caps catch-up after a stalled frame", () => {
    const game = createGame();
    advanceGame(game, { ...emptyInput(), throttle: 1 }, 60);
    expect(Math.hypot(game.x, game.z - 8)).toBeLessThan(1);
  });
  it("stays inside the island at full boost", () => {
    const game = createGame();
    drive(game, 20, { throttle: 1, boost: true });
    expect(Math.abs(game.x)).toBeLessThanOrEqual(WORLD_LIMIT);
    expect(Math.abs(game.z)).toBeLessThanOrEqual(WORLD_LIMIT);
    expect(Number.isFinite(game.speed)).toBe(true);
  });
  it("collides safely with a building, even from its exact center", () => {
    const game = createGame(),
      place = places[0];
    game.x = place.x;
    game.z = place.z;
    stepGame(game, emptyInput(), FIXED_STEP);
    expect(
      Math.hypot(game.x - place.x, game.z - place.z),
    ).toBeGreaterThanOrEqual(3);
    expect(game.nearby).toBe(place.id);
  });
  it("pushes a block rather than passing through it", () => {
    const game = createGame();
    game.x = 4;
    game.z = 2;
    game.vz = -5;
    const original = game.props[0].z;
    stepGame(game, emptyInput(), FIXED_STEP);
    expect(game.props[0].z).toBeLessThan(original);
    expect(game.props[0].vz).toBeLessThan(0);
  });
  it("launches off the ramp and lands on the ground", () => {
    const game = createGame();
    game.x = 0;
    game.z = -11.5;
    game.vz = -9;
    drive(game, 0.4, { throttle: 1 });
    expect(game.height).toBeGreaterThan(0.4);
    drive(game, 3);
    expect(game.height).toBe(0);
    expect(game.verticalSpeed).toBe(0);
  });
});

describe("scenic route", () => {
  it("starts the clock at the first ring, counts each ring once, and freezes the final time", () => {
    const game = createGame();
    drive(game, 0.2);
    expect(game.elapsed).toBe(0);
    for (const [x, z] of tokens) {
      game.x = x;
      game.z = z;
      game.vx = 0;
      game.vz = 0;
      drive(game, 0.1);
    }
    expect(game.collected.size).toBe(10);
    expect(game.finished).toBe(true);
    const finishedTime = game.elapsed;
    drive(game, 1);
    expect(game.elapsed).toBe(finishedTime);
    expect(game.collected.size).toBe(10);
  });
  it("respawning preserves the challenge, while restarting clears it", () => {
    const game = createGame();
    game.x = 0;
    game.z = 14;
    drive(game, 0.5);
    expect(game.collected.size).toBe(1);
    respawn(game);
    expect(game.x).toBe(0);
    expect(game.z).toBe(8);
    expect(game.speed).toBe(0);
    expect(game.collected.size).toBe(1);
    expect(game.elapsed).toBeGreaterThan(0);
    restartRoute(game);
    expect(game.collected.size).toBe(0);
    expect(game.elapsed).toBe(0);
    expect(game.routeStarted).toBe(false);
  });
});
