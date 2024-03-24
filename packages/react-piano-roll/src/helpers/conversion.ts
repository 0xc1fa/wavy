import {
  baseBlackKeyLength,
  baseKeyWidth,
  baseLaneWidth,
  basePixelsPerBeat,
  basePixelsPerTick,
  baseWhiteKeyWidth,
  draggableBoundaryPixel,
  ticksPerBeat,
} from "@/constants";
import { PitchRange } from "@/types/piano-roll-range";
import { PianoRollNote } from "@/types";
import { isBlackKey } from ".";
import { Offset, convertOffsetToObject, convertOffsetToTuple } from "@/types/offset";
import { TickRange } from "@/contexts/PianoRollConfigProvider";
import { getTickInGrid } from "./grid";

export function getBeatFromOffsetX(scaleX: number, offsetX: number) {
  return offsetX / (scaleX * basePixelsPerBeat);
}

export function getTickFromOffsetX(scaleX: number, offsetX: number) {
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

export function getNotesFromOffsetX(scaleX: number, notes: PianoRollNote[], offsetX: number) {
  return notes.filter(
    (note) =>
      note.tick <= getTickFromOffsetX(scaleX, offsetX) &&
      note.tick + note.duration >= getTickFromOffsetX(scaleX, offsetX),
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
  notes: PianoRollNote[],
  position: { offsetX: number; offsetY: number } | [number, number],
): PianoRollNote | null {
  if (Array.isArray(position)) {
    position = { offsetX: position[0], offsetY: position[1] };
  }
  for (const note of notes.slice().reverse()) {
    if (
      getNoteNumFromOffsetY(numOfKeys, position.offsetY) == note.noteNumber &&
      getTickFromOffsetX(scaleX, position.offsetX) >= note.tick &&
      getTickFromOffsetX(scaleX, position.offsetX) <= note.tick + note.duration
    ) {
      return note;
    }
  }
  return null;
}

export function getWhiteKeyNumFromPosition(range: PitchRange, y: number) {
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

export function getPianoKeyNumFromPosition(range: PitchRange, x: number, y: number) {
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
  notes: PianoRollNote[],
  e: PointerEvent | MouseEvent,
): PianoRollNote | null {
  return getNoteFromPosition(scaleX, numOfKeys, notes, [e.offsetX, e.offsetY]);
}

export function getNoteNumFromEvent(numOfKeys: number, e: PointerEvent | MouseEvent): number {
  return getNoteNumFromOffsetY(numOfKeys, e.offsetY);
}

export function getTickFromEvent(scaleX: number, e: PointerEvent | MouseEvent): number {
  return getTickFromOffsetX(scaleX, e.offsetX);
}

export function roundDownTickToNearestGrid(tick: number, scaleX: number) {
  return tick - (tick % getTickInGrid(scaleX));
}

export function isNoteLeftMarginClicked(numOfKeys: number, scaleX: number, note: PianoRollNote, offset: Offset) {
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

export function isNoteRightMarginClicked(numOfKeys: number, scaleX: number, note: PianoRollNote, offset: Offset) {
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
  note: PianoRollNote,
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
    getTickFromOffsetX(scaleX, marquee.startingPosition.x),
    getTickFromOffsetX(scaleX, marquee.ongoingPosition.x),
  ].sort((a, b) => a - b);

  return (
    note.noteNumber >= selectedMinNoteNum &&
    note.noteNumber <= selectedMaxNoteNum &&
    note.tick + note.duration >= selectedMinTick &&
    note.tick <= selectedMaxTick
  );
}

export function baseCanvasHeight(numOfKeys: number) {
  return baseLaneWidth * numOfKeys;
}

export function baseCanvasWidth(tickRange: TickRange) {
  return (tickRange[1] - tickRange[0]) * basePixelsPerTick;
}

export function getScaledPixelPerBeat(scaleX: number) {
  return basePixelsPerBeat * scaleX;
}
