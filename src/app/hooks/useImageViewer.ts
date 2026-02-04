import { convertFileSrc } from "@tauri-apps/api/core";
import { useCallback, useState } from "preact/hooks";

import * as api from "../../api";

type ImageViewer = {
  image: { path: string; url: string } | null;
  setPath: (path: string | null) => void;
  refreshUrl: () => void;
  nextImage: () => void;
  previousImage: () => void;
};

export function useImageViewer(): ImageViewer {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [currentPath, setCurrentPathRaw] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const setCurrentPath = useCallback(
    (path: string | null) => {
      setCurrentPathRaw(path);
      setCurrentUrl(path ? `${convertFileSrc(path)}?${Date.now()}` : null);

      (async () => {
        if (!path) return;
        const paths = await api.listFilesInSameDirectory(path);
        setImagePaths(paths);
      })();
    },
    [currentPath, currentUrl],
  );

  const refreshUrl = useCallback(() => {
    setCurrentPath(currentPath);
  }, [currentPath, setCurrentPath]);

  const nextImage = useCallback(() => {
    if (!currentPath) return;

    const currentIndex = imagePaths.indexOf(currentPath);
    const nextIndex = currentIndex + 1;
    if (currentIndex < 0 || nextIndex >= imagePaths.length) return;

    setCurrentPath(imagePaths[nextIndex]);
  }, [imagePaths, currentPath, setCurrentPath]);

  const previousImage = useCallback(() => {
    if (!currentPath) return;

    const currentIndex = imagePaths.indexOf(currentPath);
    const nextIndex = currentIndex - 1;
    if (currentIndex < 0 || nextIndex < 0) return;

    setCurrentPath(imagePaths[nextIndex]);
  }, [imagePaths, currentPath, setCurrentPath]);

  return {
    image:
      currentPath && currentUrl ? { path: currentPath, url: currentUrl } : null,
    setPath: setCurrentPath,
    refreshUrl,
    nextImage,
    previousImage,
  };
}
