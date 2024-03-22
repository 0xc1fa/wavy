import { modifyingNotesAtom, notesAtom, selectedNotesAtom } from "@/store/note";
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

export type MarqueePosition = [{ x: number; y: number }, { x: number; y: number }];
export function useHandleMarqueeSelection() {
  // const { pianoRollStore, dispatch } = useStore();
  const notes = useAtomValue(notesAtom);
  const selectedNotes = useAtomValue(selectedNotesAtom);
  const selectionRange = useAtomValue(selectionRangeAtom);
  const setSelectionTicks = useSetAtom(selectionTicksAtom);
  const noteModificationBuffer = useAtomValue(noteModificationBufferAtom);
  const modifyingNotes = useSetAtom(modifyingNotesAtom);

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
    modifyingNotes(
      bufferedNotes.map((note) => ({
        ...note,
        isSelected: inMarquee(numOfKeys, scaleX, note, {
          startingPosition: marqueePosition[0],
          ongoingPosition: marqueePosition[1],
        })
          ? !note.isSelected
          : note.isSelected,
      })),
    );
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
