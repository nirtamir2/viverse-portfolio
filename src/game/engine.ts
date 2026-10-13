import { places } from "../portfolio";
import type { PlaceId } from "../portfolio";

export const WORLD_LIMIT = 21;
export const FIXED_STEP = 1 / 120;
export const tokens = [
  [0, 14],
  [9, 14],
  [17, 7],
  [17, -5],
  [9, -14],
  [0, -14],
  [-9, -14],
  [-17, -5],
  [-17, 7],
  [-9, 14],
] as const;

export interface Input {
  throttle: number;
  steering: number;
  brake: boolean;
  boost: boolean;
}
export interface Prop {
  x: number;
  z: number;
  vx: number;
  vz: number;
  angle: number;
}
export interface GameState {
  x: number;
  z: number;
  heading: number;
  vx: number;
  vz: number;
  speed: number;
  height: number;
  verticalSpeed: number;
  steering: number;
  elapsed: number;
  accumulator: number;
  collected: Set<number>;
  routeStarted: boolean;
  finished: boolean;
  nearby: PlaceId | null;
  props: Prop[];
}

export const emptyInput = (): Input => ({
  throttle: 0,
  steering: 0,
  brake: false,
  boost: false,
});
export function createGame(): GameState {
  return {
    x: 0,
    z: 8,
    heading: 0,
    vx: 0,
    vz: 0,
    speed: 0,
    height: 0,
    verticalSpeed: 0,
    steering: 0,
    elapsed: 0,
    accumulator: 0,
    collected: new Set(),
    routeStarted: false,
    finished: false,
    nearby: null,
    props: Array.from({ length: 7 }, (_, i) => ({
      x: 4 + (i % 3) * 1.2,
      z: 1 + Math.floor(i / 3) * 1.2,
      vx: 0,
      vz: 0,
      angle: i * 0.4,
    })),
  };
}

export function respawn(game: GameState) {
  game.x = 0;
  game.z = 8;
  game.heading = 0;
  game.vx = 0;
  game.vz = 0;
  game.speed = 0;
  game.height = 0;
  game.verticalSpeed = 0;
  game.steering = 0;
  game.accumulator = 0;
  game.nearby = null;
}

export function advanceGame(game: GameState, input: Input, frameDelta: number) {
  game.accumulator += Math.min(Math.max(frameDelta, 0), 0.1);
  while (game.accumulator + 1e-9 >= FIXED_STEP) {
    stepGame(game, input, FIXED_STEP);
    game.accumulator = Math.max(0, game.accumulator - FIXED_STEP);
  }
}

export function restartRoute(game: GameState) {
  respawn(game);
  game.collected.clear();
  game.elapsed = 0;
  game.routeStarted = false;
  game.finished = false;
}

export function stepGame(game: GameState, input: Input, dt: number) {
  // A fixed simulation step keeps grip, acceleration, and collisions independent of display refresh rate.
  const forwardX = -Math.sin(game.heading),
    forwardZ = -Math.cos(game.heading);
  let forwardSpeed = game.vx * forwardX + game.vz * forwardZ;
  game.steering += (input.steering - game.steering) * (1 - Math.exp(-10 * dt));
  const turn =
    game.steering *
    Math.min(Math.abs(forwardSpeed) / 3, 1) *
    (input.brake ? 2.7 : 1.9);
  game.heading += turn * Math.sign(forwardSpeed) * dt;
  const nextForwardX = -Math.sin(game.heading),
    nextForwardZ = -Math.cos(game.heading);
  forwardSpeed = game.vx * nextForwardX + game.vz * nextForwardZ;
  let sideSpeed =
    game.vx * Math.cos(game.heading) - game.vz * Math.sin(game.heading);
  const maxSpeed = input.boost && input.throttle > 0 ? 16 : 10;
  forwardSpeed += input.throttle * (input.boost ? 15 : 10) * dt;
  forwardSpeed *= Math.exp(
    -(input.brake ? 1.8 : input.throttle ? 0.55 : 1.6) * dt,
  );
  forwardSpeed = Math.max(-5, Math.min(maxSpeed, forwardSpeed));
  sideSpeed *= Math.exp(-(input.brake ? 1.2 : 9) * dt);
  // Turning rotates the body faster than its velocity while braking, creating a controllable drift.
  game.vx = nextForwardX * forwardSpeed + Math.cos(game.heading) * sideSpeed;
  game.vz = nextForwardZ * forwardSpeed - Math.sin(game.heading) * sideSpeed;
  game.x += game.vx * dt;
  game.z += game.vz * dt;
  if (Math.abs(game.x) > WORLD_LIMIT) {
    game.x = Math.sign(game.x) * WORLD_LIMIT;
    game.vx *= -0.35;
  }
  if (Math.abs(game.z) > WORLD_LIMIT) {
    game.z = Math.sign(game.z) * WORLD_LIMIT;
    game.vz *= -0.35;
  }

  // Low ramp on the north road, approached from the south. Decorative buildings use circular footprints.
  const rampHeight =
    Math.abs(game.x) < 1.8 && game.z > -14.8 && game.z < -11.3
      ? ((-11.3 - game.z) / 3.5) * 1.1
      : 0;
  if (rampHeight > game.height) {
    game.height = rampHeight;
    game.verticalSpeed = Math.max(0, -game.vz * 0.32);
  } else {
    game.verticalSpeed -= 16 * dt;
    game.height += game.verticalSpeed * dt;
  }
  if (game.height < 0) {
    game.height = 0;
    game.verticalSpeed = 0;
  }

  game.nearby = null;
  for (const place of places) {
    const dx = game.x - place.x,
      dz = game.z - place.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 5.5) game.nearby = place.id;
    if (distance < 3 && game.height < 1.5) {
      const nx = distance > 0.001 ? dx / distance : 1,
        nz = distance > 0.001 ? dz / distance : 0;
      game.x = place.x + nx * 3;
      game.z = place.z + nz * 3;
      const into = game.vx * nx + game.vz * nz;
      if (into < 0) {
        game.vx -= into * nx * 1.4;
        game.vz -= into * nz * 1.4;
      }
    }
  }
  for (const prop of game.props) {
    prop.x += prop.vx * dt;
    prop.z += prop.vz * dt;
    prop.vx *= Math.exp(-2.5 * dt);
    prop.vz *= Math.exp(-2.5 * dt);
    prop.angle += (prop.vx + prop.vz) * dt * 0.5;
    if (Math.abs(prop.x) > 20) {
      prop.x = Math.sign(prop.x) * 20;
      prop.vx *= -0.5;
    }
    if (Math.abs(prop.z) > 20) {
      prop.z = Math.sign(prop.z) * 20;
      prop.vz *= -0.5;
    }
    const dx = prop.x - game.x,
      dz = prop.z - game.z,
      distance = Math.hypot(dx, dz);
    if (distance < 1.3 && game.height < 0.7) {
      const nx = distance > 0.001 ? dx / distance : 1,
        nz = distance > 0.001 ? dz / distance : 0;
      prop.x = game.x + nx * 1.3;
      prop.z = game.z + nz * 1.3;
      prop.vx += game.vx * 0.8 + nx * 2;
      prop.vz += game.vz * 0.8 + nz * 2;
      game.vx *= 0.96;
      game.vz *= 0.96;
    }
  }
  game.speed = Math.hypot(game.vx, game.vz);
  if (game.routeStarted && !game.finished) game.elapsed += dt;
  tokens.forEach(([x, z], index) => {
    if (
      !game.collected.has(index) &&
      Math.hypot(game.x - x, game.z - z) < 1.8
    ) {
      game.collected.add(index);
      game.routeStarted = true;
      if (game.collected.size === tokens.length) game.finished = true;
    }
  });
}
