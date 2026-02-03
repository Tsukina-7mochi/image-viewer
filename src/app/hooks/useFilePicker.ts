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
  const [filepath, setFilepathRaw] = useState<string | null>(null);
  // create a state instead of calculating from filepath to generate a new url
  // with only new search parameter to reload image
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isPickerOpening, setPickerOpening] = useState(false);

  const setFilepath = function (filepath: string | null) {
    setFilepathRaw(filepath);
    setFileUrl(filepath ? convertFileSrc(filepath) : null);
  };

  const openFilePicker = useCallback(() => {
    if (isPickerOpening) return;
    setPickerOpening(true);

    (async () => {
      try {
        const result = await dialog.open({
          multiple: false,
          directory: false,
          fileAccessMode: "scoped",
          pickerMode: "image",
        });
        setPickerOpening(false);
        setFilepath(result);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isPickerOpening, setFilepath]);

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
