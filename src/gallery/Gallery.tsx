import { Center, Edges, Float, Gltf, Resize, Text } from "@react-three/drei";
import { BvhPhysicsBody } from "@react-three/viverse";
import { Suspense } from "react";
import { TransparentBox } from "../TransparentBox";
import { companies, exhibits, type ExhibitId } from "./content";

function Logo({ src, size = 1.1 }: { src: string; size?: number }) {
  return (
    <Suspense fallback={null}>
      <Resize scale={size}>
        <Center>
          <Gltf src={src} />
        </Center>
      </Resize>
    </Suspense>
  );
}

function Sculpture({ id, color }: { id: ExhibitId; color: string }) {
  if (id === "about")
    return (
      <Suspense fallback={null}>
        <group rotation-y={0.25}>
          <Resize scale={2.1}>
            <Center>
              <Gltf src="/macbook.glb" />
            </Center>
          </Resize>
        </group>
      </Suspense>
    );
  if (id === "projects")
    return (
      <group rotation={[0.3, 0.4, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 0.7, i * 0.8, i * 0.6]}>
            <torusGeometry args={[0.8, 0.035, 8, 48]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        ))}
        <mesh>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.5}
            roughness={0.12}
            transmission={0.6}
            thickness={0.5}
          />
          <Edges color="#ece6f5" />
        </mesh>
      </group>
    );
  if (id === "skills")
    return (
      <group>
        <Logo src="/tech/react.gltf" size={1.35} />
        <group position={[1.3, -0.2, 0.2]}>
          <Logo src="/tech/typescript.gltf" size={0.65} />
        </group>
      </group>
    );
  if (id === "career")
    return (
      <group>
        <Logo src="/companies logos/peaklight.gltf" size={1.6} />
      </group>
    );
  if (id === "notes")
    return (
      <group rotation-y={-0.2}>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0, i * 0.2 - 0.3, 0]} rotation-y={i * 0.14}>
            <mesh>
              <boxGeometry args={[1.35, 0.12, 1]} />
              <meshStandardMaterial
                color={i === 1 ? "#d5ded8" : color}
                metalness={0.3}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 0, 0.51]}>
              <boxGeometry args={[1.2, 0.07, 0.02]} />
              <meshStandardMaterial color="#fbf2e8" />
            </mesh>
          </group>
        ))}
      </group>
    );
  return (
    <group rotation-z={0.3}>
      <mesh>
        <torusGeometry args={[0.65, 0.045, 12, 64]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.65, 0.045, 12, 64]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.28, 20, 16]} />
        <meshPhysicalMaterial
          color={color}
          transmission={0.8}
          roughness={0.05}
          thickness={0.8}
        />
      </mesh>
    </group>
  );
}

export function Gallery({
  onOpen,
  paused,
}: {
  onOpen: (id: ExhibitId) => void;
  paused: boolean;
}) {
  return (
    <group>
      {/* Thin inlaid paths give the open floor a legible route, without obstacles. */}
      {[
        { p: [0, -1.99, -13], s: [0.025, 0.015, 28] },
        { p: [-5, -1.99, -3], s: [10, 0.015, 0.025] },
        { p: [0, -1.99, -11], s: [20, 0.015, 0.025] },
        { p: [0, -1.99, -24], s: [20, 0.015, 0.025] },
        { p: [-10, -1.99, -18], s: [0.025, 0.015, 14] },
        { p: [10, -1.99, -17], s: [0.025, 0.015, 14] },
      ].map((path, i) => (
        <mesh
          key={i}
          position={path.p as [number, number, number]}
          scale={path.s as [number, number, number]}
        >
          <boxGeometry />
          <meshBasicMaterial color="#b1c9c4" transparent opacity={0.26} />
        </mesh>
      ))}
      <Text
        position={[0, -1.97, 6]}
        rotation-x={-Math.PI / 2}
        fontSize={0.2}
        color="#97aba7"
        letterSpacing={0.08}
      >
        TAKE A WALK. FIND SOMETHING.
      </Text>
      {exhibits.map((item, index) => (
        <group key={item.id} position={item.position}>
          <BvhPhysicsBody>
            <TransparentBox
              position={[0, -0.65, 0]}
              scale={[2.7, 0.85, 2.1]}
              color={item.color}
            />
          </BvhPhysicsBody>
          <mesh position={[0, -0.21, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[2.73, 2.13]} />
            <meshStandardMaterial
              color="#222c32"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <Float
            enabled={!paused}
            speed={1}
            rotationIntensity={0.12}
            floatIntensity={0.18}
          >
            <group position={[0, 0.65, 0]}>
              <Sculpture id={item.id} color={item.color} />
            </group>
          </Float>
          <Text
            position={[-1.2, 1.9, 0]}
            anchorX="left"
            fontSize={0.095}
            letterSpacing={0.12}
            color={item.color}
          >{`${(index + 1).toString().padStart(2, "0")} / ${item.shortTitle.toUpperCase()}`}</Text>
          <Text
            position={[0, -0.5, 1.09]}
            fontSize={0.16}
            color="#f2eee6"
            onClick={(event) => {
              event.stopPropagation();
              onOpen(item.id);
            }}
          >
            {item.shortTitle}
          </Text>
          <mesh position={[0, -1.18, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[2.1, 2.12, 64]} />
            <meshBasicMaterial color={item.color} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
      {/* Career logos are kept as objects to walk among, rather than just a list. */}
      {companies.map((company, index) => (
        <group key={company.name} position={[-6.5 + index * 2.6, -0.8, -29]}>
          <BvhPhysicsBody>
            <TransparentBox
              position={[0, -0.75, 0]}
              scale={[1.75, 0.7, 1.2]}
              color="#eadfc9"
            />
          </BvhPhysicsBody>
          <Logo src={company.src} size={1.1} />
          <Text position={[0, -0.5, 0.65]} fontSize={0.105} color="#dcd5c6">
            {company.name}
          </Text>
        </group>
      ))}
      <Text
        position={[0, 1.6, -29]}
        fontSize={0.24}
        letterSpacing={0.08}
        color="#ddcfb5"
      >
        THE JOURNEY SO FAR
      </Text>
      {/* A hovering mobile: a destination above the walkable glass staircase. */}
      <Float
        enabled={!paused}
        speed={0.7}
        floatIntensity={0.25}
        rotationIntensity={0.2}
      >
        <group position={[3.5, 4.4, -14]}>
          <mesh rotation={[0.6, 0.3, 0.4]}>
            <torusGeometry args={[1.25, 0.025, 8, 80]} />
            <meshStandardMaterial
              color="#e5d2af"
              metalness={0.9}
              roughness={0.14}
            />
          </mesh>
          <mesh rotation={[1, -0.4, -0.6]}>
            <torusGeometry args={[0.85, 0.025, 8, 64]} />
            <meshStandardMaterial
              color="#baccc9"
              metalness={0.9}
              roughness={0.14}
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.5]} />
            <meshPhysicalMaterial
              color="#bddedb"
              transmission={1}
              thickness={0.8}
              roughness={0.06}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
