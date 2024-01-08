import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PianoRollStoreProvider } from "./components/PianoRoll/store/pianoRollStore.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PianoRollStoreProvider>
      <App />
    </PianoRollStoreProvider>
  </React.StrictMode>
  ,
)

import { Workbox } from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
}
