import { TrackNoteEvent, VibratoMode } from "@/types";
import { PianoRollStore } from "@/store/pianoRollStore";
import { v4 as uuidv4 } from "uuid";
import { PianoRollHistoryItemType, getChoppedHistoryAfterHead } from "./history-action";
import _ from "lodash";
import { clampDuration, clampNoteNumber, clampTick, clampTo7BitRange, clampTo7BitRangeWithMinOne, clampVelocity } from "@/helpers/number";

export type NoteAction =
  | AddNoteAction
  | AddNotesAction
  | ModifyingNotesAction
  | DeleteSelectedNotesAction
  | UpdateNoteLyricAction
  | ToggleSelectedNoteVibratoModeAction
  | VibratoDepthDelayChangeSelectedNoteAction
  | VibratoRateChangeSelectedNoteAction
  | SetNoteInMarqueeAsSelectedAction
  | MoveNoteAsLatestModifiedAction
  | SetNoteModificationBufferWithSelectedNoteAction
  | SetNoteModificationBufferWithAllNoteAction;

function createNote(state: PianoRollStore, ticks: number, noteNum: number): TrackNoteEvent {
  return {
    id: uuidv4(),
    tick: ticks,
    noteNumber: noteNum,
    velocity: state.defaultVelocity,
    lyric: state.defaultNoteLyric,
    duration: state.defaultDuration,
    isSelected: true,
    isActive: true,
    vibratoDepth: 10,
    vibratoRate: 30,
    vibratoDelay: state.defaultDuration * 0.3,
    vibratoMode: VibratoMode.Normal,
  };
}

type AddNoteAction = {
  type: "ADD_NOTE";
  payload: { ticks: number; noteNum: number };
};
export function addNote(state: PianoRollStore, action: AddNoteAction) {
  const newNote = createNote(state, action.payload.ticks, action.payload.noteNum);
  return {
    ...state,
    pianoRollNotes: [...state.pianoRollNotes, newNote],
    notesHistory: {
      head: state.notesHistory.head + 1,
      history: [
        ...getChoppedHistoryAfterHead(state.notesHistory),
        { type: PianoRollHistoryItemType.ADD_NOTE, note: [newNote] },
      ],
    },
  };
}

type AddNotesAction = {
  type: "ADD_NOTES";
  payload: { notes: TrackNoteEvent[] };
};
export function addNotes(state: PianoRollStore, action: AddNotesAction) {
  const newNotes = action.payload.notes.map((note) => ({
    ...note,
    id: uuidv4(),
  }));
  return {
    ...state,
    pianoRollNotes: [...state.pianoRollNotes, ...newNotes],
    notesHistory: {
      head: state.notesHistory.head + 1,
      history: [
        ...getChoppedHistoryAfterHead(state.notesHistory),
        { type: PianoRollHistoryItemType.ADD_NOTE, note: newNotes },
      ],
    },
  };
}

type ModifyingNotesAction = {
  type: "MODIFYING_NOTES";
  payload: { notes: TrackNoteEvent[] };
};
export function modifyingNotes(state: PianoRollStore, action: ModifyingNotesAction) {
  const { history, head } = state.notesHistory;
  const prevHistory = history[head]?.note;
  const notesIdsToBeModified = action.payload.notes.map((note) => note.id);
  const notesNotModified = state.pianoRollNotes.filter((note) => !notesIdsToBeModified.includes(note.id));
  const notesModifiedWithClampValue = action.payload.notes.map((note) => ({
    ...note,
    noteNumber: clampNoteNumber(note.noteNumber),
    velocity: clampVelocity(note.velocity),
    tick: clampTick(note.tick),
    duration: clampDuration(note.duration),
  }));
  const newStateWithoutHistory = {
    ...state,
    pianoRollNotes: [...notesNotModified, ...notesModifiedWithClampValue],
  };
  if (_.isEqual(prevHistory, state.noteModificationBuffer.notesSelected)) {
    return {
      ...newStateWithoutHistory,
    };
  } else {
    return {
      ...newStateWithoutHistory,
      notesHistory: {
        head: state.notesHistory.head + 1,
        history: [
          ...getChoppedHistoryAfterHead(state.notesHistory),
          {
            type: PianoRollHistoryItemType.MODIFY_NOTE,
            note: state.noteModificationBuffer.notesSelected,
          },
        ],
      },
    };
  }
}

type DeleteSelectedNotesAction = { type: "DELETE_SELECTED_NOTES" };
export function deleteSelectedNotes(state: PianoRollStore, action: DeleteSelectedNotesAction) {
  const notesToBeDeleted = state.pianoRollNotes.filter((note) => note.isSelected);
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.filter((note) => !note.isSelected),
    notesHistory: {
      head: state.notesHistory.head + 1,
      history: [
        ...getChoppedHistoryAfterHead(state.notesHistory),
        { type: PianoRollHistoryItemType.DELETE_NOTE, note: notesToBeDeleted },
      ],
    },
  };
}

type ToggleSelectedNoteVibratoModeAction = {
  type: "TOGGLE_SELECTED_NOTE_VIBRATO_MODE";
};
export function toggleSelectedNoteVibratoMode(state: PianoRollStore, action: ToggleSelectedNoteVibratoModeAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map((note) => ({
      ...note,
      vibratoMode: note.isSelected ? (note.vibratoMode + 1) % 2 : note.vibratoMode,
    })),
  };
}

type VibratoDepthDelayChangeSelectedNoteAction = {
  type: "VIBRATO_DEPTH_DELAY_CHANGE_SELECTED_NOTE";
  payload: { depthOffset: number; delayOffset: number };
};
export function vibratoDepthDelayChangeSelectedNote(
  state: PianoRollStore,
  action: VibratoDepthDelayChangeSelectedNoteAction,
) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map((note) => {
      if (note.isSelected) {
        const newVibratoDepth = note.vibratoDepth + 0.6 * action.payload.depthOffset;
        const newVibratoDelay = note.vibratoDelay - 4 * action.payload.delayOffset;
        return {
          ...note,
          vibratoDelay: Math.max(Math.min(newVibratoDelay, note.duration * 0.9), 0),
          vibratoDepth: Math.min(Math.max(newVibratoDepth, 0), 200),
        };
      } else {
        return note;
      }
    }),
  };
}

type VibratoRateChangeSelectedNoteAction = {
  type: "VIBRATO_RATE_CHANGE_SELECTED_NOTE";
  payload: { rateOffset: number };
};
export function vibratoRateChangeSelectedNote(state: PianoRollStore, action: VibratoRateChangeSelectedNoteAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map((note) => {
      if (note.isSelected) {
        const newVibratoRate = note.vibratoRate - 0.15 * action.payload.rateOffset;
        // const newVibratoRate = note.vibratoRate + 1 * (this.state.ongoingPosition.x - e.offsetX);
        console.log(`newVibratoRate: ${newVibratoRate}`);
        return {
          ...note,
          // vibratoDelay: Math.max(Math.min(newVibratoDelay, note.duration * 0.9), 0),
          vibratoRate: Math.min(Math.max(newVibratoRate, 5), 200),
        };
      } else {
        return note;
      }
    }),
  };
}

type SetNoteInMarqueeAsSelectedAction = {
  type: "SET_NOTE_IN_MARQUEE_AS_SELECTED";
  payload: {
    startingPosition: { x: number; y: number };
    ongoingPosition: { x: number; y: number };
  };
};
export function setNoteInMarqueeAsSelected(state: PianoRollStore, action: SetNoteInMarqueeAsSelectedAction) {
  const [selectedMinNoteNum, selectedMaxNoteNum] = [
    state.getNoteNumFromOffsetY(action.payload.startingPosition.y),
    state.getNoteNumFromOffsetY(action.payload.ongoingPosition.y),
  ].sort((a, b) => a - b);
  const [selectedMinTick, selectedMaxTick] = [
    state.getTickFromOffsetX(action.payload.startingPosition.x),
    state.getTickFromOffsetX(action.payload.ongoingPosition.x),
  ].sort((a, b) => a - b);
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map((note) => {
      if (
        note.noteNumber >= selectedMinNoteNum &&
        note.noteNumber <= selectedMaxNoteNum &&
        note.tick + note.duration >= selectedMinTick &&
        note.tick <= selectedMaxTick
      ) {
        return { ...note, isSelected: true };
      } else {
        return note;
      }
    }),
  };
}

type UpdateNoteLyricAction = {
  type: "UPDATE_NOTE_LYRIC";
  payload: { noteId: string; lyric: string };
};
export function updateNoteLyric(state: PianoRollStore, action: UpdateNoteLyricAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map((note) => {
      if (note.id === action.payload.noteId) {
        return { ...note, lyric: action.payload.lyric };
      } else {
        return note;
      }
    }),
  };
}

type MoveNoteAsLatestModifiedAction = {
  type: "MOVE_NOTE_AS_LATEST_MODIFIED";
  payload: { noteId: string };
};
export function moveNoteAsLatestModified(state: PianoRollStore, action: MoveNoteAsLatestModifiedAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes
      .filter((note) => note.id !== action.payload.noteId)
      .concat(state.pianoRollNotes.filter((note) => note.id === action.payload.noteId)),
  };
}

type SetNoteModificationBufferWithSelectedNoteAction = {
  type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE";
  payload: { initX: number; initY: number };
};
export function setNoteModificationBufferWithSelectedNote(state: PianoRollStore, action: SetNoteModificationBufferWithSelectedNoteAction) {
  return {
    ...state,
    noteModificationBuffer: {
      notesSelected: state.pianoRollNotes.filter((note) => note.isSelected),
      initX: action.payload.initX,
      initY: action.payload.initY,
    },
  };
}

type SetNoteModificationBufferWithAllNoteAction = {
  type: "SET_NOTE_MODIFICATION_BUFFER_WITH_ALL_NOTE";
  payload: { initX: number; initY: number };
};
export function setNoteModificationBufferWithAllNote(state: PianoRollStore, action: SetNoteModificationBufferWithAllNoteAction) {
  return {
    ...state,
    noteModificationBuffer: {
      notesSelected: state.pianoRollNotes,
      initX: action.payload.initX,
      initY: action.payload.initY,
    },
  };
}
