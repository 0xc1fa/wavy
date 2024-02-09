import { useEffect, useReducer, useRef, useState } from "react";
import { useStore } from "@/hooks/useStore";
import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import {
  focusNote,
  getEndingTickFromNotes,
  getSelectionRangeWithSelectedNotes,
  getStartingTickFromNotes,
  useNotes,
} from "../helpers/notes";
import _ from "lodash";
import { useClipboard, useClipboardReducer } from "@/hooks/useClipboard";


export default function usePianoRollKeyboardHandlers(onSpace?: (event: React.KeyboardEvent) => void) {
  const { pianoRollStore, dispatch } = useStore();
  const notes = useNotes();
  const { clipboard, clipboardDispatch } = useClipboardReducer();

  let spaceDown = useRef(false);

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    switch (event.code) {
      case "Backspace":
      case "Delete":
        onDeleteDown(event);
        break;
      case "Space":
        onSpaceDown(event);
        break;
    }
    if (event.metaKey) {
      switch (event.code) {
        // case "KeyX":
        //   onCopy(event);
        //   dispatch({ type: "DELETE_SELECTED_NOTES" });
        //   break;
        // case "KeyC":
        //   onCopy(event);
        //   break;
        // case "KeyV":
        //   onPaste(event);
        //   break;
        case "KeyZ": {
          if (event.shiftKey) {
            dispatch({ type: "REDO" });
          } else {
            dispatch({ type: "UNDO" });
          }
        }
      }
    }
  };

  const onKeyUp: React.KeyboardEventHandler = (event) => {
    switch (event.code) {
      case "Space":
        spaceDown.current = false;
        break;
    }
  };

  const onDeleteDown = (event: React.KeyboardEvent) => {
    let focusedElement = document.activeElement;
    let flag = true;

    if (focusedElement && focusedElement.hasAttributes()) {
      Array.from(focusedElement.attributes).forEach((attr) => {
        if (attr.name === "data-noteid") {
          if (notes.filter((note) => note.id === attr.value)) {
            flag = false;
          }
        }
      });
    }
    if (flag) {
      event.preventDefault();
      dispatch({ type: "DELETE_SELECTED_NOTES" });
    }
  };

  const onSpaceDown = (event: React.KeyboardEvent) => {
    onSpace?.(event);
  };

  const onCopy = (event: React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (pianoRollStore.selectedNotes().length === 0) {
      return;
    }

    let selectionRange = getSelectionRangeWithSelectedNotes(
      pianoRollStore.selectedNotes(),
      pianoRollStore.selectionRange!,
    );
    clipboardDispatch({
      type: "setNote",
      payload: { notes: pianoRollStore.selectedNotes(), selectedRange: selectionRange },
    });
  };

  const onPaste = (event: React.KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (pianoRollStore.selectionTicks === null) {
      return;
    }

    if (clipboard.notes.length === 0) {
      return;
    }
    const shiftedNotes = clipboard.notes.map((note) => ({
      ...note,
      tick: pianoRollStore.selectionTicks! + note.tick,
    }));
    dispatch({ type: "UNSELECTED_ALL_NOTES" });
    dispatch({ type: "ADD_NOTES", payload: { notes: shiftedNotes } });
    dispatch({
      type: "SET_SELECTION_TICKS",
      payload: { ticks: pianoRollStore.selectionTicks! + clipboard.selectionWidth },
    });
    dispatch({
      type: "SET_SELECTION_RANGE",
      payload: {
        range: pianoRollStore.selectionRange
          ? (pianoRollStore.selectionRange.map((item) => item + clipboard.selectionWidth) as [number, number])
          : null,
      },
    });
  };

  return {
    onKeyDown,
    onKeyUp,
  };
}
