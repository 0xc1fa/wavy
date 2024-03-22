import { notesAtom } from "@/store/note";
import { selectionRangeAtom } from "@/store/selection-ticks";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getTickFromOffsetX } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { getNearestGridTick } from "@/helpers/grid";
import { useAtomValue, useSetAtom } from "jotai";
// import { useStore } from "@/hooks/useStore";
import { useRef } from "react";

export function useHandleRangeSelection() {
  // const { pianoRollStore, dispatch } = useStore();
  const notes = useAtomValue(notesAtom);
  const setSelectionRange = useSetAtom(selectionRangeAtom);
  const { scaleX } = useScaleX();

  const startingPositionX = useRef(0);

  const handleRangeSelectionPD: React.PointerEventHandler = (event) => {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    setSelectionRange(null);
    if (noteClicked || event.metaKey) {
      return;
    }

    event.currentTarget.setPointerCapture(event.nativeEvent.pointerId);
    const relativeX = getRelativeX(event);
    startingPositionX.current = relativeX;
  };

  const handleRangeSelectionPM: React.PointerEventHandler = (event) => {
    const hasCapture = event.currentTarget.hasPointerCapture(event.pointerId);
    if (!hasCapture) {
      return;
    }
    const relativeX = getRelativeX(event);
    const snappedSelection = [startingPositionX.current, relativeX]
      .map(getTickFromOffsetX.bind(null, scaleX))
      .map(getNearestGridTick.bind(null, scaleX))
      .sort((a, b) => a - b) as [number, number];
    setSelectionRange(snappedSelection);
  };

  return { handleRangeSelectionPD, handleRangeSelectionPM };
}
