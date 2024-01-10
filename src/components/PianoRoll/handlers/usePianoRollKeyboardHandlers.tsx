import { useEffect, useReducer, useRef, useState } from "react";
import { usePianoRollDispatch } from "../hooks/usePianoRollDispatch";
import useStore from "../hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { getEndingTickFromNotes, getSelectedNotes, getStartingTickFromNotes, usePianoRollNotes } from "../helpers/notes";

type SelectionRegion = {
  start: number,
  width: number,
}

type Clipboard = {
  notes: TrackNoteEvent[],
  selectionRegion: SelectionRegion,
}

type ClipboardAction =
  | { type: 'setNote', payload: { notes: TrackNoteEvent[] } }

function clipboardReducer(state: Clipboard, action: ClipboardAction) {
  switch (action.type) {
    case 'setNote':
      return {
        notes: action.payload.notes,
        selectionRegion: {
          start: getStartingTickFromNotes(action.payload.notes),
          width: getEndingTickFromNotes(action.payload.notes) - getStartingTickFromNotes(action.payload.notes)
        }
      }
    default:
      throw new Error('Invalid action type');
  }
}

export default function usePianoRollKeyboardHandlers(
  onSpace?: (event: React.KeyboardEvent) => void,
) {

  const dispatch = usePianoRollDispatch()
  const { pianoRollStore } = useStore();
  const pianoRollNotes = usePianoRollNotes()
  const [clipboard, clipboardDispatch] = useReducer(clipboardReducer, { notes: [], selectionRegion: { start: 0, width: 0 } })

  let spaceDown = useRef(false)

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
        case "KeyZ": {
          if (event.shiftKey) {
            dispatch({ type: 'REDO' })
          } else {
            dispatch({ type: 'UNDO' })
          }
        }
      }
    }
  }

  const onKeyUp: React.KeyboardEventHandler = (event) => {
    switch (event.code) {
      case "Space": spaceDown.current = false; break;
    }
  }

  const onDeleteDown = (event: React.KeyboardEvent) => {
    dispatch({ type: 'deleteSelectedNotes' })
  }

  const onSpaceDown = (event: React.KeyboardEvent) => {
    onSpace?.(event)
  }

  const onCopy = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();

    const selectedNotes = getSelectedNotes(pianoRollNotes)
    if (selectedNotes.length > 0) {
      clipboardDispatch({ type: 'setNote', payload: { notes: selectedNotes } })
    }
  }

  const onCut = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();
    const selectedNotes = getSelectedNotes(pianoRollNotes)

    if (selectedNotes.length > 0) {
      clipboardDispatch({ type: 'setNote', payload: { notes: selectedNotes } })
    }
    dispatch({ type: 'deleteSelectedNotes' })
  }

  const onPaste = (event: React.KeyboardEvent) => {
    console.log('copying...')
    event.preventDefault();
    event.stopPropagation();

    if (clipboard.notes.length === 0) {
      return;
    }
    const shiftedNotes = clipboard.notes
      .map(note => ({
        ...note,
        tick: pianoRollStore.selectionTicks + (note.tick - clipboard.selectionRegion.start)
      }))
    dispatch({ type: 'unselectAllNotes' })
    dispatch({ type: 'addNotes', payload: { notes: shiftedNotes } })
  }

  return {
    onKeyDown,
    onKeyUp
  }
}