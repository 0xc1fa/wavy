import { modifyingNotesAtom, notesAtom, selectedNoteIdsAtom, selectedNotesAtom } from "@/store/note";
import { noteModificationBufferAtom } from "@/store/note-modification-buffer";
import { selectionRangeAtom, selectionTicksAtom } from "@/store/selection-ticks";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { inMarquee } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
// import { useStore } from "@/hooks/useStore";
import React, { useEffect, useRef, useState } from "react";
import { create } from "mutative";

export type MarqueePosition = [{ x: number; y: number }, { x: number; y: number }];
export function useHandleMarqueeSelection() {
  // const { pianoRollStore, dispatch } = useStore();
  const notes = useAtomValue(notesAtom);
  const selectedNotes = useAtomValue(selectedNotesAtom);
  const selectionRange = useAtomValue(selectionRangeAtom);
  const setSelectionTicks = useSetAtom(selectionTicksAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const modifyingNotes = useSetAtom(modifyingNotesAtom);
  const [selectedNoteIds, setSelectedNoteIds] = useAtom(selectedNoteIdsAtom);

  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;
  const [marqueePosition, setMarqueePosition] = useState<MarqueePosition | null>(null);

  const handleMarqueeSelectionPD: React.PointerEventHandler = (event) => {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    if (noteClicked || event.metaKey) {
      return;
    }
    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    setMarqueePosition([
      { x: relativeX, y: relativeY },
      { x: relativeX, y: relativeY },
    ]);
  };

  const handleMarqueeSelectionPM: React.PointerEventHandler = (event) => {
    if (!marqueePosition) {
      return;
    }
    const bufferedNotes = noteModificationBuffer.notesSelected;
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    setMarqueePosition((prev) => [
      { x: prev![0].x, y: prev![0].y },
      { x: relativeX, y: relativeY },
    ]);

    const newNotes = bufferedNotes.filter((note) =>
      inMarquee(numOfKeys, scaleX, note, {
        startingPosition: marqueePosition[0],
        ongoingPosition: { x: relativeX, y: relativeY },
      }),
    );
    if (newNotes.length === 0) {
      return;
    }

    bufferedNotes.forEach((note) => {
      const noteIsSelected = selectedNoteIds.has(note.id);
      const isInMarquee = inMarquee(numOfKeys, scaleX, note, {
        startingPosition: marqueePosition[0],
        ongoingPosition: marqueePosition[1],
      });
      if (isInMarquee) {
        setSelectedNoteIds((prev) => create(prev, (draft) => draft.add(note.id)));
      }
    });
  };

  const handleMarqueeSelectionPU: React.PointerEventHandler = (event) => {
    if (!marqueePosition) {
      return;
    }
    setMarqueePosition(null);
    if (selectedNotes.length === 0) {
      return;
    }
    let newSelectionRange = getSelectionRangeWithSelectedNotes(selectedNotes, selectionRange);
    setSelectionTicks(newSelectionRange[1]);
  };

  return {
    handleMarqueeSelectionPD,
    handleMarqueeSelectionPM,
    handleMarqueeSelectionPU,
    marqueePosition,
  };
}
