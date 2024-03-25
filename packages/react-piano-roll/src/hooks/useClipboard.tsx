import { addNotesAtom, deleteSelectedNotesAtom, selectedNoteIdsAtom, selectedNotesAtom } from "@/store/note";
import { selectionRangeAtom, selectionTicksAtom } from "@/store/selection-ticks";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { PianoRollNote } from "@/types";
import { useAtom, useSetAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { create as createZustand } from "zustand";
import { create } from "mutative";

export function useCut() {
  const copy = useCopy();
  const deleteSelectedNotes = useSetAtom(deleteSelectedNotesAtom);

  return () => {
    copy();
    deleteSelectedNotes();
  };
}

export function useCopy() {
  const [selectedNotes] = useAtom(selectedNotesAtom);
  const [selectionRange] = useAtom(selectionRangeAtom);
  const { setNotes } = useClipboardStore();

  return () => {
    if (selectedNotes.length === 0) return;

    let totalSelectionRange = getSelectionRangeWithSelectedNotes(selectedNotes, selectionRange!);
    setNotes(selectedNotes, totalSelectionRange);
  };
}

export function usePaste() {
  const [selectionTicks, setSelectionTicks] = useAtom(selectionTicksAtom);
  const { notes, selectionWidth } = useClipboardStore();
  const setSelectedNoteIds = useSetAtom(selectedNoteIdsAtom);
  const addNotes = useSetAtom(addNotesAtom);
  const [selectionRange, setSelectionRange] = useAtom(selectionRangeAtom);

  return () => {
    if (selectionTicks === null || notes.length === 0) return;

    const shiftedNotes = notes.map((note) => ({
      ...note,
      id: uuidv4(),
      tick: selectionTicks! + note.tick,
    }));
    setSelectedNoteIds(new Set());
    addNotes(shiftedNotes);
    setSelectionTicks(selectionTicks! + selectionWidth);
    setSelectionRange(
      selectionRange ? (selectionRange.map((item) => item + selectionWidth) as [number, number]) : null,
    );
  };
}

type Clipboard = {
  notes: PianoRollNote[];
  selectionWidth: number;
  setNotes(notes: PianoRollNote[], selectedRange: [number, number]): void;
};

const useClipboardStore = createZustand<Clipboard>((set) => ({
  notes: [],
  selectionWidth: 0,
  setNotes: (notes: PianoRollNote[], selectedRange: [number, number]) => {
    const selectionTicks = getSelectionRangeWithSelectedNotes(notes, selectedRange);
    const noteDraft = create(notes, (draft) => {
      draft.forEach((note) => (note.tick -= selectionTicks[0]));
    });
    set({
      notes: noteDraft,
      selectionWidth: selectionTicks[1] - selectionTicks[0],
    });
  },
}));
