import App from "./App";
import { AppContextProvider } from "./StateGeneric";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById("root")
);
