import { Text3D } from "@react-three/drei";

export function SomeText() {
  return (
    <Text3D
      font="/font/Inter_Regular.json"
      bevelEnabled
      bevelSize={0.05}
      scale={0.3}
    >
      Nir Tamir
      <meshNormalMaterial />
    </Text3D>
  );
}
