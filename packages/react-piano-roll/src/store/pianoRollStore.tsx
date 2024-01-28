import { TrackNoteEvent } from "@/types/TrackNoteEvent";
import { isBlackKey } from "../helpers";
import { createContext, useReducer } from "react";
import { NoteAction, addNote, addNotes, deleteSelectedNotes, modifyingNotes, moveNoteAsLatestModified, setNoteInMarqueeAsSelected, setNoteModificationBuffer, toggleSelectedNoteVibratoMode, updateNoteLyric, vibratoDepthDelayChangeSelectedNote, vibratoRateChangeSelectedNote } from "../actions/note-actions";
import { TransformAction, setPianoLaneScaleX } from "../actions/transform-actions";
import { SelectionAction, setNoteAsSelected, setSelectionTicks, unselectAllNotes } from "../actions/selection-actions";
import { HistoryAction, PianoRollHistoryItem, redo, undo } from "../actions/history-action";

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

export type PianoRollStoreAction = NoteAction | TransformAction | SelectionAction | HistoryAction

function reducer(state: PianoRollStore, action: PianoRollStoreAction) {
  switch (action.type) {
    case 'addNote': return addNote(state, action);
    case 'addNotes': return addNotes(state, action);
    case 'MODIFYING_NOTES': return modifyingNotes(state, action);
    // case 'BEGIN_MODIFYING_NOTES': return beginModifyingNotes(state, action);
    // case 'FINISH_MODIFYING_NOTES': return finishModifyingNotes(state, action);
    case 'unselectAllNotes': return unselectAllNotes(state, action);
    case 'setNoteAsSelected': return setNoteAsSelected(state, action);
    case 'toggleSelectedNoteVibratoMode': return toggleSelectedNoteVibratoMode(state, action);
    case 'vibratoDepthDelayChangeSelectedNote': return vibratoDepthDelayChangeSelectedNote(state, action);
    case 'vibratoRateChangeSelectedNote': return vibratoRateChangeSelectedNote(state, action);
    case 'setNoteInMarqueeAsSelected': return setNoteInMarqueeAsSelected(state, action);
    case 'updateNoteLyric': return updateNoteLyric(state, action);
    case 'moveNoteAsLatestModified': return moveNoteAsLatestModified(state, action);
    case 'setPianoLaneScaleX': return setPianoLaneScaleX(state, action);
    case 'setSelectionTicks': return setSelectionTicks(state, action);
    case 'deleteSelectedNotes': return deleteSelectedNotes(state, action);
    case 'setNoteModificationBuffer': return setNoteModificationBuffer(state, action)
    case 'setBpm':
      return {
        ...state,
        bpm: action.payload.bpm
      }
    case 'UNDO':
      return undo(state, action);
    case 'REDO':
      return redo(state, action);
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
    pianoRollNotes: new Array<TrackNoteEvent>(),
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
    scaling: {
      scaleX: 1,
      scaleY: 1,
    },

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
    pixelPerBeat: 70,
    tickPerBeat: 480,
    defaultNoteLyric: "啦",
    draggableBoundaryPixel: 10,

    resolution: 1,
    scrollTop: 0,

    currentTicks: 0,
    selectionTicks: 0,
    startingTick: 0,
    endingTick: 480 * 4 * 8,

    get scaledPixelPerBeat() {
      return this.pixelPerBeat * this.pianoLaneScaleX
    },

    get laneLength() {
      return (this.endingTick - this.startingTick) * this.pixelsPerTick
    },

    get canvasWidth() {
      return this.pianoLaneScaleX * this.laneLength;
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

    getNotesFromOffsetX(offsetX: number) {
      return this.pianoRollNotes.filter(note => note.tick <= this.getTickFromOffsetX(offsetX) && (note.tick + note.duration) >= this.getTickFromOffsetX(offsetX) )
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