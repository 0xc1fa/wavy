import { TrackNoteEvent } from "react-piano-roll/dist/types";

export function setLegato(notes: TrackNoteEvent[], setNotes: (notes: TrackNoteEvent[]) => void) {
  console.log("SetLegatoActionItem clicked");
  let selectedNotes = notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
  let unselectedNotes = notes.filter((note) => !note.isSelected);
  for (let i = 0; i < selectedNotes.length - 1; i++) {
    selectedNotes[i].duration = selectedNotes[i + 1].tick - selectedNotes[i].tick;
  }
  setNotes([...unselectedNotes, ...selectedNotes]);
};
