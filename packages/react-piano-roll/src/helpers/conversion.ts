import {
  baseBlackKeyLength,
  baseKeyWidth,
  baseLaneWidth,
  basePixelsPerBeat,
  baseWhiteKeyWidth,
  draggableBoundaryPixel,
  ticksPerBeat,
} from "@/constants";
import { PianoRollRange } from "@/interfaces/piano-roll-range";
import { TrackNoteEvent } from "@/types";
import { isBlackKey } from ".";
import { Offset, convertOffsetToObject, convertOffsetToTuple } from "@/interfaces/offset";

export function getBeatFromOffsetX(offsetX: number, scaleX: number) {
  return offsetX / (scaleX * basePixelsPerBeat);
}

export function getTickFromOffsetX(offsetX: number, scaleX: number) {
  return (offsetX / (scaleX * basePixelsPerBeat)) * ticksPerBeat;
}

export function getNoteNumFromOffsetY(numOfKeys: number, offsetY: number) {
  return Math.floor(numOfKeys - offsetY / baseLaneWidth);
}

export function getMinYFromNoteNum(numOfKeys: number, noteNum: number) {
  return (numOfKeys - noteNum - 1) * baseLaneWidth;
}

export function getMaxYFromNoteNum(numOfKeys: number, noteNum: number) {
  return (numOfKeys - noteNum) * baseLaneWidth;
}

export function getCenterYFromNoteNum(numOfKeys: number, noteNum: number) {
  return (getMinYFromNoteNum(numOfKeys, noteNum) + getMaxYFromNoteNum(numOfKeys, noteNum)) / 2;
}

export function getNotesFromOffsetX(scaleX: number, notes: TrackNoteEvent[], offsetX: number) {
  return notes.filter(
    (note) =>
      note.tick <= getTickFromOffsetX(offsetX, scaleX) &&
      note.tick + note.duration >= getTickFromOffsetX(offsetX, scaleX),
  );
}

export function getNoteNameFromNoteNum(noteNum: number) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const noteNameIndex = noteNum % 12;
  const octave = Math.floor(noteNum / 12) - 1;
  return `${noteNames[noteNameIndex]}${octave}`;
}

export function getOffsetXFromTick(scaleX: number, tick: number) {
  return (tick / ticksPerBeat) * basePixelsPerBeat * scaleX;
}

export function getNoteFromPosition(
  scaleX: number,
  numOfKeys: number,
  notes: TrackNoteEvent[],
  position: { offsetX: number; offsetY: number } | [number, number],
): TrackNoteEvent | null {
  if (Array.isArray(position)) {
    position = { offsetX: position[0], offsetY: position[1] };
  }
  for (const note of notes.slice().reverse()) {
    if (
      getNoteNumFromOffsetY(numOfKeys, position.offsetY) == note.noteNumber &&
      getTickFromOffsetX(position.offsetX, scaleX) >= note.tick &&
      getTickFromOffsetX(position.offsetX, scaleX) <= note.tick + note.duration
    ) {
      return note;
    }
  }
  return null;
}

export function getWhiteKeyNumFromPosition(range: PianoRollRange, y: number) {
  let currentY = 0;
  for (let keyNum = range.numOfKeys - 1; keyNum >= range.startingNoteNum; keyNum--) {
    if (isBlackKey(keyNum)) {
      continue;
    }
    if (y >= currentY && y <= currentY + baseWhiteKeyWidth) {
      return keyNum;
    }
    currentY += baseWhiteKeyWidth;
  }
  return -1;
}

export function getBlackKeyNumFromPosition(numOfKeys: number, y: number) {
  return Math.floor(numOfKeys - y / baseKeyWidth);
}

export function isInnerKeyboard(x: number) {
  return x < baseBlackKeyLength;
}

export function getPianoKeyNumFromPosition(range: PianoRollRange, x: number, y: number) {
  const estimatedKeyNum = Math.floor(range.numOfKeys - y / baseKeyWidth);
  if (!isInnerKeyboard(x)) {
    return getWhiteKeyNumFromPosition({ numOfKeys: range.numOfKeys, startingNoteNum: range.startingNoteNum }, y);
  } else if (isInnerKeyboard(x) && isBlackKey(estimatedKeyNum)) {
    return getBlackKeyNumFromPosition(range.numOfKeys, y);
  } else {
    return getWhiteKeyNumFromPosition({ numOfKeys: range.numOfKeys, startingNoteNum: range.startingNoteNum }, y);
  }
}

export function getNoteFromEvent(
  numOfKeys: number,
  scaleX: number,
  notes: TrackNoteEvent[],
  e: PointerEvent | MouseEvent,
): TrackNoteEvent | null {
  return getNoteFromPosition(scaleX, numOfKeys, notes, [e.offsetX, e.offsetY]);
}

export function getNoteNumFromEvent(numOfKeys: number, e: PointerEvent | MouseEvent): number {
  return getNoteNumFromOffsetY(numOfKeys, e.offsetY);
}

export function getTickFromEvent(scaleX: number, e: PointerEvent | MouseEvent): number {
  return getTickFromOffsetX(e.offsetX, scaleX);
}

export function roundDownTickToNearestGrid(tick: number) {
  return tick - (tick % ticksPerBeat);
}

export function isNoteLeftMarginClicked(numOfKeys: number, scaleX: number, note: TrackNoteEvent, offset: Offset) {
  offset = convertOffsetToObject(offset);
  if (
    getNoteNumFromOffsetY(numOfKeys, offset.y) == note.noteNumber &&
    offset.x >= getOffsetXFromTick(scaleX, note.tick) &&
    offset.x <= getOffsetXFromTick(scaleX, note.tick) + draggableBoundaryPixel
  ) {
    return true;
  } else {
    return false;
  }
}

export function isNoteRightMarginClicked(numOfKeys: number, scaleX: number, note: TrackNoteEvent, offset: Offset) {
  offset = convertOffsetToObject(offset);
  if (
    getNoteNumFromOffsetY(numOfKeys, offset.y) == note.noteNumber &&
    offset.x <= getOffsetXFromTick(scaleX, note.tick + note.duration) &&
    offset.x >= getOffsetXFromTick(scaleX, note.tick + note.duration) - draggableBoundaryPixel
  ) {
    return true;
  } else {
    return false;
  }
}

export function inMarquee(
  numOfKeys: number,
  scaleX: number,
  note: TrackNoteEvent,
  marquee: {
    startingPosition: { x: number; y: number };
    ongoingPosition: { x: number; y: number };
  },
) {
  const [selectedMinNoteNum, selectedMaxNoteNum] = [
    getNoteNumFromOffsetY(numOfKeys, marquee.startingPosition.y),
    getNoteNumFromOffsetY(numOfKeys, marquee.ongoingPosition.y),
  ].sort((a, b) => a - b);
  const [selectedMinTick, selectedMaxTick] = [
    getTickFromOffsetX(marquee.startingPosition.x, scaleX),
    getTickFromOffsetX(marquee.ongoingPosition.x, scaleX),
  ].sort((a, b) => a - b);

  return (
    note.noteNumber >= selectedMinNoteNum &&
    note.noteNumber <= selectedMaxNoteNum &&
    note.tick + note.duration >= selectedMinTick &&
    note.tick <= selectedMaxTick
  );
}

export function canvasHeight(numOfKeys: number) {
  return baseLaneWidth * numOfKeys;
}
