import { Canvas } from "@react-three/fiber";
import { Fullscreen, Text } from "@react-three/uikit";
import {
  BvhPhysicsWorld,
} from "@react-three/viverse";
import { Suspense } from "react";
import { Scene } from "./Scene";

export function App() {
  return (
    <Canvas
      style={{ width: "100%", flexGrow: 1 }}
      camera={{ fov: 75, position: [0, 1.5, 3] }}
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense
        fallback={
          <Fullscreen alignItems="center" justifyContent="center">
            <Text>Loading ...</Text>
          </Fullscreen>
        }
      >
        <BvhPhysicsWorld>
          <Scene />
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
}


