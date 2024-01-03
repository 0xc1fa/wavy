import { useEffect, useRef, useState } from "react";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";

type Clipboard = {
  notes: TrackNoteEvent[]
  region: { start: number, end: number }
}

export default function usePianoRollKeyboardHandlers(
  onSpace?: (event: React.KeyboardEvent) => void,
) {

  const dispatch = usePianoRollDispatch()
  const { pianoRollStore } = useStore();
  const [clipboard, setClipboard] = useState<Clipboard>({ notes: [], region: { start: 0, end: 0 } });
  let spaceDown = useRef(false)

  let intervalRef = useRef<NodeJS.Timeout>();

  // const calculateInterval = () => ((1 / pianoRollStore.tickPerBeat) /pianoRollStore.bpm) * 600000

  const calculateInterval = () => 1

  useEffect(() => {
    if (pianoRollStore.isPlaying) {

      const tickInterval = calculateInterval();
      intervalRef.current = setInterval(() => {
        console.log(pianoRollStore.currentTicks)
        dispatch({ type: 'incrementTicksByOne' })
      }, tickInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }


    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pianoRollStore.isPlaying, pianoRollStore.bpm, pianoRollStore.tickPerBeat]);

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    console.log(event)
    switch (event.code) {
      case "Backspace":
      case "Delete": onDeleteDown(event); break;
      case "Space": onSpaceDown(event); break;
    }
    if (event.metaKey) {
      switch (event.code) {
        case "KeyX": onCut(event); break;
        case "KeyC": onCopy(event); break;
        case "KeyV": onPaste(event); break;

      }
    }
  }

  const onKeyUp: React.KeyboardEventHandler = (event) => {
    switch (event.code) {
      case "Space": spaceDown.current = false; break;
    }
  }

  const onDeleteDown = (event: React.KeyboardEvent) => {
    // event.preventDefault()
    // event.stopPropagation()
  }

  const onSpaceDown = (event: React.KeyboardEvent) => {
    // event.preventDefault()
    // event.stopPropagation()
    onSpace?.(event)
  }

  const onCopy = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();
    const selectedNotes = pianoRollStore.pianoRollNotes.filter(note => note.isSelected);
    if (selectedNotes.length > 0) {

      // setClipboard(selectedNotes)
    }
  }

  const onCut = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();
    const selectedNotes = pianoRollStore.pianoRollNotes.filter(note => note.isSelected);

    if (selectedNotes.length > 0) {

    }
    dispatch({ type: 'deleteSelectedNotes' })
  }

  const onPaste = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();
  }



  return {
    onKeyDown,
    onKeyUp
  }
}