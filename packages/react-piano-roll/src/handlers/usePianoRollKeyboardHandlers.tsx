import { useRef } from "react";
import { useStore } from "@/hooks/useStore";
import {
  useNotes,
} from "../helpers/notes";
import _ from "lodash";


export default function usePianoRollKeyboardHandlers(onSpace?: (event: React.KeyboardEvent) => void) {
  const { pianoRollStore, dispatch } = useStore();
  const notes = useNotes();

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

  return {
    onKeyDown,
    onKeyUp,
  };
}
