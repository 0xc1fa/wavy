import { getSelectedNotes, getUnselectedNotes, sortNotes } from "@/utils/notes";
import { PianoRollData } from "react-piano-roll";

export function scaleNoteTime(
  scale: number,
): (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) => void {
  return function (data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
    let selectedNotes = sortNotes(getSelectedNotes(data));
    let unselectedNotes = getUnselectedNotes(data);
    const startingTick = selectedNotes[0].tick;
    selectedNotes.forEach((_, i) => {
      selectedNotes[i].tick = startingTick + (selectedNotes[i].tick - startingTick) * scale;
      selectedNotes[i].duration = selectedNotes[i].duration * scale;
    });
    set({ notes: [...unselectedNotes, ...selectedNotes] });
  };
}

export const halfTime = scaleNoteTime(0.5);
export const doubleTime = scaleNoteTime(2);
