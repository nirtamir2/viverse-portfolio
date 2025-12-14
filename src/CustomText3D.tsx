import { MeshDistortMaterial, Text3D } from "@react-three/drei";

interface Props {
  text: string;
}
export function CustomText3D(props: Props) {
  const { text } = props;
  return (
    <Text3D
      font="/font/Inter_Regular.json"
      bevelEnabled
      bevelSize={0.04}
      bevelThickness={0.05}
      height={0.3}
      letterSpacing={0.1}
      size={1.2}
    >
      {text}
      <MeshDistortMaterial
        color="#6bffb3ff"
        transparent
        opacity={0.95}
        distort={0.3}
        speed={2}
        roughness={0.1}
        metalness={0.9}
      />
    </Text3D>
  );
}
