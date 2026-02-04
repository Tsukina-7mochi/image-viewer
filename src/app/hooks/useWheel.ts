import { useEffect } from "preact/hooks";

export function useWheel(callback: (e: WheelEvent) => void) {
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      callback(e);
      e.preventDefault();
    };

    document.addEventListener("wheel", handler);
    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, [document, callback]);
}
