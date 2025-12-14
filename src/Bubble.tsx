import { Caustics, MeshTransmissionMaterial } from "@react-three/drei";
import type { ComponentProps } from "react";

export function Bubble(props: Partial<ComponentProps<typeof Caustics>>) {
  return (
    <Caustics
      {...props}
      color="#ffffff"
      lightSource={[5, 5, -10]}
      worldRadius={0.01}
      ior={1.2}
      intensity={0.005}
      causticsOnly={false}
      backside={false}
    >
      <mesh castShadow receiveShadow position={[-2, 0.5, -1]} scale={0.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          resolution={1024}
          distortion={0.25}
          color="#ffffff"
          thickness={1}
          anisotropy={1}
        />
      </mesh>
    </Caustics>
  );
}
