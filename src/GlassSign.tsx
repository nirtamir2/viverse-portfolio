import { Float, MeshTransmissionMaterial, Text } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface GlassSignProps extends GroupProps {
  text: string;
  width?: number;
  height?: number;
  textColor?: string;
}

export function GlassSign({
  text,
  width = 4,
  height = 1,
  textColor = "#ffffff",
  ...props
}: GlassSignProps) {
  return (
    <group {...props}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        {/* Glass panel */}
        <mesh>
          <boxGeometry args={[width, height, 0.1]} />
          <MeshTransmissionMaterial
            resolution={256}
            distortion={0.1}
            color="#88ccff"
            thickness={0.5}
            anisotropy={0.5}
            transmission={0.9}
            roughness={0.1}
            ior={1.5}
          />
        </mesh>

        {/* Text on glass */}
        <Text
          position={[0, 0, 0.1]}
          fontSize={height * 0.5}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          // font="/font/Inter_Regular.json"
        >
          {text}
        </Text>
      </Float>
    </group>
  );
}
