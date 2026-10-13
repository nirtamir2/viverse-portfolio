import { Component } from "react";
import type { ReactNode } from "react";

export class WorldBoundary extends Component<
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
    return this.state.failed ? (
      <div className="world-fallback">
        The 3D world couldn’t start on this device.
        <br />
        You can still explore everything in the portfolio.
      </div>
    ) : (
      this.props.children
    );
  }
}
