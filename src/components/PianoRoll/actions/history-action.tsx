import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { PianoRollStore } from "../store/pianoRollStore";
import { usePianoRollNotes } from "../helpers/notes";

export enum PianoRollHistoryItemType {
  ADD_NOTE,
  DELETE_NOTE,
  MODIFY_NOTE
}

export type PianoRollHistoryItem = {
  type: PianoRollHistoryItemType,
  note: TrackNoteEvent[]
}

type PianoRollHistory = {
  head: number,
  history: PianoRollHistoryItem[]
}

export type HistoryAction =
  // | AppendHistoryAction
  | UndoAction
  | RedoAction

type UndoAction = { type: 'UNDO' }
export function undo(state: PianoRollStore, action: UndoAction) {
  const prevNoteHistory = getPrevNoteHistory(state.pianoRollNotes, state.notesHistory)
  return {
    ...state,
    pianoRollNotes: prevNoteHistory,
    notesHistory: {
      ...state.notesHistory,
      head: state.notesHistory.head - 1
    }
  }
}

function getPrevNoteHistory(notes: TrackNoteEvent[], history: PianoRollHistory): TrackNoteEvent[] {
  const nearestHistory = history.history[history.head]
  switch(nearestHistory.type) {
    case PianoRollHistoryItemType.ADD_NOTE: {
      return notes.filter(note =>
        !nearestHistory.note.some(hNote => hNote.id === note.id)
      )
    }
    case PianoRollHistoryItemType.DELETE_NOTE: {
      return [...notes, ...nearestHistory.note]
    }
    case PianoRollHistoryItemType.MODIFY_NOTE: {
      const modifiedNoteIds = new Map(nearestHistory.note.map(note => [note.id, note]))
      return notes.map(note => modifiedNoteIds.has(note.id)
        ? modifiedNoteIds.get(note.id) as TrackNoteEvent
        : note
      )
    }
    default:
      throw Error('action not defined')
  }
}

type RedoAction = { type: 'REDO' }
export function redo() {
  
}