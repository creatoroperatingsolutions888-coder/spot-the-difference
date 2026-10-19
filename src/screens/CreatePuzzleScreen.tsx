import React, { useRef, useState } from "react";

interface CreateProps {
  onBack: () => void;
  onPuzzleSaved: (puzzle: { id: string | null; totalDifferences: number }) => void;
}

export const CreatePuzzleScreen: React.FC<CreateProps> = ({
  onBack,
  onPuzzleSaved,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  };

  const base: React.CSSProperties = {
    flex: "1 1 140px",
    padding: "16px 12px",
    fontSize: 20,
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
  };
  const green: React.CSSProperties = {
    ...base,
    border: "3px solid #14532d",
    background: "linear-gradient(#4ade80, #16a34a)",
    boxShadow: "0 5px 0 #14532d",
  };
  const gold: React.CSSProperties = {
    ...base,
    flex: "0 0 auto",
    padding: "12px 28px",
    fontSize: 18,
    border: "3px solid #78350f",
    background: "linear-gradient(#fcd34d, #d97706)",
    boxShadow: "0 4px 0 #78350f",
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
  const heading: React.CSSProperties = {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 900,
    color: "#1e3a8a",
    margin: "18px 0 10px",
  };

  const tips = [
    "Use your own photos",
    "Choose public domain images",
    "No logos or celebrities",
    "Keep it family-friendly",
  ];

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
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={ribbon}>Create Your Own</div>

        <div style={heading}>Capture or Upload</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={orange} onClick={() => cameraRef.current && cameraRef.current.click()}>
            Take Photo
          </button>
          <button style={green} onClick={() => uploadRef.current && uploadRef.current.click()}>
            Upload Photo
          </button>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />

        {photoUrl && (
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <img
              src={photoUrl}
              alt="Your puzzle photo"
              style={{
                maxWidth: "100%",
                maxHeight: 320,
                borderRadius: 14,
                border: "5px solid #92400e",
                boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}

        <div style={heading}>Edit Differences</div>
        <div
          style={{
            background: "#ffffff",
            border: "3px dashed #1e3a8a",
            borderRadius: 14,
            padding: 14,
            textAlign: "center",
            color: "#1e3a8a",
            fontWeight: 700,
          }}
        >
          Add, Erase, Recolor, Blur, and Clone tools are coming soon.
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            style={{
              ...green,
              width: "100%",
              fontSize: 24,
              opacity: photoUrl ? 1 : 0.5,
              cursor: photoUrl ? "pointer" : "not-allowed",
            }}
            disabled={!photoUrl}
            onClick={() => onPuzzleSaved({ id: "custom", totalDifferences: 10 })}
          >
            Save Your Puzzle
          </button>
        </div>

        <div
          style={{
            marginTop: 22,
            background: "#fffbeb",
            border: "4px solid #b45309",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: "#991b1b", marginBottom: 8 }}>
            Legal Tips
          </div>
          {tips.map((t, i) => (
            <div key={t} style={{ fontSize: 17, fontWeight: 700, color: "#78350f", padding: "4px 0" }}>
              {i + 1}. {t}
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
