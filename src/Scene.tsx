import { Environment, Lightformer, Sky, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  BvhPhysicsBody,
  BvhPhysicsWorld,
  JumpAction,
  Vanilla,
  useKeyboardLocomotionActionBindings,
  usePointerButtonActionBinding,
  usePointerCaptureRotateZoomActionBindings,
  useScreenJoystickLocomotionActionBindings,
  useBvhPhysicsWorld,
} from "@react-three/viverse";
import { memo, Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import { Bubble } from "./Bubble";
import { CustomText3D } from "./CustomText3D";
import { Floor } from "./Floor";
import { TransparentBox } from "./TransparentBox";
import { Gallery } from "./gallery/Gallery";
import { GlassCapture } from "./gallery/Glass";
import { nearestExhibit, type ExhibitId } from "./gallery/content";

export type WorldStatus = {
  ready: boolean;
  nearby: ExhibitId | null;
  x: number;
  z: number;
  height: number;
};

function ActiveControls() {
  useKeyboardLocomotionActionBindings({
    moveForwardKeys: ["ArrowUp", "KeyW"],
    moveBackwardKeys: ["ArrowDown", "KeyS"],
    moveLeftKeys: ["ArrowLeft", "KeyA"],
    moveRightKeys: ["ArrowRight", "KeyD"],
  });
  usePointerCaptureRotateZoomActionBindings({ rotationSpeed: 0.6 });
  useScreenJoystickLocomotionActionBindings();
  const canvas = useThree((state) => state.gl.domElement);
  const jumpButton = useMemo(() => document.createElement("button"), []);
  usePointerButtonActionBinding(JumpAction, { domElement: jumpButton });
  useEffect(() => {
    jumpButton.className = "gallery-touch-jump";
    jumpButton.type = "button";
    jumpButton.textContent = "↑";
    canvas.parentElement?.appendChild(jumpButton);
    const key = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        JumpAction.emit(event);
      }
    };
    jumpButton.addEventListener("keydown", key);
    jumpButton.setAttribute("aria-label", "Jump");
    return () => {
      jumpButton.removeEventListener("keydown", key);
      jumpButton.remove();
    };
  }, [jumpButton, canvas]);
  return null;
}

function Visitor({
  paused,
  reset,
  onStatus,
}: {
  paused: boolean;
  reset: number;
  onStatus: (status: WorldStatus) => void;
}) {
  const container = useRef<Group>(null);
  const ref = useRef<Vanilla.SimpleCharacter | null>(null);
  const options = useRef<Vanilla.SimpleCharacterOptions>({
    actionBindings: [],
    model: { url: "/avatar.vrm" },
  });
  const firstLoad = useRef(true);
  const lastReport = useRef(0);
  const canvas = useThree((state) => state.gl.domElement);
  const camera = useThree((state) => state.camera);
  const world = useBvhPhysicsWorld();
  const entrance = useCallback(() => {
    const visitor = ref.current;
    visitor?.position.set(0, -1.95, 3);
    camera.position.set(0, 0.75, 8.8);
    camera.rotation.set(-0.26, 0, 0, "YXZ");
    if (visitor) {
      visitor.cameraBehavior.rotationYaw = 0;
      visitor.cameraBehavior.rotationPitch = -0.26;
      visitor.cameraBehavior.zoomDistance = 6;
    }
  }, [camera]);
  useEffect(() => {
    let cancelled = false;
    // Wait until StrictMode has finished its mount/cleanup check before starting
    // the controller’s asynchronous model and animation loading.
    queueMicrotask(() => {
      if (cancelled || !container.current) return;
      const visitor = new Vanilla.SimpleCharacter(
        camera,
        world,
        canvas,
        options.current,
      );
      visitor.name = "gallery-visitor";
      ref.current = visitor;
      container.current.add(visitor);
      entrance();
    });
    return () => {
      cancelled = true;
      ref.current?.dispose();
      ref.current = null;
    };
  }, [camera, canvas, world, entrance]);
  useEffect(entrance, [reset, entrance]);
  useEffect(() => {
    const prevent = (event: KeyboardEvent) => {
      if (
        ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.code,
        )
      )
        event.preventDefault();
    };
    canvas.addEventListener("keydown", prevent);
    return () => canvas.removeEventListener("keydown", prevent);
  }, [canvas]);
  useFrame((state, delta) => {
    const visitor = ref.current;
    if (!visitor) return;
    options.current.movement = paused
      ? { walk: false, run: false, jump: false }
      : { walk: { speed: 3.2 }, run: { speed: 6.2 }, jump: { speed: 8.5 } };
    options.current.physics = paused ? false : { updatesPerSecond: 60 };
    options.current.cameraBehavior = paused
      ? false
      : {
          collision: false,
          characterBaseOffset: [0, 1.2, 0],
          rotation: { minPitch: -0.75, maxPitch: 0.12 },
          zoom: { minDistance: 3, maxDistance: 9 },
        };
    // A hidden tab must not accumulate a second of physics catch-up.
    if (!paused) visitor.update(Math.min(delta, 0.08));
    if (!visitor.model || visitor.model.currentAnimations.size === 0) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      if (!paused) canvas.focus({ preventScroll: true });
    }
    const position = visitor.position;
    if (
      position.y < -9 ||
      Math.abs(position.x) > 26 ||
      position.z < -35 ||
      position.z > 15
    )
      entrance();
    if (state.clock.elapsedTime - lastReport.current < 0.12) return;
    lastReport.current = state.clock.elapsedTime;
    onStatus({
      ready: true,
      nearby: nearestExhibit(position.x, position.y, position.z),
      x: position.x,
      z: position.z,
      height: position.y,
    });
  });
  return (
    <>
      {!paused && <ActiveControls />}
      <group ref={container} />
    </>
  );
}

export const Scene = memo(function Scene({
  paused,
  quality,
  reset,
  onStatus,
  onOpen,
}: {
  paused: boolean;
  quality: "full" | "light";
  reset: number;
  onStatus: (status: WorldStatus) => void;
  onOpen: (id: ExhibitId) => void;
}) {
  return (
    <BvhPhysicsWorld>
      <color attach="background" args={["#c6d3de"]} />
      <Sky
        sunPosition={[100, 10, 100]}
        turbidity={8}
        rayleigh={0.4}
        mieCoefficient={0.01}
      />
      <fog attach="fog" args={["#bacbd5", 35, 75]} />
      <ambientLight intensity={0.7} />
      <hemisphereLight args={["#d9e9f1", "#20202e", 1.4]} />
      <directionalLight
        intensity={2.2}
        color="#fff0d9"
        position={[8, 16, 8]}
        castShadow={quality === "full"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
      />
      <directionalLight
        intensity={1.4}
        color="#a9d5e6"
        position={[-12, 10, -20]}
      />
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={3}
          position={[0, 9, 0]}
          rotation-x={Math.PI / 2}
          scale={[20, 12, 1]}
        />
        <Lightformer
          intensity={2}
          color="#d3eee6"
          position={[-10, 4, -10]}
          rotation-y={Math.PI / 2}
          scale={[4, 15, 1]}
        />
        <Lightformer
          intensity={2}
          color="#f3dfbb"
          position={[12, 6, -10]}
          rotation-y={-Math.PI / 2}
          scale={[4, 16, 1]}
        />
        <Lightformer
          intensity={1.5}
          position={[0, 4, 15]}
          rotation-y={Math.PI}
          scale={[18, 5, 1]}
        />
      </Environment>
      <Suspense fallback={null}>
        <Visitor paused={paused} reset={reset} onStatus={onStatus} />
      </Suspense>
      <GlassCapture light={quality === "light"}>
        <BvhPhysicsBody>
          <group position={[0, -2, -10]}>
            <Floor light={quality === "light"} />
          </group>
          {/* The original glass platforms remain the entrance to the world. */}
          <TransparentBox scale={[2, 1, 3]} position={[3.91, 0, 0]} />
          <TransparentBox scale={[2, 0.5, 3]} position={[1.92, 2.5, -3.22]} />
          <TransparentBox scale={[1, 1, 4]} position={[0.08, -1, 0]} />
          <TransparentBox scale={[2, 1, 3]} position={[0, 0.5, -2.22]} />
          {/* A second staircase climbs to a quiet, elevated viewing platform. */}
          {Array.from({ length: 8 }, (_, i) => (
            <TransparentBox
              key={i}
              scale={[2.5, 0.28, 1.4]}
              position={[4.8, -1.75 + i * 0.45, -4.5 - i * 1.1]}
              color="#dce8f5"
            />
          ))}
          <TransparentBox
            scale={[5, 0.3, 4]}
            position={[3.5, 1.7, -14]}
            color="#dce8f5"
          />
        </BvhPhysicsBody>
        <group position={[-3.7, 3.4, -8]} scale={0.45}>
          <CustomText3D text="Nir Tamir" />
        </group>
        <Text
          position={[0, 2.65, -8]}
          fontSize={0.15}
          letterSpacing={0.12}
          color="#c2d5d0"
        >
          DEVELOPER · MAKER · CURIOUS HUMAN
        </Text>
        <Bubble position={[8, 1.8, -2]} size={0.65} color="#b7dedb" />
        <Bubble position={[-4, 3.4, -8]} size={0.45} color="#cfbfdc" />
        <Bubble position={[-12, 1.8, -17]} size={0.8} color="#c7dacd" />
        <Gallery onOpen={onOpen} paused={paused} />
      </GlassCapture>
    </BvhPhysicsWorld>
  );
});
