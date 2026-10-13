import { Box } from "@react-three/drei";
import type { ComponentProps } from "react";
import { BoxGeometry, EdgesGeometry } from "three";
import { GlassMaterial } from "./gallery/Glass";

const boxGeometry = new BoxGeometry();
const boxEdges = new EdgesGeometry(boxGeometry);
boxGeometry.dispose();

// One scene capture is shared by every glass object in the gallery.
export function TransparentBox({
  color = "#e7f5f2",
  ...props
}: ComponentProps<typeof Box> & { color?: string }) {
  return (
    <Box {...props} receiveShadow userData={{ galleryGlass: true }}>
      <GlassMaterial color={color} />
      <lineSegments geometry={boxEdges}>
        <lineBasicMaterial color="#d7e7e4" transparent opacity={0.24} />
      </lineSegments>
    </Box>
  );
}
