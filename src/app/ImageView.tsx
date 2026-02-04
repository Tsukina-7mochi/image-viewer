import { useCallback, useRef, useState } from "preact/hooks";
import { useBoundingClientRect } from "./hooks/useBoundingClientRect";
import { useImageSize } from "./hooks/useImageSize";
import { useKeydown } from "./hooks/useKeydown";
import { useMouseDrag } from "./hooks/useMouseDrag";
import { useWheel } from "./hooks/useWheel";

type Position = { x: number; y: number };

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
  // Changes in position depend on scale, but if callbacks depend on scale,
  // it leads to frequent re-registration of event listeners, so we use
  // internal mutability with `useRef`.
  const position = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [placementStyles, setPlacementStyles] = useState({
    left: "",
    top: "",
    width: "",
    height: "",
  });

  const wrapperRect = useBoundingClientRect(wrapperRef);
  const imageSize = useImageSize(imageRef);

  const setPosition = useCallback(
    (newPosition: Position) => {
      if (!wrapperRect || !imageSize) return;

      const width = imageSize.width * scale.current;
      const height = imageSize.height * scale.current;
      position.current = {
        x: saturate(
          newPosition.x,
          -width + EDGE_PX,
          wrapperRect.width - EDGE_PX,
        ),
        y: saturate(
          newPosition.y,
          -height + EDGE_PX,
          wrapperRect.height - EDGE_PX,
        ),
      };
      console.log(position.current);
      updatePlacementStyles();
    },
    [wrapperRect, imageSize],
  );
  const setScale = useCallback(
    (newScale: number) => {
      let minScale = 0;
      if (imageSize !== null) {
        minScale = MIN_SIZE_PX / Math.min(imageSize.width, imageSize.height);
      }
      scale.current = Math.max(minScale, newScale);
      updatePlacementStyles();
    },
    [imageSize],
  );

  const updatePlacementStyles = useCallback(() => {
    if (wrapperRect === null || imageSize === null) {
      setPlacementStyles({
        left: "0",
        top: "0",
        width: "auto",
        height: "auto",
      });
      return;
    }

    console.log(imageSize);
    const width = imageSize.width * scale.current;
    const height = imageSize.height * scale.current;
    const left = position.current.x;
    const top = position.current.y;

    setPlacementStyles({
      left: px(left),
      top: px(top),
      width: px(width),
      height: px(height),
    });
  }, [wrapperRect, imageSize]);

  const handleWheel = useCallback((e: WheelEvent) => {
    setScale(scale.current + e.deltaY * WHEEL_MULTIPLIER);
  }, []);
  useWheel(handleWheel);

  const handleDrag = useCallback(({ x, y }: { x: number; y: number }) => {
    setPosition({
      x: position.current.x + x,
      y: position.current.y + y,
    });
  }, []);
  useMouseDrag(wrapperRef, handleDrag);

  useKeydown({ key: "+", ctrlKey: true }, () => {
    setScale(scale.current + 0.1);
  });
  useKeydown({ key: "=", ctrlKey: true }, () => {
    setScale(scale.current + 0.1);
  });
  useKeydown({ key: "-", ctrlKey: true }, () => {
    setScale(scale.current - 0.1);
  });
  useKeydown({ key: "_", ctrlKey: true }, () => {
    setScale(scale.current - 0.1);
  });

  return (
    <div class="size-full" ref={wrapperRef}>
      <img
        src={props.url}
        alt=""
        class="absolute"
        style={placementStyles}
        ref={imageRef}
      />
    </div>
  );
}
