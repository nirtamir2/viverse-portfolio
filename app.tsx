import {
  Box,
  Caustics,
  ContactShadows,
  Environment,
  Gltf,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  Sky,
  Sphere,
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
import { Suspense, useRef, useState } from "react";
import { Group, Object3D } from "three";

export function App() {
  return (
    <Canvas
      style={{ width: "100%", flexGrow: 1 }}
      camera={{ fov: 75, position: [0, 1.5, 3] }}
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
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={1}
        position={[10, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight intensity={0.5} position={[-10, 10, -5]} />
      <Environment preset="city" />
      <Sky sunPosition={[100, 10, 100]} />
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={20}
        blur={1}
        far={2}
      />
      <fog attach="fog" args={["#191920", 0, 15]} />

      <SimpleCharacter
        ref={characterRef}
        model={{
          url: "avaturn_avatar.vrm",
          type: "vrm",
          castShadow: true,
          receiveShadow: true,
        }}
      >
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
        <group position={[0, -2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={1}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={0.5}
            />
          </mesh>
        </group>
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
        <Box scale={[1, 1, 4]} position={[0.08, -1, 0]}>
          <MeshTransmissionMaterial
            resolution={512}
            distortion={0.25}
            color="#ffffff"
            thickness={1}
            anisotropy={1}
          />
        </Box>

        <Gltf
          scale={0.5}
          position-y={-1.02}
          position-x={-4.07}
          src="/macbook.glb"
          onClick={() => window.open("https://github.com", "_blank")}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        />
        {/* <Animated3DText /> */}
        {/* <FloatingGeometry /> */}
        <InteractiveElements />
      </FixedBvhPhysicsBody>

      <Caustics
        color="#ffffff"
        position={[0, -0.5, 0]}
        lightSource={[5, 5, -10]}
        worldRadius={0.01}
        ior={1.2}
        intensity={0.005}
        causticsOnly={false}
        backside={false}
      >
        <mesh castShadow receiveShadow position={[-2, 0.5, -1]} scale={0.5}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial
            resolution={1024}
            distortion={0.25}
            color="#ffffff"
            thickness={1}
            anisotropy={1}
          />
        </mesh>
      </Caustics>

      <Caustics
        color="#ffffff"
        position={[4, -1, 0]}
        lightSource={[5, 5, -10]}
        worldRadius={0.01}
        ior={1.2}
        intensity={0.005}
        causticsOnly={false}
        backside={false}
      >
        <mesh position={[-2, 0.5, -1]} scale={1}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial
            distortion={0.25}
            color="#ffffff"
            thickness={1}
            anisotropy={1}
          />
        </mesh>
      </Caustics>
    </>
  );
}

function InteractiveElements() {
  const [scrollY, setScrollY] = useState(0);

  return (
    <>
      {/* Interactive particles */}
      {/* <Particles count={200} /> */}

      {/* Scrolling text */}
      {/* <ScrollingText text="Welcome to my interactive 3D portfolio • Created with Viverse • Inspired by Bruno Simon • " /> */}

      {/* Interactive floor grid */}
      <Grid size={30} divisions={30} position={[0, -2, 0]} />
    </>
  );
}

function Particles({ count = 100 }) {
  const meshRef = useRef<Group>(null);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 10,
          (Math.random() - 0.5) * 20,
        ] as [number, number, number],
        color: new Color().setHSL(Math.random(), 0.8, 0.6),
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <Sphere args={[0.05, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function ScrollingText({ text }: { text: string }) {
  const textRef = useRef<Group>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <Float speed={0.5} floatIntensity={0.5}>
      <group ref={textRef} position={[0, -1, -8]}>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.01}
          height={0.1}
          letterSpacing={0.05}
          size={0.3}
        >
          {text.repeat(3)}
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </Text3D>
      </group>
    </Float>
  );
}

function Grid({
  size,
  divisions,
  position,
}: {
  size: number;
  divisions: number;
  position: [number, number, number];
}) {
  const gridRef = useRef<Group>(null);

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.PI / 2;
    }
  });

  return (
    <group ref={gridRef} position={position}>
      <gridHelper args={[size, divisions, "#4ecdc4", "#4ecdc4"]} />
    </group>
  );
}

function PlayerTag() {
  const profile = {
    name: "Nir Tamir",
    activeAvatar: { headIconUrl: "https://nirtamir.com/me" },
  };
  const ref = useRef<Object3D>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current == null) {
      return;
    }
    ref.current.quaternion.copy(state.camera.quaternion);

    // Add subtle floating animation
    ref.current.position.y =
      2.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group
      ref={ref}
      position-y={2.15}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Root
        depthTest={false}
        renderOrder={1}
        backgroundOpacity={hovered ? 0.8 : 0.6}
        borderRadius={15}
        paddingX={3}
        height={25}
        backgroundColor={hovered ? "#4ecdc4" : "white"}
        flexDirection="row"
        alignItems="center"
        gap={6}
        scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <Image
          width={20}
          height={20}
          borderRadius={18}
          src={profile.activeAvatar?.headIconUrl}
        />
        <Text
          fontWeight="bold"
          fontSize={14}
          marginRight={4}
          color={hovered ? "white" : "black"}
        >
          {profile.name}
        </Text>
      </Root>
    </group>
  );
}

function Animated3DText() {
  const textRef = useRef<Group>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={textRef} position={[0, 2, -5]}>
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.05}
          height={0.3}
          letterSpacing={0.1}
          size={1.2}
        >
          Welcome to
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
        <Text3D
          font="/font/Inter_Regular.json"
          bevelEnabled
          bevelSize={0.05}
          bevelThickness={0.07}
          height={0.4}
          letterSpacing={0.1}
          size={2}
          position={[0, -2, 0]}
        >
          Nir Tamir
          <MeshDistortMaterial
            color="#4ecdc4"
            transparent
            opacity={0.95}
            distort={0.4}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
          />
        </Text3D>
      </group>
    </Float>
  );
}

function FloatingGeometry() {
  const geometries = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        Math.cos((i / 20) * Math.PI * 2) * (8 + Math.random() * 5),
        Math.random() * 10 + 3,
        Math.sin((i / 20) * Math.PI * 2) * (8 + Math.random() * 5),
      ] as [number, number, number],
      type: i % 3,
      color: new Color().setHSL(Math.random(), 0.8, 0.6),
    }));
  }, []);

  return (
    <group>
      {geometries.map((geo, i) => (
        <Float
          key={i}
          speed={0.5 + Math.random() * 2}
          rotationIntensity={1.5}
          floatIntensity={1}
        >
          <mesh position={geo.position} castShadow>
            {geo.type === 0 && <Torus args={[0.8, 0.2, 16, 100]} />}
            {geo.type === 1 && <Box args={[1, 1, 1]} />}
            {geo.type === 2 && <Sphere args={[0.8, 32, 32]} />}
            <MeshWobbleMaterial
              color={geo.color}
              transparent
              opacity={0.7}
              factor={0.3}
              speed={1 + Math.random()}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
