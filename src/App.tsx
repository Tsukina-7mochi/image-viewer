import "preact/debug";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { getCliArgumentFilepath } from "./api";
import { EmptyView } from "./app/EmptyView";
import { useCurrentWindow } from "./app/hooks/useCurrentWindow";
import { useFilePicker } from "./app/hooks/useFilePicker";
import { useKeydown } from "./app/hooks/useKeydown";
import { useListFilesInSameDirectory } from "./app/hooks/useListFilesInSameDirectory";
import { ImageView } from "./app/ImageView";
import { Titlebar } from "./app/Titlebar";

export function App() {
  const appWindow = useCurrentWindow();
  const [file, { openFilePicker, setFilepath }] = useFilePicker();
  const filepath = useMemo(() => file?.path ?? null, [file]);
  const fileUrl = useMemo(() => file?.url ?? null, [file]);
  const windowTitle = useMemo(() => filepath ?? "Image Viewer", [filepath]);
  const filesInSameDirectory = useListFilesInSameDirectory(filepath);
  const [immersiveMode, setImmersiveMode] = useState(false);

  const openNextImage = useCallback(() => {
    console.log(filepath, filesInSameDirectory);
    if (!filepath) return;

    const index = filesInSameDirectory.indexOf(filepath);
    const newIndex = index + 1;
    if (index < 0 || newIndex >= filesInSameDirectory.length) return;

    setFilepath(filesInSameDirectory[newIndex]);
  }, [filepath, filesInSameDirectory]);

  const openPreviousImage = useCallback(() => {
    if (!filepath) return;

    const index = filesInSameDirectory.indexOf(filepath);
    const newIndex = index - 1;
    if (index < 0 || newIndex < 0) return;

    setFilepath(filesInSameDirectory[newIndex]);
  }, [filepath, filesInSameDirectory]);

  const closeWindow = useCallback(() => appWindow.close(), [appWindow]);

  const reloadImage = useCallback(() => {
    setFilepath(filepath);
  }, [filepath]);

  const toggleImmersiveMode = useCallback(() => {
    setImmersiveMode((prev) => !prev);
  }, [immersiveMode]);

  useEffect(() => {
    appWindow.setTitle(windowTitle);
  }, [windowTitle]);
  useKeydown({ key: "ArrowRight" }, openNextImage);
  useKeydown({ key: "ArrowLeft" }, openPreviousImage);
  useKeydown({ key: "r", ctrlKey: true }, reloadImage);
  useKeydown({ key: "o", ctrlKey: true }, openFilePicker);
  useKeydown({ key: "w", ctrlKey: true }, closeWindow);
  useKeydown({ key: "F11" }, toggleImmersiveMode);

  useEffect(() => {
    (async () => {
      const filepath = await getCliArgumentFilepath();
      if (!filepath) return;
      console.log(filepath);
      setFilepath(filepath);
    })();
  }, []);

  return (
    <>
      <Titlebar title={windowTitle} autoHide={immersiveMode} />
      <main class="size-full bg-background text-foreground">
        {fileUrl ? (
          <ImageView url={fileUrl} />
        ) : (
          <EmptyView
            message="No file selected"
            openFilePicker={openFilePicker}
          />
        )}
      </main>
    </>
  );
}
