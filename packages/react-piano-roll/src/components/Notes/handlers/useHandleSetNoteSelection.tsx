import { moveNoteAsLatestModifiedAtom, notesAtom, selectedNoteIdsAtom } from "@/store/note";
import { getNoteObjectFromEvent } from "@/helpers/event";
import { PianoRollNote } from "@/types";
import { useAtom } from "jotai";
import { create } from "mutative";

export function useHandleSetNoteSelection() {
  const [notes] = useAtom(notesAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const [, moveNoteAsLatestModified] = useAtom(moveNoteAsLatestModifiedAtom);

  function handleSetNoteSelectionPD(event: React.PointerEvent<Element>) {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    setNoteSelection(event, noteClicked);
  }

  const setNoteSelection = (event: React.PointerEvent<Element>, noteClicked: PianoRollNote | null) => {
    if (!noteClicked) {
      if (!event.shiftKey) {
        setSelectedNoteIds(new Set())
      }
    } else if (!selectedNoteIds.has(noteClicked.id) && !event.shiftKey) {
      setSelectedNoteIds(new Set([noteClicked.id]));
    } else {
      setSelectedNoteIds(prev => create(prev, (draft) => draft.add(noteClicked.id)))
    }
    if (noteClicked) {
      moveNoteAsLatestModified(noteClicked.id);
    }
  };

  return {
    handleSetNoteSelectionPD,
  };
}
