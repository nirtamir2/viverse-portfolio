import { Gltf, Text3D, Float } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface PlaygroundItemProps extends GroupProps {
  src: string;
  label: string;
  labelPosition?: "front" | "back" | "left" | "right";
  labelOffset?: number;
  logoScale?: number;
  labelScale?: number;
  floatLogo?: boolean;
}

export function PlaygroundItem({
  src,
  label,
  labelPosition = "front",
  labelOffset = 1.5,
  logoScale = 1,
  labelScale = 0.15,
  floatLogo = true,
  ...props
}: PlaygroundItemProps) {
  // Calculate label position based on direction
  const getLabelPos = (): [number, number, number] => {
    switch (labelPosition) {
      case "front":
        return [0, 0.1, labelOffset];
      case "back":
        return [0, 0.1, -labelOffset];
      case "left":
        return [-labelOffset, 0.1, 0];
      case "right":
        return [labelOffset, 0.1, 0];
    }
  };

  const getLabelRotation = (): [number, number, number] => {
    switch (labelPosition) {
      case "front":
        return [-Math.PI / 2, 0, 0];
      case "back":
        return [-Math.PI / 2, 0, Math.PI];
      case "left":
        return [-Math.PI / 2, 0, Math.PI / 2];
      case "right":
        return [-Math.PI / 2, 0, -Math.PI / 2];
    }
  };

  const logoContent = (
    <Gltf src={src} scale={logoScale} />
  );

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

      {/* 3D Text label on the floor */}
      <Text3D
        font="/font/Inter_Regular.json"
        position={getLabelPos()}
        rotation={getLabelRotation()}
        size={0.3}
        height={0.05}
        scale={labelScale}
      >
        {label}
        <meshStandardMaterial color="#ffffff" />
      </Text3D>
    </group>
  );
}
