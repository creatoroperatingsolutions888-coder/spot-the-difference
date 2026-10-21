import React from "react";
import { loadStats, currentStreak } from "../stats";

interface StatsProps {
  onBack: () => void;
}

const formatTime = (s: number | null): string => {
  if (s === null) return "--:--";
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return m + ":" + sec;
};

export const StatsScreen: React.FC<StatsProps> = ({ onBack }) => {
  const stats = loadStats();
  const rows: [string, string][] = [
    ["Puzzles Solved", String(stats.solved)],
    ["Best Time", formatTime(stats.bestSeconds)],
    ["Daily Streak", String(currentStreak(stats))],
    ["Stars Earned", String(stats.stars)],
  ];

  return (
    <div
      className="screen stats-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fef3c7, #fde68a)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "Arial Rounded MT Bold, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(#f97316, #c2410c)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 30,
            fontWeight: 900,
            padding: "12px 16px",
            borderRadius: 14,
            border: "3px solid #7c2d12",
            boxShadow: "0 4px 0 #7c2d12",
            marginBottom: 20,
          }}
        >
          My Stats
        </div>

        <div
          style={{
            background: "#7c2d12",
            border: "4px solid #451a03",
            borderRadius: 18,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {rows.map((row) => (
            <div
              key={row[0]}
              style={{
                background: "#92400e",
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ color: "#ffffff", fontSize: 22, fontWeight: 800 }}>{row[0]}</div>
              <div
                style={{
                  background: "#16a34a",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 800,
                  borderRadius: 10,
                  padding: "6px 18px",
                  minWidth: 70,
                  textAlign: "center",
                }}
              >
                {row[1]}
              </div>
            </div>
          ))}
        </div>

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
