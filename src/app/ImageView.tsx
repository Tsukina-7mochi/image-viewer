import { useCallback, useMemo, useState } from "preact/hooks";
import { useBoundingClientRect } from "./hooks/useBoundingClientRect";
import { useKeydown } from "./hooks/useKeydown";
import { useMouseDrag } from "./hooks/useMouseDrag";
import { useWheel } from "./hooks/useWheel";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

const WHEEL_MULTIPLIER = 0.01;
const MIN_SIZE_PX = 10;
const EDGE_PX = 10;

function px(value: number): string {
  return `${value}px`;
}

function saturate(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function ImageView(props: { url: string }) {
  const [position, setPositionRaw] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScaleRaw] = useState(1);
  const [imageSize, setImageSize] = useState<Size | null>(null);
  const [wrapperRectRef, wrapperRect] = useBoundingClientRect();

  const clampAndSetPosition = useCallback(
    (newPosition: Position) => {
      if (!wrapperRect || !imageSize) return;
      setPositionRaw({
        x: saturate(
          newPosition.x,
          -imageSize.width * scale + EDGE_PX,
          wrapperRect.width - EDGE_PX,
        ),
        y: saturate(
          newPosition.y,
          -imageSize.height * scale + EDGE_PX,
          wrapperRect.height - EDGE_PX,
        ),
      });
    },
    [wrapperRect, imageSize, scale],
  );

  const clampAndSetScale = useCallback(
    (newScale_: number) => {
      let minScale = 0;
      if (imageSize !== null) {
        minScale = MIN_SIZE_PX / Math.min(imageSize.width, imageSize.height);
      }

      const newScale = Math.max(minScale, newScale_);
      if (imageSize) {
        const centerX = position.x + (imageSize.width * scale) / 2;
        const centerY = position.y + (imageSize.height * scale) / 2;
        setPositionRaw({
          x: centerX - (imageSize.width * newScale) / 2,
          y: centerY - (imageSize.height * newScale) / 2,
        });
      }
      setScaleRaw(newScale);
    },
    [imageSize, scale, position],
  );

  const placementStyles = useMemo(() => {
    if (imageSize === null) {
      return { left: "0", top: "0", width: "auto", height: "auto" };
    }

    return {
      left: px(position.x),
      top: px(position.y),
      width: px(imageSize.width * scale),
      height: px(imageSize.height * scale),
    };
  }, [imageSize, position, scale]);

  const handleWheel = useCallback(
    (e: WheelEvent) => clampAndSetScale(scale + e.deltaY * WHEEL_MULTIPLIER),
    [scale, clampAndSetScale],
  );
  useWheel(handleWheel);

  const handleDrag = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      console.log("drag", x, y);
      clampAndSetPosition({ x: position.x + x, y: position.y + y });
    },
    [position, clampAndSetPosition],
  );
  const mouseDragRef = useMouseDrag(handleDrag);

  const fitImageToWindow = useCallback(() => {
    if (!wrapperRect || !imageSize) return;

    const imageAspectRatio = imageSize.width / imageSize.height;
    const wrapperAspectRatio = wrapperRect.width / wrapperRect.height;

    if (imageAspectRatio > wrapperAspectRatio) {
      const scale = wrapperRect.width / imageSize.width;
      setScaleRaw(scale);
      setPositionRaw({
        x: 0,
        y: (wrapperRect.height - imageSize.height * scale) / 2,
      });
    } else {
      const scale = wrapperRect.height / imageSize.height;
      setScaleRaw(scale);
      setPositionRaw({
        x: (wrapperRect.width - imageSize.width * scale) / 2,
        y: 0,
      });
    }
  }, [wrapperRect, imageSize]);

  useKeydown({ key: "+", ctrlKey: true }, () => {
    clampAndSetScale(scale + 0.1);
  });
  useKeydown({ key: "=", ctrlKey: true }, () => {
    clampAndSetScale(scale + 0.1);
  });
  useKeydown({ key: "-", ctrlKey: true }, () => {
    clampAndSetScale(scale - 0.1);
  });
  useKeydown({ key: "_", ctrlKey: true }, () => {
    clampAndSetScale(scale - 0.1);
  });
  useKeydown({ key: "0", ctrlKey: true }, fitImageToWindow);

  const handleImageLoad = useCallback(
    (event: Event) => {
      const target = event.target as HTMLImageElement;
      const imageSize = {
        width: target.naturalWidth,
        height: target.naturalHeight,
      };
      setImageSize(imageSize);

      if (wrapperRect) {
        const imageAspectRatio = target.naturalWidth / target.naturalHeight;
        const wrapperAspectRatio = wrapperRect.width / wrapperRect.height;

        if (imageAspectRatio > wrapperAspectRatio) {
          const scale = wrapperRect.width / target.naturalWidth;
          setScaleRaw(scale);
          setPositionRaw({
            x: 0,
            y: (wrapperRect.height - target.naturalHeight * scale) / 2,
          });
        } else {
          const scale = wrapperRect.height / target.naturalHeight;
          setScaleRaw(scale);
          setPositionRaw({
            x: (wrapperRect.width - target.naturalWidth * scale) / 2,
            y: 0,
          });
        }
      }
    },
    [wrapperRect],
  );

  const wrapperRef = useCallback(
    (node: HTMLElement | null) => {
      wrapperRectRef(node);
      mouseDragRef(node);
    },
    [wrapperRectRef, mouseDragRef],
  );

  return (
    <div class="size-full" ref={wrapperRef}>
      <img
        src={props.url}
        alt=""
        class="absolute pointer-events-none max-w-none max-h-none max-h-none"
        style={placementStyles}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
