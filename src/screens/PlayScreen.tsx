import React from "react";

interface PlayProps {
  onBack: () => void;
  onStartPuzzle: (puzzle: { id: string | null; totalDifferences: number }) => void;
}

export const PlayScreen: React.FC<PlayProps> = ({ onBack, onStartPuzzle }) => {
  const start = (id: string, totalDifferences: number) =>
    onStartPuzzle({ id, totalDifferences });

  const base: React.CSSProperties = {
    width: "100%",
    padding: "16px 20px",
    fontSize: 24,
    fontWeight: 800,
    borderRadius: 14,
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "inherit",
  };
  const blue: React.CSSProperties = {
    ...base,
    border: "3px solid #1e3a8a",
    background: "linear-gradient(#60a5fa, #1d4ed8)",
    boxShadow: "0 5px 0 #1e3a8a",
    fontSize: 30,
  };
  const green: React.CSSProperties = {
    ...base,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    boxShadow: "0 5px 0 #14532d",
  };
  const orange: React.CSSProperties = {
    ...base,
    border: "3px solid #9a3412",
    background: "linear-gradient(#fb923c, #ea580c)",
    boxShadow: "0 5px 0 #9a3412",
  };
  const red: React.CSSProperties = {
    ...base,
    border: "3px solid #7f1d1d",
    background: "linear-gradient(#f87171, #b91c1c)",
    boxShadow: "0 5px 0 #7f1d1d",
  };
  const ribbon: React.CSSProperties = {
    background: "linear-gradient(#ef4444, #b91c1c)",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: 900,
    padding: "10px 16px",
    borderRadius: 12,
    border: "3px solid #7f1d1d",
    boxShadow: "0 4px 0 #7f1d1d",
    marginBottom: 20,
  };

  return (
    <div
      className="screen play-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fef3c7, #fde68a)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "Arial Rounded MT Bold, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={ribbon}>Play</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button style={blue} onClick={() => start("quick", 10)}>
            Quick Play
          </button>

          <div
            style={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#78350f",
              marginTop: 10,
            }}
          >
            Choose Difficulty
          </div>

          <button style={green} onClick={() => start("easy", 5)}>
            Easy
          </button>
          <button style={orange} onClick={() => start("medium", 8)}>
            Medium
          </button>
          <button style={red} onClick={() => start("hard", 10)}>
            Hard
          </button>
        </div>

        <div style={{ marginTop: 28, textAlign: "center" }}>
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
