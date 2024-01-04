import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { VibratoMode } from "@/types/VibratoMode";
import { isBlackKey } from "../helpers";
import { v4 as uuidv4 } from 'uuid';
import { createContext, useReducer } from "react";

export const PianoRollStoreContext = createContext<ReturnType<typeof usePianoRollStore> | undefined>(undefined)

interface PianoRollStoreProviderProps {
  children?: React.ReactNode
}
export function PianoRollStoreProvider({ children }: PianoRollStoreProviderProps) {
  const pianoRollStore = usePianoRollStore()
  return (
    <PianoRollStoreContext.Provider value={pianoRollStore}>
      {children}
    </PianoRollStoreContext.Provider>
  )
}

type PianoRollStoreAction =
  | { type: 'addNote', payload: { ticks: number, noteNum: number } }
  | { type: 'addNotes', payload: { notes: TrackNoteEvent[] } }
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
  | { type: 'updateNoteLyric', payload: { noteId: string, lyric: string } }
  | { type: 'moveNoteAsLatestModified', payload: { noteId: string } }
  | { type: 'setPianoLaneScaleX', payload: { pianoLaneScaleX: number } }
  | { type: 'deleteSelectedNotes' }
  | { type: 'setPlayheadTicks', payload: { ticks: number } }
  | { type: 'incrementTicksByOne' }
  | { type: 'play' }
  | { type: 'stop' }
  | { type: 'setSelectionTicks', payload: { ticks: number } }
  | { type: 'setBpm', payload: { bpm: number } }

function reducer(state: PianoRollStore, action: PianoRollStoreAction) {
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

  switch (action.type) {
    case 'addNote':
      const newNote = createNote(action.payload.ticks, action.payload.noteNum)
      return {...state, pianoRollNotes: [...state.pianoRollNotes, newNote]}
    case 'addNotes':
      return {
        ...state,
        pianoRollNotes: [
          ...state.pianoRollNotes,
          ...action.payload.notes.map(note => ({...note, id: uuidv4()}))
        ]
      }
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
          if (note.isSelected && (state.getOffsetXFromTick(note.duration + action.payload.deltaTicks) > 10)) {
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
    case 'updateNoteLyric':
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
    case 'moveNoteAsLatestModified':
      return {
        ...state,
        pianoRollNotes: state.pianoRollNotes.filter(note => note.id !== action.payload.noteId).concat(state.pianoRollNotes.filter(note => note.id === action.payload.noteId))
      }
    case 'setPianoLaneScaleX':
      return {
        ...state,
        pianoLaneScaleX: action.payload.pianoLaneScaleX
      }
    case 'setPlayheadTicks':
      return {
        ...state,
        currentTicks: action.payload.ticks
      }
    case 'setSelectionTicks':
      return {
        ...state,
        selectionTicks: action.payload.ticks
      }
    case 'incrementTicksByOne':
      return {
        ...state,
        currentTicks: state.currentTicks + 1
      }
    case 'deleteSelectedNotes':
      return {
        ...state,
        pianoRollNotes: state.pianoRollNotes.filter(note => !note.isSelected)
      }
    case 'play':
      return {
        ...state,
        isPlaying: true
      }
    case 'stop':
      return {
        ...state,
        isPlaying: false
      }
    case 'setBpm':
      return {
        ...state,
        bpm: action.payload.bpm
      }
    default:
      throw new Error();
  }
}

function usePianoRollStore(
  initialState?: PianoRollStore,
) {
  const [pianoRollStore, dispatch] = useReducer(
    reducer,
    initialState ? initialState : defaultPianoRollStore(),
  );

  return {
    pianoRollStore,
    dispatch
  };

}

export type PianoRollStoreContext = ReturnType<typeof usePianoRollStore>

export type PianoRollStore = ReturnType<typeof defaultPianoRollStore>
function defaultPianoRollStore() {
  return {
    keyPressed: new Array(),
    keySelected: new Array(),
    pianoRollNotes: new Array<TrackNoteEvent>(),
    pitchBendEvent: new Array(),

    bpm: 120,

    pianoLaneScaleX: 1,
    pianoLaneScaleY: 1,
    defaultVelocity: 64,
    defaultDuration: 480,
    playheadTick: 0,
    keyLength: 50,
    keyWidth: 25,
    blackKeyLengthRatio: 0.5,

    startingOctave: -1,
    endingOctave: 10,
    laneWidth: 25,
    laneLength: 1500,
    pixelPerBeat: 70,
    tickPerBeat: 480,
    defaultNoteLyric: "啦",
    draggableBoundaryPixel: 10,

    resolution: 1,
    scrollTop: 0,

    isPlaying: false,
    currentTicks: 0,
    selectionTicks: 460,

    get canvasWidth() {
      return this.laneLength * this.pianoLaneScaleX;
    },

    get startingNoteNum() {
      return 0;
    },
    get numOfKeys() {
      return 128
    },
    get pixelsPerTick() {
      return this.pixelPerBeat / this.tickPerBeat;
    },
    get canvasHeight() {
      return this.laneWidth * this.numOfKeys;
    },
    get whiteKeyWidth() {
      return this.keyWidth * 12 / 7;
    },
    get blackKeyLength() {
      return this.keyLength * this.blackKeyLengthRatio;
    },

    getBeatFromOffsetX(offsetX: number) {
      return (offsetX / (this.pianoLaneScaleX * this.pixelPerBeat));
    },

    getTickFromOffsetX(offsetX: number) {
      return (offsetX / (this.pianoLaneScaleX * this.pixelPerBeat)) * this.tickPerBeat;
    },

    getNoteNumFromOffsetY(offsetY: number) {
      return Math.floor(this.numOfKeys - offsetY / this.laneWidth);
    },

    getCenterYFromNoteNum(noteNum: number) {
      return (this.getMinYFromNoteNum(noteNum) + this.getMaxYFromNoteNum(noteNum)) / 2
    },

    getNoteNameFromNoteNum(noteNum: number) {
      const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteNameIndex = noteNum % 12;
      const octave = Math.floor(noteNum / 12) - 1;
      return `${noteNames[noteNameIndex]}${octave}`;
    },

    getMinYFromNoteNum(noteNum: number,) {
      return (this.numOfKeys - noteNum - 1) * this.laneWidth;
    },

    getMaxYFromNoteNum(noteNum: number) {
      return (this.numOfKeys - noteNum) * this.laneWidth;
    },

    getOffsetXFromTick(tick: number) {
      return (tick / this.tickPerBeat) * this.pixelPerBeat * this.pianoLaneScaleX;
    },

    getNoteFromPosition(offsetX: number, offsetY: number): TrackNoteEvent | null {
      console.log(this.pianoRollNotes)
      console.log(this.getNoteNumFromOffsetY(offsetY))
      console.log(this.getTickFromOffsetX(offsetX))
      for (const note of this.pianoRollNotes.slice().reverse()) {
        if (
          this.getNoteNumFromOffsetY(offsetY) == note.noteNumber
          && this.getTickFromOffsetX(offsetX) >= note.tick
          && this.getTickFromOffsetX(offsetX) <= note.tick + note.duration
        ) {
          return note;
        }
      }
      return null;
    },

    getWhiteKeyNumFromPosition(y: number) {
      let currentY = 0
      for (let keyNum = this.numOfKeys - 1; keyNum >= this.startingNoteNum; keyNum--) {
        if (isBlackKey(keyNum)) {
          continue
        }
        if (y >= currentY && y <= currentY + this.whiteKeyWidth) {
          return keyNum
        }
        currentY += this.whiteKeyWidth
      }
      return -1;
    },

    getBlackKeyNumFromPosition(y: number) {
      return Math.floor(this.numOfKeys - y / this.keyWidth);
    },

    getPianoKeyNumFromPosition(x: number, y: number) {
      const estimatedKeyNum = Math.floor(this.numOfKeys - y / this.keyWidth)
      if (!this.isInnerKeyboard(x)) {
        return this.getWhiteKeyNumFromPosition(y);
      } else if (this.isInnerKeyboard(x) && isBlackKey(estimatedKeyNum)) {
        return this.getBlackKeyNumFromPosition(y);
      } else {
        return this.getWhiteKeyNumFromPosition(y);
      }
    },

    getNoteFromEvent(e: PointerEvent | MouseEvent): TrackNoteEvent | null {
      return this.getNoteFromPosition(e.offsetX, e.offsetY);
    },

    getNoteNumFromEvent(e: PointerEvent | MouseEvent): number {
      return this.getNoteNumFromOffsetY(e.offsetY);
    },

    getTickFromEvent(e: PointerEvent | MouseEvent): number {
      return this.getTickFromOffsetX(e.offsetX);
    },

    roundDownTickToNearestGrid(tick: number) {
      return tick - tick % this.tickPerBeat;
    },

    clearCanvas(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, this.laneLength, this.canvasHeight)
    },

    isInnerKeyboard(x: number) {
      const blackKeyLength = this.keyLength * this.blackKeyLengthRatio
      return x < blackKeyLength
    },

    isNoteLeftMarginClicked(
      note: TrackNoteEvent,
      offsetX: number, offsetY: number,
    ) {
      if (
        this.getNoteNumFromOffsetY(offsetY) == note.noteNumber
        && offsetX >= this.getOffsetXFromTick(note.tick)
        && offsetX <= this.getOffsetXFromTick(note.tick) + this.draggableBoundaryPixel
      ) {
        return true;
      } else {
        return false;
      }
    },

    isNoteRightMarginClicked(
      note: TrackNoteEvent,
      offsetX: number, offsetY: number,
    ) {
      if (
        this.getNoteNumFromOffsetY(offsetY) == note.noteNumber
        && offsetX <= this.getOffsetXFromTick(note.tick + note.duration)
        && offsetX >= this.getOffsetXFromTick(note.tick + note.duration) - this.draggableBoundaryPixel
      ) {
        return true;
      } else {
        return false;
      }
    },
  }
}