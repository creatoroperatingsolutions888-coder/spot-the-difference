import React from "react";

interface StatsProps {
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsProps> = ({ onBack }) => {
  const stats = [
    { label: "Puzzles Solved", value: "0" },
    { label: "Best Time", value: "--:--" },
    { label: "Daily Streak", value: "0" },
    { label: "Stars Earned", value: "0" },
  ];

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
            fontSize: 26,
            fontWeight: 900,
            padding: "10px 16px",
            borderRadius: 12,
            border: "3px solid #7c2d12",
            boxShadow: "0 4px 0 #7c2d12",
            marginBottom: 20,
          }}
        >
          My Stats
        </div>

        <div
          style={{
            background: "#78350f",
            borderRadius: 16,
            padding: 14,
            border: "4px solid #451a03",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#92400e",
                color: "#ffffff",
                padding: "14px 16px",
                borderRadius: 12,
                marginBottom: 10,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              <span>{s.label}</span>
              <span
                style={{
                  background: "#16a34a",
                  padding: "6px 16px",
                  borderRadius: 10,
                  minWidth: 60,
                  textAlign: "center",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
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
