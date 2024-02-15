import { PianoRollStore, PianoRollStoreAction } from "@/store/pianoRollStore";
import { Dispatch, RefObject, useEffect } from "react";
import { useStore } from "@/hooks/useStore";

export function useHandleDelete<T extends HTMLElement>(ref: RefObject<T>) {
  const { pianoRollStore, dispatch } = useStore();

  useEffect(() => {
    const deleteWarper = (event: KeyboardEvent) => handleDelete(event, pianoRollStore, dispatch);
    ref.current!.addEventListener("keydown", deleteWarper);
    return () => {
      ref.current!.removeEventListener("keydown", deleteWarper);
    };
  }, []);
}

function handleDelete(event: KeyboardEvent, pianoRollStore: PianoRollStore, dispatch: Dispatch<PianoRollStoreAction>) {
  if (event.code === "Delete" || event.code === "Backspace") {
    console.log("delete")
    deleteNotes(event, pianoRollStore, dispatch);
  }
}

function deleteNotes(event: KeyboardEvent, pianoRollStore: PianoRollStore, dispatch: Dispatch<PianoRollStoreAction>) {
  let focusedElement = document.activeElement;
  let flag = true;

  if (focusedElement && focusedElement.hasAttributes()) {
    Array.from(focusedElement.attributes).forEach((attr) => {
      if (attr.name === "data-note-id") {
        if (pianoRollStore.notes.filter((note) => note.id === attr.value)) {
          flag = false;
        }
      }
    });
  }
  if (flag) {
    event.preventDefault();
    dispatch({ type: "DELETE_SELECTED_NOTES" });
  }
}
