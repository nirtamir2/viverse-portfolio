import { MeshTransmissionMaterial, useFBO } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { createContext, useContext, type ReactNode } from "react";
import { NoToneMapping, type Object3D, type Texture } from "three";

const GlassBuffer = createContext<Texture | undefined>(undefined);

export function GlassCapture({
  children,
  light,
}: {
  children: ReactNode;
  light: boolean;
}) {
  const size = useThree((state) => state.size);
  const width = light ? 256 : 512;
  const target = useFBO(
    width,
    Math.max(160, Math.round((width * size.height) / size.width)),
  );
  useFrame(({ gl, scene, camera }) => {
    const hidden: Object3D[] = [];
    scene.traverse((object) => {
      if (object.userData.galleryGlass && object.visible) {
        hidden.push(object);
        object.visible = false;
      }
    });
    const previousTarget = gl.getRenderTarget();
    const previousTone = gl.toneMapping;
    const previousXR = gl.xr.enabled;
    const previousShadows = gl.shadowMap.autoUpdate;
    try {
      gl.xr.enabled = false;
      gl.shadowMap.autoUpdate = false;
      gl.toneMapping = NoToneMapping;
      gl.setRenderTarget(target);
      gl.render(scene, camera);
    } finally {
      gl.setRenderTarget(previousTarget);
      gl.toneMapping = previousTone;
      gl.xr.enabled = previousXR;
      gl.shadowMap.autoUpdate = previousShadows;
      hidden.forEach((object) => {
        object.visible = true;
      });
    }
  });
  return (
    <GlassBuffer.Provider value={target.texture}>
      {children}
    </GlassBuffer.Provider>
  );
}

export function GlassMaterial({
  color = "#e7f5f2",
  thickness = 0.6,
  distortion = 0,
}: {
  color?: string;
  thickness?: number;
  distortion?: number;
}) {
  const buffer = useContext(GlassBuffer);
  return (
    <MeshTransmissionMaterial
      buffer={buffer}
      resolution={32}
      samples={2}
      color={color}
      roughness={0.06}
      thickness={thickness}
      ior={1.45}
      chromaticAberration={0.035}
      distortion={distortion}
    />
  );
}
