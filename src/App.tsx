import { useRef, useState } from 'react'
import './App.css'
import { PianoRoll, downloadMidi, useNoteModification } from "../packages/react-piano-roll";
import { usePianoRollNotes } from "../packages/react-piano-roll/dist";
import { useStore } from "../packages/react-piano-roll";

function App() {

  const pianoRollNote = usePianoRollNotes();
  const { pianoRollStore } = useStore()
  const { setSelectedNotesAsLegato } = useNoteModification()


  const [json, setJson] = useState(JSON.stringify({}))
  const [audio, setAudio] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const synthesis: React.MouseEventHandler = (event) => {
    console.log("trigger send")

    const newpianoRollLanesState = pianoRollStore.pianoRollNotes.map((note) => ({
      time: note.tick,
      duration: note.duration,
      lyric: note.lyric,
      noteNumber: note.noteNumber,
    }))

    const message = {
      bpm: pianoRollStore.bpm,
      notes: newpianoRollLanesState,
    }

    const newJsonMessage = JSON.stringify(message)
    if (newJsonMessage === json) {
      return
    }
    setJson(newJsonMessage)
    console.log(json)
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      ws.send(json);
    };

    let blob: Blob | undefined;
    let audioURL: string | undefined;

    ws.onmessage = (event) => {
      const arrayBuffer = event.data;
      blob = new Blob([arrayBuffer], { type: "audio/wav" });
      audioURL = URL.createObjectURL(blob);
      setAudio(audioURL)
    };

    console.log("message sent")
  }

  return (
    <>
      <audio controls src={audio} ref={audioRef} />
      <button onClick={synthesis}>Synthesis</button>
      <button onClick={() => downloadMidi(pianoRollNote)}>Download</button>
      <button onClick={setSelectedNotesAsLegato}>Set Legato</button>
      <PianoRoll attachLyric />
    </>
  )
}

export default App
