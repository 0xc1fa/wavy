import { useRef, useState } from "react";
import { getNotesFromOffsetX } from "@/helpers/conversion";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { PianoRollNote } from "@/types";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
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

export default function useVelocityEditorMouseHandlers() {
  const [mouseHandlerMode] = useState(VelocityEditorMouseHandlerMode.SelectAndDrag);
  const notes = useAtomValue(notesAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const setNoteModificationBufferWithSelectedNote = useSetAtom(setNoteModificationBufferWithAllNotesAtom);
  const modifyingNote = useSetAtom(modifyingNotesAtom);

  const { scaleX } = useScaleX();
  const noteClicked = useRef<PianoRollNote | null>(null);

  const handleNoteSelection = (event: React.PointerEvent) => {
    if (!noteClicked.current) {
      if (!event.shiftKey) setSelectedNoteIds(new Set());
      return false;
    }

    if (!selectedNoteIds.has(noteClicked.current.id) && noteClicked.current !== null) {
      if (!event.shiftKey) setSelectedNoteIds(new Set());
      setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(noteClicked.current!.id)));
    }

    setNoteModificationBufferWithSelectedNote({ initX: getRelativeX(event), initY: getRelativeY(event) });
    return true; // Indicates a note was clicked and handled
  };

  const onPointerDown: React.PointerEventHandler = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    noteClicked.current = getNoteObjectFromEvent(notes, event);

    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      handleNoteSelection(event);
    }
  };

  const onPointerMove: React.PointerEventHandler = (event) => {
    if (!noteClicked.current) return;
    const containerHeight = event.currentTarget.clientHeight;
    const relativeY = getRelativeY(event);
    const deltaVelocity = getVelocityByRelativeY(containerHeight, relativeY) - getVelocityByRelativeY(containerHeight, noteModificationBuffer.initY);

    let notesToUpdate = new Array<PianoRollNote>();

    if (mouseHandlerMode === VelocityEditorMouseHandlerMode.Pencil) {
      notesToUpdate = getNotesFromOffsetX(scaleX, notes, event.clientX).map((note) => ({
        ...note,
        velocity: selectedNoteIds.has(note.id) ?  getVelocityByRelativeY(containerHeight, relativeY) : note.velocity
      }));
    } else if (mouseHandlerMode === VelocityEditorMouseHandlerMode.SelectAndDrag) {
      notesToUpdate = noteModificationBuffer.notesSelected.map((note) => ({
        ...note, velocity: note.velocity + deltaVelocity
      }));
    }

    modifyingNote(notesToUpdate);
  };

  const onPointerUp: React.PointerEventHandler = () => {
    noteClicked.current = null;
  };

  return { onPointerDown, onPointerMove, onPointerUp };
}

function getVelocityByRelativeY(containerHeight: number, relativeY: number): number {
  const velocityInPercent = 1 - relativeY / containerHeight;
  const velocity = velocityInPercent * 127;
  return velocity;
}
