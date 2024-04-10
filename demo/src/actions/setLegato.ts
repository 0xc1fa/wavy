import { getSelectedNotes, getUnselectedNotes, sortNotes } from "@/utils/notes";
import { PianoRollData } from "@midi-editor/react";

export function setLegato(data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
  console.log("SetLegatoActionItem clicked");
  const selectedNotes = sortNotes(getSelectedNotes(data));
  const unselectedNotes = getUnselectedNotes(data);
  for (let i = 0; i < selectedNotes.length - 1; i++) {
    selectedNotes[i].duration = selectedNotes[i + 1].tick - selectedNotes[i].tick;
  }
  set({ notes: [...unselectedNotes, ...selectedNotes] });
}
