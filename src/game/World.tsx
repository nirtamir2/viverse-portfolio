import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode, RefObject } from "react";
import {
  BufferAttribute,
  CanvasTexture,
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Path,
  PCFShadowMap,
  Shape,
  SRGBColorSpace,
  Vector3,
} from "three";
import type { BufferGeometry, OrthographicCamera } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { places } from "../portfolio";
import { advanceGame, tokens } from "./engine";
import type { GameState, Input } from "./engine";

export interface WorldProps {
  game: RefObject<GameState>;
  input: RefObject<Input>;
  active: boolean;
  quality: "auto" | "low" | "high";
  onTick: () => void;
  onReady: () => void;
  onFailure: () => void;
}

function Box({
  size,
  color,
  ...props
}: ThreeElements["mesh"] & { size: [number, number, number]; color: string }) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function StaticBatch({ children }: { children: ReactNode }) {
  const root = useRef<Group>(null);
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  useLayoutEffect(() => {
    const sources: Mesh[] = [],
      parts: BufferGeometry[] = [];
    root.current!.updateWorldMatrix(true, true);
    const inverse = new Matrix4().copy(root.current!.matrixWorld).invert();
    root.current!.traverse((object) => {
      if (
        !(object instanceof Mesh) ||
        object instanceof InstancedMesh ||
        object.userData.staticBatch ||
        !(object.material instanceof MeshStandardMaterial) ||
        object.material.map
      )
        return;
      const part = object.geometry.index
        ? object.geometry.toNonIndexed()
        : object.geometry.clone();
      part.applyMatrix4(
        new Matrix4().multiplyMatrices(inverse, object.matrixWorld),
      );
      for (const name of Object.keys(part.attributes))
        if (name !== "position" && name !== "normal")
          part.deleteAttribute(name);
      const colors = new Float32Array(part.attributes.position.count * 3);
      for (let i = 0; i < colors.length; i += 3)
        object.material.color.toArray(colors, i);
      part.setAttribute("color", new BufferAttribute(colors, 3));
      parts.push(part);
      sources.push(object);
      object.visible = false;
    });
    const merged = mergeGeometries(parts);
    parts.forEach((part) => part.dispose());
    setGeometry(merged);
    return () => {
      merged?.dispose();
      sources.forEach((object) => {
        object.visible = true;
      });
    };
  }, []);
  return (
    <group ref={root}>
      {children}
      {geometry && (
        <mesh
          geometry={geometry}
          userData={{ staticBatch: true }}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial vertexColors roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

function roundedPath(
  path: Shape | Path,
  width: number,
  depth: number,
  radius: number,
) {
  const x = -width / 2,
    y = -depth / 2;
  path.moveTo(x + radius, y);
  path.lineTo(x + width - radius, y);
  path.quadraticCurveTo(x + width, y, x + width, y + radius);
  path.lineTo(x + width, y + depth - radius);
  path.quadraticCurveTo(x + width, y + depth, x + width - radius, y + depth);
  path.lineTo(x + radius, y + depth);
  path.quadraticCurveTo(x, y + depth, x, y + depth - radius);
  path.lineTo(x, y + radius);
  path.quadraticCurveTo(x, y, x + radius, y);
  return path;
}

function GroundText({
  text,
  position,
  width = 7,
  color = "#786f5b",
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 160;
    const context = canvas.getContext("2d")!;
    context.fillStyle = color;
    context.font = "700 76px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 512, 80, 1000);
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[width, width / 6.4]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

const Landscape = memo(function Landscape() {
  const road = useMemo(() => {
    const shape = roundedPath(new Shape(), 38, 34, 7) as Shape;
    shape.holes.push(roundedPath(new Path(), 30, 26, 4));
    return shape;
  }, []);
  return (
    <group>
      <Box size={[46, 1.3, 42]} position={[0, -0.73, 0]} color="#c6ac87" />
      <Box size={[45.7, 0.14, 41.7]} position={[0, -0.05, 0]} color="#e4d5b6" />
      <mesh rotation-x={-Math.PI / 2} position-y={0.035} receiveShadow>
        <shapeGeometry args={[road, 12]} />
        <meshStandardMaterial color="#eee5d0" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.038} receiveShadow>
        <planeGeometry args={[4, 28]} />
        <meshStandardMaterial color="#eee5d0" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.04} receiveShadow>
        <circleGeometry args={[6, 48]} />
        <meshStandardMaterial color="#c8bca1" />
      </mesh>
      <GroundText
        text="HELLO, CURIOUS HUMAN."
        position={[0, 0.065, 4.4]}
        width={9}
      />
      <GroundText
        text="TAKE THE SCENIC ROUTE"
        position={[0, 0.065, 17.3]}
        width={9}
      />
      <GroundText text="JUMP ↑" position={[0, 0.065, -9.7]} width={3} />
      {[-13, -10, -7, -4, 4, 7, 10, 13].map((x) => (
        <group key={x}>
          <Box
            size={[1.2, 0.025, 0.12]}
            color="#c2b399"
            position={[x, 0.06, -15]}
          />
          <Box
            size={[1.2, 0.025, 0.12]}
            color="#c2b399"
            position={[x, 0.06, 15]}
          />
        </group>
      ))}
      {[-9, -6, -3, 0, 3, 6, 9].map((z) => (
        <group key={z}>
          <Box
            size={[0.12, 0.025, 1.2]}
            color="#c2b399"
            position={[-17, 0.06, z]}
          />
          <Box
            size={[0.12, 0.025, 1.2]}
            color="#c2b399"
            position={[17, 0.06, z]}
          />
        </group>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <Box
          key={i}
          size={[0.5, 0.025, 0.5]}
          color={i % 2 ? "#eae1cf" : "#6e7062"}
          position={[
            -1.25 + (i % 6) * 0.5,
            0.075,
            10.4 + Math.floor(i / 6) * 0.5,
          ]}
        />
      ))}
      <Box
        size={[3.3, 0.25, 3.7]}
        color="#c08d64"
        position={[0, 0.6, -13.1]}
        rotation-x={-0.3}
      />
      <Trees />
      {places.map((place, i) => (
        <Pavilion key={place.id} index={i} />
      ))}
      <group position={[-4, 0, 0]}>
        <Box size={[0.16, 3.1, 0.16]} color="#8e8069" position={[0, 1.55, 0]} />
        <Box
          size={[2.7, 0.65, 0.18]}
          color="#f7f0dd"
          position={[0, 2.8, 0]}
          rotation-y={0.5}
        />
        <Box
          size={[2.4, 0.55, 0.18]}
          color="#dc714c"
          position={[0, 2.1, 0]}
          rotation-y={-0.2}
        />
      </group>
      <group position={[1.6, 0, 2]}>
        <Box
          size={[0.85, 0.85, 0.85]}
          color="#c7c0a9"
          position={[0, 0.43, 0]}
        />
        <mesh position={[0, 1.1, 0]} castShadow>
          <icosahedronGeometry args={[0.65, 0]} />
          <meshStandardMaterial color="#dd714b" />
        </mesh>
      </group>
    </group>
  );
});

function Trees() {
  const trunks = useRef<InstancedMesh>(null),
    crowns = useRef<InstancedMesh>(null),
    rocks = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const object = new Object3D();
    const color = new Color();
    for (let i = 0; i < 32; i++) {
      const side = Math.floor(i / 8),
        t = (i % 8) * 4.7 - 16.5;
      const x = side < 2 ? t : side === 2 ? -20.5 : 20.5,
        z = side >= 2 ? t : side === 0 ? -18.5 : 18.5;
      const height = 1.9 + ((i * 7) % 9) * 0.19;
      object.position.set(x, height / 2, z);
      object.scale.set(0.18, height, 0.18);
      object.updateMatrix();
      trunks.current!.setMatrixAt(i, object.matrix);
      object.position.y = height + 0.2;
      object.scale.set(1.1, 1.5 + (i % 3) * 0.2, 1.1);
      object.rotation.y = i * 1.3;
      object.updateMatrix();
      crowns.current!.setMatrixAt(i, object.matrix);
      color.set(["#75866a", "#8d9a74", "#a6ac80", "#607c66"][i % 4]);
      crowns.current!.setColorAt(i, color);
      object.position.set(x + 0.9, 0.2, z + 0.7);
      object.scale.set(0.4 + (i % 3) * 0.15, 0.3, 0.45);
      object.updateMatrix();
      rocks.current!.setMatrixAt(i, object.matrix);
    }
    for (const ref of [trunks, crowns, rocks]) {
      ref.current!.instanceMatrix.needsUpdate = true;
      ref.current!.computeBoundingSphere();
    }
  }, []);
  return (
    <group>
      <instancedMesh ref={trunks} args={[undefined, undefined, 32]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="#9a8768" />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[undefined, undefined, 32]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={1} />
      </instancedMesh>
      <instancedMesh ref={rocks} args={[undefined, undefined, 32]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#bdab8d" />
      </instancedMesh>
    </group>
  );
}

function Pavilion({ index }: { index: number }) {
  const place = places[index];
  return (
    <group position={[place.x, 0, place.z]}>
      <Box size={[5.2, 0.2, 5]} color="#c6b497" position-y={0.12} />
      <Box size={[3.8, 2.1, 2.9]} color="#f3e9d5" position-y={1.2} />
      <Box size={[4.5, 0.3, 3.6]} color={place.color} position-y={2.4} />
      <Box size={[0.15, 1.3, 0.15]} color="#b09b7d" position={[-1.9, 0.9, 2]} />
      <Box size={[0.15, 1.3, 0.15]} color="#b09b7d" position={[1.9, 0.9, 2]} />
      <Box
        size={[4.4, 0.18, 1.8]}
        color={place.color}
        position={[0, 1.6, 1.8]}
        rotation-x={0.1}
      />
      <Box size={[2.3, 1, 0.04]} color="#536d68" position={[0, 1.3, 1.48]} />
      <Box size={[0.1, 1, 0.1]} color="#e9ddc6" position={[0, 1.3, 1.53]} />
      <GroundText
        text={
          ["THE STUDIO", "CAREER AVENUE", "THE PLAYGROUND", "READING ROOM"][
            index
          ]
        }
        position={[0, 0.25, 3.8]}
        width={7.8}
        color={place.color}
      />
      {index === 0 && (
        <group position-y={2.57}>
          <Box
            size={[0.45, 0.8, 0.45]}
            color="#dc714c"
            position={[1.3, 0.4, 0]}
          />
          <mesh position={[-0.7, 0.9, 0]} castShadow>
            <torusGeometry args={[0.85, 0.15, 8, 24]} />
            <meshStandardMaterial color="#eab461" />
          </mesh>
        </group>
      )}
      {index === 1 &&
        [0, 1, 2].map((i) => (
          <Box
            key={i}
            size={[0.65, 0.6 + i * 0.5, 0.65]}
            color={place.color}
            position={[-1 + i, 2.55 + (0.6 + i * 0.5) / 2, 0]}
          />
        ))}
      {index === 2 && (
        <group position={[0, 3.2, 0]} rotation={[0.3, 0.4, 0.2]}>
          <Box size={[1.2, 1.2, 1.2]} color="#d6a243" />
          <Box size={[1.5, 0.16, 1.5]} color="#efca77" />
        </group>
      )}
      {index === 3 &&
        [-1, 0, 1].map((x, i) => (
          <Box
            key={x}
            size={[0.6, 1.2, 1]}
            color={["#7b8eb3", "#e2a468", "#93a687"][i]}
            position={[x * 0.7, 3.1, 0]}
            rotation-z={(i - 1) * 0.12}
          />
        ))}
    </group>
  );
}

function Car({
  carRef,
  bodyRef,
  wheels,
}: {
  carRef: RefObject<Group | null>;
  bodyRef: RefObject<Group | null>;
  wheels: RefObject<(Group | null)[]>;
}) {
  return (
    <group ref={carRef}>
      <group ref={bodyRef}>
        <StaticBatch>
          <Box
            size={[1.55, 0.48, 2.5]}
            color="#df7349"
            position={[0, 0.63, 0]}
          />
          <Box
            size={[1.35, 0.58, 1.15]}
            color="#f8d485"
            position={[0, 1.15, 0.25]}
          />
          <Box
            size={[1.22, 0.4, 0.05]}
            color="#506e70"
            position={[0, 1.17, -0.35]}
            rotation-x={-0.15}
          />
          <Box
            size={[0.04, 0.38, 0.88]}
            color="#506e70"
            position={[-0.69, 1.17, 0.25]}
          />
          <Box
            size={[0.04, 0.38, 0.88]}
            color="#506e70"
            position={[0.69, 1.17, 0.25]}
          />
          <Box
            size={[1.52, 0.15, 1.4]}
            color="#f9dc9e"
            position={[0, 1.5, 0.2]}
          />
          <Box
            size={[1.6, 0.16, 0.16]}
            color="#59645d"
            position={[0, 0.5, -1.3]}
          />
          <Box
            size={[1.6, 0.16, 0.16]}
            color="#59645d"
            position={[0, 0.5, 1.3]}
          />
          {[-0.53, 0.53].map((x) => (
            <group key={x}>
              <Box
                size={[0.34, 0.21, 0.06]}
                color="#fff2bb"
                position={[x, 0.74, -1.27]}
              />
              <Box
                size={[0.25, 0.16, 0.06]}
                color="#ab493c"
                position={[x, 0.74, 1.27]}
              />
            </group>
          ))}
          <Box size={[0.8, 0.2, 1]} color="#8f9b7c" position={[0, 1.67, 0.3]} />
          <Box
            size={[0.9, 0.06, 0.1]}
            color="#6b745f"
            position={[0, 1.79, 0.3]}
          />
        </StaticBatch>
      </group>
      {[-0.88, 0.88].flatMap((x, side) =>
        [-0.78, 0.83].map((z, axle) => (
          <group
            key={`${side}-${axle}`}
            position={[x, 0.43, z]}
            ref={(ref) => {
              wheels.current[side * 2 + axle] = ref;
            }}
          >
            <mesh rotation-z={Math.PI / 2} castShadow>
              <cylinderGeometry args={[0.43, 0.43, 0.32, 12]} />
              <meshStandardMaterial color="#45534c" />
            </mesh>
            <mesh rotation-z={Math.PI / 2} position-x={Math.sign(x) * 0.17}>
              <cylinderGeometry args={[0.22, 0.22, 0.015, 8]} />
              <meshStandardMaterial color="#f4dec0" />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

function Simulation({
  game,
  input,
  active,
  quality,
  onTick,
  onReady,
  onFailure,
  onSlow,
}: WorldProps & { onSlow: () => void }) {
  const car = useRef<Group>(null),
    body = useRef<Group>(null),
    wheels = useRef<(Group | null)[]>([]);
  const coins = useRef<(Mesh | null)[]>([]),
    props = useRef<(Mesh | null)[]>([]),
    dust = useRef<InstancedMesh>(null);
  const { camera, size, gl, scene } = useThree();
  const temp = useMemo(
    () => ({
      target: new Vector3(),
      object: new Object3D(),
      tick: 0,
      time: 0,
      frames: 0,
      frameTime: 0,
      adapted: false,
    }),
    [],
  );
  const particles = useMemo(
    () => Array.from({ length: 30 }, () => ({ x: 0, y: -10, z: 0, life: 0 })),
    [],
  );
  const particleIndex = useRef(0);
  useLayoutEffect(() => {
    const orthographic = camera as OrthographicCamera;
    orthographic.zoom = Math.min(size.width / 59, size.height / 48);
    orthographic.position.set(28, 32, 34);
    orthographic.lookAt(0, 0, 0);
    orthographic.updateProjectionMatrix();
  }, [camera, size]);
  useEffect(() => {
    temp.adapted = false;
    temp.frames = 0;
    temp.frameTime = 0;
  }, [quality, temp]);
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1);
    temp.time += active ? dt : 0;
    const state = game.current;
    if (active) advanceGame(state, input.current, rawDelta);
    else state.accumulator = 0;
    car.current!.position.set(state.x, state.height + 0.05, state.z);
    car.current!.rotation.y = state.heading;
    body.current!.rotation.z = state.steering * state.speed * 0.009;
    body.current!.rotation.x = -state.verticalSpeed * 0.025;
    wheels.current.forEach((wheel, index) => {
      if (wheel) {
        wheel.rotation.x += active ? state.speed * dt * 2.3 : 0;
        if (index % 2 === 0) wheel.rotation.y = state.steering * 0.35;
      }
    });
    props.current.forEach((prop, index) => {
      if (prop) {
        prop.position.set(state.props[index].x, 0.48, state.props[index].z);
        prop.rotation.y = state.props[index].angle;
      }
    });
    coins.current.forEach((coin, index) => {
      if (coin) {
        coin.visible = !state.collected.has(index);
        coin.position.y = 1.1 + Math.sin(temp.time * 2.2 + index) * 0.18;
        coin.rotation.y = temp.time + index;
      }
    });
    if (active && state.speed > 3 && temp.frames % 3 === 0) {
      const particle = particles[particleIndex.current++ % particles.length];
      particle.x = state.x + Math.sin(state.heading) * 1.2;
      particle.z = state.z + Math.cos(state.heading) * 1.2;
      particle.y = state.height + 0.3;
      particle.life = 1;
    }
    particles.forEach((particle, index) => {
      particle.life = Math.max(0, particle.life - dt * 1.6);
      particle.y += dt * 0.3;
      temp.object.position.set(particle.x, particle.y, particle.z);
      temp.object.scale.setScalar(
        particle.life > 0 ? (1 - particle.life) * 0.45 : 0,
      );
      temp.object.updateMatrix();
      dust.current!.setMatrixAt(index, temp.object.matrix);
    });
    dust.current!.instanceMatrix.needsUpdate = true;
    const follow = active ? 1 - Math.exp(-2 * dt) : 1;
    temp.target.x += (state.x * 0.6 - temp.target.x) * follow;
    temp.target.z += (state.z * 0.6 - temp.target.z) * follow;
    camera.position.set(temp.target.x + 28, 32, temp.target.z + 34);
    camera.lookAt(temp.target);
    const orthographic = camera as OrthographicCamera;
    const targetZoom =
      Math.min(size.width / 59, size.height / 48) *
      (active ? (size.width < 650 ? 1.2 : 1.35) : 1);
    orthographic.zoom +=
      (targetZoom - orthographic.zoom) * (active ? 1 - Math.exp(-3 * dt) : 1);
    orthographic.updateProjectionMatrix();
    temp.tick += dt;
    if (temp.tick >= 0.1) {
      onTick();
      temp.tick = 0;
    }
    if (active) {
      temp.frames++;
      temp.frameTime += rawDelta;
      if (
        quality === "auto" &&
        !temp.adapted &&
        temp.frames >= 15 &&
        temp.frameTime >= 2
      ) {
        if (temp.frameTime / temp.frames > 1 / 42) onSlow();
        temp.adapted = true;
      }
    }
    // Readable diagnostics for browser verification without copying simulation into React state.
    scene.userData.performance = {
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
    };
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.triangles = String(gl.info.render.triangles);
  });
  return (
    <>
      <color attach="background" args={["#f5f2e9"]} />
      <hemisphereLight args={["#fff8e6", "#b6b196", 2.4]} />
      <directionalLight
        position={[-12, 22, 8]}
        intensity={3}
        castShadow={quality !== "low"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-camera-far={70}
        shadow-normalBias={0.06}
      />
      <StaticBatch>
        <Landscape />
      </StaticBatch>
      <Car carRef={car} bodyRef={body} wheels={wheels} />
      {tokens.map(([x, z], index) => (
        <mesh
          key={index}
          position={[x, 1.1, z]}
          ref={(ref) => {
            coins.current[index] = ref;
          }}
          castShadow
        >
          <torusGeometry args={[0.42, 0.11, 6, 16]} />
          <meshStandardMaterial
            color="#e5aa39"
            emissive="#9b6815"
            emissiveIntensity={0.15}
            roughness={0.55}
          />
        </mesh>
      ))}
      {game.current.props.map((_, index) => (
        <Box
          key={index}
          ref={(ref) => {
            props.current[index] = ref;
          }}
          size={[0.85, 0.85, 0.85]}
          color={["#de916b", "#b6bf95", "#e3c072"][index % 3]}
        />
      ))}
      <instancedMesh
        ref={dust}
        args={[undefined, undefined, 30]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#d9c7a9" />
      </instancedMesh>
    </>
  );
}

export default memo(function World(props: WorldProps) {
  const [reduced, setReduced] = useState(false);
  const onSlow = useCallback(() => setReduced(true), []);
  return (
    <Canvas
      orthographic
      camera={{ position: [28, 32, 34], near: 0.1, far: 150, zoom: 16 }}
      dpr={
        props.quality === "low"
          ? 1
          : props.quality === "high"
            ? Math.min(devicePixelRatio, 2)
            : reduced
              ? 1
              : Math.min(devicePixelRatio, 1.5)
      }
      shadows={props.quality !== "low" ? { type: PCFShadowMap } : false}
      frameloop={props.active ? "always" : "demand"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Simulation {...props} onSlow={onSlow} />
    </Canvas>
  );
});
