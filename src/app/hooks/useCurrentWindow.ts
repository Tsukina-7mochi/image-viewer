import { getCurrentWindow, type Window } from "@tauri-apps/api/window";
import { useMemo } from "preact/hooks";

export function useCurrentWindow(): Window {
  return useMemo(() => {
    return getCurrentWindow();
  }, []);
}
