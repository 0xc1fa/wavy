import { PianoRollData } from "@midi-editor/react";

export function getSelectedNotes(data: PianoRollData) {
  return data.notes.filter((note) => note.isSelected);
}

export function sortNotes(notes: PianoRollData["notes"]) {
  return notes.sort((a, b) => a.tick - b.tick);
}

export function getUnselectedNotes(data: PianoRollData) {
  return data.notes.filter((note) => !note.isSelected);
}
