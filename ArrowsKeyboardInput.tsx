export type InputField<T> = {
  default: T
}
export const MoveForwardField: InputField<number> = {
  default: 0,
}

export const MoveBackwardField: InputField<number> = {
  default: 0,
}

export const MoveLeftField: InputField<number> = {
  default: 0,
}

export const MoveRightField: InputField<number> = {
  default: 0,
}

export const LastTimeJumpPressedField: InputField<number | null> = {
  default: null,
}

export const RunField: InputField<boolean> = {
  default: false,
}

export const DeltaZoomField: InputField<number> = {
  default: 0,
}

export const DeltaYawField: InputField<number> = {
  default: 0,
}

export const DeltaPitchField: InputField<number> = {
  default: 0,
}

export interface Input {
  get<T>(field: InputField<T>): T | undefined
  destroy?(): void
}

const MoveForwardKeys = ["KeyW", "ArrowUp"];
const MoveBackwardKeys = ["KeyS", "ArrowDown"];
const MoveLeftKeys = ["KeyA", "ArrowLeft"];
const MoveRightKeys = ["KeyD", "ArrowRight"];
const RunKeys = ["ShiftRight", "ShiftLeft"];

export class ArrowsKeyboardInput implements Input {
  private readonly abortController = new AbortController();
  private readonly keyState = new Map<
    string,
    { pressTime?: number; releaseTime?: number }
  >();

  constructor(domElement: HTMLElement) {
    domElement.tabIndex = 0;
    domElement.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        let state = this.keyState.get(event.code);
        const now = performance.now() / 1000;
        if (state == null) {
          this.keyState.set(event.code, (state = { pressTime: now }));
        } else {
          state.pressTime = now;
        }
      },
      {
        signal: this.abortController.signal,
      }
    );

    domElement.addEventListener(
      "keyup",
      (event: KeyboardEvent) => {
        let state = this.keyState.get(event.code);
        const now = performance.now() / 1000;
        if (state == null) {
          this.keyState.set(event.code, (state = { releaseTime: now }));
        } else {
          state.releaseTime = now;
        }
      },
      {
        signal: this.abortController.signal,
      }
    );

    // Handle focus loss to clear pressed keys
    domElement.addEventListener("blur", () => this.keyState.clear(), {
      signal: this.abortController.signal,
    });
  }

  get<T>(field: InputField<T>): T | undefined {
    if (field === LastTimeJumpPressedField) {
      return (this.keyState.get("Space")?.pressTime ?? null) as T;
    }
    let keys: Array<string> | undefined;
    switch (field) {
      case MoveForwardField:
        keys = MoveForwardKeys;
        break;
      case MoveBackwardField:
        keys = MoveBackwardKeys;
        break;
      case MoveLeftField:
        keys = MoveLeftKeys;
        break;
      case MoveRightField:
        keys = MoveRightKeys;
        break;
      case RunField:
        keys = RunKeys;
        break;
    }
    if (keys == null) {
      return undefined;
    }
    return keys.some((key) => {
      const state = this.keyState.get(key);
      if (state?.pressTime == null) {
        return false;
      }
      return state.releaseTime == null || state.pressTime > state.releaseTime;
    }) as T;
  }

  destroy(): void {
    this.abortController.abort();
  }
}
