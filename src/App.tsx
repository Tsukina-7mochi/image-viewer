import "preact/debug";

import { Titlebar } from "./app/Titlebar";
import { ImageView } from "./app/ImageView";
import { EmptyView } from "./app/EmptyView";
import { useFilePicker } from "./app/hooks/useFilePicker";

export function App() {
  const [fileUrl, pickFile] = useFilePicker();

  return (
    <>
      <Titlebar />
      <main class="size-full bg-background text-foreground">
        {fileUrl ? (
          <ImageView url={fileUrl} />
        ) : (
          <EmptyView message="No file selected" pickFile={pickFile} />
        )}
      </main>
    </>
  );
}
