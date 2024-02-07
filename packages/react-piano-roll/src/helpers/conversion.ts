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

export function getNotesFromOffsetX(scaleX: number, notes: TrackNoteEvent[], offsetX: number, ) {
  return notes.filter(
    (note) =>
      note.tick <= getTickFromOffsetX(offsetX, scaleX) &&
      note.tick + note.duration >= getTickFromOffsetX(offsetX, scaleX),
  );
}