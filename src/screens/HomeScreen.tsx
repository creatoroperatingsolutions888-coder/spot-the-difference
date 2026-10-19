import React from "react";

interface HomeProps {
  timerEnabled: boolean;
  onToggleTimer: () => void;
  onPlay: () => void;
  onDaily: () => void;
  onCreate: () => void;
  onSettings: () => void;
  onStats: () => void;
  onShop: () => void;
}

export const HomeScreen: React.FC<HomeProps> = ({
  timerEnabled,
  onToggleTimer,
  onPlay,
  onDaily,
  onCreate,
  onSettings,
  onStats,
  onShop,
}) => {
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
  const orange: React.CSSProperties = {
    ...base,
    border: "3px solid #9a3412",
    background: "linear-gradient(#fb923c, #ea580c)",
    boxShadow: "0 5px 0 #9a3412",
    fontSize: 32,
  };
  const purple: React.CSSProperties = {
    ...base,
    border: "3px solid #4c1d95",
    background: "linear-gradient(#a78bfa, #6d28d9)",
    boxShadow: "0 5px 0 #4c1d95",
  };
  const green: React.CSSProperties = {
    ...base,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    boxShadow: "0 5px 0 #14532d",
  };
  const blue: React.CSSProperties = {
    ...base,
    border: "3px solid #1e3a8a",
    background: "linear-gradient(#60a5fa, #1d4ed8)",
    boxShadow: "0 5px 0 #1e3a8a",
  };
  const small: React.CSSProperties = {
    flex: "1 1 90px",
    padding: "12px 8px",
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
      className="screen home-screen"
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
            background: "linear-gradient(#166534, #14532d)",
            border: "4px solid #facc15",
            borderRadius: 18,
            padding: "18px 12px",
            textAlign: "center",
            color: "#ffffff",
            boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: "#facc15", letterSpacing: 2 }}>
            COS
          </div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Spot the Difference</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button style={orange} onClick={onPlay}>Play</button>
          <button style={purple} onClick={onDaily}>Daily Challenge</button>
          <button style={blue} onClick={onCreate}>Create Your Own</button>
          <button style={green} onClick={onToggleTimer}>
            Timer Mode: {timerEnabled ? "ON" : "OFF"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
          <button style={small} onClick={onSettings}>Settings</button>
          <button style={small} onClick={onStats}>My Stats</button>
          <button style={small} onClick={onShop}>Shop</button>
        </div>
      </div>
    </div>
  );
};