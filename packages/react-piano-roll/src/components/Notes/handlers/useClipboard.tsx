import { addNotesAtom, deleteSelectedNotesAtom, selectedNoteIdsAtom, selectedNotesAtom } from "@/store/note";
import { selectionRangeAtom, selectionTicksAtom } from "@/store/selection-ticks";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { PianoRollNote } from "@/types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Dispatch, RefObject, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";

export function useClipboard<T extends HTMLElement>(ref: RefObject<T>) {
  const { clipboard, clipboardDispatch } = useClipboardReducer();
  const selectedNotes = useAtomValue(selectedNotesAtom);
  const [selectionTicks, setSelectionTicks] = useAtom(selectionTicksAtom);
  const [selectionRange, setSelectionRange] = useAtom(selectionRangeAtom);
  const [_, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const setterGroup = {
    addNotes: useSetAtom(addNotesAtom),
    setSelectionTicks,
    setSelectionRange,
  };
  const deleteSelectedNotes = useSetAtom(deleteSelectedNotesAtom);
  const copyWarper = (event: KeyboardEvent) => {
    if (event.metaKey && event.code === "KeyC") {
      event.preventDefault();
      event.stopPropagation();
      copyNotes(selectedNotes, selectionRange, clipboardDispatch);
    }
  };
  const pasteWarper = (event: KeyboardEvent) => {
    if (event.metaKey && event.code === "KeyV") {
      event.preventDefault();
      event.stopPropagation();
      if (selectionTicks === null) {
        return;
      }

      if (clipboard.notes.length === 0) {
        return;
      }
      const shiftedNotes = clipboard.notes.map((note) => ({
        ...note,
        id: uuidv4(),
        tick: selectionTicks! + note.tick,
      }));
      setSelectedNoteIds(new Set());
      setterGroup.addNotes(shiftedNotes);

      setterGroup.setSelectionTicks(selectionTicks! + clipboard.selectionWidth);
      setterGroup.setSelectionRange(
        selectionRange ? (selectionRange.map((item) => item + clipboard.selectionWidth) as [number, number]) : null,
      );
      // pasteNotes(selectionTicks, selectionRange, clipboard, setterGroup);
    }
  };
  const cutWarper = (event: KeyboardEvent) => {
    if (event.metaKey && event.code === "KeyX") {
      event.preventDefault();
      event.stopPropagation();
      copyNotes(selectedNotes, selectionRange, clipboardDispatch);
      deleteSelectedNotes();
    }
  };

  useEffect(() => {
    ref.current!.addEventListener("keydown", copyWarper);
    ref.current!.addEventListener("keydown", cutWarper);
    ref.current!.addEventListener("keydown", pasteWarper);

    return () => {
      ref.current!.removeEventListener("keydown", copyWarper);
      ref.current!.removeEventListener("keydown", cutWarper);
      ref.current!.removeEventListener("keydown", pasteWarper);
    };
  });
}

function copyNotes(
  selectedNotes: PianoRollNote[],
  selectionRange: [number, number] | null,
  clipboardDispatch: Dispatch<ClipboardAction>,
) {
  if (selectedNotes.length === 0) {
    return;
  }

  let totalSelectionRange = getSelectionRangeWithSelectedNotes(selectedNotes, selectionRange!);
  clipboardDispatch({
    type: "setNote",
    payload: { notes: selectedNotes, selectedRange: totalSelectionRange },
  });
}

function pasteNotes(
  selectionTicks: number | null,
  selectionRange: [number, number] | null,
  clipboard: Clipboard,
  storeDispatch: {
    unselectAllNotes: () => void;
    addNotes: (notes: PianoRollNote[]) => void;
    setSelectionTicks: (ticks: number) => void;
    setSelectionRange: (range: [number, number] | null) => void;
  },
) {
  if (selectionTicks === null) {
    return;
  }

  if (clipboard.notes.length === 0) {
    return;
  }
  const shiftedNotes = clipboard.notes.map((note) => ({
    ...note,
    tick: selectionTicks! + note.tick,
  }));
  storeDispatch.unselectAllNotes();
  storeDispatch.addNotes(shiftedNotes);

  storeDispatch.setSelectionTicks(selectionTicks! + clipboard.selectionWidth);
  storeDispatch.setSelectionRange(
    selectionRange ? (selectionRange.map((item) => item + clipboard.selectionWidth) as [number, number]) : null,
  );
}

export function useClipboardReducer() {
  const defaultClipboard: Clipboard = {
    notes: [],
    selectionWidth: 0,
  };
  const [clipboard, clipboardDispatch] = useReducer(clipboardReducer, defaultClipboard);
  return { clipboard, clipboardDispatch };
}

type Clipboard = {
  notes: PianoRollNote[];
  selectionWidth: number;
};

type ClipboardAction = {
  type: "setNote";
  payload: {
    notes: PianoRollNote[];
    selectedRange: [number, number];
  };
};

function clipboardReducer(state: Clipboard, action: ClipboardAction) {
  switch (action.type) {
    case "setNote":
      const selectionTicks = getSelectionRangeWithSelectedNotes(action.payload.notes, action.payload.selectedRange);
      return {
        notes: action.payload.notes.map((note) => ({
          ...note,
          tick: note.tick - selectionTicks[0],
        })),
        selectionWidth: selectionTicks[1] - selectionTicks[0],
      };
    default:
      throw new Error("Invalid action type");
  }
}
