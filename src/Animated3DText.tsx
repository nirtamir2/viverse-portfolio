import { Float, MeshDistortMaterial, Text3D } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

export function Animated3DText() {
  const textRef = useRef<Group>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={textRef} position={[0, 2, -5]}>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.05}
          height={0.3}
          letterSpacing={0.1}
          size={1.2}
        >
          Welcome to
          <MeshDistortMaterial
            color="#6bffb3ff"
            transparent
            opacity={0.95}
            distort={0.3}
            speed={2}
            roughness={0.1}
            metalness={0.9} />
        </Text3D>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.05}
          bevelThickness={0.07}
          height={0.4}
          letterSpacing={0.1}
          size={2}
          position={[0, -2, 0]}
        >
          Nir Tamir
          <MeshDistortMaterial
            color="#4ecdc4"
            transparent
            opacity={0.95}
            distort={0.4}
            speed={1.5}
            roughness={0.1}
            metalness={0.9} />
        </Text3D>
      </group>
    </Float>
  );
}
