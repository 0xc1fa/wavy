import { useState } from "react";
import useStore from "../hooks/useStore";
import { getNotesFromOffsetX } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";

enum VelocityEditorMouseHandlerMode {
  Idle,
  SelectAndDrag,
  Pencil,
}

export default function useVelocityEditorMouseHandlers() {
  const [isDragging, setIsDragging] = useState(false);
  const [mouseHandlerMode, setMouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.Pencil);
  const { pianoRollStore, dispatch } = useStore();
  const { scaleX } = useScaleX();

  const onPointerDown: React.PointerEventHandler = (event) => {
    const containerHeight = event.currentTarget.clientHeight;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        const notesInPosition = getNotesFromOffsetX(scaleX, pianoRollStore.notes, offsetX);
        const newVelocityInPercent = 1 - offsetY / containerHeight;
        const newVelocity = newVelocityInPercent * 127;
        const modifiedNotes = notesInPosition.map((note) => ({
          ...note,
          velocity: newVelocity,
        }));
        dispatch({
          type: "MODIFYING_NOTES",
          payload: { notes: modifiedNotes },
        });
        break;
      }
      case VelocityEditorMouseHandlerMode.SelectAndDrag: {
        const noteClicked = getNotesFromOffsetX(scaleX, pianoRollStore.notes, offsetX)[0];
        const noteClickedIsSelected = noteClicked?.isSelected;
        if (noteClicked) {
          if (!noteClicked.isSelected) {
            dispatch({ type: "UNSELECTED_ALL_NOTES" });
            dispatch({
              type: "SET_NOTE_AS_SELECTED",
              payload: { noteId: noteClicked.id },
            });
          }
          dispatch({
            type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
            payload: {
              initX: event.nativeEvent.offsetX,
              initY: event.nativeEvent.offsetY,
            },
          });
        }
        break;
      }
    }
    dispatch({
      type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
      payload: {
        initX: event.nativeEvent.offsetX,
        initY: event.nativeEvent.offsetY,
      },
    });
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    if (!isDragging) {
      return;
    }
    const containerHeight = event.currentTarget.clientHeight;
    const offsetX = event.nativeEvent.offsetX;
    const offsetY = event.nativeEvent.offsetY;
    switch (mouseHandlerMode) {
      case VelocityEditorMouseHandlerMode.Pencil: {
        const notesInPosition = getNotesFromOffsetX(scaleX, pianoRollStore.notes, offsetX);
        const newVelocityInPercent = 1 - offsetY / containerHeight;
        const newVelocity = newVelocityInPercent * 127;
        const modifiedNotes = notesInPosition.map((note) => ({
          ...note,
          velocity: newVelocity,
        }));
        dispatch({
          type: "MODIFYING_NOTES",
          payload: { notes: modifiedNotes },
        });
        dispatch({ type: "SET_LAST_MODIFIED_VELOCITY", payload: { velocity: newVelocity } });
      }
    }
  };

  const onPointerUp: React.PointerEventHandler = (event) => {
    setIsDragging(false);
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
