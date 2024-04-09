import { getSelectedNotes, getUnselectedNotes, sortNotes } from "@/utils/notes";
import { PianoRollData } from "react-piano-roll";

export function setLegato(data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
  console.log("SetLegatoActionItem clicked");
  let selectedNotes = sortNotes(getSelectedNotes(data));
  let unselectedNotes = getUnselectedNotes(data);
  for (let i = 0; i < selectedNotes.length - 1; i++) {
    selectedNotes[i].duration = selectedNotes[i + 1].tick - selectedNotes[i].tick;
  }
  set({ notes: [...unselectedNotes, ...selectedNotes] });
}
