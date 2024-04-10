import { PianoRollNote } from "@/types";
import { atom } from "jotai";
import { notesAtom, selectedNotesAtom } from "./note";
import jotai from "jotai";

export const noteModificationBufferAtom = atom({
  notesSelected: new Array<PianoRollNote>(),
  initX: 0,
  initY: 0,
});

function setBufferWithNoteAndPtrPos(
  set: jotai.Setter,
  pointerPos: { initX: number; initY: number },
  notes: PianoRollNote[],
) {
  set(noteModificationBufferAtom, {
    notesSelected: notes,
    initX: pointerPos.initX,
    initY: pointerPos.initY,
  });
}

export const setNoteModificationBufferWithSelectedNotesAtom = atom(
  null,
  (get, set, pointerPos: { initX: number; initY: number }) => {
    setBufferWithNoteAndPtrPos(set, pointerPos, get(selectedNotesAtom));
  },
);

export const setNoteModificationBufferWithAllNotesAtom = atom(
  null,
  (get, set, pointerPos: { initX: number; initY: number }) => {
    setBufferWithNoteAndPtrPos(set, pointerPos, get(notesAtom));
  },
);
