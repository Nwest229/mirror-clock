"use client";

import { useSeatingReducer } from "@/hooks/useSeatingReducer";
import { SetupConfig } from "@/types";
import SetupScreen from "./setup/SetupScreen";
import ArrangementScreen from "./arrangement/ArrangementScreen";

export default function App() {
  const [state, dispatch, ready] = useSeatingReducer();

  function handleSetupSubmit(config: SetupConfig) {
    dispatch({ type: "SUBMIT_SETUP", payload: config });
  }

  function handleReset() {
    dispatch({ type: "RESET_TO_SETUP" });
  }

  // Avoid SSR/hydration flash — don't render until client state is loaded
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (state.screen === "arrangement") {
    return <ArrangementScreen state={state} dispatch={dispatch} onReset={handleReset} />;
  }

  return <SetupScreen onSubmit={handleSetupSubmit} />;
}
