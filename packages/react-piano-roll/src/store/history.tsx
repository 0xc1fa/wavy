import { PianoRollNote } from "@/types";
import { atom } from "jotai";
import { notesAtom } from "./note";

export enum PianoRollHistoryItemType {
  ADD_NOTE,
  DELETE_NOTE,
  MODIFY_NOTE,
}

export type PianoRollHistoryItem = {
  type: PianoRollHistoryItemType;
  note: PianoRollNote[];
};

export type NotesHistory = {
  head: number;
  history: PianoRollHistoryItem[];
};

export const notesHistoryAtom = atom<NotesHistory>({
  head: -1,
  history: new Array<PianoRollHistoryItem>(),
});

export const undoHistoryAtom = atom(null, (get, set) => {
  const { history, head } = get(notesHistoryAtom);
  const edgeCases = history.length === 0 || head === -1;
  if (edgeCases) {
    return get(notesHistoryAtom);
  }

  const prevNoteHistory = getPrevNoteHistory(get(notesAtom), get(notesHistoryAtom));

  set(notesAtom, prevNoteHistory);
  set(notesHistoryAtom, {
    history,
    head: head - 1,
  });
});

export const redoHistoryAtom = atom(null, (get, set) => {
  const { history, head } = get(notesHistoryAtom);
  const edgeCases = history.length === 0 || head === history.length - 1;
  if (edgeCases) {
    return get(notesHistoryAtom);
  }

  const nextNoteHistory = getNextNoteHistory(get(notesAtom), get(notesHistoryAtom));

  set(notesAtom, nextNoteHistory);
  set(notesHistoryAtom, {
    history,
    head: head + 1,
  });
});

function getNearestHistoryNoteIds(nearestHistory: PianoRollHistoryItem): string[] {
  return nearestHistory.note.map((note) => note.id);
}

function getNearestHistoryNoteIdMap(nearestHistory: PianoRollHistoryItem) {
  return new Map(nearestHistory.note.map((note) => [note.id, note]));
}

function getNotesNotInTheNearestHistory(history: PianoRollHistoryItem, notes: PianoRollNote[]): PianoRollNote[] {
  const nearestHistoryNoteId = new Set(getNearestHistoryNoteIds(history));
  return notes.filter((note) => !nearestHistoryNoteId.has(note.id));
}

function getNotesRevertedToNearestHistory(history: PianoRollHistoryItem, notes: PianoRollNote[]): PianoRollNote[] {
  const nearestHistoryNoteIdMap = getNearestHistoryNoteIdMap(history);
  return notes.map((note) =>
    nearestHistoryNoteIdMap.has(note.id) ? (nearestHistoryNoteIdMap.get(note.id) as PianoRollNote) : note,
  );
}

function getPrevNoteHistory(notes: PianoRollNote[], history: NotesHistory): PianoRollNote[] {
  const nearestHistory = history.history[history.head];
  switch (nearestHistory.type) {
    case PianoRollHistoryItemType.ADD_NOTE: {
      return getNotesNotInTheNearestHistory(nearestHistory, notes);
    }
    case PianoRollHistoryItemType.DELETE_NOTE: {
      return [...notes, ...nearestHistory.note];
    }
    case PianoRollHistoryItemType.MODIFY_NOTE: {
      return getNotesRevertedToNearestHistory(nearestHistory, notes);
    }
    default:
      throw Error("action not defined");
  }
}

function getNextNoteHistory(notes: PianoRollNote[], history: NotesHistory): PianoRollNote[] {
  const nearestHistory = history.history[history.head + 1];
  switch (nearestHistory.type) {
    case PianoRollHistoryItemType.ADD_NOTE: {
      return [...notes, ...nearestHistory.note];
    }
    case PianoRollHistoryItemType.DELETE_NOTE: {
      return getNotesNotInTheNearestHistory(nearestHistory, notes);
    }
    case PianoRollHistoryItemType.MODIFY_NOTE: {
      return getNotesRevertedToNearestHistory(nearestHistory, notes);
    }
    default:
      throw Error("action not defined");
  }
}

export function getChoppedHistoryAfterHead(history: NotesHistory): PianoRollHistoryItem[] {
  return history.history.slice(0, history.head + 1);
}
