export type Member = {
  id: string;
  name: string;
  avatar: string;
  pace: string;
};

export type Marker = {
  id: string;
  type: "water" | "crossing" | "rest" | "start" | "finish" | "cheer";
  label: string;
  position: [number, number];
};

export type RunPath = {
  id: string;
  title: string;
  description: string;
  distanceKm: number;
  difficulty: "easy" | "medium" | "hard";
  color: string;
  coords: [number, number][];
  markers: Marker[];
};

export type LeaderboardEntry = {
  memberId: string;
  pathId: string;
  timeSeconds: number;
  paceMinKm: string;
  votes?: number;
};

export type Run = {
  id: string;
  clubId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  centerCoord: [number, number];
  isPaid: boolean;
  price?: number;
  status: "upcoming" | "live" | "finished";
  joined: string[];
  paths: RunPath[];
  leaderboard: LeaderboardEntry[];
};

export type Club = {
  id: string;
  name: string;
  city: string;
  description: string;
  emoji: string;
  accent: string; // hex used for solid color blocks
  members: Member[];
  runIds: string[];
};

export const members: Member[] = [
  { id: "m1", name: "Amara Okafor", avatar: "🦊", pace: "4:30" },
  { id: "m2", name: "Liam Chen", avatar: "🐺", pace: "5:10" },
  { id: "m3", name: "Sofia Rossi", avatar: "🦋", pace: "4:55" },
  { id: "m4", name: "Diego Martín", avatar: "🐯", pace: "4:20" },
  { id: "m5", name: "Priya Patel", avatar: "🦄", pace: "5:40" },
  { id: "m6", name: "Noah Park", avatar: "🐸", pace: "4:45" },
  { id: "m7", name: "Zara Ahmed", avatar: "🦩", pace: "6:00" },
  { id: "m8", name: "Kenji Tanaka", avatar: "🐉", pace: "4:15" },
];

// Central Park-ish loop coords for demo
const longPath: [number, number][] = [
  [40.7711, -73.9742],
  [40.7735, -73.9712],
  [40.7762, -73.9685],
  [40.7798, -73.9628],
  [40.7821, -73.9583],
  [40.7795, -73.9555],
  [40.7748, -73.9582],
  [40.7712, -73.9645],
  [40.7689, -73.9695],
  [40.7705, -73.9738],
];

const shortPath: [number, number][] = [
  [40.7711, -73.9742],
  [40.7735, -73.9712],
  [40.7748, -73.9682],
  [40.7732, -73.9665],
  [40.7710, -73.9700],
  [40.7705, -73.9738],
];

const easyPath: [number, number][] = [
  [40.7711, -73.9742],
  [40.7720, -73.9728],
  [40.7728, -73.9712],
  [40.7720, -73.9700],
  [40.7710, -73.9715],
  [40.7705, -73.9738],
];

const samplePaths: RunPath[] = [
  {
    id: "p1",
    title: "Long Loop",
    description: "The full reservoir circuit for distance hunters.",
    distanceKm: 10.2,
    difficulty: "hard",
    color: "#e94560",
    coords: longPath,
    markers: [
      { id: "mk1", type: "start", label: "Start line", position: longPath[0] },
      { id: "mk2", type: "water", label: "Water station", position: longPath[3] },
      { id: "mk3", type: "crossing", label: "Road crossing", position: longPath[5] },
      { id: "mk4", type: "cheer", label: "Cheer zone 🎉", position: longPath[7] },
      { id: "mk5", type: "finish", label: "Finish", position: longPath[longPath.length - 1] },
    ],
  },
  {
    id: "p2",
    title: "Short Sprint",
    description: "Half-loop for quick speed work.",
    distanceKm: 5.1,
    difficulty: "medium",
    color: "#22c55e",
    coords: shortPath,
    markers: [
      { id: "mk6", type: "start", label: "Start line", position: shortPath[0] },
      { id: "mk7", type: "water", label: "Water", position: shortPath[2] },
      { id: "mk8", type: "finish", label: "Finish", position: shortPath[shortPath.length - 1] },
    ],
  },
  {
    id: "p3",
    title: "Pregnant / Recovery",
    description: "Flat, gentle, with frequent rest points.",
    distanceKm: 2.4,
    difficulty: "easy",
    color: "#a78bfa",
    coords: easyPath,
    markers: [
      { id: "mk9", type: "start", label: "Start", position: easyPath[0] },
      { id: "mk10", type: "rest", label: "Rest bench", position: easyPath[2] },
      { id: "mk11", type: "finish", label: "Finish", position: easyPath[easyPath.length - 1] },
    ],
  },
];

export const runs: Run[] = [
  {
    id: "r1",
    clubId: "c1",
    title: "Sunday Sunrise Long Run",
    date: "2026-06-21",
    time: "06:30",
    location: "Central Park, NYC",
    centerCoord: [40.7748, -73.9682],
    isPaid: false,
    status: "upcoming",
    joined: ["m1", "m2", "m3", "m4", "m6"],
    paths: samplePaths,
    leaderboard: [
      { memberId: "m8", pathId: "p1", timeSeconds: 2580, paceMinKm: "4:13", isMVP: true },
      { memberId: "m4", pathId: "p1", timeSeconds: 2640, paceMinKm: "4:19" },
      { memberId: "m1", pathId: "p1", timeSeconds: 2790, paceMinKm: "4:33" },
      { memberId: "m3", pathId: "p2", timeSeconds: 1500, paceMinKm: "4:54", isMVP: true },
      { memberId: "m6", pathId: "p2", timeSeconds: 1545, paceMinKm: "5:02" },
      { memberId: "m5", pathId: "p3", timeSeconds: 870, paceMinKm: "6:02", isMVP: true },
    ],
  },
  {
    id: "r2",
    clubId: "c1",
    title: "Charity 10K — Run for Kids",
    date: "2026-07-04",
    time: "08:00",
    location: "Brooklyn Bridge Park",
    centerCoord: [40.7024, -73.9963],
    isPaid: true,
    price: 25,
    status: "upcoming",
    joined: ["m1", "m2", "m5"],
    paths: samplePaths.slice(0, 2),
    leaderboard: [],
  },
  {
    id: "r3",
    clubId: "c2",
    title: "Wednesday Track Night",
    date: "2026-06-18",
    time: "18:30",
    location: "Riverside Track",
    centerCoord: [40.8, -73.97],
    isPaid: false,
    status: "finished",
    joined: ["m2", "m4", "m7", "m8"],
    paths: samplePaths,
    leaderboard: [
      { memberId: "m8", pathId: "p1", timeSeconds: 2520, paceMinKm: "4:07", isMVP: true },
      { memberId: "m4", pathId: "p1", timeSeconds: 2610, paceMinKm: "4:16" },
      { memberId: "m2", pathId: "p2", timeSeconds: 1620, paceMinKm: "5:18", isMVP: true },
      { memberId: "m7", pathId: "p3", timeSeconds: 920, paceMinKm: "6:23", isMVP: true },
    ],
  },
];

export const clubs: Club[] = [
  {
    id: "c1",
    name: "Sunrise Striders",
    city: "New York, NY",
    description: "Early birds chasing the horizon. All paces welcome.",
    emoji: "🌅",
    color: "from-[oklch(0.62_0.22_28)] to-[oklch(0.74_0.2_45)]",
    members: members.slice(0, 6),
    runIds: ["r1", "r2"],
  },
  {
    id: "c2",
    name: "Night Owls Track Club",
    city: "Brooklyn, NY",
    description: "Speed sessions after sundown. Track + tempo focus.",
    emoji: "🌙",
    color: "from-[oklch(0.68_0.2_305)] to-[oklch(0.62_0.22_200)]",
    members: members.slice(2, 8),
    runIds: ["r3"],
  },
  {
    id: "c3",
    name: "Trailblazers Collective",
    city: "Seattle, WA",
    description: "Trails, mud, hills, and hot cocoa.",
    emoji: "🌲",
    color: "from-[oklch(0.72_0.18_165)] to-[oklch(0.78_0.18_90)]",
    members: members.slice(1, 5),
    runIds: [],
  },
];

export function getClub(id: string) {
  return clubs.find((c) => c.id === id);
}
export function getRun(id: string) {
  return runs.find((r) => r.id === id);
}
export function getMember(id: string) {
  return members.find((m) => m.id === id);
}
export function getRunsForClub(clubId: string) {
  return runs.filter((r) => r.clubId === clubId);
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}