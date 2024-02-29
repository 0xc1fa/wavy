import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
// import { useStore } from "@/hooks/useStore";
import { useRef } from "react";
import _ from "lodash";
import { useAtom, useSetAtom } from "jotai";
import { modifyingNotesAtom, notesAtom } from "@/atoms/note";
import { noteModificationBufferAtom, setNoteModificationBufferWithAllNotesAtom, setNoteModificationBufferWithSelectedNotesAtom } from "@/atoms/note-modification-buffer";
import { lastModifiedVelocityAtom } from "@/atoms/last-modified";

export function useHandleSetVelocity() {
  // const { pianoRollStore, dispatch } = useStore();
  const active = useRef(false);
  const [notes] = useAtom(notesAtom);
  const [noteModificationBuffer] = useAtom(noteModificationBufferAtom)
  const [,setNoteModificationBufferWithSelectedNotes] = useAtom(setNoteModificationBufferWithSelectedNotesAtom)
  const [,modifyingNotes] = useAtom(modifyingNotesAtom)
  const setLastModifiedVelocityAtom = useSetAtom(lastModifiedVelocityAtom)

  const handleSetVelocityPD: React.PointerEventHandler = (event) => {
    if (!event.metaKey) {
      return;
    }
    const noteClicked = getNoteObjectFromEvent(notes, event);
    if (!noteClicked) {
      return;
    }
    active.current = true;
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    setNoteModificationBufferWithSelectedNotes({ initX: relativeX, initY: relativeY })
  };

  const handleSetVelocityPM: React.PointerEventHandler = (event) => {
    if (!active.current) {
      return;
    }
    const bufferedNotes = noteModificationBuffer.notesSelected;
    const noteClicked = _.last(bufferedNotes);
    const relativeY = getRelativeY(event);
    const deltaY = relativeY - noteModificationBuffer.initY;
    const newNotes = bufferedNotes.map((bufferedNote) => ({
      ...bufferedNote,
      velocity: bufferedNote.velocity - deltaY / 3,
    }));
    modifyingNotes(newNotes);
    setLastModifiedVelocityAtom(noteClicked!.velocity - deltaY / 3)
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
