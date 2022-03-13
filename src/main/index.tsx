import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import App from "./renderers/components/App";

ReactDOM.render(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <App />,
  document.getElementById("app-contents")
);
