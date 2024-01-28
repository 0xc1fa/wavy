import { PianoRollStore } from "@/store/pianoRollStore";

export type SelectionAction =
  | SetNoteAsSelectedAction
  | UnselectAllNotesAction
  | SetSelectionTicksAction;


type SetNoteAsSelectedAction = {
  type: 'setNoteAsSelected',
  payload: { noteId: string }
}
export function setNoteAsSelected(state: PianoRollStore, action: SetNoteAsSelectedAction) {
  return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, isSelected: note.isSelected || note.id === action.payload.noteId}))}
}

type UnselectAllNotesAction = { type: 'unselectAllNotes' }
export function unselectAllNotes(state: PianoRollStore, action: UnselectAllNotesAction) {
  return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, isSelected: false}))}
}


type SetSelectionTicksAction = { type: 'setSelectionTicks', payload: { ticks: number } }
export function setSelectionTicks(state: PianoRollStore, action: SetSelectionTicksAction)  {
  return {
    ...state,
    selectionTicks: action.payload.ticks
  }
}
