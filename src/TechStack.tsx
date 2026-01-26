import { PlaygroundItem } from "./PlaygroundItem";

// Tech stack logos - Skills Zone (separate area from companies)
// Arranged in front/right side of the playground
const techLogos = [
  // Core skills - main area (front right)
  { name: "TypeScript", src: "/tech/typescript.gltf", position: [8, 0, 6] as [number, number, number] },
  { name: "React", src: "/tech/react.gltf", position: [12, 0, 6] as [number, number, number] },
  { name: "Next.js", src: "/tech/nextjs.gltf", position: [16, 0, 6] as [number, number, number] },

  // Frontend tools - second row
  { name: "TailwindCSS", src: "/tech/tailwindcss.gltf", position: [8, 0, 10] as [number, number, number] },
  { name: "TanStack", src: "/tech/tanstack.gltf", position: [12, 0, 10] as [number, number, number] },
  { name: "Three.js", src: "/tech/threejs.gltf", position: [16, 0, 10] as [number, number, number] },

  // Dev tools - third row
  { name: "GitHub", src: "/tech/github.gltf", position: [8, 0, 14] as [number, number, number] },
  { name: "VS Code", src: "/tech/vscode-white.gltf", position: [12, 0, 14] as [number, number, number] },
  { name: "Vercel", src: "/tech/vercel.gltf", position: [16, 0, 14] as [number, number, number] },

  // Testing & Quality - left side area
  { name: "Vitest", src: "/tech/vitest.gltf", position: [-12, 0, 6] as [number, number, number] },
  { name: "Prettier", src: "/tech/prettier.gltf", position: [-16, 0, 6] as [number, number, number] },
  { name: "pnpm", src: "/tech/pnpm.gltf", position: [-12, 0, 10] as [number, number, number] },

  // Backend & Database - left side second row
  { name: "Prisma", src: "/tech/prisma.gltf", position: [-16, 0, 10] as [number, number, number] },
  { name: "Hono", src: "/tech/hono.gltf", position: [-12, 0, 14] as [number, number, number] },
  { name: "Effect", src: "/tech/effect-ts.gltf", position: [-16, 0, 14] as [number, number, number] },

  // Mobile & Animation
  { name: "Expo", src: "/tech/expo.gltf", position: [-8, 0, 6] as [number, number, number] },
  { name: "Motion", src: "/tech/motion.gltf", position: [20, 0, 6] as [number, number, number] },
];

export function TechStack() {
  return (
    <group>
      {techLogos.map((tech) => (
        <PlaygroundItem
          key={tech.name}
          src={tech.src}
          label={tech.name}
          position={tech.position}
          logoScale={0.4}
          labelScale={0.1}
          labelPosition="front"
          labelOffset={1.2}
        />
      ))}
    </group>
  );
}
