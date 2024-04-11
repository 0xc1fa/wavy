import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useEventListener } from "@/hooks/useEventListener";
import { RefObject } from "react";

export function useZoomGesture(ref: RefObject<HTMLElement>) {
  const { setScaleX } = useScaleX();
  const { tickRange } = useConfig();

  useEventListener(ref, "wheel", (event: WheelEvent) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    const minScaleX = (800 - 50) / baseCanvasWidth(tickRange);
    const multiplier = -0.01;
    const newPianoRollScaleX = (scaleX: number) => scaleX * (1 + event.deltaY * multiplier);
    setScaleX((prev) => Math.max(minScaleX, newPianoRollScaleX(prev)));
  });
}
