import { Box, MeshTransmissionMaterial } from "@react-three/drei";
import type { ComponentProps } from "react";

export function TransparentBox(props: ComponentProps<typeof Box>) {
  return (
    <Box {...props}>
      <MeshTransmissionMaterial
        resolution={512}
        distortion={0.25}
        color="#ffffff"
        thickness={1}
        anisotropy={1}
      />
    </Box>
  );
}
