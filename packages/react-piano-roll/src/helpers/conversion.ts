import { baseLaneWidth, basePixelsPerBeat, ticksPerBeat } from "@/constants";
import { TrackNoteEvent } from "@/types";

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

export function getNotesFromOffsetX(scaleX: number, notes: TrackNoteEvent[], offsetX: number, ) {
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