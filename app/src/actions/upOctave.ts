import { PianoRollData } from "react-piano-roll";
import { PianoRollNote } from "react-piano-roll/dist/types";

export function upOctave(data: PianoRollData, set: (data: PianoRollData) => void) {
  let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
  let unselectedNotes = data.notes.filter((note) => !note.isSelected);
  for (let i = 0; i < selectedNotes.length; i++) {
    selectedNotes[i].noteNumber = selectedNotes[i].noteNumber + 12;
  }
  set({ notes: [...unselectedNotes, ...selectedNotes] });
}
