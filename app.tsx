import {
  Box,
  Float,
  Gltf,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Sky,
  Sphere,
  Text3D,
  Torus
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Fullscreen, Image, Root, Text } from "@react-three/uikit";
import {
  BvhPhysicsWorld,
  CharacterModelBone,
  FixedBvhPhysicsBody,
  PrototypeBox,
  SimpleCharacter,
} from "@react-three/viverse";
import { Suspense, useMemo, useRef } from "react";
import { Color, Group, Object3D, Vector3 } from "three";

export function App() {
  return (
    <Canvas
      style={{ width: "100%", flexGrow: 1 }}
      camera={{ fov: 90, position: [0, 2, 2] }}
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense
        fallback={
          <Fullscreen alignItems="center" justifyContent="center">
            <Text>Loading ...</Text>
          </Fullscreen>
        }
      >
        <BvhPhysicsWorld>
          <Scene />
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
}

export function Scene() {
  const characterRef = useRef<Group>(null);
  useFrame(() => {
    if (characterRef.current == null) {
      return;
    }
    if (characterRef.current.position.y < -10) {
      characterRef.current.position.set(0, 0, 0);
    }
  });
  return (
    <>
      <Sky />
      <directionalLight
        intensity={1.2}
        position={[5, 10, 10]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={1} />
      <SimpleCharacter
        ref={characterRef}
        model={{
          url: "avaturn_avatar.vrm",
          type: "vrm",
          castShadow: true,
          receiveShadow: true,
        }}
      >
        <PlayerTag />
        <CharacterModelBone bone="rightHand">
          <Gltf
            scale={0.5}
            scale-y={0.65}
            position-y={-0.02}
            position-x={0.07}
            rotation-z={-(0.2 * Math.PI) / 2}
            rotation-x={-(1 * Math.PI) / 2}
            src="sword.gltf"
          />
        </CharacterModelBone>
      </SimpleCharacter>
      <FixedBvhPhysicsBody>
        <PrototypeBox
          color="#cccccc"
          scale={[2, 1, 3]}
          position={[3.91, 0, 0]}
        />
        <PrototypeBox
          color="#ffccff"
          scale={[3, 1, 3]}
          position={[2.92, 1.5, -1.22]}
        />
        <PrototypeBox
          color="#ccffff"
          scale={[2, 0.5, 3]}
          position={[1.92, 2.5, -3.22]}
        />
        <PrototypeBox
          color="#ffccff"
          scale={[2, 1, 3]}
          position={[-2.92, 0, -2.22]}
        />
        <PrototypeBox
          color="#ccffff"
          scale={[1, 1, 4]}
          position={[0.08, -1, 0]}
        />
        <PrototypeBox
          color="#ffffcc"
          scale={[4, 1, 1]}
          position={[0.08, 3.5, 0]}
        />
        <PrototypeBox
          color="#ffffff"
          scale={[30, 0.5, 30]}
          position={[0.08, -2, 0]}
        />
        <Gltf
          scale={0.5}
          position-y={-1.02}
          position-x={-4.07}
          src="/macbook.glb"
        />
      </FixedBvhPhysicsBody>
      <Animated3DText />
      <FloatingGeometry />
      
    </>
  );
}

function PlayerTag() {
  const profile = {
    name: "Nir Tamir",
    activeAvatar: { headIconUrl: "https://nirtamir.com/me" },
  };
  const ref = useRef<Object3D>(null);
  useFrame((state) => {
    if (ref.current == null) {
      return;
    }
    ref.current.quaternion.copy(state.camera.quaternion);
  });
  return (
    <group ref={ref} position-y={2.15}>
      <Root
        depthTest={false}
        renderOrder={1}
        backgroundOpacity={0.5}
        borderRadius={10}
        paddingX={2}
        height={20}
        backgroundColor="white"
        flexDirection="row"
        alignItems="center"
        gap={4}
      >
        <Image
          width={16}
          height={16}
          borderRadius={14}
          src={profile.activeAvatar?.headIconUrl}
        />
        <Text fontWeight="bold" fontSize={12} marginRight={3}>
          {profile.name}
        </Text>
      </Root>
    </group>
  );
}

function Animated3DText() {
  const textRef = useRef<Group>(null);

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={textRef} position={[0, 1, -4]}>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.01}
          height={0.1}
          letterSpacing={0.05}
          size={0.8}
        >
          Welcome to
          <MeshDistortMaterial
            color="#6bffb3ff"
            transparent
            opacity={0.9}
            distort={0.2}
            speed={3}
            roughness={0}
            metalness={0.5}
          />
        </Text3D>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.02}
          bevelThickness={0.01}
          height={0.1}
          letterSpacing={0.05}
          size={1.2}
          position={[0, -1.5, 0]}
        >
          Nir Tamir
          <MeshDistortMaterial
            color="#4ecdc4"
            transparent
            opacity={0.9}
            distort={0.3}
            speed={2}
            roughness={0}
            metalness={0.7}
          />
        </Text3D>
      </group>
    </Float>
  );
}

function FloatingGeometry() {
  const geometries = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        Math.cos((i / 12) * Math.PI * 2) * 12,
        Math.random() * 6 + 2,
        Math.sin((i / 12) * Math.PI * 2) * 12,
      ] as [number, number, number],
      type: i % 3,
      color: new Color().setHSL((i / 12), 0.7, 0.6),
    }));
  }, []);

  return (
    <group>
      {geometries.map((geo, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={1} floatIntensity={0.5}>
          <mesh position={geo.position} castShadow>
            {geo.type === 0 && <Torus args={[1, 0.3, 16, 100]} />}
            {geo.type === 1 && <Box args={[1.5, 1.5, 1.5]} />}
            {geo.type === 2 && <Sphere args={[1, 32, 32]} />}
            <MeshWobbleMaterial
              color={geo.color}
              transparent
              opacity={0.6}
              factor={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
