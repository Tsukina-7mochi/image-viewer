import { useEffect, useState } from "preact/hooks";

import * as api from "../../api";

export function useListFilesInSameDirectory(filepath: string): string[] {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await api.listFilesInSameDirectory(filepath);
        console.log(filepath, result);
        setList(result);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [filepath]);

  return list;
}
