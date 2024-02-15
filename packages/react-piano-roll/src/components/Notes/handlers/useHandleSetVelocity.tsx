import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { useStore } from "@/hooks/useStore";
import { useRef } from "react";
import _ from "lodash";

export function useHandleSetVelocity() {
  const { pianoRollStore, dispatch } = useStore();
  const active = useRef(false);

  const handleSetVelocityPD: React.PointerEventHandler = (event) => {
    if (!event.metaKey) {
      return;
    }
    const noteClicked = getNoteObjectFromEvent(pianoRollStore.notes, event);
    if (!noteClicked) {
      return;
    }
    active.current = true;
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    dispatch({
      type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
      payload: { initX: relativeX, initY: relativeY },
    });
  };

  const handleSetVelocityPM: React.PointerEventHandler = (event) => {
    if (!active.current) {
      return;
    }
    const bufferedNotes = pianoRollStore.noteModificationBuffer.notesSelected;
    const noteClicked = _.last(bufferedNotes);
    const relativeY = getRelativeY(event);
    const deltaY = relativeY - pianoRollStore.noteModificationBuffer.initY;
    const newNotes = bufferedNotes.map((bufferedNote) => ({
      ...bufferedNote,
      velocity: bufferedNote.velocity - deltaY / 3,
    }));
    dispatch({ type: "MODIFYING_NOTES", payload: { notes: newNotes } });
    dispatch({ type: "SET_LAST_MODIFIED_VELOCITY", payload: { velocity: noteClicked!.velocity - deltaY / 3 } });
  };

  const handleSetVelocityPU: React.PointerEventHandler = (event) => {
    active.current = false;
  };

  return {
    handleSetVelocityPD,
    handleSetVelocityPM,
    handleSetVelocityPU,
  };
}
