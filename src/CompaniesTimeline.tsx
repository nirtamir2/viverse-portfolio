import { Logo3D } from "./Logo3D";

// Companies from CV in chronological order (oldest to newest)
const companies = [
  {
    name: "Ofek 324 Unit - IAF",
    src: "/companies logos/ofek-flat.gltf",
    period: "2014-2018",
    role: "Software Developer",
  },
  {
    name: "Any.do",
    src: "/companies logos/anydo.gltf",
    period: "2018-2019",
    role: "Web Developer",
  },
  {
    name: "CME Group",
    src: "/companies logos/cme.gltf",
    period: "2019-2020",
    role: "Senior Frontend Developer",
  },
  {
    name: "Cycode",
    src: "/companies logos/cycode-white.gltf",
    period: "2020-2022",
    role: "Senior Frontend Developer",
  },
  {
    name: "YOULEAP",
    src: "/companies logos/youleap.gltf",
    period: "2022-2023",
    role: "Senior Frontend Developer",
  },
  {
    name: "Peaklight",
    src: "/companies logos/peaklight.gltf",
    period: "2024-Present",
    role: "Founding Engineer",
  },
];

interface CompaniesTimelineProps {
  startPosition?: [number, number, number];
  spacing?: number;
  logoScale?: number;
}

export function CompaniesTimeline({
  startPosition = [-12, 2, -6],
  spacing = 4,
  logoScale = 0.8,
}: CompaniesTimelineProps) {
  return (
    <group>
      {companies.map((company, index) => (
        <Logo3D
          key={company.name}
          src={company.src}
          label={`${company.name} (${company.period})`}
          position={[
            startPosition[0] + index * spacing,
            startPosition[1] + Math.sin(index * 0.5) * 0.5,
            startPosition[2],
          ]}
          scale={logoScale}
          floatSpeed={1 + index * 0.1}
          floatIntensity={0.2}
          showLabel
        />
      ))}
    </group>
  );
}
