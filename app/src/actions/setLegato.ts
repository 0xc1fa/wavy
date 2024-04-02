import { PianoRollData } from "react-piano-roll";

export function setLegato(data: PianoRollData, set: (notes: Partial<PianoRollData>) => void) {
  console.log("SetLegatoActionItem clicked");
  let selectedNotes = data.notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
  let unselectedNotes = data.notes.filter((note) => !note.isSelected);
  for (let i = 0; i < selectedNotes.length - 1; i++) {
    selectedNotes[i].duration = selectedNotes[i + 1].tick - selectedNotes[i].tick;
  }
  set({ notes: [...unselectedNotes, ...selectedNotes] });
}
