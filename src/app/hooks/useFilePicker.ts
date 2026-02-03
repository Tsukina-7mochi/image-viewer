import { convertFileSrc } from "@tauri-apps/api/core";
import * as dialog from "@tauri-apps/plugin-dialog";
import { useMemo, useState } from "preact/hooks";

export function useFilePicker(): [string | null, () => void] {
  const [filepath, setFilePath] = useState<string | null>(null);
  const fileUrl = useMemo(() => {
    if (!filepath) return null;
    return convertFileSrc(filepath);
  }, [filepath]);

  const pickFile = function () {
    (async () => {
      const result = await dialog.open({
        multiple: false,
        directory: false,
        fileAccessMode: "scoped",
      });
      setFilePath(result);
    })();
  };

  return [fileUrl, pickFile];
}
