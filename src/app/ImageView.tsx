import { useCallback, useRef, useState } from "preact/hooks";
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
  // Changes in position depend on scale, but if callbacks depend on scale,
  // it leads to frequent re-registration of event listeners, so we use
  // internal mutability with `useRef`.
  const position = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [placementStyles, setPlacementStyles] = useState({
    left: "",
    top: "",
    width: "",
    height: "",
  });
  const [imageSize, setImageSize] = useState<Size | null>(null);
  const wrapperRect = useBoundingClientRect(wrapperRef);

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
      updatePlacementStyles();
    },
    [wrapperRect, imageSize],
  );

  const setScale = useCallback(
    (newScale_: number) => {
      let minScale = 0;
      if (imageSize !== null) {
        minScale = MIN_SIZE_PX / Math.min(imageSize.width, imageSize.height);
      }
      const newScale = Math.max(minScale, newScale_);

      if (imageSize) {
        const pos = position.current;
        const centerX = pos.x + (imageSize.width * scale.current) / 2;
        const centerY = pos.y + (imageSize.height * scale.current) / 2;
        position.current = {
          x: centerX - (imageSize.width * newScale) / 2,
          y: centerY - (imageSize.height * newScale) / 2,
        };
      }

      scale.current = newScale;
      updatePlacementStyles();
    },
    [imageSize],
  );

  const updatePlacementStyles = useCallback((imageSizeOverride?: Size) => {
    const imageSize_ = imageSizeOverride ?? imageSize;

    if (wrapperRect === null || imageSize_ === null) {
      setPlacementStyles({
        left: "0",
        top: "0",
        width: "auto",
        height: "auto",
      });
      return;
    }

    const width = imageSize_.width * scale.current;
    const height = imageSize_.height * scale.current;
    const left = position.current.x;
    const top = position.current.y;

    setPlacementStyles({
      left: px(left),
      top: px(top),
      width: px(width),
      height: px(height),
    });
  }, [wrapperRect, imageSize]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      setScale(scale.current + e.deltaY * WHEEL_MULTIPLIER);
    },
    [setScale],
  );
  useWheel(handleWheel);

  const handleDrag = useCallback(
    ({ x, y }: { x: number; y: number }) => {
      setPosition({
        x: position.current.x + x,
        y: position.current.y + y,
      });
    },
    [setPosition],
  );
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

  const handleImageLoad = useCallback(
    (event: Event) => {
      const target = event.target as HTMLImageElement;
      const imageSize = {
        width: target.naturalWidth,
        height: target.naturalHeight,
      }
      setImageSize(imageSize);

      if (wrapperRect) {
        const imageAspectRatio = target.naturalWidth / target.naturalHeight;
        const wrapperAspectRatio = wrapperRect.width / wrapperRect.height;

        if (imageAspectRatio > wrapperAspectRatio) {
          const scale_ = wrapperRect.width / target.naturalWidth;
          scale.current = scale_;
          position.current = {
            x: 0,
            y: (wrapperRect.height - target.naturalHeight * scale_) / 2,
          };
        } else {
          const scale_ = wrapperRect.height / target.naturalHeight;
          scale.current = scale_;
          position.current = {
            x: (wrapperRect.width - target.naturalWidth * scale_) / 2,
            y: 0,
          };
        }

        updatePlacementStyles(imageSize);
      }
    },
    [wrapperRect],
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
