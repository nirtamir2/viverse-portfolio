import { ContactShadows, Environment, Gltf, Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BvhPhysicsBody,
  BvhPhysicsWorld,
  SimpleCharacter,
} from "@react-three/viverse";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import { Bubble } from "./Bubble";
import { CustomText3D } from "./CustomText3D";
import { Floor } from "./Floor";
import { TransparentBox } from "./TransparentBox";

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
      {/* <Animated3DText></Animated3DText> */}
      <BvhPhysicsBody>
        <group position={[0, -2, 0]}>
          <Floor />
        </group>
        <TransparentBox scale={[2, 1, 3]} position={[3.91, 0, 0]} />
        <TransparentBox scale={[2, 0.5, 3]} position={[1.92, 2.5, -3.22]} />

        <TransparentBox scale={[1, 1, 4]} position={[0.08, -1, 0]} />
        <TransparentBox scale={[2, 1, 3]} position={[0, 0.5, -2.22]} />

        <Gltf
          scale={0.5}
          position-y={-1.02}
          position-x={-4.07}
          src="/macbook.glb"
          // onClick={() => window.open("https://github.com", "_blank")}
          // onPointerOver={() => (document.body.style.cursor = "pointer")}
          // onPointerOut={() => (document.body.style.cursor = "auto")}
        />
        {/* <Animated3DText /> */}
        {/* <FloatingGeometry /> */}
        {/* <Grid size={30} divisions={30} position={[0, -2, 0]} /> */}
      </BvhPhysicsBody>
      <group position={[-2, 4, -8]} scale={0.5}>
        <CustomText3D text="Nir Tamir" />
      </group>
      <Bubble position={[0, -0.5, 0]} />
      <Bubble position={[8, -0.5, -1]} />

      {/* <AnyDo></AnyDo> */}
    </BvhPhysicsWorld>
  );
}
