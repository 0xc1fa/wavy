import React from 'react';
import logo from './logo.svg';
import './App.css';
import PianoRoll from "react-piano-roll/src";
import { PianoRollStoreProvider } from "react-piano-roll/src/store/pianoRollStore"

function App() {
  return (
    <div className="App">
      <PianoRollStoreProvider>
        <PianoRoll attachLyric />
      </PianoRollStoreProvider>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
