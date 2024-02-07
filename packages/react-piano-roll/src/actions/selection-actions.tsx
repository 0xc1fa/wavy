import { PianoRollStore } from "@/store/pianoRollStore";

export type SelectionAction = SetNoteAsSelectedAction | UnselectAllNotesAction | SetSelectionTicksAction;

type SetNoteAsSelectedAction = {
  type: "SET_NOTE_AS_SELECTED";
  payload: { noteId: string };
};
export function setNoteAsSelected(state: PianoRollStore, action: SetNoteAsSelectedAction) {
  return {
    ...state,
    notes: state.notes.map((note) => ({
      ...note,
      isSelected: note.isSelected || note.id === action.payload.noteId,
    })),
  };
}

type UnselectAllNotesAction = { type: "UNSELECTED_ALL_NOTES" };
export function unselectAllNotes(state: PianoRollStore, action: UnselectAllNotesAction) {
  return {
    ...state,
    notes: state.notes.map((note) => ({
      ...note,
      isSelected: false,
    })),
  };
}

type SetSelectionTicksAction = {
  type: "SET_SELECTION_TICKS";
  payload: { ticks: number };
};
export function setSelectionTicks(state: PianoRollStore, action: SetSelectionTicksAction) {
  return {
    ...state,
    selectionTicks: action.payload.ticks,
  };
}
