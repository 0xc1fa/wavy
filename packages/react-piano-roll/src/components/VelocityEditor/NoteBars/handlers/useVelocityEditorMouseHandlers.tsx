import { useRef, useState } from "react";
// import { useStore } from "@/hooks/useStore";
import { getNotesFromOffsetX } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { PianoRollNote } from "@/types";
import { getNoteIdFromEvent, getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { modifyingNotesAtom, notesAtom, selectedNoteIdsAtom } from "@/store/note";
import {
  noteModificationBufferAtom,
  setNoteModificationBufferWithAllNotesAtom,
} from "@/store/note-modification-buffer";
import { create } from "mutative";

enum VelocityEditorMouseHandlerMode {
  Idle,
  SelectAndDrag,
  Pencil,
}

type Buffer = {
  bufferedNotes: PianoRollNote[];
  bufferedY: number;
};

export default function useVelocityEditorMouseHandlers() {
  const [mouseHandlerMode, setMouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.SelectAndDrag);
  const notes = useAtomValue(notesAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const setNoteModificationBufferWithSelectedNote = useSetAtom(setNoteModificationBufferWithAllNotesAtom);
  const modifyingNote = useSetAtom(modifyingNotesAtom);

  const { scaleX } = useScaleX();
  const noteClicked = useRef<PianoRollNote | null>(null);

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    noteClicked.current = getNoteObjectFromEvent(notes, event);
    if (!noteClicked.current) {
      if (!event.shiftKey) {
        // unselectedAllNotes();
        setSelectedNoteIds(new Set());
      }
      return;
    }
    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.Pencil) {
    } else if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      if (selectedNoteIds.has(noteClicked.current.id)) {
      } else {
        if (!event.shiftKey) {
          setSelectedNoteIds(new Set());
        }
        if (noteClicked.current !== null) {
          setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(noteClicked.current!.id)));
        }
      }
      setNoteModificationBufferWithSelectedNote({ initX: getRelativeX(event), initY: getRelativeY(event) });
    }
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    if (!noteClicked.current) {
      return;
    }
    const containerHeight = event.currentTarget.clientHeight;
    const relativeY = getRelativeY(event);
    const initVelocity = getVelocityByRelativeY(containerHeight, noteModificationBuffer.initY);
    const currentVelocity = getVelocityByRelativeY(containerHeight, relativeY);
    const deltaVelocity = currentVelocity - initVelocity;
    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.Pencil) {
      const notesGot = getNotesFromOffsetX(scaleX, notes, event.clientX);
      const newNote = notesGot.map((note) => ({
        ...note,
        velocity: currentVelocity,
        // isSelected: true,
      }));
      modifyingNote(newNote);
    } else if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      const newNote = noteModificationBuffer.notesSelected.map((note) => ({
        ...note,
        velocity: note.velocity + deltaVelocity,
        // isSelected: true,
      }));
      modifyingNote(newNote);
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
