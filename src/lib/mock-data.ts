import { useSyncExternalStore } from "react";

export type Member = {
  id: string;
  name: string;
  avatar: string;
  pace: string;
};

export type MarkerType = "water" | "crossing" | "rest" | "start" | "finish" | "cheer";

export type Marker = {
  id: string;
  type: MarkerType;
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
  votes: number;
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
  accent: string;
  members: Member[];
  runIds: string[];
};

// ---------------- mutable store ----------------
const listeners = new Set<() => void>();
let version = 0;
function emit() {
  version++;
  listeners.forEach((l) => l());
}
export function useStore() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => version,
    () => version,
  );
}

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

const ORANGE = "#ff6b35";
const AMBER = "#f7931e";
const PINK = "#e84393";

function defaultPaths(): RunPath[] {
  const stamp = Math.random().toString(36).slice(2, 7);
  return [
    {
      id: `p-${stamp}-l`,
      title: "Long Loop",
      description: "The full reservoir circuit for distance hunters.",
      distanceKm: 10.2,
      difficulty: "hard",
      color: ORANGE,
      coords: longPath,
      markers: [
        { id: `mk-${stamp}-1`, type: "start", label: "Start line", position: longPath[0] },
        { id: `mk-${stamp}-2`, type: "water", label: "Water station", position: longPath[3] },
        { id: `mk-${stamp}-3`, type: "crossing", label: "Road crossing", position: longPath[5] },
        { id: `mk-${stamp}-4`, type: "cheer", label: "Cheer zone", position: longPath[7] },
        { id: `mk-${stamp}-5`, type: "finish", label: "Finish", position: longPath[longPath.length - 1] },
      ],
    },
    {
      id: `p-${stamp}-s`,
      title: "Short Sprint",
      description: "Half-loop for quick speed work.",
      distanceKm: 5.1,
      difficulty: "medium",
      color: PINK,
      coords: shortPath,
      markers: [
        { id: `mk-${stamp}-6`, type: "start", label: "Start line", position: shortPath[0] },
        { id: `mk-${stamp}-7`, type: "water", label: "Water", position: shortPath[2] },
        { id: `mk-${stamp}-8`, type: "finish", label: "Finish", position: shortPath[shortPath.length - 1] },
      ],
    },
    {
      id: `p-${stamp}-e`,
      title: "Recovery / Easy",
      description: "Flat, gentle, with frequent rest points.",
      distanceKm: 2.4,
      difficulty: "easy",
      color: AMBER,
      coords: easyPath,
      markers: [
        { id: `mk-${stamp}-9`, type: "start", label: "Start", position: easyPath[0] },
        { id: `mk-${stamp}-10`, type: "rest", label: "Rest bench", position: easyPath[2] },
        { id: `mk-${stamp}-11`, type: "finish", label: "Finish", position: easyPath[easyPath.length - 1] },
      ],
    },
  ];
}

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

const r1Paths = defaultPaths();
const r3Paths = defaultPaths();

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
    paths: r1Paths,
    leaderboard: [
      { memberId: "m8", pathId: r1Paths[0].id, timeSeconds: 2580, paceMinKm: "4:13", votes: 4 },
      { memberId: "m4", pathId: r1Paths[0].id, timeSeconds: 2640, paceMinKm: "4:19", votes: 2 },
      { memberId: "m1", pathId: r1Paths[0].id, timeSeconds: 2790, paceMinKm: "4:33", votes: 1 },
      { memberId: "m3", pathId: r1Paths[1].id, timeSeconds: 1500, paceMinKm: "4:54", votes: 5 },
      { memberId: "m6", pathId: r1Paths[1].id, timeSeconds: 1545, paceMinKm: "5:02", votes: 2 },
      { memberId: "m5", pathId: r1Paths[2].id, timeSeconds: 870, paceMinKm: "6:02", votes: 3 },
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
    paths: defaultPaths().slice(0, 2),
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
    paths: r3Paths,
    leaderboard: [
      { memberId: "m8", pathId: r3Paths[0].id, timeSeconds: 2520, paceMinKm: "4:07", votes: 6 },
      { memberId: "m4", pathId: r3Paths[0].id, timeSeconds: 2610, paceMinKm: "4:16", votes: 1 },
      { memberId: "m2", pathId: r3Paths[1].id, timeSeconds: 1620, paceMinKm: "5:18", votes: 4 },
      { memberId: "m7", pathId: r3Paths[2].id, timeSeconds: 920, paceMinKm: "6:23", votes: 3 },
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
    accent: ORANGE,
    members: members.slice(0, 6),
    runIds: ["r1", "r2"],
  },
  {
    id: "c2",
    name: "Night Owls Track Club",
    city: "Brooklyn, NY",
    description: "Speed sessions after sundown. Track + tempo focus.",
    emoji: "🌙",
    accent: PINK,
    members: members.slice(2, 8),
    runIds: ["r3"],
  },
  {
    id: "c3",
    name: "Trailblazers Collective",
    city: "Seattle, WA",
    description: "Trails, mud, hills, and hot cocoa.",
    emoji: "🌲",
    accent: AMBER,
    members: members.slice(1, 5),
    runIds: [],
  },
];

// ---------------- selectors ----------------
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

// MVP per path = entry with the most votes (tie-break: fastest time)
export function mvpForPath(run: Run, pathId: string): LeaderboardEntry | undefined {
  const entries = run.leaderboard.filter((e) => e.pathId === pathId);
  if (entries.length === 0) return undefined;
  return [...entries].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0) || a.timeSeconds - b.timeSeconds,
  )[0];
}

// ---------------- mutations ----------------
const AVATARS = ["🦊", "🐺", "🦋", "🐯", "🦄", "🐸", "🦩", "🐉", "🐝", "🐢", "🦅"];
function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createClub(input: { name: string; city: string; description: string; emoji: string; accent?: string }) {
  const club: Club = {
    id: nextId("c"),
    name: input.name,
    city: input.city,
    description: input.description,
    emoji: input.emoji || "🏃",
    accent: input.accent || ORANGE,
    members: [],
    runIds: [],
  };
  clubs.push(club);
  emit();
  return club;
}

export function inviteMember(clubId: string, name: string) {
  const club = getClub(clubId);
  if (!club) return;
  const m: Member = {
    id: nextId("m"),
    name,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    pace: `${4 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
  };
  members.push(m);
  club.members.push(m);
  emit();
  return m;
}

export function createRun(input: {
  clubId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  isPaid: boolean;
  price?: number;
}) {
  const club = getClub(input.clubId);
  if (!club) return;
  const run: Run = {
    id: nextId("r"),
    clubId: input.clubId,
    title: input.title,
    date: input.date,
    time: input.time,
    location: input.location,
    centerCoord: [40.7748, -73.9682],
    isPaid: input.isPaid,
    price: input.price,
    status: "upcoming",
    joined: [],
    paths: defaultPaths(),
    leaderboard: [],
  };
  runs.push(run);
  club.runIds.push(run.id);
  emit();
  return run;
}

export function toggleJoin(runId: string, memberId: string) {
  const run = getRun(runId);
  if (!run) return;
  const i = run.joined.indexOf(memberId);
  if (i >= 0) run.joined.splice(i, 1);
  else run.joined.push(memberId);
  emit();
}

export function voteMVP(runId: string, memberId: string, pathId: string) {
  const run = getRun(runId);
  if (!run) return;
  const entry = run.leaderboard.find((e) => e.memberId === memberId && e.pathId === pathId);
  if (entry) entry.votes = (entry.votes ?? 0) + 1;
  emit();
}

// the "current" runner — for join/vote actions in mock mode
export const currentMemberId = "m1";