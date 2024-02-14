import { useConfig } from "@/contexts/PianoRollConfigProvider";
import { useScaleX } from "@/contexts/ScaleXProvider";
import { baseCanvasWidth } from "@/helpers/conversion";
import { RefObject, useEffect } from "react";

export function useHandleScaleX(ref: RefObject<HTMLElement>) {
  const { setScaleX } = useScaleX();
  const { tickRange } = useConfig();

  const handleScaleX = (event: WheelEvent) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    const minScaleX = (800 - 50) / baseCanvasWidth(tickRange);
    const multiplier = -0.01;
    const newPianoRollScaleX = (scaleX: number) => scaleX * (1 + event.deltaY * multiplier);
    setScaleX((prev) => Math.max(minScaleX, newPianoRollScaleX(prev)));
  };

  useEffect(() => {
    ref.current?.addEventListener('wheel', handleScaleX)
    return () => {
      ref.current?.removeEventListener('wheel', handleScaleX)
    }
  }, [tickRange]);
}
