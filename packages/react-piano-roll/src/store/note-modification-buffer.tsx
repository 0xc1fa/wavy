import { PianoRollNote } from "@/types";
import { atom } from "jotai";
import { notesAtom, selectedNotesAtom } from "./note";

export const noteModificationBufferAtom = atom({
  notesSelected: new Array<PianoRollNote>(),
  initX: 0,
  initY: 0,
});

export const setNoteModificationBufferWithSelectedNotesAtom = atom(
  null,
  (get, set, pointerPos: { initX: number; initY: number }) => {
    set(noteModificationBufferAtom, {
      notesSelected: get(selectedNotesAtom),
      initX: pointerPos.initX,
      initY: pointerPos.initY,
    });
  },
);

export const setNoteModificationBufferWithAllNotesAtom = atom(
  null,
  (get, set, pointerPos: { initX: number; initY: number }) => {
    set(noteModificationBufferAtom, {
      notesSelected: get(notesAtom),
      initX: pointerPos.initX,
      initY: pointerPos.initY,
    });
  },
);
