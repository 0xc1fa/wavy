import { useScaleX } from "@/contexts/ScaleXProvider";
import { getTickFromOffsetX } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { getNearestGridTick } from "@/helpers/grid";
import { useStore } from "@/hooks/useStore";
import { set } from "lodash";
import { useRef } from "react";

export function useHandleRangeSelection() {
  const { pianoRollStore, dispatch } = useStore();
  const { scaleX } = useScaleX();

  const startingPositionX = useRef(0);

  const handleRangeSelectionPD: React.PointerEventHandler = (event) => {
    const noteClicked = getNoteObjectFromEvent(pianoRollStore.notes, event);
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
    dispatch({ type: "SET_SELECTION_RANGE", payload: { range: snappedSelection } });
  };

  return { handleRangeSelectionPD, handleRangeSelectionPM };
}
