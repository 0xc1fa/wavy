import { TrackNoteEvent } from "@/types";
import { PianoRollStore } from "@/store/pianoRollStore";

export enum PianoRollHistoryItemType {
  ADD_NOTE,
  DELETE_NOTE,
  MODIFY_NOTE,
}

export type PianoRollHistoryItem = {
  type: PianoRollHistoryItemType;
  note: TrackNoteEvent[];
};

type PianoRollHistory = {
  head: number;
  history: PianoRollHistoryItem[];
};

export type HistoryAction =
  // | AppendHistoryAction
  UndoAction | RedoAction;

type UndoAction = { type: "UNDO" };
export function undo(state: PianoRollStore, action: UndoAction) {

  const { history, head } = state.notesHistory;

  const edgeCases =
    history.length === 0 || // There is no history
    head === -1; // Already at the beginning of history
  if (edgeCases) {
    return state;
  }

  const prevNoteHistory = getPrevNoteHistory(state.notes, state.notesHistory);
  return {
    ...state,
    notes: prevNoteHistory,
    notesHistory: {
      ...state.notesHistory,
      head: head - 1,
    },
  };
}

function getPrevNoteHistory(notes: TrackNoteEvent[], history: PianoRollHistory): TrackNoteEvent[] {
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

type RedoAction = { type: "REDO" };
export function redo(state: PianoRollStore, action: RedoAction) {
  const { history, head } = state.notesHistory;
  const edgeCases =
    history.length === 0 || // There is no history
    head === history.length - 1; // Already at the end of history

  if (edgeCases) {
    return state;
  }

  const nextNoteHistory = getNextNoteHistory(state.notes, state.notesHistory);
  return {
    ...state,
    notes: nextNoteHistory,
    notesHistory: {
      ...state.notesHistory,
      head: head + 1,
    },
  };
}

function getNextNoteHistory(notes: TrackNoteEvent[], history: PianoRollHistory): TrackNoteEvent[] {
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

export function getChoppedHistoryAfterHead(history: PianoRollHistory): PianoRollHistoryItem[] {
  return history.history.slice(0, history.head + 1);
}
