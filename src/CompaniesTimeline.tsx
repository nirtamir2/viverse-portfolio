import { PlaygroundItem } from "./PlaygroundItem";

// Companies - Career path in a line behind the starting area
const companies = [
  {
    name: "Ofek 324",
    src: "/companies logos/ofek-flat.gltf",
    position: [-12, 0, -8] as [number, number, number],
  },
  {
    name: "Any.do",
    src: "/companies logos/anydo.gltf",
    position: [-6, 0, -8] as [number, number, number],
  },
  {
    name: "CME Group",
    src: "/companies logos/cme.gltf",
    position: [0, 0, -8] as [number, number, number],
  },
  {
    name: "Cycode",
    src: "/companies logos/cycode-white.gltf",
    position: [6, 0, -8] as [number, number, number],
  },
  {
    name: "YOULEAP",
    src: "/companies logos/youleap.gltf",
    position: [12, 0, -8] as [number, number, number],
  },
  {
    name: "Peaklight",
    src: "/companies logos/peaklight.gltf",
    position: [18, 0, -8] as [number, number, number],
  },
];

export function CompaniesTimeline() {
  return (
    <group>
      {companies.map((company) => (
        <PlaygroundItem
          key={company.name}
          src={company.src}
          label={company.name}
          position={company.position}
          logoScale={0.5}
        />
      ))}
    </group>
  );
}
