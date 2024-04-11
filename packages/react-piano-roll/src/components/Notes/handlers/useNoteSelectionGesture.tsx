import { moveNoteAsLatestModifiedAtom, notesAtom, selectedNoteIdsAtom } from "@/store/note";
import { getNoteObjectFromEvent } from "@/helpers/event";
import { PianoRollNote } from "@/types";
import { useAtom } from "jotai";
import { create } from "mutative";
import { useEventListener } from "@/hooks/useEventListener";
import { RefObject } from "react";

export function useNoteSelectionGesture<T extends HTMLElement>(ref: RefObject<T>) {
  const [notes] = useAtom(notesAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const [, moveNoteAsLatestModified] = useAtom(moveNoteAsLatestModifiedAtom);

  const setNoteSelection = (event: PointerEvent, noteClicked: PianoRollNote | null) => {
    if (!noteClicked) {
      if (!event.shiftKey) {
        setSelectedNoteIds(new Set());
      }
    } else if (!selectedNoteIds.has(noteClicked.id) && !event.shiftKey) {
      setSelectedNoteIds(new Set([noteClicked.id]));
    } else {
      setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(noteClicked.id)));
    }
    if (noteClicked) {
      moveNoteAsLatestModified(noteClicked.id);
    }
  };

  useEventListener(ref, "pointerdown", (event: PointerEvent) => {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    setNoteSelection(event, noteClicked);
  });
}
