import React, { useEffect, useState } from "react";
import { getCustomPuzzle } from "./CreatePuzzleScreen";

interface GameProps {
  puzzle: { id: string | null; totalDifferences: number };
  timerEnabled: boolean;
  onBack: () => void;
}

type Pt = [number, number];
type Spot = { id: number; l: Pt; r: Pt };
type PuzzleData = { image: string; w: number; h: number; spots: Spot[]; bonus: Spot[] };

// Set this to true only if YouTube approved the logo, or you accept the risk.
const USE_YOUTUBE_PICTURE = false;

// Coordinates are pixels on the 1080 x 720 pictures.
// "spots" are the differences you must find. "bonus" are extra ones worth bonus points.
const BUILT_IN: Record<string, { spots: Spot[]; bonus: Spot[] }> = {
  "puzzle-1": {
    spots: [
      { id: 1, l: [405, 310], r: [928, 310] },
      { id: 2, l: [218, 455], r: [741, 455] },
      { id: 3, l: [132, 590], r: [655, 595] },
      { id: 4, l: [219, 637], r: [742, 637] },
      { id: 5, l: [123, 210], r: [647, 220] },
    ],
    bonus: [
      { id: 1, l: [316, 533], r: [845, 537] },
      { id: 2, l: [100, 520], r: [625, 518] },
    ],
  },
  "puzzle-4": {
    spots: [
      { id: 1, l: [140, 280], r: [620, 320] },
      { id: 2, l: [297, 190], r: [652, 190] },
      { id: 3, l: [247, 288], r: [722, 288] },
      { id: 4, l: [95, 452], r: [640, 452] },
      { id: 5, l: [103, 525], r: [645, 500] },
      { id: 6, l: [135, 625], r: [600, 608] },
    ],
    bonus: [{ id: 1, l: [482, 635], r: [917, 585] }],
  },
  "puzzle-3": {
    spots: [
      { id: 1, l: [335, 488], r: [873, 488] },
      { id: 2, l: [462, 270], r: [1010, 215] },
      { id: 3, l: [472, 322], r: [1010, 318] },
      { id: 4, l: [45, 430], r: [578, 420] },
      { id: 5, l: [393, 465], r: [925, 488] },
      { id: 6, l: [225, 690], r: [750, 688] },
    ],
    bonus: [
      { id: 1, l: [480, 397], r: [1012, 410] },
      { id: 2, l: [55, 240], r: [595, 235] },
    ],
  },
  "puzzle-2": {
    spots: [
      { id: 1, l: [92, 585], r: [623, 585] },
      { id: 2, l: [473, 180], r: [997, 170] },
      { id: 3, l: [78, 495], r: [588, 497] },
      { id: 4, l: [487, 440], r: [1015, 420] },
      { id: 5, l: [475, 655], r: [868, 653] },
      { id: 6, l: [507, 470], r: [1035, 468] },
    ],
    bonus: [
      { id: 1, l: [397, 172], r: [938, 192] },
      { id: 2, l: [205, 215], r: [735, 213] },
    ],
  },
};

const LEVEL_PICTURES: Record<string, string> = {
  easy: "puzzle-1",
  medium: "puzzle-4",
  hard: USE_YOUTUBE_PICTURE ? "puzzle-2" : "puzzle-3",
};

const RANDOM_POOL: string[] = USE_YOUTUBE_PICTURE
  ? ["puzzle-1", "puzzle-4", "puzzle-3", "puzzle-2"]
  : ["puzzle-1", "puzzle-4", "puzzle-3"];

const pickBuiltIn = (id: string | null): string => {
  if (id && LEVEL_PICTURES[id]) return LEVEL_PICTURES[id];
  return RANDOM_POOL[Math.floor(Math.random() * RANDOM_POOL.length)];
};

const resolvePuzzle = (id: string | null): PuzzleData => {
  if (id === "custom") {
    const c = getCustomPuzzle();
    if (c) return { image: c.image, w: c.width, h: c.height, spots: c.spots, bonus: [] };
  }
  const key = pickBuiltIn(id);
  return {
    image: key + ".jpg",
    w: 1080,
    h: 720,
    spots: BUILT_IN[key].spots,
    bonus: BUILT_IN[key].bonus,
  };
};

const HIT_RADIUS = 50;
const RING_R = 42;
const START_SECONDS = 120;
const START_HINTS = 3;
const POINTS_FIND = 100;
const POINTS_BONUS = 50;
const POINTS_MISS = 10;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return m + ":" + sec;
};

export const GameScreen: React.FC<GameProps> = ({ puzzle, timerEnabled, onBack }) => {
  const [data] = useState<PuzzleData>(() => resolvePuzzle(puzzle.id));
  const { spots, bonus, image, w, h } = data;

  const [found, setFound] = useState<number[]>([]);
  const [bonusFound, setBonusFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [hintsLeft, setHintsLeft] = useState(START_HINTS);
  const [hintId, setHintId] = useState<number | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number } | null>(null);
  const [flash, setFlash] = useState<{ x: number; y: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const [imgError, setImgError] = useState(false);

  const total = spots.length;
  const won = found.length === total;
  const lost = timerEnabled && secondsLeft <= 0 && !won;
  const finished = won || lost;
  const points = Math.max(
    0,
    found.length * POINTS_FIND + bonusFound.length * POINTS_BONUS - misses * POINTS_MISS
  );

  useEffect(() => {
    if (!timerEnabled || finished || paused) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [timerEnabled, finished, paused]);

  const distTo = (s: Spot, x: number, y: number) =>
    Math.min(Math.hypot(s.l[0] - x, s.l[1] - y), Math.hypot(s.r[0] - x, s.r[1] - y));

  const nearest = (list: Spot[], skip: number[], x: number, y: number): Spot | null => {
    let best: Spot | null = null;
    let bestDist = HIT_RADIUS + 1;
    for (const s of list) {
      if (skip.includes(s.id)) continue;
      const d = distTo(s, x, y);
      if (d <= HIT_RADIUS && d < bestDist) {
        best = s;
        bestDist = d;
      }
    }
    return best;
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (finished || paused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    const y = ((e.clientY - rect.top) / rect.height) * h;

    const hit = nearest(spots, found, x, y);
    if (hit) {
      const id = hit.id;
      setFound((f) => [...f, id]);
      setHintId(null);
      return;
    }

    const extra = nearest(bonus, bonusFound, x, y);
    if (extra) {
      const id = extra.id;
      setBonusFound((b) => [...b, id]);
      setFlash({ x, y });
      setTimeout(() => setFlash(null), 900);
      return;
    }

    // tapping something already found is not a miss
    const alreadyFound =
      spots.some((s) => found.includes(s.id) && distTo(s, x, y) <= HIT_RADIUS) ||
      bonus.some((s) => bonusFound.includes(s.id) && distTo(s, x, y) <= HIT_RADIUS);
    if (alreadyFound) return;

    setMisses((m) => m + 1);
    setMiss({ x, y });
    setTimeout(() => setMiss(null), 600);
    if (timerEnabled) setSecondsLeft((s) => Math.max(0, s - 3));
  };

  const useHint = () => {
    if (finished || paused || hintsLeft <= 0) return;
    const remaining = spots.filter((s) => !found.includes(s.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintId(pick.id);
    setHintsLeft((n) => n - 1);
    setTimeout(() => setHintId(null), 2500);
  };

  const restart = () => {
    setFound([]);
    setBonusFound([]);
    setMisses(0);
    setSecondsLeft(START_SECONDS);
    setHintsLeft(START_HINTS);
    setHintId(null);
    setPaused(false);
  };

  const stars = misses <= 2 ? 3 : misses <= 6 ? 2 : 1;

  const orange: React.CSSProperties = {
    padding: "12px 20px",
    fontSize: 18,
    fontWeight: 800,
    borderRadius: 12,
    border: "3px solid #9a3412",
    background: "linear-gradient(#fb923c, #ea580c)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 4px 0 #9a3412",
  };
  const green: React.CSSProperties = {
    ...orange,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    boxShadow: "0 4px 0 #14532d",
  };
  const purple: React.CSSProperties = {
    ...orange,
    border: "3px solid #4c1d95",
    background: "linear-gradient(#a78bfa, #6d28d9)",
    boxShadow: "0 4px 0 #4c1d95",
  };
  const chip: React.CSSProperties = {
    color: "#ffffff",
    padding: "6px 16px",
    borderRadius: 12,
    fontSize: 17,
    fontWeight: 800,
  };

  return (
    <div
      className="screen game-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fef3c7, #fde68a)",
        padding: 16,
        fontFamily: "Arial Rounded MT Bold, Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(#ef4444, #b91c1c)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 900,
            padding: "10px 16px",
            borderRadius: 12,
            border: "3px solid #7f1d1d",
            boxShadow: "0 4px 0 #7f1d1d",
            marginBottom: 14,
          }}
        >
          Spot the Difference
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <button style={orange} onClick={onBack}>Back</button>
          <div style={{ background: "#1e3a8a", color: "#ffffff", padding: "10px 18px", borderRadius: 12, fontSize: 20, fontWeight: 800 }}>
            Found {found.length} / {total}
          </div>
          <div
            style={{
              background: timerEnabled && secondsLeft <= 15 ? "#b91c1c" : "#15803d",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 800,
              minWidth: 90,
              textAlign: "center",
            }}
          >
            {timerEnabled ? formatTime(secondsLeft) : "Chill Mode"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ ...chip, background: "#92400e" }}>Points: {points}</div>
          {bonus.length > 0 && (
            <div style={{ ...chip, background: "#ca8a04" }}>Bonus: {bonusFound.length}</div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          {imgError ? (
            <div
              style={{
                padding: 30,
                borderRadius: 14,
                background: "#fee2e2",
                border: "4px solid #dc2626",
                textAlign: "center",
                fontSize: 20,
                fontWeight: 800,
                color: "#7f1d1d",
              }}
            >
              Picture not found
              <div style={{ fontSize: 15, marginTop: 8, fontWeight: 600 }}>
                Check that the picture files are in the public folder of your repo.
              </div>
            </div>
          ) : (
            <div
              onClick={handleTap}
              style={{
                position: "relative",
                cursor: "pointer",
                touchAction: "manipulation",
                borderRadius: 14,
                overflow: "hidden",
                border: "5px solid #92400e",
                boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
                lineHeight: 0,
              }}
            >
              <img
                src={image}
                alt="Spot the difference puzzle"
                onError={() => setImgError(true)}
                draggable={false}
                style={{ width: "100%", display: "block", userSelect: "none" }}
              />
              <svg
                viewBox={"0 0 " + w + " " + h}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {spots
                  .filter((s) => found.includes(s.id))
                  .map((s) =>
                    [s.l, s.r].map((p, i) => (
                      <circle
                        key={"f" + s.id + "-" + i}
                        cx={p[0]}
                        cy={p[1]}
                        r={RING_R}
                        fill="rgba(34,197,94,0.25)"
                        stroke="#16a34a"
                        strokeWidth="6"
                      />
                    ))
                  )}
                {bonus
                  .filter((s) => bonusFound.includes(s.id))
                  .map((s) =>
                    [s.l, s.r].map((p, i) => (
                      <circle
                        key={"b" + s.id + "-" + i}
                        cx={p[0]}
                        cy={p[1]}
                        r={RING_R}
                        fill="rgba(250,204,21,0.3)"
                        stroke="#eab308"
                        strokeWidth="6"
                      />
                    ))
                  )}
                {spots
                  .filter((s) => s.id === hintId)
                  .map((s) =>
                    [s.l, s.r].map((p, i) => (
                      <circle
                        key={"h" + s.id + "-" + i}
                        cx={p[0]}
                        cy={p[1]}
                        r={RING_R + 8}
                        fill="none"
                        stroke="#facc15"
                        strokeWidth="6"
                        strokeDasharray="14 8"
                      />
                    ))
                  )}
                {miss && (
                  <text
                    x={miss.x}
                    y={miss.y + 14}
                    fontSize="44"
                    fontWeight="bold"
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth="2"
                    textAnchor="middle"
                  >
                    X
                  </text>
                )}
                {flash && (
                  <text
                    x={flash.x}
                    y={flash.y - 20}
                    fontSize="44"
                    fontWeight="bold"
                    fill="#ca8a04"
                    stroke="#ffffff"
                    strokeWidth="2"
                    textAnchor="middle"
                  >
                    {"+" + POINTS_BONUS + " Bonus!"}
                  </text>
                )}
              </svg>
            </div>
          )}

          {paused && !finished && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(30,58,138,0.92)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                color: "#ffffff",
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              Paused
              <button style={green} onClick={() => setPaused(false)}>Resume</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <button style={purple} onClick={useHint} disabled={hintsLeft <= 0}>
            Hint ({hintsLeft})
          </button>
          <button style={green} onClick={() => setPaused(true)}>Pause</button>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, fontSize: 16, fontWeight: 700, color: "#78350f" }}>
          Misses: {misses}{timerEnabled ? " (each miss costs 3 seconds)" : ""}
        </div>

        {finished && (
          <div
            style={{
              marginTop: 20,
              padding: 24,
              borderRadius: 16,
              background: won ? "#dcfce7" : "#fee2e2",
              border: won ? "4px solid #16a34a" : "4px solid #dc2626",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 30 }}>
              {won ? "You spotted them all!" : "Time's up!"}
            </h2>
            {won && (
              <div style={{ fontSize: 44, marginBottom: 10 }}>
                {"★".repeat(stars)}{"☆".repeat(3 - stars)}
              </div>
            )}
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 14 }}>
              Points: {points}
              {bonusFound.length > 0 ? "  (" + bonusFound.length + " bonus found!)" : ""}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <button style={orange} onClick={restart}>Play Again</button>
              <button style={purple} onClick={onBack}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
