import React, { useEffect, useState } from "react";

interface GameProps {
  puzzle: { id: string | null; totalDifferences: number };
  timerEnabled: boolean;
  onBack: () => void;
}

type Diff = {
  id: number;
  x: number;
  y: number;
  left: React.ReactNode;
  right: React.ReactNode;
};

const DIFFS: Diff[] = [
  { id: 1, x: 80, y: 15, left: <circle cx="80" cy="15" r="7" fill="#fbbf24" />, right: <circle cx="80" cy="15" r="7" fill="#f97316" /> },
  { id: 2, x: 25, y: 15, left: <ellipse cx="25" cy="15" rx="10" ry="4" fill="#ffffff" />, right: null },
  { id: 3, x: 50, y: 60, left: <rect x="40" y="50" width="22" height="20" fill="#ef4444" />, right: <rect x="40" y="50" width="22" height="20" fill="#3b82f6" /> },
  { id: 4, x: 51, y: 65, left: <rect x="48" y="60" width="6" height="10" fill="#78350f" />, right: <rect x="48" y="60" width="6" height="10" fill="#fde68a" /> },
  { id: 5, x: 45, y: 56, left: <rect x="43" y="54" width="5" height="5" fill="#bae6fd" />, right: null },
  { id: 6, x: 15, y: 60, left: <circle cx="15" cy="60" r="10" fill="#16a34a" />, right: <circle cx="15" cy="60" r="10" fill="#84cc16" /> },
  { id: 7, x: 60, y: 25, left: <polygon points="57,25 60,22 63,25 60,24" fill="#1f2937" />, right: null },
  { id: 8, x: 80, y: 85, left: <circle cx="80" cy="85" r="3" fill="#ec4899" />, right: null },
  { id: 9, x: 70, y: 62, left: <rect x="68" y="58" width="4" height="8" fill="#57534e" />, right: null },
  { id: 10, x: 30, y: 88, left: <circle cx="30" cy="88" r="3" fill="#f43f5e" />, right: <circle cx="30" cy="88" r="3" fill="#facc15" /> },
];

const HIT_RADIUS = 7;
const START_SECONDS = 120;
const START_HINTS = 3;

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return m + ":" + sec;
};

const Scene: React.FC<{
  side: "left" | "right";
  found: number[];
  hintId: number | null;
  miss: { x: number; y: number } | null;
  onTap: (x: number, y: number) => void;
}> = ({ side, found, hintId, miss, onTap }) => (
  <svg
    viewBox="0 0 100 100"
    style={{
      width: "100%",
      aspectRatio: "1 / 1",
      borderRadius: 14,
      border: "5px solid #92400e",
      boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
      cursor: "pointer",
      touchAction: "manipulation",
      display: "block",
    }}
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onTap(
        ((e.clientX - rect.left) / rect.width) * 100,
        ((e.clientY - rect.top) / rect.height) * 100
      );
    }}
  >
    <rect x="0" y="0" width="100" height="100" fill="#bfdbfe" />
    <circle cx="10" cy="10" r="6" fill="#fde047" />
    <rect x="0" y="72" width="100" height="28" fill="#86efac" />
    <polygon points="38,50 51,38 64,50" fill="#7c2d12" />
    {DIFFS.map((d) => (
      <g key={d.id}>{side === "left" ? d.left : d.right}</g>
    ))}
    {DIFFS.filter((d) => found.includes(d.id)).map((d) => (
      <circle key={"f" + d.id} cx={d.x} cy={d.y} r={HIT_RADIUS} fill="rgba(34,197,94,0.25)" stroke="#16a34a" strokeWidth="1.8" />
    ))}
    {DIFFS.filter((d) => d.id === hintId).map((d) => (
      <circle key={"h" + d.id} cx={d.x} cy={d.y} r={HIT_RADIUS + 2} fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="3 2" />
    ))}
    {miss && (
      <text x={miss.x} y={miss.y} fontSize="9" fontWeight="bold" fill="#dc2626" textAnchor="middle">
        X
      </text>
    )}
  </svg>
);

export const GameScreen: React.FC<GameProps> = ({ puzzle, timerEnabled, onBack }) => {
  const [found, setFound] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [hintsLeft, setHintsLeft] = useState(START_HINTS);
  const [hintId, setHintId] = useState<number | null>(null);
  const [miss, setMiss] = useState<{ x: number; y: number } | null>(null);
  const [paused, setPaused] = useState(false);

  const total = DIFFS.length;
  const won = found.length === total;
  const lost = timerEnabled && secondsLeft <= 0 && !won;
  const finished = won || lost;

  useEffect(() => {
    if (!timerEnabled || finished || paused) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [timerEnabled, finished, paused]);

  const handleTap = (x: number, y: number) => {
    if (finished || paused) return;
    const hit = DIFFS.find(
      (d) => !found.includes(d.id) && Math.hypot(d.x - x, d.y - y) <= HIT_RADIUS
    );
    if (hit) {
      setFound((f) => [...f, hit.id]);
      setHintId(null);
    } else {
      setMisses((m) => m + 1);
      setMiss({ x, y });
      setTimeout(() => setMiss(null), 600);
      if (timerEnabled) setSecondsLeft((s) => Math.max(0, s - 3));
    }
  };

  const useHint = () => {
    if (finished || paused || hintsLeft <= 0) return;
    const remaining = DIFFS.filter((d) => !found.includes(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintId(pick.id);
    setHintsLeft((h) => h - 1);
    setTimeout(() => setHintId(null), 2500);
  };

  const restart = () => {
    setFound([]);
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
            marginBottom: 14,
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

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px" }}>
              <Scene side="left" found={found} hintId={hintId} miss={miss} onTap={handleTap} />
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <Scene side="right" found={found} hintId={hintId} miss={miss} onTap={handleTap} />
            </div>
          </div>

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