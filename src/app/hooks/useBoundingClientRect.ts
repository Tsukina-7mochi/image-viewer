import type { RefCallback } from "preact";
import { useCallback, useState } from "preact/hooks";

export function useBoundingClientRect(): [
  RefCallback<HTMLElement>,
  DOMRectReadOnly | null,
] {
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  const ref: RefCallback<HTMLElement> = useCallback((node) => {
    console.log("useBoundingClientRect", node);
    if (node === null) {
      setRect(null);
      return;
    }
    setRect(node.getBoundingClientRect());

    const observer = new ResizeObserver((resize) => {
      setRect(resize[0].contentRect);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, rect];
}
