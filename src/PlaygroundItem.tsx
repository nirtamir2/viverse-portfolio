import { Gltf, Float, Text, MeshTransmissionMaterial } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface PlaygroundItemProps extends GroupProps {
  src: string;
  label?: string;
  logoScale?: number;
  floatLogo?: boolean;
  showGlassLabel?: boolean;
}

export function PlaygroundItem({
  src,
  label,
  logoScale = 1,
  floatLogo = true,
  showGlassLabel = true,
  ...props
}: PlaygroundItemProps) {
  const logoContent = <Gltf src={src} scale={logoScale} />;

  return (
    <group {...props}>
      {/* Logo - optionally floating */}
      {floatLogo ? (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          {logoContent}
        </Float>
      ) : (
        logoContent
      )}

      {/* Small glass label below the logo */}
      {showGlassLabel && label && (
        <group position={[0, -1.2, 0]}>
          {/* Glass panel */}
          <mesh>
            <boxGeometry args={[2.5, 0.4, 0.05]} />
            <meshMatcapMaterial color="black" />
          </mesh>
          {/* Label text */}
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.3}
          >
            {label}
          </Text>
        </group>
      )}
    </group>
  );
}
