import { Text3D } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";

interface SectionHeaderProps extends GroupProps {
  text: string;
  color?: string;
}

export function SectionHeader({
  text,
  color = "#ffffff",
  ...props
}: SectionHeaderProps) {
  return (
    <group {...props}>
      <Text3D
        font="/font/Inter_Regular.json"
        size={0.8}
        height={0.1}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.02}
      >
        {text}
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </Text3D>
    </group>
  );
}
