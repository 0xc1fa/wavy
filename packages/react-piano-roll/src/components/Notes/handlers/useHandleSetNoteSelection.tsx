import { moveNoteAsLatestModifiedAtom, notesAtom, setNoteAsSelectedAtom, unselectAllNotesAtom } from "@/atoms/note";
import { getNoteObjectFromEvent } from "@/helpers/event";
import { TrackNoteEvent } from "@/types";
import { useAtom } from "jotai";

export function useHandleSetNoteSelection() {
  // const { pianoRollStore, dispatch } = useStore();
  const [notes] = useAtom(notesAtom)
  const [, unselectAllNotes] = useAtom(unselectAllNotesAtom)
  const [, setNoteAsSelected] = useAtom(setNoteAsSelectedAtom)
  const [, moveNoteAsLatestModified] = useAtom(moveNoteAsLatestModifiedAtom)

  function handleSetNoteSelectionPD(event: React.PointerEvent<Element>) {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    setNoteSelection(event, noteClicked);
  }

  const setNoteSelection = (event: React.PointerEvent<Element>, noteClicked: TrackNoteEvent | null) => {
    if (!noteClicked) {
      if (!event.shiftKey) {
        unselectAllNotes();
      }
    } else if (!noteClicked.isSelected && !event.shiftKey) {
      unselectAllNotes();
      setNoteAsSelected(noteClicked?.id!);
    } else {
      setNoteAsSelected(noteClicked?.id!);
    }
    if (noteClicked) {
      moveNoteAsLatestModified(noteClicked.id)
    }
  };

  return {
    handleSetNoteSelectionPD,
  };
}
