import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { isBlackKey } from "../helpers";
import { createContext, useReducer } from "react";
import {
  NoteAction,
  addNote,
  addNotes,
  deleteSelectedNotes,
  modifyingNotes,
  moveNoteAsLatestModified,
  setNoteInMarqueeAsSelected,
  setNoteModificationBufferWithAllNote,
  setNoteModificationBufferWithSelectedNote,
  toggleSelectedNoteVibratoMode,
  updateNoteLyric,
  vibratoDepthDelayChangeSelectedNote,
  vibratoRateChangeSelectedNote,
} from "../actions/note-actions";
import { TransformAction, setscaleX } from "../actions/transform-actions";
import { SelectionAction, setNoteAsSelected, setSelectionTicks, unselectAllNotes } from "../actions/selection-actions";
import { HistoryAction, PianoRollHistoryItem, redo, undo } from "../actions/history-action";
import { MetaAction, setClipSpan } from "@/actions/meta-action";
import { basePixelsPerBeat, basePixelsPerTick } from "@/constants";

export const PianoRollStoreContext = createContext<ReturnType<typeof usePianoRollStore> | undefined>(undefined);

interface PianoRollStoreProviderProps {
  children?: React.ReactNode;
}
export function PianoRollStoreProvider({ children }: PianoRollStoreProviderProps) {
  const pianoRollStore = usePianoRollStore();
  return <PianoRollStoreContext.Provider value={pianoRollStore}>{children}</PianoRollStoreContext.Provider>;
}

export type PianoRollStoreAction = NoteAction | TransformAction | SelectionAction | HistoryAction | MetaAction;

function reducer(state: PianoRollStore, action: PianoRollStoreAction) {
  switch (action.type) {
    case "ADD_NOTE":
      return addNote(state, action);
    case "ADD_NOTES":
      return addNotes(state, action);
    case "MODIFYING_NOTES":
      return modifyingNotes(state, action);
    case "UNSELECTED_ALL_NOTES":
      return unselectAllNotes(state, action);
    case "SET_NOTE_AS_SELECTED":
      return setNoteAsSelected(state, action);
    case "TOGGLE_SELECTED_NOTE_VIBRATO_MODE":
      return toggleSelectedNoteVibratoMode(state, action);
    case "VIBRATO_DEPTH_DELAY_CHANGE_SELECTED_NOTE":
      return vibratoDepthDelayChangeSelectedNote(state, action);
    case "VIBRATO_RATE_CHANGE_SELECTED_NOTE":
      return vibratoRateChangeSelectedNote(state, action);
    case "SET_NOTE_IN_MARQUEE_AS_SELECTED":
      return setNoteInMarqueeAsSelected(state, action);
    case "UPDATE_NOTE_LYRIC":
      return updateNoteLyric(state, action);
    case "MOVE_NOTE_AS_LATEST_MODIFIED":
      return moveNoteAsLatestModified(state, action);
    case "SET_PIANO_LANE_SCALE_X":
      return setscaleX(state, action);
    case "SET_SELECTION_TICKS":
      return setSelectionTicks(state, action);
    case "DELETE_SELECTED_NOTES":
      return deleteSelectedNotes(state, action);
    case "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE":
      return setNoteModificationBufferWithSelectedNote(state, action);
    case "SET_NOTE_MODIFICATION_BUFFER_WITH_ALL_NOTE":
      return setNoteModificationBufferWithAllNote(state, action);
    case "SET_BPM":
      return {
        ...state,
        bpm: action.payload.bpm,
      };
    case "UNDO":
      return undo(state, action);
    case "REDO":
      return redo(state, action);
    case "SET_CLIP_SPAN":
      return setClipSpan(state, action);
    default:
      throw new Error();
  }
}

function usePianoRollStore(initialState?: PianoRollStore) {
  const [pianoRollStore, dispatch] = useReducer(reducer, initialState ? initialState : defaultPianoRollStore());

  return {
    pianoRollStore,
    dispatch,
  };
}

export type PianoRollStoreContext = ReturnType<typeof usePianoRollStore>;

export type PianoRollStore = ReturnType<typeof defaultPianoRollStore>;
function defaultPianoRollStore() {
  return {
    notes: new Array<TrackNoteEvent>(),
    notesHistory: {
      head: -1,
      history: new Array<PianoRollHistoryItem>(),
    },
    noteModificationBuffer: {
      notesSelected: new Array<TrackNoteEvent>(),
      initX: 0,
      initY: 0,
    },

    bpm: 120,

    scaleX: 1,
    scaleY: 1,
    newNoteVelocity: 64,
    newNoteDuration: 480,

    selectionTicks: 0,

    get scaledPixelPerBeat() {
      return basePixelsPerBeat * this.scaleX;
    },
  };
}
