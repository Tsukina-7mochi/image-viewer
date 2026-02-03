import { convertFileSrc } from "@tauri-apps/api/core";
import * as dialog from "@tauri-apps/plugin-dialog";
import { useCallback, useMemo, useState } from "preact/hooks";

export function useFilePicker(): [
  { path: string; url: string } | null,
  {
    openFilePicker: () => void;
    setFilepath: (filepath: string | null) => void;
    renewFileUrl: () => void;
  },
] {
  const [filepath, setFilepath] = useState<string | null>(null);
  // create a state instead of calculating from filepath to generate a new url
  // with only new search parameter to reload image
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const openFilePicker = function () {
    (async () => {
      try {
        const result = await dialog.open({
          multiple: false,
          directory: false,
          fileAccessMode: "scoped",
          filters: [
            {
              // list from https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
              name: "Image",
              extensions: [
                "apng",
                "png",
                "avif",
                "jpg",
                "jpeg",
                "jfif",
                "pjpeg",
                "pjp",
                "svg",
                "webp",
                "bmp",
                "ico",
                "cur",
                "tif",
                "tiff",
              ],
            },
          ],
        });
        setFilepath(result);
        setFileUrl(result ? convertFileSrc(result) : null);
      } catch (e) {
        console.error(e);
      }
    })();
  };

  const renewFileUrl = useCallback(() => {
    const url = URL.parse(fileUrl as any);
    if (!url) return;
    url.search = `?{Date.now()}`;
    setFileUrl(url.toString());
  }, [fileUrl]);

  return [
    filepath && fileUrl
      ? {
          path: filepath,
          url: fileUrl,
        }
      : null,
    { openFilePicker, setFilepath, renewFileUrl },
  ];
}
