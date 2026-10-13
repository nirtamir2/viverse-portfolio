export type ExhibitId =
  "about" | "projects" | "skills" | "career" | "notes" | "contact";
export const exhibits: {
  id: ExhibitId;
  title: string;
  shortTitle: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
}[] = [
  {
    id: "about",
    title: "Behind the glass",
    shortTitle: "About me",
    subtitle: "THE PERSON BEHIND THE PIXELS",
    position: [-6, -0.8, -3],
    color: "#b8efde",
  },
  {
    id: "projects",
    title: "Made out of curiosity",
    shortTitle: "Selected work",
    subtitle: "SIDE PROJECTS & SMALL OBSESSIONS",
    position: [-10, -0.8, -12],
    color: "#c6b9ef",
  },
  {
    id: "skills",
    title: "Tools of the trade",
    shortTitle: "The toolkit",
    subtitle: "WHAT I LIKE TO BUILD WITH",
    position: [10, -0.8, -10],
    color: "#a9d9ed",
  },
  {
    id: "career",
    title: "The journey so far",
    shortTitle: "The journey",
    subtitle: "A WALK THROUGH MY WORK",
    position: [0, -0.8, -24],
    color: "#e6d1a7",
  },
  {
    id: "notes",
    title: "Thoughts, shared",
    shortTitle: "Words & talks",
    subtitle: "NOTES FROM THE WORKBENCH",
    position: [10, -0.8, -24],
    color: "#e7bfd5",
  },
  {
    id: "contact",
    title: "Let’s make something",
    shortTitle: "Say hello",
    subtitle: "GOOD THINGS START WITH A CONVERSATION",
    position: [-10, -0.8, -24],
    color: "#b8efde",
  },
];

// Content from ../blogs/nirtamir.com/src/pages/about.md and ../blogs/blog/src/data/projects.ts.
export const projects = [
  {
    title: "Winston Snores",
    kind: "3D EXPERIENCE",
    description:
      "A sleepy dog, soothing snores, and an animated 3D world built with React Three Fiber.",
    href: "https://winston-snores.nirtamir.com",
  },
  {
    title: "Pitkiyot",
    kind: "SOCIAL GAME",
    description:
      "A game of words, clues, and pantomime. Built for the joy of playing together.",
    href: "https://pitkiyot.nirtamir.com",
  },
  {
    title: "Leaf Story",
    kind: "INTERACTIVE STORY",
    description:
      "A small story about a leaf, told through animation and playful 3D transitions.",
    href: "https://leaf-story.nirtamir.com",
  },
  {
    title: "Router Explorer",
    kind: "DEVELOPER TOOL",
    description:
      "A VS Code extension that makes file-based routers easier to navigate.",
    href: "https://marketplace.visualstudio.com/items?itemName=NirTamir.router-explorer",
  },
  {
    title: "solid-wrap-balancer",
    kind: "OPEN SOURCE",
    description: "A tiny Solid.js component for better-balanced headings.",
    href: "https://github.com/nirtamir2/solid-wrap-balancer",
  },
  {
    title: "obsidian-slidev",
    kind: "KNOWLEDGE & TOOLS",
    description:
      "Bringing Slidev presentations into Obsidian, where the ideas begin.",
    href: "https://github.com/nirtamir2/obsidian-slidev",
  },
];
export const companies = [
  { name: "Ofek 324", src: "/companies logos/ofek-flat.gltf" },
  { name: "Any.do", src: "/companies logos/anydo.gltf" },
  { name: "CME Group", src: "/companies logos/cme.gltf" },
  { name: "Cycode", src: "/companies logos/cycode-white.gltf" },
  { name: "YOULEAP", src: "/companies logos/youleap.gltf" },
  { name: "Peaklight", src: "/companies logos/peaklight.gltf" },
];
export function nearestExhibit(
  x: number,
  y: number,
  z: number,
): ExhibitId | null {
  let nearest: ExhibitId | null = null;
  let distance = 3.6;
  for (const item of exhibits) {
    const current = Math.hypot(x - item.position[0], z - item.position[2]);
    if (current < distance && Math.abs(y + 2) < 3) {
      nearest = item.id;
      distance = current;
    }
  }
  return nearest;
}
