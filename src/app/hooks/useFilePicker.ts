import * as dialog from "@tauri-apps/plugin-dialog";
import { useCallback, useState } from "preact/hooks";

type FilePicker = {
  open: () => void;
};

export function useFilePicker(
  onSelect: (path: string | null) => void,
): FilePicker {
  const [isPickerOpening, setPickerOpening] = useState(false);

  const open = useCallback(() => {
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
        onSelect(result);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [onSelect, isPickerOpening]);

  return { open };
}
