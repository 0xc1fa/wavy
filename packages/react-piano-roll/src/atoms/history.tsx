import { TrackNoteEvent } from "@/types";
import { atom } from "jotai";
import { notesAtom } from "./note";

export enum PianoRollHistoryItemType {
  ADD_NOTE,
  DELETE_NOTE,
  MODIFY_NOTE,
}

export type PianoRollHistoryItem = {
  type: PianoRollHistoryItemType;
  note: TrackNoteEvent[];
};

export type NotesHistory = {
  head: number;
  history: PianoRollHistoryItem[]
}

export const notesHistoryAtom = atom<NotesHistory>({
  head: -1,
  history: new Array<PianoRollHistoryItem>(),
})

export const undoHistoryAtom = atom(null, (get, set) => {
  const { history, head }= get(notesHistoryAtom)
  const edgeCases = history.length === 0 || head === -1;
  if (edgeCases) {
    return get(notesHistoryAtom);
  }

  const prevNoteHistory = getPrevNoteHistory(get(notesAtom), get(notesHistoryAtom))

  set(notesAtom, prevNoteHistory);
  set(notesHistoryAtom, {
    history,
    head: head - 1,
  });
})

export const redoHistoryAtom = atom(null, (get, set) => {
  const { history, head } = get(notesHistoryAtom)
  const edgeCases = history.length === 0 || head === history.length - 1;
  if (edgeCases) {
    return get(notesHistoryAtom);
  }

  const nextNoteHistory = getNextNoteHistory(get(notesAtom), get(notesHistoryAtom))

  set(notesAtom, nextNoteHistory);
  set(notesHistoryAtom, {
    history,
    head: head + 1,
  });
})


function getPrevNoteHistory(notes: TrackNoteEvent[], history: NotesHistory): TrackNoteEvent[] {
  const nearestHistory = history.history[history.head];
  switch (nearestHistory.type) {
    case PianoRollHistoryItemType.ADD_NOTE: {
      const toBeDeletedNoteIds = new Set(nearestHistory.note.map((note) => note.id));
      return notes.filter((note) => !toBeDeletedNoteIds.has(note.id));
    }
    case PianoRollHistoryItemType.DELETE_NOTE: {
      return [...notes, ...nearestHistory.note];
    }
    case PianoRollHistoryItemType.MODIFY_NOTE: {
      const modifiedNoteIds = new Map(nearestHistory.note.map((note) => [note.id, note]));
      return notes.map((note) =>
        modifiedNoteIds.has(note.id) ? (modifiedNoteIds.get(note.id) as TrackNoteEvent) : note,
      );
    }
    default:
      throw Error("action not defined");
  }
}


function getNextNoteHistory(notes: TrackNoteEvent[], history: NotesHistory): TrackNoteEvent[] {
  const nearestHistory = history.history[history.head + 1];
  switch (nearestHistory.type) {
    case PianoRollHistoryItemType.ADD_NOTE: {
      return [...notes, ...nearestHistory.note];
    }
    case PianoRollHistoryItemType.DELETE_NOTE: {
      const deletedNoteIds = new Set(nearestHistory.note.map((note) => note.id));
      return notes.filter((note) => !deletedNoteIds.has(note.id));
    }
    case PianoRollHistoryItemType.MODIFY_NOTE: {
      const modifiedNoteIds = new Map(nearestHistory.note.map((note) => [note.id, note]));
      return notes.map((note) =>
        modifiedNoteIds.has(note.id) ? (modifiedNoteIds.get(note.id) as TrackNoteEvent) : note,
      );
    }
    default:
      throw Error("action not defined");
  }
}

export function getChoppedHistoryAfterHead(history: NotesHistory): PianoRollHistoryItem[] {
  return history.history.slice(0, history.head + 1);
}
