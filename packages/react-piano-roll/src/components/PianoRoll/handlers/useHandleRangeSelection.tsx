import { notesAtom } from "@/store/note";
import { selectionRangeAtom } from "@/store/selection-ticks";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { getTickFromOffsetX } from "@/helpers/conversion";
import { getNoteObjectFromEvent, getRelativeX, getRelativeY } from "@/helpers/event";
import { getNearestGridTick } from "@/helpers/grid";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef } from "react";
import { useEventListener } from "@/hooks/useEventListener";

export function useHandleRangeSelection(ref: React.RefObject<HTMLElement>) {
  const notes = useAtomValue(notesAtom);
  const setSelectionRange = useSetAtom(selectionRangeAtom);
  const { scaleX } = useScaleX();
  const startingPositionX = useRef(0);

  useEventListener(ref, "pointerdown", (event) => {
    const noteClicked = getNoteObjectFromEvent(notes, event);
    setSelectionRange(null);
    if (noteClicked || event.metaKey) {
      return;
    }

    const eventCurrentTarget = event.currentTarget as HTMLElement;
    eventCurrentTarget.setPointerCapture(event.pointerId);
    const relativeX = getRelativeX(event);
    startingPositionX.current = relativeX;
  });

  useEventListener(ref, "pointermove", (event) => {
    const eventCurrentTarget = event.currentTarget as HTMLElement;
    const hasCapture = eventCurrentTarget.hasPointerCapture(event.pointerId);
    if (!hasCapture) {
      return;
    }
    const relativeX = getRelativeX(event);
    const snappedSelection = [startingPositionX.current, relativeX]
      .map(getTickFromOffsetX.bind(null, scaleX))
      .map(getNearestGridTick.bind(null, scaleX))
      .sort((a, b) => a - b) as [number, number];
    setSelectionRange(snappedSelection);
  });
}
