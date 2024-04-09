import { PianoRollData } from "react-piano-roll";

// export function halfTime(data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
//   let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
//   let unselectedNotes = data.notes.filter((note) => !note.isSelected);
//   const startingTick = selectedNotes[0].tick;
//   for (let i = 0; i < selectedNotes.length; i++) {
//     selectedNotes[i].tick = startingTick + (selectedNotes[i].tick - startingTick) / 2;
//     selectedNotes[i].duration = selectedNotes[i].duration / 2;
//   }
//   set({ notes: [...unselectedNotes, ...selectedNotes] });
// }

export function scaleNoteTime(
  scale: number,
): (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) => void {
  return function (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
    let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
    let unselectedNotes = data.notes.filter((note) => !note.isSelected);
    const startingTick = selectedNotes[0].tick;
    for (let i = 0; i < selectedNotes.length; i++) {
      selectedNotes[i].tick = startingTick + (selectedNotes[i].tick - startingTick) * scale;
      selectedNotes[i].duration = selectedNotes[i].duration * scale;
    }
    set({ notes: [...unselectedNotes, ...selectedNotes] });
  };
}

export const halfTime = scaleNoteTime(0.5);
export const doubleTime = scaleNoteTime(2);
