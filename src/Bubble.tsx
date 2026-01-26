import { Sphere } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface BubbleProps extends GroupProps {
  size?: number;
  color?: string;
}

export function Bubble({ size = 0.5, color = "#aaeeff", ...props }: BubbleProps) {
  return (
    <group {...props}>
      <Sphere args={[size, 16, 16]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          metalness={0.1}
          roughness={0.1}
        />
      </Sphere>
    </group>
  );
}
