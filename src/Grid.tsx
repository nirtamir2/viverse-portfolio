

export function Grid({
  size, divisions, position,
}: {
  size: number;
  divisions: number;
  position: [number, number, number];
}) {
  return (
    <group rotation-x={Math.PI / 2} position={position}>
      <gridHelper args={[size, divisions, "#4ecdc4", "#4ecdc4"]} />
    </group>
  );
}
