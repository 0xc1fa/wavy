import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PianoRollStoreProvider } from "react-piano-roll";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PianoRollStoreProvider>
      <App />
    </PianoRollStoreProvider>
  </React.StrictMode>,
);
