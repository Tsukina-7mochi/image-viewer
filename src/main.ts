import { h, render } from "preact";
import { App } from "./App";

window.addEventListener("DOMContentLoaded", () => {
  render(h(App, null, null), document.body);
});
