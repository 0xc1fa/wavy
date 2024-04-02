import { PianoRollData } from "react-piano-roll";

export function doubleTime(data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
  let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
  let unselectedNotes = data.notes.filter((note) => !note.isSelected);
  const startingTick = selectedNotes[0].tick;
  for (let i = 0; i < selectedNotes.length; i++) {
    selectedNotes[i].tick = startingTick + (selectedNotes[i].tick - startingTick) * 2;
    selectedNotes[i].duration = selectedNotes[i].duration * 2;
  }
  set({ notes: [...unselectedNotes, ...selectedNotes] });
}
