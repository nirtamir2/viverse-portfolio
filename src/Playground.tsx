import { Box, RoundedBox } from "@react-three/drei";

export function Playground() {
  return (
    <group>
      {/* Simple staircase to explore - clean pastel colors */}
      <RoundedBox args={[3, 0.3, 2]} position={[0, -1.7, 3]} radius={0.05}>
        <meshStandardMaterial color="#a8d8ea" />
      </RoundedBox>
      <RoundedBox args={[3, 0.3, 2]} position={[0, -1.2, 5]} radius={0.05}>
        <meshStandardMaterial color="#aa96da" />
      </RoundedBox>
      <RoundedBox args={[3, 0.3, 2]} position={[0, -0.7, 7]} radius={0.05}>
        <meshStandardMaterial color="#fcbad3" />
      </RoundedBox>

      {/* Platform at top */}
      <RoundedBox args={[5, 0.25, 4]} position={[0, -0.2, 9]} radius={0.05}>
        <meshStandardMaterial color="#ffffd2" />
      </RoundedBox>

      {/* Two side platforms - minimal */}
      <RoundedBox args={[2, 0.25, 2]} position={[-5, -1.4, 0]} radius={0.05}>
        <meshStandardMaterial color="#a8d8ea" />
      </RoundedBox>
      <RoundedBox args={[2, 0.25, 2]} position={[5, -1.4, 0]} radius={0.05}>
        <meshStandardMaterial color="#fcbad3" />
      </RoundedBox>

      {/* Couple of fun cubes to jump on */}
      <Box args={[1, 1, 1]} position={[-3, -1.3, -2]}>
        <meshStandardMaterial color="#aa96da" />
      </Box>
      <Box args={[0.8, 0.8, 0.8]} position={[3, -1.4, -2]}>
        <meshStandardMaterial color="#a8d8ea" />
      </Box>
    </group>
  );
}
