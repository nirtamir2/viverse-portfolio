import {
  Box,
  Caustics,
  ContactShadows,
  Environment,
  Gltf,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  Sky,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BvhPhysicsBody,
  BvhPhysicsWorld,
  PrototypeBox,
  SimpleCharacter,
} from "@react-three/viverse";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import { Animated3DText } from "./Animated3DText";
import { AnyDo } from "./AnyDo";
import { Grid } from "./Grid";

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
    <BvhPhysicsWorld>
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
      {/* <fog attach="fog" args={["#191920", 0, 15]} /> */}

      <Suspense fallback={null}>
        <SimpleCharacter
          inputOptions={{
            keyboardMoveForwardKeys: ["ArrowUp", "KeyW"],
            keyboardMoveBackwardKeys: ["ArrowDown", "KeyS"],
            keyboardMoveLeftKeys: ["ArrowLeft", "KeyA"],
            keyboardMoveRightKeys: ["ArrowRight", "KeyD"],
          }}
          ref={characterRef}
          model={{
            url: "avatar.vrm",
          }}
        ></SimpleCharacter>
      </Suspense>
      <Animated3DText></Animated3DText>
      <BvhPhysicsBody>
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
        <Grid size={30} divisions={30} position={[0, -2, 0]} />
      </BvhPhysicsBody>

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
        position={[0, -1, 8]}
        lightSource={[5, 5, -10]}
        worldRadius={0.01}
        ior={1.2}
        intensity={0}
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
      <AnyDo></AnyDo>
      <Caustics
        position={[8, -0.5, -1]}
        color={[1, 0.8, 0.8]}
        lightSource={[-1.2, 3, -2]}
        intensity={0.005}
        worldRadius={0.1126 / 10}
        ior={0.91}
        causticsOnly={false}
        backside={false}
      >
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial color="white" />
        </mesh>
      </Caustics>
    </BvhPhysicsWorld>
  );
}
