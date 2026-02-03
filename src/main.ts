import { getMatches } from "@tauri-apps/plugin-cli";
import { h, render } from "preact";
import { App } from "./App";

window.addEventListener("DOMContentLoaded", () => {
  render(h(App, null, null), document.body);

  getMatches().then((matches) => console.log(matches));
});
