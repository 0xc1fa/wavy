import { PianoRollStore } from "@/store/pianoRollStore";

export type SelectionAction =
  | SetNoteAsSelectedAction
  | UnselectAllNotesAction
  | SetSelectionTicksAction
  | SetSelectionRangeAction;

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
  payload: { ticks: number | null };
};
export function setSelectionTicks(state: PianoRollStore, action: SetSelectionTicksAction) {
  return {
    ...state,
    selectionTicks: action.payload.ticks,
  };
}

type SetSelectionRangeAction = {
  type: "SET_SELECTION_RANGE";
  payload: { range: [number, number] | null };
};
export function setSelectionRange(state: PianoRollStore, action: SetSelectionRangeAction) {
  return {
    ...state,
    selectionRange: action.payload.range,
  };
}
