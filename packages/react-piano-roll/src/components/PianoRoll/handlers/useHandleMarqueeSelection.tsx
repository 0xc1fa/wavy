import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { inMarquee } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { getSelectionRangeWithSelectedNotes } from "@/helpers/notes";
import { useStore } from "@/hooks/useStore";
import React, { useEffect, useRef, useState } from "react";

export type MarqueePosition = [{ x: number; y: number }, { x: number; y: number }];
export function useHandleMarqueeSelection() {
  const { pianoRollStore, dispatch } = useStore();
  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;
  const [marqueePosition, setMarqueePosition] = useState<MarqueePosition | null>(null);

  const handleMarqueeSelectionPD: React.PointerEventHandler = (event) => {
    const noteClicked = getNoteObjectFromEvent(pianoRollStore.notes, event);
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
    const bufferedNotes = pianoRollStore.noteModificationBuffer.notesSelected;
    const relativeX = getRelativeX(event);
    const relativeY = getRelativeY(event);
    setMarqueePosition((prev) => [
      { x: prev![0].x, y: prev![0].y },
      { x: relativeX, y: relativeY },
    ]);
    dispatch({
      type: "MODIFYING_NOTES",
      payload: {
        notes: bufferedNotes.map((note) => ({
          ...note,
          isSelected: inMarquee(numOfKeys, scaleX, note, {
            startingPosition: marqueePosition[0],
            ongoingPosition: marqueePosition[1],
          })
            ? !note.isSelected
            : note.isSelected,
        })),
      },
    });
  };

  const handleMarqueeSelectionPU: React.PointerEventHandler = (event) => {
    if (!marqueePosition) {
      return;
    }
    setMarqueePosition(null);
    if (pianoRollStore.selectedNotes().length === 0) {
      return;
    }
    let selectionRange = getSelectionRangeWithSelectedNotes(
      pianoRollStore.selectedNotes(),
      pianoRollStore.selectionRange,
    );
    dispatch({ type: "SET_SELECTION_TICKS", payload: { ticks: selectionRange[1] } });
  };

  return {
    handleMarqueeSelectionPD,
    handleMarqueeSelectionPM,
    handleMarqueeSelectionPU,
    marqueePosition,
  };
}
