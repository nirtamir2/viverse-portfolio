import { Caustics } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { GlassMaterial } from "./gallery/Glass";

export function Bubble({
  size = 0.5,
  color = "#e2eee9",
  ...props
}: ThreeElements["group"] & { size?: number; color?: string }) {
  return (
    <group {...props}>
      <Caustics
        frames={1}
        resolution={256}
        color="#ffffff"
        lightSource={[5, 5, -10]}
        worldRadius={0.02}
        ior={1.2}
        intensity={0.005}
        causticsOnly={false}
        backside={false}
      >
        <mesh castShadow receiveShadow userData={{ galleryGlass: true }}>
          <sphereGeometry args={[size, 24, 24]} />
          <GlassMaterial color={color} />
        </mesh>
      </Caustics>
    </group>
  );
}
