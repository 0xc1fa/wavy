import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { VibratoMode } from "@/types/VibratoMode";
import { v4 as uuidv4 } from 'uuid';
import { createContext, useContext, useReducer } from "react";
import usePianoRollStore, { PianoRollStoreContext } from "./pianoRollStore";

export const MidiEventStoreContext = createContext<ReturnType<typeof useMidiEventStore> | undefined>(undefined)

interface MidiEventStoreProviderProps {
  children?: React.ReactNode
}
export function MidiEventStoreStoreProvider({ children }: MidiEventStoreProviderProps) {
  const pianoRollStore = useMidiEventStore()
  return (
    <MidiEventStoreStoreContext.Provider value={pianoRollStore}>
      {children}
    </MidiEventStoreStoreContext.Provider>
  )
}

type MidiEventStoreStoreAction =
  | { type: 'addNote', payload: {ticks: number, noteNum: number} }
  | { type: 'unselectAllNotes' }
  | { type: 'setNoteAsSelected', payload: { noteId: string } }
  | { type: 'toggleSelectedNoteVibratoMode' }
  | { type: 'trimSelectedNote', payload: { deltaTicks: number } }
  | { type: 'extendSelectedNote', payload: { deltaTicks: number } }
  | { type: 'shiftSelectedNote', payload: { deltaPitch: number, deltaTicks: number } }
  | { type: 'vibratoDepthDelayChangeSelectedNote', payload: { depthOffset: number, delayOffset: number } }
  | { type: 'vibratoRateChangeSelectedNote', payload: { rateOffset: number } }
  | { type: 'setNoteInMarqueeAsSelected', payload: {
    startingPosition: {x: number, y: number},
    ongoingPosition: {x: number, y: number},
  }}

function reducer(state: MidiEventStore, action: MidiEventStoreStoreAction) {
  function createNote(ticks: number, noteNum: number): TrackNoteEvent {
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

  const { pianoRollStore } = usePianoRollStore();

  switch (action.type) {
    case 'addNote':
      const newNote = createNote(action.payload.ticks, action.payload.noteNum)
      return {...state, pianoRollNotes: [...state.pianoRollNotes, newNote]}
    case 'unselectAllNotes':
      return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, isSelected: false}))}
    case 'setNoteAsSelected':
      return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, isSelected: note.isSelected || note.id === action.payload.noteId}))}
    case 'toggleSelectedNoteVibratoMode':
      return {...state, pianoRollNotes: state.pianoRollNotes.map(note => ({...note, vibratoMode: note.isSelected ? (note.vibratoMode + 1) % 2 : note.vibratoMode}))}
    case 'trimSelectedNote':

      return {
        ...state,
        pianoRollNotes: state.pianoRollNotes.map(note => {
          if (note.isSelected && (state.getOffsetXFromTick(note.duration - action.payload.deltaTicks) > 10)) {
            return {
              ...note,
              tick: note.tick + action.payload.deltaTicks,
              duration: note.duration - action.payload.deltaTicks,
              vibratoDelay: Math.min(note.vibratoDelay, note.duration * 0.5)
            };
          } else {
            return note
          }
        })
      }
    case 'extendSelectedNote':
      return {
        ...state,
        pianoRollNotes: state.pianoRollNotes.map(note => {
          if (note.isSelected && (pianoRollStore.getOffsetXFromTick(note.duration + action.payload.deltaTicks) > 10)) {
            return {
              ...note,
              duration: note.duration + action.payload.deltaTicks,
              vibratoDelay: Math.min(note.vibratoDelay, note.duration * 0.5)
            };
          } else {
            return note
          }
        })
      }
    case 'shiftSelectedNote':
      return {
        ...state,
        pianoRollNotes: state.pianoRollNotes.map(note => {
          if (note.isSelected) {
            return {
              ...note,
              noteNumber: note.noteNumber + action.payload.deltaPitch,
              tick: note.tick + action.payload.deltaTicks,
            };
          } else {
            return note
          }
        })
      }
    case 'vibratoDepthDelayChangeSelectedNote':
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
    case 'vibratoRateChangeSelectedNote':
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
    case 'setNoteInMarqueeAsSelected':
      const [selectedMinNoteNum, selectedMaxNoteNum] = [
        pianoRollStore.getNoteNumFromOffsetY(action.payload.startingPosition.y),
        pianoRollStore.getNoteNumFromOffsetY(action.payload.ongoingPosition.y)].sort((a, b) => a - b)
      const [selectedMinTick, selectedMaxTick] = [
        pianoRollStore.getTickFromOffsetX(action.payload.startingPosition.x),
        pianoRollStore.getTickFromOffsetX(action.payload.ongoingPosition.x)].sort((a, b) => a - b);
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
    default:
      throw new Error();
  }
}

export default function useMidiEventStore(
  initialState?: MidiEventStore,
) {
  const [midiEventStore, dispatch] = useReducer(
    reducer,
    initialState ? initialState : defaultMidiEventStore(),
  );

  return {
    midiEventStore,
    dispatch
  };

}

export type MidiEventStoreContext = ReturnType<typeof useMidiEventStore>

export type MidiEventStore = ReturnType<typeof defaultMidiEventStore>
function defaultMidiEventStore() {
  return {
    pianoRollNotes: new Array(),
    pitchBendEvent: new Array(),

    defaultVelocity: 64,
    defaultDuration: 480,
    defaultNoteLyric: "啦",

    getNoteFromPosition(offsetX: number, offsetY: number): TrackNoteEvent | null {
      const { pianoRollStore } = usePianoRollStore();

      for (const note of this.pianoRollNotes) {
        if (
          pianoRollStore.getNoteNumFromOffsetY(offsetY) === note.noteNumber
          && pianoRollStore.getTickFromOffsetX(offsetX) >= note.tick
          && pianoRollStore.getTickFromOffsetX(offsetX) <= note.tick + note.duration
        ) {
          return note;
        }
      }
      return null;
    },

  }
}