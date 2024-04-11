import { useEffect, useState } from "react";
import _ from "lodash";
import { isNoteLeftMarginClicked, isNoteRightMarginClicked } from "@/helpers/conversion";
import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/store/note";
import { useEventListener } from "@/hooks/useEventListener";
import { usePointerHoldDetector } from "@/hooks/usePointerHoldDetector";
import { getNoteObjectFromEvent, getRelativeXY } from "@/helpers/event";
import styles from "./index.module.scss";

type CursorStyle = "default" | "col-resize";
export function useCursorStyleUpdater(ref: React.RefObject<HTMLElement>) {
  const notes = useAtomValue(notesAtom);
  const { scaleX } = useScaleX();
  const { numOfKeys } = useConfig().pitchRange;
  const holding = usePointerHoldDetector(ref);
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>("default");

  useEffect(() => {
    ref.current?.classList.remove(styles["col-resize"]);
    ref.current?.classList.remove(styles["default"]);
    ref.current?.classList.add(styles[cursorStyle]);
  }, [cursorStyle]);

  const calculateCursorStyle = (event: PointerEvent): CursorStyle => {
    if (holding) return cursorStyle;
    const hoveredNote = getNoteObjectFromEvent(notes, event);
    if (!hoveredNote) return "default";
    const relativeXY = getRelativeXY(event);
    const isMarginHovered = [isNoteLeftMarginClicked, isNoteRightMarginClicked].map((fn) =>
      fn(numOfKeys, scaleX, hoveredNote, relativeXY),
    );
    return isMarginHovered.some(Boolean) ? "col-resize" : "default";
  };

  const updateCursorStyle = (event: PointerEvent): void => setCursorStyle(calculateCursorStyle(event));

  useEventListener(ref, "pointerdown", updateCursorStyle);
  useEventListener(ref, "pointermove", updateCursorStyle);
}
