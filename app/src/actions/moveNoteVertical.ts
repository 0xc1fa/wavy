import { PianoRollData } from "react-piano-roll";

export function moveNoteVertical(semitone: number) {
  return function (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
    let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
    let unselectedNotes = data.notes.filter((note) => !note.isSelected);
    for (let i = 0; i < selectedNotes.length; i++) {
      selectedNotes[i].noteNumber = selectedNotes[i].noteNumber + semitone;
    }
    set({ notes: [...unselectedNotes, ...selectedNotes] });
  };
}

export const downOctave = moveNoteVertical(-12);
export const upOctave = moveNoteVertical(12);
