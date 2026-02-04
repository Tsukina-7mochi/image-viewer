import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";

type Vec2 = { x: number; y: number };

export function useMouseDrag(
  ref: RefObject<HTMLElement>,
  callback: (pos: Vec2) => void,
): void {
  useEffect(() => {
    if (!ref.current) return;

    let pressing = false;

    const downHandler = (e: MouseEvent) => {
      pressing = true;
      e.preventDefault();
    };
    const moveHandler = (e: MouseEvent) => {
      if (!pressing) return;

      callback({
        x: e.movementX,
        y: e.movementY,
      });
      e.preventDefault();
    };
    const upHandler = (e: MouseEvent) => {
      pressing = false;
      e.preventDefault();
    };

    addEventListener("mousedown", downHandler);
    addEventListener("mousemove", moveHandler);
    addEventListener("mouseup", upHandler);
    addEventListener("mouseleave", upHandler);
    return () => {
      removeEventListener("mousedown", downHandler);
      removeEventListener("mousemove", moveHandler);
      removeEventListener("mouseup", upHandler);
      removeEventListener("mouseleave", upHandler);
    };
  }, [ref.current, callback]);
}
