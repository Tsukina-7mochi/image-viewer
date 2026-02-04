import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

type Size = { width: number; height: number };

export function useImageSize(ref: RefObject<HTMLImageElement>): Size | null {
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    if (!ref.current) {
      setSize(null);
      return;
    }

    setSize({
      width: ref.current.naturalWidth,
      height: ref.current.naturalHeight,
    });

    const observer = new MutationObserver((mutation) => {
      const image = mutation[0].target as HTMLImageElement;
      setSize({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    });

    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ["src"],
    });
    return () => {
      observer.disconnect();
    };
  }, [ref.current]);

  return size;
}
