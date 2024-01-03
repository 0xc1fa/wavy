import { useEffect, useRef } from "react";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";

export default function usePianoRollKeyboardHandlers(
  onSpace?: (event: React.KeyboardEvent) => void,
) {

  const dispatch = usePianoRollDispatch()
  const { pianoRollStore } = useStore();
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
    switch (event.code) {
      case "Backspace":
      case "Delete": onDeleteDown(event); break;
      case "Space": onSpaceDown(event); break;
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


  return {
    onKeyDown,
    onKeyUp
  }
}