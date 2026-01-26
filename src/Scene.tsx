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
import { CompaniesTimeline } from "./CompaniesTimeline";
import { CustomText3D } from "./CustomText3D";
import { Floor } from "./Floor";
import { Playground } from "./Playground";
import { TechStack } from "./TechStack";

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
      <ambientLight intensity={0.7} />
      <directionalLight intensity={0.6} position={[10, 15, 5]} />
      <directionalLight intensity={0.3} position={[-10, 10, -5]} />
      <Environment preset="city" />
      <Sky sunPosition={[100, 20, 100]} />
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.25}
        scale={25}
        blur={2}
        far={3}
        frames={1}
      />

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
        />
      </Suspense>

      <BvhPhysicsBody>
        <group position={[0, -2, 0]}>
          <Floor />
        </group>
        <Playground />
        <Gltf
          scale={0.5}
          position={[-4, -1.02, 0]}
          src="/macbook.glb"
        />
      </BvhPhysicsBody>

      {/* Name */}
      <group position={[-2, 3, -6]} scale={0.4}>
        <CustomText3D text="Nir Tamir" />
      </group>

      {/* Just a couple floating bubbles for accent */}
      <Bubble position={[6, 2, 5]} size={0.5} color="#a8d8ea" />
      <Bubble position={[-5, 2.5, 6]} size={0.4} color="#fcbad3" />

      {/* Companies */}
      <Suspense fallback={null}>
        <CompaniesTimeline />
      </Suspense>

      {/* Tech */}
      <Suspense fallback={null}>
        <TechStack />
      </Suspense>
    </BvhPhysicsWorld>
  );
}
