import { deleteSelectedNotesAtom, notesAtom } from "@/store/note";
import { PianoRollNote } from "@/types";
import { useAtom, useSetAtom } from "jotai";
import { Dispatch, RefObject, useEffect } from "react";

export function useHandleDelete<T extends HTMLElement>(ref: RefObject<T>) {
  const [notes] = useAtom(notesAtom);
  const deleteSelectedNotes = useSetAtom(deleteSelectedNotesAtom);
  useEffect(() => {
    const deleteWarper = (event: KeyboardEvent) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        deleteNotes(event, notes, deleteSelectedNotes);
      }
    };
    ref.current!.addEventListener("keydown", deleteWarper);
    return () => {
      ref.current!.removeEventListener("keydown", deleteWarper);
    };
  }, []);
}

function deleteNotes(event: KeyboardEvent, notes: PianoRollNote[], deleteSelectedNotes: () => void) {
  let focusedElement = document.activeElement;
  let flag = true;

  if (focusedElement && focusedElement.hasAttributes()) {
    Array.from(focusedElement.attributes).forEach((attr) => {
      if (attr.name === "data-note-id") {
        if (notes.filter((note) => note.id === attr.value)) {
          flag = false;
        }
      }
    });
  }
  if (flag) {
    event.preventDefault();
    deleteSelectedNotes();
  }
}
