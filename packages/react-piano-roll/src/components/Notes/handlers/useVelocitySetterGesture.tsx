import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { RefObject, useRef } from "react";
import _ from "lodash";
import { useAtom, useSetAtom } from "jotai";
import { modifyingNotesAtom, notesAtom } from "@/store/note";
import {
  noteModificationBufferAtom,
  setNoteModificationBufferWithSelectedNotesAtom,
} from "@/store/note-modification-buffer";
import { lastModifiedVelocityAtom } from "@/store/last-modified";
import { useEventListener } from "@/hooks/useEventListener";

export function useVelocitySetterGesture<T extends HTMLElement>(ref: RefObject<T>) {
  const active = useRef(false);
  const [notes] = useAtom(notesAtom);
  const [noteModificationBuffer] = useAtom(noteModificationBufferAtom);
  const [, setNoteModificationBufferWithSelectedNotes] = useAtom(setNoteModificationBufferWithSelectedNotesAtom);
  const [, modifyingNotes] = useAtom(modifyingNotesAtom);
  const setLastModifiedVelocityAtom = useSetAtom(lastModifiedVelocityAtom);

  useEventListener(ref, "pointerdown", (event: PointerEvent) => {
    console.log("pointerdown");
    if (!event.metaKey) {
      return;
    }
    event.preventDefault();
    const noteClicked = getNoteObjectFromEvent(notes, event);
    console.log("noteClicked", noteClicked);
    if (!noteClicked) {
      return;
    }
    active.current = true;
    const eventCurrentTarget = event.currentTarget as HTMLElement;
    eventCurrentTarget.setPointerCapture(event.pointerId);
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    setNoteModificationBufferWithSelectedNotes({ initX: relativeX, initY: relativeY });
  });

  useEventListener(ref, "pointermove", (event: PointerEvent) => {
    if (!active.current) {
      return;
    }
    console.log("pointermove");
    const bufferedNotes = noteModificationBuffer.notesSelected;
    const noteClicked = _.last(bufferedNotes);
    const relativeY = getRelativeY(event);
    const deltaY = relativeY - noteModificationBuffer.initY;
    const newNotes = bufferedNotes.map((bufferedNote) => ({
      ...bufferedNote,
      velocity: bufferedNote.velocity - deltaY / 3,
    }));
    modifyingNotes(newNotes);
    setLastModifiedVelocityAtom(noteClicked!.velocity - deltaY / 3);
  });

  useEventListener(ref, "pointerup", () => {
    active.current = false;
  });
}
