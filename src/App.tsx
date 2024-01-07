import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PianoRoll from "@/components/PianoRoll/components";
import usePreventZoom from "./components/PianoRoll/hooks/usePreventZoom";
import { usePianoRollNotes } from "./components/PianoRoll/helpers/notes";

import midi from '@/components/PianoRoll/helpers/midi';
import { usePianoRollDispatch } from "./components/PianoRoll/hooks/usePianoRollDispatch";

function App() {
  const [count, setCount] = useState(0)
  const pianoRollNote = usePianoRollNotes();
  const dispatch = usePianoRollDispatch();

  const downloadMidi = () => {

    const buffer = midi(pianoRollNote)
    const blob = new Blob([buffer], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'music.mid';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const setLegato = () => {
    let selectedNote = pianoRollNote.filter(note => note.isSelected).sort((a, b) => a.tick - b.tick)
    for (let i = 0; i < selectedNote.length - 1; i++) {
      selectedNote[i].duration = selectedNote[i + 1].tick - selectedNote[i].tick
    }
    dispatch({ type: 'modifiedNotes', payload: { notes: selectedNote }})
    console.log('set legato')
  }

  return (
    <>
      <button onClick={downloadMidi}>Download</button>
      <button onClick={setLegato}>Set Legato</button>
      <PianoRoll attachLyric />
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
