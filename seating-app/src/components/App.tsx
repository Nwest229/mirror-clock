"use client";

import { useSeatingReducer } from "@/hooks/useSeatingReducer";
import { SetupConfig } from "@/types";
import SetupScreen from "./setup/SetupScreen";
import ArrangementScreen from "./arrangement/ArrangementScreen";

export default function App() {
  const [state, dispatch] = useSeatingReducer();

  function handleSetupSubmit(config: SetupConfig) {
    dispatch({ type: "SUBMIT_SETUP", payload: config });
  }

  function handleReset() {
    dispatch({ type: "RESET_TO_SETUP" });
  }

  if (state.screen === "arrangement") {
    return <ArrangementScreen state={state} dispatch={dispatch} onReset={handleReset} />;
  }

  return <SetupScreen onSubmit={handleSetupSubmit} />;
}
