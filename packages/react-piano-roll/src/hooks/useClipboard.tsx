import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { TrackNoteEvent } from "@/types";
import { Dispatch, RefObject, useEffect, useReducer } from "react";
import { useStore } from "..";
import { PianoRollStore, PianoRollStoreAction } from "@/store/pianoRollStore";

export function useClipboard<T extends HTMLElement>(ref: RefObject<T>) {
  const {clipboard, clipboardDispatch} = useClipboardReducer();
  const {pianoRollStore, dispatch} = useStore();
  const copyWarper = (event: KeyboardEvent) => handleCopy(event, pianoRollStore, clipboardDispatch)
  const pasteWarper = (event: KeyboardEvent) => handlePaste(event, pianoRollStore, clipboard, dispatch)
  const cutWarper = (event: KeyboardEvent) => handleCut(event, pianoRollStore, clipboardDispatch, dispatch)

  useEffect(() => {
    ref.current!.addEventListener("keydown", copyWarper);
    ref.current!.addEventListener("keydown", cutWarper);
    ref.current!.addEventListener("keydown", pasteWarper);

    return () => {
      ref.current!.removeEventListener("keydown", copyWarper);
      ref.current!.removeEventListener("keydown", cutWarper);
      ref.current!.removeEventListener("keydown", pasteWarper);
    }
  })

}

function handleCopy(event: KeyboardEvent, pianoRollStore: PianoRollStore, clipboardDispatch: Dispatch<ClipboardAction>) {
  if (event.metaKey && event.code === "KeyC") {
    event.preventDefault();
    event.stopPropagation();
    copyNotes(pianoRollStore, clipboardDispatch);
  }
}

function copyNotes(pianoRollStore: PianoRollStore, clipboardDispatch: Dispatch<ClipboardAction>) {
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
}

function handleCut(event: KeyboardEvent, pianoRollStore: PianoRollStore, clipboardDispatch: Dispatch<ClipboardAction>, storeDispatch: Dispatch<PianoRollStoreAction>) {
  if (event.metaKey && event.code === "KeyX") {
    event.preventDefault();
    event.stopPropagation();
    copyNotes(pianoRollStore, clipboardDispatch);
    storeDispatch({ type: "DELETE_SELECTED_NOTES" });
  }
}

function handlePaste(event: KeyboardEvent, pianoRollStore: PianoRollStore, clipboard: Clipboard, storeDispatch: Dispatch<PianoRollStoreAction>) {
  if (event.metaKey && event.code === "KeyV") {
    event.preventDefault();
    event.stopPropagation();
    pasteNotes(pianoRollStore, clipboard, storeDispatch);
  }
}

function pasteNotes(pianoRollStore: PianoRollStore, clipboard: Clipboard, storeDispatch: Dispatch<PianoRollStoreAction>) {
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
  storeDispatch({ type: "UNSELECTED_ALL_NOTES" });
  storeDispatch({ type: "ADD_NOTES", payload: { notes: shiftedNotes } });
  storeDispatch({
    type: "SET_SELECTION_TICKS",
    payload: { ticks: pianoRollStore.selectionTicks! + clipboard.selectionWidth },
  });
  storeDispatch({
    type: "SET_SELECTION_RANGE",
    payload: {
      range: pianoRollStore.selectionRange
        ? (pianoRollStore.selectionRange.map((item) => item + clipboard.selectionWidth) as [number, number])
        : null,
    },
  });
}

export function useClipboardReducer() {
  const defaultClipboard: Clipboard = {
    notes: [],
    selectionWidth: 0,
  }
  const [clipboard, clipboardDispatch] = useReducer(clipboardReducer, defaultClipboard);
  return { clipboard, clipboardDispatch };
}

type Clipboard = {
  notes: TrackNoteEvent[];
  selectionWidth: number;
};

type ClipboardAction = {
  type: "setNote";
  payload: {
    notes: TrackNoteEvent[];
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