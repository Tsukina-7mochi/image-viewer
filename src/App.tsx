import "preact/debug";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getCliArgumentFilepath } from "./api";
import { EmptyView } from "./app/EmptyView";
import { useCurrentWindow } from "./app/hooks/useCurrentWindow";
import { useFilePicker } from "./app/hooks/useFilePicker";
import { useImageViewer } from "./app/hooks/useImageViewer";
import { useKeydown } from "./app/hooks/useKeydown";
import { ImageView } from "./app/ImageView";
import { Titlebar } from "./app/Titlebar";

export function App() {
  const [immersiveMode, setImmersiveMode] = useState(false);
  const appWindow = useCurrentWindow();
  const viewer = useImageViewer();
  const filePicker = useFilePicker(viewer.setPath);

  const windowTitle = useMemo(
    () => viewer.image?.path ?? "Image Viewer",
    [viewer.image?.path],
  );

  const toggleImmersiveMode = useCallback(() => {
    setImmersiveMode((prev) => !prev);
  }, []);

  const closeWindow = useCallback(() => {
    appWindow.close();
  }, [appWindow]);

  useEffect(() => {
    appWindow.setTitle(windowTitle);
  }, [windowTitle, appWindow]);

  useKeydown({ key: "ArrowRight" }, viewer.nextImage);
  useKeydown({ key: "ArrowLeft" }, viewer.previousImage);
  useKeydown({ key: "r", ctrlKey: true }, viewer.refreshUrl);
  useKeydown({ key: "o", ctrlKey: true }, filePicker.open);
  useKeydown({ key: "w", ctrlKey: true }, closeWindow);
  useKeydown({ key: "F11" }, toggleImmersiveMode);

  // biome-ignore lint:correctness/useExhaustiveDependencies
  useEffect(() => {
    (async () => {
      const filepath = await getCliArgumentFilepath();
      viewer.setPath(filepath ?? null);
    })();
  }, []);

  return (
    <>
      <main class="size-full bg-background text-foreground">
        {viewer.image ? (
          <ImageView url={viewer.image.url} />
        ) : (
          <EmptyView
            message="No file selected"
            openFilePicker={filePicker.open}
          />
        )}
      </main>
      <Titlebar title={windowTitle} hidden={immersiveMode} />
    </>
  );
}
