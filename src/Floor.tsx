import { MeshReflectorMaterial } from "@react-three/drei";

export function Floor({ light = false }: { light?: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[64, 80]} />
      {light ? (
        <meshStandardMaterial
          color="#080d12"
          roughness={0.28}
          metalness={0.6}
        />
      ) : (
        <MeshReflectorMaterial
          blur={[80, 40]}
          resolution={512}
          mixBlur={1}
          mixStrength={12}
          roughness={0.55}
          depthScale={0.8}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#080d12"
          metalness={0.6}
        />
      )}
    </mesh>
  );
}
