import { getNoteObjectFromEvent } from "@/helpers/event";
import { useStore } from "@/hooks/useStore";
import { TrackNoteEvent } from "@/types";

export function useHandleSetNoteSelection() {
  const { pianoRollStore, dispatch } = useStore();

  function handleSetNoteSelectionPD(event: React.PointerEvent<Element>) {
    const noteClicked = getNoteObjectFromEvent(pianoRollStore.notes, event);
    setNoteSelection(event, noteClicked);
  }

  const setNoteSelection = (event: React.PointerEvent<Element>, noteClicked: TrackNoteEvent | null) => {
    if (!noteClicked) {
      if (!event.shiftKey) {
        dispatch({ type: "UNSELECTED_ALL_NOTES" });
      }
    } else if (!noteClicked.isSelected && !event.shiftKey) {
      dispatch({ type: "UNSELECTED_ALL_NOTES" });
      dispatch({
        type: "SET_NOTE_AS_SELECTED",
        payload: { noteId: noteClicked?.id! },
      });
    } else {
      dispatch({
        type: "SET_NOTE_AS_SELECTED",
        payload: { noteId: noteClicked?.id! },
      });
    }
    if (noteClicked) {
      dispatch({ type: "MOVE_NOTE_AS_LATEST_MODIFIED", payload: { noteId: noteClicked.id } });
    }
  };

  return {
    handleSetNoteSelectionPD,
  };
}
