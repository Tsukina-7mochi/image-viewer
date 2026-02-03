import fileIcon from "../assets/icons/file.svg";
export function EmptyView(props: {
  message: string;
  openFilePicker: () => void;
}) {
  return (
    <div class="w-full h-full flex flex-col gap-4 p-4 items-center justify-center">
      <span>{props.message}</span>
      <button
        type="button"
        class="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 px-4 py-2 rounded flex items-center gap-2"
        onClick={props.openFilePicker}
      >
        <img src={fileIcon} alt="" class="inline" draggable={false} />
        <span>Choose File</span>
      </button>
    </div>
  );
}
