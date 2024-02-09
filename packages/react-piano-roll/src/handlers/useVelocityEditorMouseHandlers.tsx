import { useRef, useState } from "react";
import { useStore } from "@/hooks/useStore";
import { getNotesFromOffsetX } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { TrackNoteEvent } from "@/types";
import { getNoteIdFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";

enum VelocityEditorMouseHandlerMode {
  Idle,
  SelectAndDrag,
  Pencil,
}

function getNoteObjectFromEvent(notes: TrackNoteEvent[], event: React.PointerEvent<Element>): TrackNoteEvent | null {
  const noteId = getNoteIdFromEvent(event);
  const note = notes.find((note) => note.id === noteId);
  return note ? note : null;
}

type Buffer = {
  bufferedNotes: TrackNoteEvent[];
  bufferedY: number;
};

export default function useVelocityEditorMouseHandlers() {
  const [mouseHandlerMode, setMouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.SelectAndDrag);
  const { pianoRollStore, dispatch } = useStore();
  const { scaleX } = useScaleX();
  const noteClicked = useRef<TrackNoteEvent | null>(null);

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    noteClicked.current = getNoteObjectFromEvent(pianoRollStore.notes, event);
    if (!noteClicked.current) {
      if (!event.shiftKey) {
        dispatch({ type: "UNSELECTED_ALL_NOTES" });
      }
      return;
    }
    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.Pencil) {
    } else if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      if (noteClicked.current.isSelected) {
      } else {
        if (!event.shiftKey) {
          dispatch({ type: "UNSELECTED_ALL_NOTES" });
        }
        dispatch({
          type: "SET_NOTE_AS_SELECTED",
          payload: { noteId: noteClicked.current.id },
        });
      }
      dispatch({
        type: "SET_NOTE_MODIFICATION_BUFFER_WITH_SELECTED_NOTE",
        payload: { initX: getRelativeX(event), initY: getRelativeY(event) },
      });
    }
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    if (!noteClicked.current) {
      return;
    }
    const containerHeight = event.currentTarget.clientHeight;
    const relativeY = getRelativeY(event);
    const initVelocity = getVelocityByRelativeY(containerHeight, pianoRollStore.noteModificationBuffer.initY);
    const currentVelocity = getVelocityByRelativeY(containerHeight, relativeY);
    const deltaVelocity = currentVelocity - initVelocity;
    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.Pencil) {
      const notes = getNotesFromOffsetX(scaleX, pianoRollStore.notes, event.clientX);
      const newNote = notes.map((note) => ({
        ...note,
        velocity: currentVelocity,
        isSelected: true,
      }));
      dispatch({
        type: "MODIFYING_NOTES",
        payload: { notes: newNote },
      });
    } else if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      const newNote = pianoRollStore.noteModificationBuffer.notesSelected.map((note) => ({
        ...note,
        velocity: note.velocity + deltaVelocity,
        isSelected: true,
      }));
      dispatch({
        type: "MODIFYING_NOTES",
        payload: { notes: newNote },
      });
    }
  };

  const onPointerUp: React.PointerEventHandler = (event) => {
    noteClicked.current = null;
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}

function getVelocityByRelativeY(containerHeight: number, relativeY: number): number {
  const velocityInPercent = 1 - relativeY / containerHeight;
  const velocity = velocityInPercent * 127;
  return velocity;
}
