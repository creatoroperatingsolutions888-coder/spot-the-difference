export type Stats = {
  solved: number;
  bestSeconds: number | null;
  streak: number;
  lastDaily: string | null;
  stars: number;
};

const KEY = "spot-the-difference-stats-v1";
const EMPTY: Stats = { solved: 0, bestSeconds: null, streak: 0, lastDaily: null, stars: 0 };

const dayString = (d: Date): string =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

export function loadStats(): Stats {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Stats>) };
  } catch {
    return { ...EMPTY };
  }
}

function saveStats(s: Stats) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // saving is optional; ignore problems
  }
}

// A streak only counts if the last daily win was today or yesterday.
export function currentStreak(s: Stats): number {
  if (!s.lastDaily) return 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const ok = s.lastDaily === dayString(new Date()) || s.lastDaily === dayString(yesterday);
  return ok ? s.streak : 0;
}

export function recordWin(opts: { seconds: number; stars: number; daily: boolean }) {
  const s = loadStats();
  s.solved += 1;
  s.stars += opts.stars;
  if (opts.seconds > 0 && (s.bestSeconds === null || opts.seconds < s.bestSeconds)) {
    s.bestSeconds = opts.seconds;
  }
  if (opts.daily) {
    const today = dayString(new Date());
    if (s.lastDaily !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      s.streak = s.lastDaily === dayString(yesterday) ? s.streak + 1 : 1;
      s.lastDaily = today;
    }
  }
  saveStats(s);
}
