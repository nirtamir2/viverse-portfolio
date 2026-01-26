import { Gltf, Text } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface PlaygroundItemProps extends GroupProps {
  src: string;
  label?: string;
  logoScale?: number;
  showLabel?: boolean;
}

export function PlaygroundItem({
  src,
  label,
  logoScale = 1,
  showLabel = true,
  ...props
}: PlaygroundItemProps) {
  return (
    <group {...props}>
      {/* Logo */}
      <Gltf src={src} scale={logoScale} />

      {/* Simple label below the logo */}
      {showLabel && label && (
        <group position={[0, -1, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 0.35]} />
            <meshBasicMaterial color="#111111" transparent opacity={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}
