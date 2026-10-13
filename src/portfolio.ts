export type PlaceId = "about" | "work" | "projects" | "notes";
export type PanelId = PlaceId | "help";

export const places: {
  id: PlaceId;
  name: string;
  subtitle: string;
  color: string;
  x: number;
  z: number;
}[] = [
  {
    id: "about",
    name: "The studio",
    subtitle: "A little about me",
    color: "#dc714c",
    x: -11,
    z: -9,
  },
  {
    id: "work",
    name: "Career avenue",
    subtitle: "Where I’ve been",
    color: "#708b71",
    x: 11,
    z: -9,
  },
  {
    id: "projects",
    name: "The playground",
    subtitle: "Things I’ve made",
    color: "#d49d36",
    x: 11,
    z: 9,
  },
  {
    id: "notes",
    name: "The reading room",
    subtitle: "Ideas worth sharing",
    color: "#7b8eb3",
    x: -11,
    z: 9,
  },
];

// Biography: ../blogs/nirtamir.com/src/pages/about.md and https://www.nirtamir.com/about
// Career, projects, and writing checked against https://www.nirtamir.com on 2026-10-13.
export const career = [
  {
    name: "Independent",
    role: "Senior Frontend Developer",
    dates: "2024 — present",
  },
  { name: "Youleap", role: "Senior Frontend Developer", dates: "2022 — 2023" },
  { name: "Cycode", role: "Senior Frontend Developer", dates: "2020 — 2022" },
  {
    name: "CME Group",
    role: "Senior Frontend Developer",
    dates: "2019 — 2020",
  },
  { name: "Any.do", role: "Senior Frontend Developer", dates: "2018 — 2019" },
  { name: "IAF · Ofek Unit", role: "Software Developer", dates: "2014 — 2018" },
];

export const projects = [
  {
    name: "Winston Snores",
    category: "3D / React",
    description:
      "An animated world for a very sleepy dog. Built with React Three Fiber and UIKit.",
    href: "https://winston-snores.nirtamir.com",
  },
  {
    name: "Pitkiyot",
    category: "Games / multiplayer",
    description:
      "A social word game for teams, with descriptions, clues, and pantomime.",
    href: "https://pitkiyot.nirtamir.com",
  },
  {
    name: "Leaf Story",
    category: "3D / storytelling",
    description:
      "A small story about a leaf, told through motion and playful 3D transitions.",
    href: "https://leaf-story.nirtamir.com",
  },
  {
    name: "Router Explorer",
    category: "Developer tools",
    description:
      "A VS Code extension to find your way around file-based routers.",
    href: "https://marketplace.visualstudio.com/items?itemName=NirTamir.router-explorer",
  },
  {
    name: "solid-wrap-balancer",
    category: "Open source / Solid.js",
    description: "A tiny component that gives headings a little more balance.",
    href: "https://github.com/nirtamir2/solid-wrap-balancer",
  },
  {
    name: "obsidian-slidev",
    category: "Tools / presentations",
    description:
      "Bringing Slidev presentations into the place where ideas begin: Obsidian.",
    href: "https://github.com/nirtamir2/obsidian-slidev",
  },
];

export const writing = [
  {
    name: "Advanced React State Boundaries",
    category: "Article · 2026",
    description:
      "Deciding what owns state when React, URLs, browser APIs, and client caches meet.",
    href: "https://www.nirtamir.com/articles/advanced-react-questions",
  },
  {
    name: "Advanced Slides with Slidev",
    category: "Article · 2026",
    description:
      "Making technical presentations more engaging and interactive.",
    href: "https://www.nirtamir.com/articles/advanced-slides-with-slidev",
  },
  {
    name: "Effortless 3D with React Three Fiber",
    category: "Conference talk · 2025",
    description:
      "Scene setup, core concepts, and a little physics. An invitation to build in 3D.",
    href: "https://www.nirtamir.com/talks",
  },
  {
    name: "TypeScript Without Surprises",
    category: "Conference talk · 2025",
    description:
      "Smarter error handling and explicit, reliable async code with Effect-TS.",
    href: "https://www.nirtamir.com/talks",
  },
];
