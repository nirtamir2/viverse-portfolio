import { PlaygroundItem } from "./PlaygroundItem";

// Tech stack logos with specific positions scattered around the playground
const techLogos = [
  // Core skills - near center
  { name: "TypeScript", src: "/tech/typescript.gltf", position: [-3, -1.8, 4] as [number, number, number] },
  { name: "React", src: "/tech/react.gltf", position: [3, -1.8, 4] as [number, number, number] },
  { name: "Next.js", src: "/tech/nextjs.gltf", position: [0, -1.8, 6] as [number, number, number] },

  // Frontend tools - scattered around
  { name: "TailwindCSS", src: "/tech/tailwindcss.gltf", position: [-5, -1.8, -3] as [number, number, number] },
  { name: "TanStack", src: "/tech/tanstack.gltf", position: [5, -1.8, -3] as [number, number, number] },
  { name: "Three.js", src: "/tech/threejs.gltf", position: [0, -1.8, -5] as [number, number, number] },

  // Dev tools - outer ring
  { name: "GitHub", src: "/tech/github.gltf", position: [-6, -1.8, 6] as [number, number, number] },
  { name: "VS Code", src: "/tech/vscode-white.gltf", position: [6, -1.8, 6] as [number, number, number] },
  { name: "pnpm", src: "/tech/pnpm.gltf", position: [-4, -1.8, -7] as [number, number, number] },
  { name: "Vercel", src: "/tech/vercel.gltf", position: [4, -1.8, -7] as [number, number, number] },

  // Testing & Quality
  { name: "Vitest", src: "/tech/vitest.gltf", position: [-7, -1.8, 2] as [number, number, number] },
  { name: "Prettier", src: "/tech/prettier.gltf", position: [7, -1.8, 2] as [number, number, number] },

  // Backend & Database
  { name: "Prisma", src: "/tech/prisma.gltf", position: [-9, -1.8, -4] as [number, number, number] },
  { name: "Hono", src: "/tech/hono.gltf", position: [9, -1.8, -4] as [number, number, number] },
  { name: "Effect", src: "/tech/effect-ts.gltf", position: [0, -1.8, -10] as [number, number, number] },

  // Mobile & Animation
  { name: "Expo", src: "/tech/expo.gltf", position: [-10, -1.8, 5] as [number, number, number] },
  { name: "Motion", src: "/tech/motion.gltf", position: [10, -1.8, 5] as [number, number, number] },
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
