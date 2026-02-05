import type { RefCallback } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

type Vec2 = { x: number; y: number };

export function useMouseDrag(
  callback: (pos: Vec2) => void,
): RefCallback<HTMLElement> {
  const callback_ = useRef(callback);
  useEffect(() => {
    callback_.current = callback;
  }, [callback]);

  const ref: RefCallback<HTMLElement> = useCallback((node) => {
    console.log("useMouseDrag", node);
    if (!node) return;

    let pressing = false;
    const downHandler = (e: MouseEvent) => {
      pressing = true;
      e.preventDefault();
    };
    const moveHandler = (e: MouseEvent) => {
      if (!pressing) return;
      callback_.current({
        x: e.movementX,
        y: e.movementY,
      });
      e.preventDefault();
    };
    const upHandler = (e: MouseEvent) => {
      pressing = false;
      e.preventDefault();
    };

    node.addEventListener("mousedown", downHandler);
    node.addEventListener("mousemove", moveHandler);
    node.addEventListener("mouseup", upHandler);
    node.addEventListener("mouseleave", upHandler);
    return () => {
      node.removeEventListener("mousedown", downHandler);
      node.removeEventListener("mousemove", moveHandler);
      node.removeEventListener("mouseup", upHandler);
      node.removeEventListener("mouseleave", upHandler);
    };
  }, []);

  return ref;
}
