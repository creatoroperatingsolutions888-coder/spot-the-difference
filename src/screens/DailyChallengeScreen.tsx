import React from "react";

interface DailyProps {
  timerEnabled: boolean;
  onBack: () => void;
  onStartPuzzle: (puzzle: { id: string | null; totalDifferences: number }) => void;
}

export const DailyChallengeScreen: React.FC<DailyProps> = ({
  timerEnabled,
  onBack,
  onStartPuzzle,
}) => {
  const today = new Date();
  const dateText = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const dayId =
    "daily-" +
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate();

  const green: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    fontSize: 28,
    fontWeight: 800,
    borderRadius: 14,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    color: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 5px 0 #14532d",
    fontFamily: "inherit",
  };
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
      className="screen daily-screen"
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
          Daily Challenge!
        </div>

        <div
          style={{
            background: "linear-gradient(#1e3a8a, #1e40af)",
            border: "4px solid #facc15",
            borderRadius: 18,
            padding: 20,
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: "#facc15" }}>
            Today's 10 Challenge!
          </div>
          <div style={{ fontSize: 18, marginTop: 8 }}>{dateText}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>
            Timer: {timerEnabled ? "ON" : "OFF"}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, marginTop: 14 }}>
            Reward: 100 coins
          </div>
        </div>

        <button
          style={green}
          onClick={() => onStartPuzzle({ id: dayId, totalDifferences: 10 })}
        >
          Start Today's Challenge
        </button>

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <button style={gold} onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
