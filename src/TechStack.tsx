import { Logo3D } from "./Logo3D";

// Tech stack logos
const techLogos = [
  { name: "TypeScript", src: "/tech/typescript.gltf" },
  { name: "React", src: "/tech/react.gltf" },
  { name: "Next.js", src: "/tech/nextjs.gltf" },
  { name: "TailwindCSS", src: "/tech/tailwindcss.gltf" },
  { name: "TanStack", src: "/tech/tanstack.gltf" },
  { name: "GitHub", src: "/tech/github.gltf" },
  { name: "pnpm", src: "/tech/pnpm.gltf" },
  { name: "Vercel", src: "/tech/vercel.gltf" },
  { name: "VS Code", src: "/tech/vscode-white.gltf" },
  { name: "Three.js", src: "/tech/threejs.gltf" },
  { name: "Vitest", src: "/tech/vitest.gltf" },
  { name: "Prisma", src: "/tech/prisma.gltf" },
  { name: "Prettier", src: "/tech/prettier.gltf" },
  { name: "Effect", src: "/tech/effect-ts.gltf" },
  { name: "Hono", src: "/tech/hono.gltf" },
  { name: "Expo", src: "/tech/expo.gltf" },
  { name: "Motion", src: "/tech/motion.gltf" },
];

// Arrange logos in a curved arc on the opposite side
function getLogoPosition(index: number, total: number): [number, number, number] {
  const angle = (index / (total - 1)) * Math.PI * 0.8 - Math.PI * 0.4;
  const radius = 10;
  const height = 1 + Math.sin(index * 0.7) * 1.5;

  return [
    Math.sin(angle) * radius + 8,
    height,
    Math.cos(angle) * radius - 5,
  ];
}

interface TechStackProps {
  logoScale?: number;
}

export function TechStack({ logoScale = 0.5 }: TechStackProps) {
  return (
    <group>
      {techLogos.map((tech, index) => (
        <Logo3D
          key={tech.name}
          src={tech.src}
          label={tech.name}
          position={getLogoPosition(index, techLogos.length)}
          scale={logoScale}
          floatSpeed={0.8 + (index % 5) * 0.2}
          floatIntensity={0.3}
          showLabel
          rotation={[0, -Math.PI * 0.3 + (index / techLogos.length) * Math.PI * 0.6, 0]}
        />
      ))}
    </group>
  );
}
