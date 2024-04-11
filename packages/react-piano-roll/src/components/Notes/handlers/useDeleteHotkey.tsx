import { useEventListener } from "@/hooks/useEventListener";
import { deleteSelectedNotesAtom, notesAtom } from "@/store/note";
import { PianoRollNote } from "@/types";
import { useAtom, useSetAtom } from "jotai";
import { RefObject } from "react";

export function useDeleteHotkey<T extends HTMLElement>(ref: RefObject<T>) {
  const [notes] = useAtom(notesAtom);
  const deleteSelectedNotes = useSetAtom(deleteSelectedNotesAtom);

  useEventListener(ref, "keydown", (event: KeyboardEvent) => {
    if (!(event.code === "Delete" || event.code === "Backspace")) {
      return;
    }
    if (isEditingNoteLyric(notes)) {
      event.preventDefault();
      deleteSelectedNotes();
    }
  });
}

function isEditingNoteLyric(notes: PianoRollNote[]) {
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
  return flag;
}
