import React, { useState } from "react";

interface SettingsProps {
  timerEnabled: boolean;
  onToggleTimer: () => void;
  onBack: () => void;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const SettingsScreen: React.FC<SettingsProps> = ({
  timerEnabled,
  onToggleTimer,
  onBack,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [difficulty, setDifficulty] = useState("Medium");

  const nextDifficulty = () => {
    const i = DIFFICULTIES.indexOf(difficulty);
    setDifficulty(DIFFICULTIES[(i + 1) % DIFFICULTIES.length]);
  };

  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#44403c",
    color: "#ffffff",
    padding: "14px 16px",
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 800,
  };
  const pill = (on: boolean): React.CSSProperties => ({
    padding: "8px 18px",
    fontSize: 18,
    fontWeight: 800,
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    color: "#ffffff",
    background: on ? "#16a34a" : "#b91c1c",
    fontFamily: "inherit",
    minWidth: 80,
  });
  const gold: React.CSSProperties = {
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
  };

  return (
    <div
      className="screen settings-screen"
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
            background: "linear-gradient(#ef4444, #b91c1c)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 900,
            padding: "10px 16px",
            borderRadius: 12,
            border: "3px solid #7f1d1d",
            boxShadow: "0 4px 0 #7f1d1d",
            marginBottom: 20,
          }}
        >
          Settings
        </div>

        <div style={row}>
          <span>Sound</span>
          <button style={pill(soundOn)} onClick={() => setSoundOn((s) => !s)}>
            {soundOn ? "On" : "Off"}
          </button>
        </div>

        <div style={row}>
          <span>Timer Mode</span>
          <button style={pill(timerEnabled)} onClick={onToggleTimer}>
            {timerEnabled ? "On" : "Off"}
          </button>
        </div>

        <div style={row}>
          <span>Difficulty</span>
          <button
            style={{ ...pill(true), background: "#d97706" }}
            onClick={nextDifficulty}
          >
            {difficulty}
          </button>
        </div>

        <div style={row}>
          <span>Language</span>
          <span style={{ color: "#fcd34d" }}>English</span>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button style={gold} onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
