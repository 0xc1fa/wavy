import { RefObject, useRef, useState } from "react";
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
import { useEventListener } from "@/hooks/useEventListener";

type MouseHandlerMode = "selectAndDrag" | "pencil" | "idle";
function useMouseHandlerMode() {
  const [mouseHandlerMode, setMouseHandlerMode] = useState<MouseHandlerMode>("selectAndDrag");

  return { mouseHandlerMode, setMouseHandlerMode };
}

export default function useVelocityEditorMouseHandlers<T extends HTMLElement>(ref: RefObject<T>) {
  const { mouseHandlerMode } = useMouseHandlerMode();
  const notes = useAtomValue(notesAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);
  const setNoteModificationBufferWithSelectedNote = useSetAtom(setNoteModificationBufferWithAllNotesAtom);
  const modifyingNote = useSetAtom(modifyingNotesAtom);
  const noteClicked = useRef<PianoRollNote | null>(null);

  const handleNoteSelection = (event: PointerEvent) => {
    if (!noteClicked.current) {
      if (!event.shiftKey) setSelectedNoteIds(new Set());
      return false;
    }

    if (!selectedNoteIds.has(noteClicked.current.id) && noteClicked.current !== null) {
      if (!event.shiftKey) setSelectedNoteIds(new Set());
      setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(noteClicked.current!.id)));
    }

    setNoteModificationBufferWithSelectedNote({ initX: getRelativeX(event), initY: getRelativeY(event) });
    return true;
  };

  useEventListener(ref, "pointerdown", (event: PointerEvent) => {
    const eventCurrentTarget = event.currentTarget as T;
    eventCurrentTarget.setPointerCapture(event.pointerId);
    noteClicked.current = getNoteObjectFromEvent(notes, event);

    if (mouseHandlerMode === "selectAndDrag") {
      handleNoteSelection(event);
    }
  });

  useEventListener(ref, "pointermove", (event: PointerEvent) => {
    if (!noteClicked.current) return;
    const eventCurrentTarget = event.currentTarget as T;
    const containerHeight = eventCurrentTarget.clientHeight;
    const relativeY = getRelativeY(event);
    const deltaVelocity =
      getVelocityByRelativeY(containerHeight, relativeY) -
      getVelocityByRelativeY(containerHeight, noteModificationBuffer.initY);

    let notesToUpdate = new Array<PianoRollNote>();

    if (mouseHandlerMode === "pencil") {
      // notesToUpdate = getNotesFromOffsetX(scaleX, notes, event.clientX).map((note) => ({
      //   ...note,
      //   velocity: selectedNoteIds.has(note.id) ? getVelocityByRelativeY(containerHeight, relativeY) : note.velocity,
      // }));
    } else if (mouseHandlerMode === "selectAndDrag") {
      notesToUpdate = noteModificationBuffer.notesSelected.map((note) => ({
        ...note,
        velocity: note.velocity + deltaVelocity,
      }));
    }

    modifyingNote(notesToUpdate);
  });

  useEventListener(ref, "pointerup", (event) => {
    noteClicked.current = null;
  });

}

function getVelocityByRelativeY(containerHeight: number, relativeY: number): number {
  const velocityInPercent = 1 - relativeY / containerHeight;
  const velocity = velocityInPercent * 127;
  return velocity;
}
