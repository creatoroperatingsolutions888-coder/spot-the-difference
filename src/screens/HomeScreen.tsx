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
    fontWeight: 900,
    borderRadius: 14,
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: 1,
  };
  const orange: React.CSSProperties = {
    ...base,
    fontSize: 34,
    color: "#ffffff",
    border: "3px solid #7c2d12",
    background: "linear-gradient(#fb923c, #ea580c)",
    boxShadow: "0 5px 0 #7c2d12",
  };
  const teal: React.CSSProperties = {
    ...base,
    color: "#ffffff",
    border: "3px solid #0b3b42",
    background: "linear-gradient(#1d9aa8, #14707a)",
    boxShadow: "0 5px 0 #0b3b42",
  };
  const gold: React.CSSProperties = {
    ...base,
    color: "#3b0a0a",
    border: "3px solid #8a5a00",
    background: "linear-gradient(#fcd34d, #f5b82e)",
    boxShadow: "0 5px 0 #8a5a00",
  };
  const navy: React.CSSProperties = {
    ...base,
    fontSize: 20,
    color: "#f5b82e",
    border: "3px solid #f5b82e",
    background: "#0b1b3a",
    boxShadow: "0 5px 0 #050d1f",
  };
  const small: React.CSSProperties = {
    flex: "1 1 90px",
    padding: "12px 8px",
    fontSize: 18,
    fontWeight: 900,
    borderRadius: 12,
    border: "3px solid #f5b82e",
    background: "#0b1b3a",
    color: "#f5b82e",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <div
      className="screen home-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#9b0615, #6f0410)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "Arial Rounded MT Bold, Arial Black, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div
          style={{
            background: "#0b1b3a",
            borderTop: "5px solid #f5b82e",
            borderBottom: "5px solid #f5b82e",
            padding: "20px 12px",
            textAlign: "center",
            marginBottom: 26,
            boxShadow: "0 8px 18px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#fb923c",
              letterSpacing: 2,
            }}
          >
            {"ALEXANDER & FRIENDS"}
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: "#f5b82e",
              lineHeight: 1.05,
              marginTop: 6,
              textShadow: "3px 3px 0 #7c2d12",
            }}
          >
            SPOT THE
            <br />
            DIFFERENCE
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button style={orange} onClick={onPlay}>PLAY</button>
          <button style={teal} onClick={onDaily}>DAILY CHALLENGE</button>
          <button style={gold} onClick={onCreate}>CREATE YOUR OWN</button>
          <button style={navy} onClick={onToggleTimer}>
            TIMER MODE: {timerEnabled ? "ON" : "OFF"}
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
