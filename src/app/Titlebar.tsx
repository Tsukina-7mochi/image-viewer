import closeIcon from "../assets/icons/close.svg";
import maximizeIcon from "../assets/icons/window-maximize.svg";
import minimizeIcon from "../assets/icons/window-minimize.svg";
import { useCurrentWindow } from "./hooks/useCurrentWindow";

function Title(props: { text: string }) {
  return (
    <div data-tauri-drag-region class="grow px-4 truncate">
      {props.text}
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
    props.interactionStyles ?? "hover:bg-white/5 active:bg-white/10";

  return (
    <button
      type="button"
      title={props.title}
      onClick={props.onClick}
      class={`w-12 h-full text-center ${interactionStyles}`}
    >
      <img
        src={props.icon}
        alt=""
        class="inline-block h-4 text-foreground"
        draggable={false}
      />
    </button>
  );
}

export function Titlebar(props: { title: string; hidden?: boolean }) {
  const appWindow = useCurrentWindow();

  const colorStyles =
    "trainsition duration-150 ease-in-out bg-none text-foreground hover:bg-background/40";
  const visibilityStyles = props.hidden ? "hidden" : "";

  return (
    <div data-tauri-drag-region class="fixed left-0 right-0 top-0 h-8">
      <div
        class={`size-full flex items-center text-xs ${colorStyles} ${visibilityStyles}`}
      >
        <Title text={props.title} />
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
    </div>
  );
}
