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
import { TransformAction, setPianoLaneScaleX } from "../actions/transform-actions";
import { SelectionAction, setNoteAsSelected, setSelectionTicks, unselectAllNotes } from "../actions/selection-actions";
import { HistoryAction, PianoRollHistoryItem, redo, undo } from "../actions/history-action";
import { MetaAction, setClipSpan } from "@/actions/meta-action";
import { baseKeyLength, baseKeyWidth, baseLaneWidth, basePixelsPerBeat, blackKeyLengthRatio, draggableBoundaryPixel, ticksPerBeat } from "@/constants";

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
      return setPianoLaneScaleX(state, action);
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

    pianoLaneScaleX: 1,
    pianoLaneScaleY: 1,
    defaultVelocity: 64,
    defaultDuration: 480,

    startingOctave: -1,
    endingOctave: 10,

    defaultNoteLyric: "啦",

    selectionTicks: 0,
    startingTick: 0,
    endingTick: 480 * 4 * 64,

    get scaledPixelPerBeat() {
      return basePixelsPerBeat * this.pianoLaneScaleX;
    },

    get laneLength() {
      return (this.endingTick - this.startingTick) * this.pixelsPerTick;
    },

    get canvasWidth() {
      return this.pianoLaneScaleX * this.laneLength;
    },

    get startingNoteNum() {
      return 0;
    },
    get numOfKeys() {
      return 128;
    },
    get pixelsPerTick() {
      return basePixelsPerBeat / ticksPerBeat;
    },
    get canvasHeight() {
      return baseLaneWidth * this.numOfKeys;
    },
    get whiteKeyWidth() {
      return (baseKeyWidth * 12) / 7;
    },
    get blackKeyLength() {
      return baseKeyLength * blackKeyLengthRatio;
    },

    getBeatFromOffsetX(offsetX: number) {
      return offsetX / (this.pianoLaneScaleX * basePixelsPerBeat);
    },

    getTickFromOffsetX(offsetX: number) {
      return (offsetX / (this.pianoLaneScaleX * basePixelsPerBeat)) * ticksPerBeat;
    },

    getNoteNumFromOffsetY(offsetY: number) {
      return Math.floor(this.numOfKeys - offsetY / baseLaneWidth);
    },

    getCenterYFromNoteNum(noteNum: number) {
      return (this.getMinYFromNoteNum(noteNum) + this.getMaxYFromNoteNum(noteNum)) / 2;
    },

    getNoteNameFromNoteNum(noteNum: number) {
      const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const noteNameIndex = noteNum % 12;
      const octave = Math.floor(noteNum / 12) - 1;
      return `${noteNames[noteNameIndex]}${octave}`;
    },

    getMinYFromNoteNum(noteNum: number) {
      return (this.numOfKeys - noteNum - 1) * baseLaneWidth;
    },

    getMaxYFromNoteNum(noteNum: number) {
      return (this.numOfKeys - noteNum) * baseLaneWidth;
    },

    getOffsetXFromTick(tick: number) {
      return (tick / ticksPerBeat) * basePixelsPerBeat * this.pianoLaneScaleX;
    },

    getNoteFromPosition(offsetX: number, offsetY: number): TrackNoteEvent | null {
      for (const note of this.pianoRollNotes.slice().reverse()) {
        if (
          this.getNoteNumFromOffsetY(offsetY) == note.noteNumber &&
          this.getTickFromOffsetX(offsetX) >= note.tick &&
          this.getTickFromOffsetX(offsetX) <= note.tick + note.duration
        ) {
          return note;
        }
      }
      return null;
    },

    getNotesFromOffsetX(offsetX: number) {
      return this.pianoRollNotes.filter(
        (note) =>
          note.tick <= this.getTickFromOffsetX(offsetX) &&
          note.tick + note.duration >= this.getTickFromOffsetX(offsetX),
      );
    },

    getWhiteKeyNumFromPosition(y: number) {
      let currentY = 0;
      for (let keyNum = this.numOfKeys - 1; keyNum >= this.startingNoteNum; keyNum--) {
        if (isBlackKey(keyNum)) {
          continue;
        }
        if (y >= currentY && y <= currentY + this.whiteKeyWidth) {
          return keyNum;
        }
        currentY += this.whiteKeyWidth;
      }
      return -1;
    },

    getBlackKeyNumFromPosition(y: number) {
      return Math.floor(this.numOfKeys - y / baseKeyWidth);
    },

    getPianoKeyNumFromPosition(x: number, y: number) {
      const estimatedKeyNum = Math.floor(this.numOfKeys - y / baseKeyWidth);
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
      return tick - (tick % ticksPerBeat);
    },

    clearCanvas(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, this.laneLength, this.canvasHeight);
    },

    isInnerKeyboard(x: number) {
      const blackKeyLength = baseKeyLength * blackKeyLengthRatio;
      return x < blackKeyLength;
    },

    isNoteLeftMarginClicked(note: TrackNoteEvent, offsetX: number, offsetY: number) {
      if (
        this.getNoteNumFromOffsetY(offsetY) == note.noteNumber &&
        offsetX >= this.getOffsetXFromTick(note.tick) &&
        offsetX <= this.getOffsetXFromTick(note.tick) + draggableBoundaryPixel
      ) {
        return true;
      } else {
        return false;
      }
    },

    isNoteRightMarginClicked(note: TrackNoteEvent, offsetX: number, offsetY: number) {
      if (
        this.getNoteNumFromOffsetY(offsetY) == note.noteNumber &&
        offsetX <= this.getOffsetXFromTick(note.tick + note.duration) &&
        offsetX >= this.getOffsetXFromTick(note.tick + note.duration) - draggableBoundaryPixel
      ) {
        return true;
      } else {
        return false;
      }
    },

    inMarquee(
      note: TrackNoteEvent,
      marquee: {
        startingPosition: { x: number; y: number };
        ongoingPosition: { x: number; y: number };
      },
    ) {
      const [selectedMinNoteNum, selectedMaxNoteNum] = [
        this.getNoteNumFromOffsetY(marquee.startingPosition.y),
        this.getNoteNumFromOffsetY(marquee.ongoingPosition.y),
      ].sort((a, b) => a - b);
      const [selectedMinTick, selectedMaxTick] = [
        this.getTickFromOffsetX(marquee.startingPosition.x),
        this.getTickFromOffsetX(marquee.ongoingPosition.x),
      ].sort((a, b) => a - b);

      return (
        note.noteNumber >= selectedMinNoteNum &&
        note.noteNumber <= selectedMaxNoteNum &&
        note.tick + note.duration >= selectedMinTick &&
        note.tick <= selectedMaxTick
      );
    },
  };
}
