import closeIcon from "../assets/icons/close.svg";
import maximizeIcon from "../assets/icons/window-maximize.svg";
import minimizeIcon from "../assets/icons/window-minimize.svg";
import { useCurrentWindow } from "./hooks/useCurrentWindow";

function Title() {
  return (
    <div
      data-tauri-drag-region
      class="grow px-4 truncate opacity-0 group-hover:opacity-100"
    >
      Image Viewer
    </div>
  );
}

function IconButton(props: {
  icon: string;
  title: string;
  onClick: () => void;
  interactionStyles?: string;
}) {
  const interactionStyles =
    props.interactionStyles ??
    "hover:bg-background-hover active:bg-background-active";

  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      class={`w-15 h-full text-center hover:bg-background-hover ${interactionStyles}`}
    >
      <img
        src={props.icon}
        alt=""
        class="inline-block h-6 text-foreground"
        draggable={false}
      />
    </button>
  );
}

export function Titlebar() {
  const appWindow = useCurrentWindow();

  return (
    <div
      data-tauri-drag-region
      class="group flex fixed left-0 right-0 top-0 h-10 items-center bg-none text-foreground hover:bg-background-secondary"
    >
      <Title />
      <IconButton
        icon={minimizeIcon}
        title="Minimize"
        onClick={() => appWindow.minimize()}
      />
      <IconButton
        icon={maximizeIcon}
        title="Maximize"
        onClick={() => appWindow.toggleMaximize()}
      />
      <IconButton
        icon={closeIcon}
        title="Close"
        onClick={() => appWindow.close()}
        interactionStyles="hover:bg-red-600 active:bg-red-700"
      />
    </div>
  );
}
