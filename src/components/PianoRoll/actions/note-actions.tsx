import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { VibratoMode } from "@/types/VibratoMode";
import { PianoRollStore } from "../store/pianoRollStore";
import { v4 as uuidv4 } from 'uuid';


export type NoteAction =
  | AddNoteAction
  | AddNotesAction
  | ModifiedNotesAction
  | ToggleSelectedNoteVibratoModeAction
  | VibratoDepthDelayChangeSelectedNoteAction
  | VibratoRateChangeSelectedNoteAction
  | SetNoteInMarqueeAsSelectedAction
  | UpdateNoteLyricAction
  | MoveNoteAsLatestModifiedAction
  | DeleteSelectedNotesAction


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
  }
}


type AddNoteAction = {
  type: 'addNote',
  payload: { ticks: number, noteNum: number }
}
export function addNote(state: PianoRollStore, action: AddNoteAction) {
  const newNote = createNote(state, action.payload.ticks, action.payload.noteNum)
  return {
    ...state,
    pianoRollNotes: [...state.pianoRollNotes, newNote]
  }
}


type AddNotesAction = {
  type: 'addNotes',
  payload: { notes: TrackNoteEvent[] }
}
export function addNotes(state: PianoRollStore, action: AddNotesAction) {
  return {
    ...state,
    pianoRollNotes: [
      ...state.pianoRollNotes,
      ...action.payload.notes.map(note => ({...note, id: uuidv4()}))
    ]
  }
}


type ModifiedNotesAction = {
  type: 'modifiedNotes',
  payload: { notes: TrackNoteEvent[] }
}
export function modifiedNotes(state: PianoRollStore, action: ModifiedNotesAction) {
  const notesIdsToBeModified = action.payload.notes.map(note => note.id)
  const notesNotModified = state.pianoRollNotes.filter(note => !notesIdsToBeModified.includes(note.id))
  return {
    ...state,
    pianoRollNotes: [
      ...notesNotModified,
      ...action.payload.notes
    ]
  }
}


type ToggleSelectedNoteVibratoModeAction = { type: 'toggleSelectedNoteVibratoMode' }
export function toggleSelectedNoteVibratoMode(state: PianoRollStore, action: ToggleSelectedNoteVibratoModeAction) {
  return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, vibratoMode: note.isSelected ? (note.vibratoMode + 1) % 2 : note.vibratoMode}))}
}


type VibratoDepthDelayChangeSelectedNoteAction = {
  type: 'vibratoDepthDelayChangeSelectedNote',
  payload: { depthOffset: number, delayOffset: number }
}
export function vibratoDepthDelayChangeSelectedNote(state: PianoRollStore, action: VibratoDepthDelayChangeSelectedNoteAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map(note => {
      if (note.isSelected) {
        const newVibratoDepth = note.vibratoDepth + 0.6 * action.payload.depthOffset
        const newVibratoDelay = note.vibratoDelay - 4 * action.payload.delayOffset
        return {
          ...note,
          vibratoDelay: Math.max(Math.min(newVibratoDelay, note.duration * 0.9), 0),
          vibratoDepth: Math.min(Math.max(newVibratoDepth, 0), 200),
        };
      } else {
        return note
      }
    })
  }
}


type VibratoRateChangeSelectedNoteAction = {
  type: 'vibratoRateChangeSelectedNote',
  payload: { rateOffset: number }
}
export function vibratoRateChangeSelectedNote(state: PianoRollStore, action: VibratoRateChangeSelectedNoteAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map(note => {
      if (note.isSelected) {
        const newVibratoRate = note.vibratoRate - 0.15 * action.payload.rateOffset
        // const newVibratoRate = note.vibratoRate + 1 * (this.state.ongoingPosition.x - e.offsetX);
        console.log(`newVibratoRate: ${newVibratoRate}`);
        return {
          ...note,
          // vibratoDelay: Math.max(Math.min(newVibratoDelay, note.duration * 0.9), 0),
          vibratoRate: Math.min(Math.max(newVibratoRate, 5), 200),
        };
      } else {
        return note
      }
    })
  }
}


type SetNoteInMarqueeAsSelectedAction = {
  type: 'setNoteInMarqueeAsSelected',
  payload: {
    startingPosition: {x: number, y: number},
    ongoingPosition: {x: number, y: number},
  }
}
export function setNoteInMarqueeAsSelected(state: PianoRollStore, action: SetNoteInMarqueeAsSelectedAction) {
  const [selectedMinNoteNum, selectedMaxNoteNum] = [
    state.getNoteNumFromOffsetY(action.payload.startingPosition.y),
      state.getNoteNumFromOffsetY(action.payload.ongoingPosition.y)].sort((a, b) => a - b)
  const [selectedMinTick, selectedMaxTick] = [
    state.getTickFromOffsetX(action.payload.startingPosition.x),
    state.getTickFromOffsetX(action.payload.ongoingPosition.x)].sort((a, b) => a - b);
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map(note => {
      if (note.noteNumber >= selectedMinNoteNum
        && note.noteNumber <= selectedMaxNoteNum
        && note.tick + note.duration >= selectedMinTick
        && note.tick <= selectedMaxTick) {
        return { ...note, isSelected: true};
      } else {
        return note;
      }
    })
  }
}


type UpdateNoteLyricAction =  {
  type: 'updateNoteLyric',
  payload: { noteId: string, lyric: string }
}
export function updateNoteLyric(state: PianoRollStore, action: UpdateNoteLyricAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.map(note => {
      if (note.id === action.payload.noteId) {
        return { ...note, lyric: action.payload.lyric };
      } else {
        return note;
      }
    })
  }
}

type MoveNoteAsLatestModifiedAction = {
  type: 'moveNoteAsLatestModified',
  payload: { noteId: string }
}
export function moveNoteAsLatestModified(state: PianoRollStore, action: MoveNoteAsLatestModifiedAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.filter(note => note.id !== action.payload.noteId).concat(state.pianoRollNotes.filter(note => note.id === action.payload.noteId))
  }
}

type DeleteSelectedNotesAction = { type: 'deleteSelectedNotes' }
export function deleteSelectedNotes(state: PianoRollStore, action: DeleteSelectedNotesAction) {
  return {
    ...state,
    pianoRollNotes: state.pianoRollNotes.filter(note => !note.isSelected)
  }
}
