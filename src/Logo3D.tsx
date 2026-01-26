import { Gltf, Float, Html } from "@react-three/drei";
import { type GroupProps } from "@react-three/fiber";
import { useState } from "react";

interface Logo3DProps extends GroupProps {
  src: string;
  label?: string;
  floatSpeed?: number;
  floatIntensity?: number;
  showLabel?: boolean;
}

export function Logo3D({
  src,
  label,
  floatSpeed = 1,
  floatIntensity = 0.3,
  showLabel = false,
  ...props
}: Logo3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group {...props}>
      <Float
        speed={floatSpeed}
        rotationIntensity={0.2}
        floatIntensity={floatIntensity}
      >
        <Gltf
          src={src}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
        {showLabel && label && hovered && (
          <Html center distanceFactor={10}>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {label}
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
}
