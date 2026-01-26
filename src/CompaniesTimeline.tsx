import { PlaygroundItem } from "./PlaygroundItem";

// Companies from CV - Career Journey Path (chronological, left to right)
// Creates a story-like timeline the character can walk along
const companies = [
  {
    name: "Ofek 324 Unit - IAF",
    src: "/companies logos/ofek-flat.gltf",
    period: "2014-2018",
    position: [-18, 0, -12] as [number, number, number],
  },
  {
    name: "Any.do",
    src: "/companies logos/anydo.gltf",
    period: "2018-2019",
    position: [-12, 0, -12] as [number, number, number],
  },
  {
    name: "CME Group",
    src: "/companies logos/cme.gltf",
    period: "2019-2020",
    position: [-6, 0, -12] as [number, number, number],
  },
  {
    name: "Cycode",
    src: "/companies logos/cycode-white.gltf",
    period: "2020-2022",
    position: [0, 0, -12] as [number, number, number],
  },
  {
    name: "YOULEAP",
    src: "/companies logos/youleap.gltf",
    period: "2022-2023",
    position: [6, 0, -12] as [number, number, number],
  },
  {
    name: "Peaklight",
    src: "/companies logos/peaklight.gltf",
    period: "2024-Present",
    position: [12, 0, -12] as [number, number, number],
  },
];

export function CompaniesTimeline() {
  return (
    <group>
      {companies.map((company) => (
        <PlaygroundItem
          key={company.name}
          src={company.src}
          label={`${company.name} | ${company.period}`}
          position={company.position}
          logoScale={0.6}
          labelScale={0.12}
          labelPosition="front"
          labelOffset={2}
        />
      ))}
    </group>
  );
}
