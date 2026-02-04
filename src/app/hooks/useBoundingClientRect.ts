import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

export function useBoundingClientRect(
  ref: RefObject<HTMLElement>,
): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setRect(ref.current?.getBoundingClientRect() ?? null);
    };

    setRect(ref.current?.getBoundingClientRect() ?? null);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref.current]);

  return rect;
}
