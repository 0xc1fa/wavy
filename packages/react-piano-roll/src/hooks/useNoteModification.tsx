import { TrackNoteEvent } from "@/types";
import { PianoRollStoreAction } from "@/store/pianoRollStore";
import { useNotes } from "@/helpers/notes";
import { useStore } from "..";

function setSelectedNotesAsLegato(notes: TrackNoteEvent[], dispatch: React.Dispatch<PianoRollStoreAction>) {
  let selectedNote = notes.filter((note) => note.isSelected).sort((a, b) => a.tick - b.tick);
  for (let i = 0; i < selectedNote.length - 1; i++) {
    selectedNote[i].duration = selectedNote[i + 1].tick - selectedNote[i].tick;
  }
  dispatch({ type: "MODIFYING_NOTES", payload: { notes: selectedNote } });
}

export function useNoteModification() {
  const pianoRollNote = useNotes();
  const { dispatch } = useStore();

  return {
    setSelectedNotesAsLegato: () => setSelectedNotesAsLegato(pianoRollNote, dispatch),
  };
}
