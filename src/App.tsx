import React, { useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { GameScreen } from "./screens/GameScreen";
import { DailyChallengeScreen } from "./screens/DailyChallengeScreen";
import { CreatePuzzleScreen } from "./screens/CreatePuzzleScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { StatsScreen } from "./screens/StatsScreen";
import { ShopScreen } from "./screens/ShopScreen";

export type ScreenName =
  | "HOME"
  | "PLAY"
  | "GAME"
  | "DAILY"
  | "CREATE"
  | "SETTINGS"
  | "STATS"
  | "SHOP";

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("HOME");
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);

  const [currentPuzzle, setCurrentPuzzle] = useState({
    id: null as string | null,
    totalDifferences: 10,
  });

  const goTo = (screen: ScreenName) => setCurrentScreen(screen);

  return (
    <div className="app-root">
      {currentScreen === "HOME" && (
        <HomeScreen
          timerEnabled={timerEnabled}
          onToggleTimer={() => setTimerEnabled((t) => !t)}
          onPlay={() => goTo("PLAY")}
          onDaily={() => goTo("DAILY")}
          onCreate={() => goTo("CREATE")}
          onSettings={() => goTo("SETTINGS")}
          onStats={() => goTo("STATS")}
          onShop={() => goTo("SHOP")}
        />
      )}

      {currentScreen === "PLAY" && (
        <PlayScreen
          onBack={() => goTo("HOME")}
          onStartPuzzle={(puzzle) => {
            setCurrentPuzzle(puzzle);
            goTo("GAME");
          }}
        />
      )}

      {currentScreen === "GAME" && (
        <GameScreen
          puzzle={currentPuzzle}
          timerEnabled={timerEnabled}
          onBack={() => goTo("PLAY")}
        />
      )}

      {currentScreen === "DAILY" && (
        <DailyChallengeScreen
          timerEnabled={timerEnabled}
          onBack={() => goTo("HOME")}
          onStartPuzzle={(puzzle) => {
            setCurrentPuzzle(puzzle);
            goTo("GAME");
          }}
        />
      )}

      {currentScreen === "CREATE" && (
        <CreatePuzzleScreen
          onBack={() => goTo("HOME")}
          onPuzzleSaved={(puzzle) => {
            setCurrentPuzzle(puzzle);
            goTo("GAME");
          }}
        />
      )}

      {currentScreen === "SETTINGS" && (
        <SettingsScreen
          timerEnabled={timerEnabled}
          onToggleTimer={() => setTimerEnabled((t) => !t)}
          onBack={() => goTo("HOME")}
        />
      )}

      {currentScreen === "STATS" && (
        <StatsScreen onBack={() => goTo("HOME")} />
      )}

      {currentScreen === "SHOP" && (
        <ShopScreen onBack={() => goTo("HOME")} />
      )}
    </div>
  );
};
