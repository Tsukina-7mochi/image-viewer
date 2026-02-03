import "preact/debug";
import { useCallback, useEffect, useMemo } from "preact/hooks";

import { Titlebar } from "./app/Titlebar";
import { ImageView } from "./app/ImageView";
import { EmptyView } from "./app/EmptyView";
import { useFilePicker } from "./app/hooks/useFilePicker";
import { useCurrentWindow } from "./app/hooks/useCurrentWindow";
import { useListFilesInSameDirectory } from "./app/hooks/useListFilesInSameDirectory";
import { useKeydown } from "./app/hooks/useKeydown";

export function App() {
  const appWindow = useCurrentWindow();
  const [file, { openFilePicker, setFilepath, renewFileUrl }] = useFilePicker();
  const filepath = useMemo(() => file?.path ?? null, [file]);
  const fileUrl = useMemo(() => file?.url ?? null, [file]);
  const windowTitle = useMemo(() => filepath ?? "Image Viewer", [filepath]);
  const filesInSameDirectory = filepath
    ? useListFilesInSameDirectory(filepath)
    : [];

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

  const closeWindow = useCallback(() => appWindow.close());

  useEffect(() => {
    appWindow.setTitle(windowTitle);
  }, [windowTitle]);
  useKeydown({ key: "ArrowRight" }, openNextImage);
  useKeydown({ key: "ArrowLeft" }, openPreviousImage);
  useKeydown({ key: "r", ctrlKey: true }, renewFileUrl);
  useKeydown({ key: "o", ctrlKey: true }, openFilePicker);
  useKeydown({ key: "w", ctrlKey: true }, closeWindow);

  return (
    <>
      <Titlebar title={windowTitle} />
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
