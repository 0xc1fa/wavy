import { useState } from "react";
import { useEventListener } from "./useEventListener";

export function useHoldAndDragGesture(ref: React.RefObject<HTMLElement>) {
  const [isDragging, setIsDragging] = useState(false);

  useEventListener(ref, "pointerdown", (event) => {
    setIsDragging(true);
  });

  useEventListener(ref, "pointerup", () => {
    setIsDragging(false);
  });

  return isDragging;
}
