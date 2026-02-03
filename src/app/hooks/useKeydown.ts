import { useEffect } from "preact/hooks";

type KeyboardEventFilter = {
  key?: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
};

export function useKeydown(
  filter: KeyboardEventFilter,
  callback: (e: KeyboardEvent) => void,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (filter.key !== undefined && e.key !== filter.key) return;
      if (filter.altKey !== undefined && e.altKey !== filter.altKey) return;
      if (filter.ctrlKey !== undefined && e.ctrlKey !== filter.ctrlKey) return;
      if (filter.metaKey !== undefined && e.metaKey !== filter.metaKey) return;
      if (filter.shiftKey !== undefined && e.shiftKey !== filter.shiftKey)
        return;

      callback(e);
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [document, callback]);
}
