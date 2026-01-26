import { PlaygroundItem } from "./PlaygroundItem";

// Core tech stack - only the essentials
const techLogos = [
  // Main skills - right side
  { name: "TypeScript", src: "/tech/typescript.gltf", position: [10, 0, 4] as [number, number, number] },
  { name: "React", src: "/tech/react.gltf", position: [14, 0, 4] as [number, number, number] },
  { name: "Next.js", src: "/tech/nextjs.gltf", position: [10, 0, 8] as [number, number, number] },
  { name: "TailwindCSS", src: "/tech/tailwindcss.gltf", position: [14, 0, 8] as [number, number, number] },

  // Tools - left side
  { name: "GitHub", src: "/tech/github.gltf", position: [-10, 0, 4] as [number, number, number] },
  { name: "VS Code", src: "/tech/vscode-white.gltf", position: [-14, 0, 4] as [number, number, number] },
  { name: "Three.js", src: "/tech/threejs.gltf", position: [-10, 0, 8] as [number, number, number] },
  { name: "Vercel", src: "/tech/vercel.gltf", position: [-14, 0, 8] as [number, number, number] },
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
          logoScale={0.5}
        />
      ))}
    </group>
  );
}
