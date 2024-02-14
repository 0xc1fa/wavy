import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { baseCanvasWidth } from "@/helpers/conversion";
import { useEventListener } from "@/hooks/useAttachHandler";
import { RefObject, useCallback, useEffect } from "react";

export function useHandleRescale(ref: RefObject<HTMLElement>) {
  const { tickRange } = useConfig();
  const { setScaleX } = useScaleX();
  const handleWheel = (event: WheelEvent) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    const minScaleX = (800 - 50) / baseCanvasWidth(tickRange);
    const multiplier = -0.01;
    const newPianoRollScaleX = (scaleX: number) => scaleX * (1 + event.deltaY * multiplier);
    setScaleX(prev => Math.max(minScaleX, newPianoRollScaleX(prev)));
  }

  useEventListener(ref, "wheel", handleWheel);
}
