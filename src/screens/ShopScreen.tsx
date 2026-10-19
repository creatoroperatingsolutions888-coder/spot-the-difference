import React from "react";

interface ShopProps {
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopProps> = ({ onBack }) => {
  const items = [
    { name: "Hint Pack", detail: "5 extra hints", price: "100 coins" },
    { name: "Puzzle Pack: Animals", detail: "20 new puzzles", price: "250 coins" },
    { name: "Puzzle Pack: Nature", detail: "20 new puzzles", price: "250 coins" },
    { name: "Remove Ads", detail: "Play with no ads", price: "$2.99" },
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
  const buy: React.CSSProperties = {
    padding: "8px 14px",
    fontSize: 16,
    fontWeight: 800,
    borderRadius: 10,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="screen shop-screen"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(#fef3c7, #fde68a)",
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "Arial Rounded MT Bold, Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        <div
          style={{
            background: "linear-gradient(#7c3aed, #5b21b6)",
            color: "#ffffff",
            textAlign: "center",
            fontSize: 26,
            fontWeight: 900,
            padding: "10px 16px",
            borderRadius: 12,
            border: "3px solid #4c1d95",
            boxShadow: "0 4px 0 #4c1d95",
            marginBottom: 20,
          }}
        >
          Shop
        </div>

        {items.map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              background: "#ffffff",
              border: "3px solid #b45309",
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 19, fontWeight: 900, color: "#78350f" }}>
                {item.name}
              </div>
              <div style={{ fontSize: 15, color: "#57534e" }}>{item.detail}</div>
            </div>
            <button
              style={buy}
              onClick={() => alert("Shop is coming soon!")}
            >
              {item.price}
            </button>
          </div>
        ))}

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button style={gold} onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
