import React, { useState } from "react";

type Pt = [number, number];
export type CustomSpot = { id: number; l: Pt; r: Pt };
export type CustomPuzzle = {
  image: string;
  width: number;
  height: number;
  spots: CustomSpot[];
};

// The game screen reads the puzzle made here.
let storedPuzzle: CustomPuzzle | null = null;
export const getCustomPuzzle = (): CustomPuzzle | null => storedPuzzle;
const setCustomPuzzle = (p: CustomPuzzle) => {
  storedPuzzle = p;
};

interface CreateProps {
  onBack: () => void;
  onPuzzleSaved: (puzzle: { id: string | null; totalDifferences: number }) => void;
}

const PANEL = 510;
const COMP_W = 1080;
const COMP_H = 560;
const LEFT_X = 20;
const RIGHT_X = 550;
const TOP_Y = 25;
const RADIUS = 34;
const MIN_VISIBLE = 22;

type Kind = "hue" | "invert" | "erase" | "flip" | "dot";
const KINDS: Kind[] = ["hue", "invert", "erase", "flip", "dot"];
const DOT_COLORS = ["#ef4444", "#facc15", "#3b82f6", "#22c55e", "#a855f7", "#f97316"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function forCircle(
  cx: number,
  cy: number,
  r: number,
  fn: (x: number, y: number, dist: number, i: number) => void
) {
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(PANEL - 1, Math.ceil(cy + r));
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(PANEL - 1, Math.ceil(cx + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist <= r) fn(x, y, dist, (y * PANEL + x) * 4);
    }
  }
}

function applyChange(
  edited: ImageData,
  original: ImageData,
  cx: number,
  cy: number,
  kind: Kind
) {
  const o = original.data;
  const d = edited.data;

  let mr = 0;
  let mg = 0;
  let mb = 0;
  if (kind === "erase") {
    let n = 0;
    forCircle(cx, cy, RADIUS * 1.6, (_x, _y, dist, i) => {
      if (dist > RADIUS * 1.15) {
        mr += o[i];
        mg += o[i + 1];
        mb += o[i + 2];
        n++;
      }
    });
    if (n > 0) {
      mr /= n;
      mg /= n;
      mb /= n;
    }
  }

  const ang = (150 * Math.PI) / 180;
  const c = Math.cos(ang);
  const s = Math.sin(ang);

  forCircle(cx, cy, RADIUS, (x, _y, dist, i) => {
    const edge = Math.min(1, (RADIUS - dist) / (RADIUS * 0.25));
    const r = o[i];
    const g = o[i + 1];
    const b = o[i + 2];
    let nr = r;
    let ng = g;
    let nb = b;
    if (kind === "invert") {
      nr = 255 - r;
      ng = 255 - g;
      nb = 255 - b;
    } else if (kind === "hue") {
      nr = r * (0.213 + c * 0.787 - s * 0.213) + g * (0.715 - c * 0.715 - s * 0.715) + b * (0.072 - c * 0.072 + s * 0.928);
      ng = r * (0.213 - c * 0.213 + s * 0.143) + g * (0.715 + c * 0.285 + s * 0.14) + b * (0.072 - c * 0.072 - s * 0.283);
      nb = r * (0.213 - c * 0.213 - s * 0.787) + g * (0.715 - c * 0.715 + s * 0.715) + b * (0.072 + c * 0.928 + s * 0.072);
    } else if (kind === "erase") {
      nr = mr;
      ng = mg;
      nb = mb;
    } else if (kind === "flip") {
      const sx = Math.max(0, Math.min(PANEL - 1, Math.round(2 * cx - x)));
      const j = ((i / 4 - x) + sx) * 4;
      nr = o[j];
      ng = o[j + 1];
      nb = o[j + 2];
    }
    d[i] = Math.max(0, Math.min(255, r + (nr - r) * edge));
    d[i + 1] = Math.max(0, Math.min(255, g + (ng - g) * edge));
    d[i + 2] = Math.max(0, Math.min(255, b + (nb - b) * edge));
  });
}

function restoreCircle(edited: ImageData, original: ImageData, cx: number, cy: number) {
  forCircle(cx, cy, RADIUS + 2, (_x, _y, _dist, i) => {
    edited.data[i] = original.data[i];
    edited.data[i + 1] = original.data[i + 1];
    edited.data[i + 2] = original.data[i + 2];
  });
}

function meanDiff(a: ImageData, b: ImageData, cx: number, cy: number): number {
  let sum = 0;
  let n = 0;
  forCircle(cx, cy, RADIUS * 0.8, (_x, _y, _dist, i) => {
    sum +=
      (Math.abs(a.data[i] - b.data[i]) +
        Math.abs(a.data[i + 1] - b.data[i + 1]) +
        Math.abs(a.data[i + 2] - b.data[i + 2])) /
      3;
    n++;
  });
  return n > 0 ? sum / n : 0;
}

function buildPuzzle(img: HTMLImageElement, count: number): CustomPuzzle {
  const base = document.createElement("canvas");
  base.width = PANEL;
  base.height = PANEL;
  const bctx = base.getContext("2d");
  if (!bctx) throw new Error("no canvas");
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  bctx.drawImage(img, sx, sy, side, side, 0, 0, PANEL, PANEL);
  const original = bctx.getImageData(0, 0, PANEL, PANEL);
  const edited = bctx.createImageData(PANEL, PANEL);
  edited.data.set(original.data);

  // pick spread-out spots
  const centers: Pt[] = [];
  const margin = RADIUS + 14;
  let minDist = 115;
  let tries = 0;
  while (centers.length < count) {
    tries++;
    if (tries > 1500) {
      minDist = 90;
    }
    const x = margin + Math.random() * (PANEL - 2 * margin);
    const y = margin + Math.random() * (PANEL - 2 * margin);
    if (centers.every((p) => Math.hypot(p[0] - x, p[1] - y) >= minDist)) {
      centers.push([x, y]);
    }
    if (tries > 6000) break;
  }

  const kinds = shuffle([...KINDS, ...KINDS]);
  const finalKinds: Kind[] = [];
  centers.forEach((p, idx) => {
    let kind = kinds[idx % kinds.length];
    if (kind !== "dot") {
      applyChange(edited, original, p[0], p[1], kind);
      if (meanDiff(edited, original, p[0], p[1]) < MIN_VISIBLE) {
        restoreCircle(edited, original, p[0], p[1]);
        kind = "invert";
        applyChange(edited, original, p[0], p[1], kind);
        if (meanDiff(edited, original, p[0], p[1]) < MIN_VISIBLE) {
          restoreCircle(edited, original, p[0], p[1]);
          kind = "dot";
        }
      }
    }
    finalKinds.push(kind);
  });

  const comp = document.createElement("canvas");
  comp.width = COMP_W;
  comp.height = COMP_H;
  const ctx = comp.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#fff7e6";
  ctx.fillRect(0, 0, COMP_W, COMP_H);
  ctx.putImageData(original, LEFT_X, TOP_Y);
  ctx.putImageData(edited, RIGHT_X, TOP_Y);

  centers.forEach((p, idx) => {
    if (finalKinds[idx] === "dot") {
      ctx.beginPath();
      ctx.arc(RIGHT_X + p[0], TOP_Y + p[1], RADIUS * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#1f2937";
      ctx.stroke();
    }
  });

  ctx.lineWidth = 6;
  ctx.strokeStyle = "#1f2937";
  ctx.strokeRect(LEFT_X - 3, TOP_Y - 3, PANEL + 6, PANEL + 6);
  ctx.strokeRect(RIGHT_X - 3, TOP_Y - 3, PANEL + 6, PANEL + 6);

  const spots: CustomSpot[] = centers.map((p, idx) => ({
    id: idx + 1,
    l: [Math.round(LEFT_X + p[0]), Math.round(TOP_Y + p[1])],
    r: [Math.round(RIGHT_X + p[0]), Math.round(TOP_Y + p[1])],
  }));

  return {
    image: comp.toDataURL("image/jpeg", 0.92),
    width: COMP_W,
    height: COMP_H,
    spots,
  };
}

export const CreatePuzzleScreen: React.FC<CreateProps> = ({ onBack, onPuzzleSaved }) => {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [count, setCount] = useState<number>(6);
  const [made, setMade] = useState<CustomPuzzle | null>(null);
  const [error, setError] = useState<string>("");

  const make = (img: HTMLImageElement, n: number) => {
    try {
      setMade(buildPuzzle(img, n));
      setError("");
    } catch {
      setError("Something went wrong making the puzzle. Try a different photo.");
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(img);
      make(img, count);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That photo couldn't be opened. Try a JPG or PNG.");
    };
    img.src = url;
  };

  const pickCount = (n: number) => {
    setCount(n);
    if (photo) make(photo, n);
  };

  const play = () => {
    if (!made) return;
    setCustomPuzzle(made);
    onPuzzleSaved({ id: "custom", totalDifferences: made.spots.length });
  };

  const base: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 18px",
    fontSize: 22,
    fontWeight: 800,
    borderRadius: 14,
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center",
  };
  const blue: React.CSSProperties = {
    ...base,
    border: "3px solid #1e3a8a",
    background: "linear-gradient(#60a5fa, #1d4ed8)",
    boxShadow: "0 5px 0 #1e3a8a",
    display: "block",
  };
  const green: React.CSSProperties = {
    ...base,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    boxShadow: "0 5px 0 #14532d",
  };
  const purple: React.CSSProperties = {
    ...base,
    border: "3px solid #4c1d95",
    background: "linear-gradient(#a78bfa, #6d28d9)",
    boxShadow: "0 5px 0 #4c1d95",
  };
  const countBtn = (n: number): React.CSSProperties => ({
    flex: 1,
    padding: "10px 6px",
    fontSize: 17,
    fontWeight: 800,
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    border: "3px solid #9a3412",
    color: n === count ? "#ffffff" : "#7c2d12",
    background: n === count ? "linear-gradient(#fb923c, #ea580c)" : "#fff7ed",
    boxShadow: n === count ? "0 4px 0 #9a3412" : "none",
  });

  return (
    <div
      className="screen create-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fef3c7, #fde68a)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "Arial Rounded MT Bold, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(#ef4444, #b91c1c)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 24,
            fontWeight: 900,
            padding: "10px 16px",
            borderRadius: 12,
            border: "3px solid #7f1d1d",
            boxShadow: "0 4px 0 #7f1d1d",
            marginBottom: 18,
          }}
        >
          Create Your Own
        </div>

        <div style={{ textAlign: "center", color: "#78350f", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
          Pick a photo and the game changes things in a copy. Your photo stays on this device and is not uploaded anywhere.
        </div>

        <label style={blue}>
          {photo ? "Choose a Different Photo" : "Choose a Photo"}
          <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
        </label>

        <div style={{ textAlign: "center", fontSize: 18, fontWeight: 900, color: "#78350f", margin: "18px 0 8px" }}>
          How many differences?
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={countBtn(5)} onClick={() => pickCount(5)}>Easy (5)</button>
          <button style={countBtn(6)} onClick={() => pickCount(6)}>Medium (6)</button>
          <button style={countBtn(8)} onClick={() => pickCount(8)}>Hard (8)</button>
        </div>

        {error && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              background: "#fee2e2",
              border: "3px solid #dc2626",
              color: "#7f1d1d",
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {made && (
          <div style={{ marginTop: 20 }}>
            <img
              src={made.image}
              alt="Your puzzle"
              style={{ width: "100%", display: "block", borderRadius: 12, border: "4px solid #92400e" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
              <button style={green} onClick={play}>Play This Puzzle</button>
              <button style={purple} onClick={() => photo && make(photo, count)}>Shuffle Again</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 26, textAlign: "center" }}>
          <button
            style={{
              padding: "12px 28px",
              fontSize: 18,
              fontWeight: 800,
              borderRadius: 12,
              border: "3px solid #78350f",
              background: "linear-gradient(#fcd34d, #d97706)",
              color: "#ffffff",
              cursor: "pointer",
              boxShadow: "0 4px 0 #78350f",
              fontFamily: "inherit",
            }}
            onClick={onBack}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
