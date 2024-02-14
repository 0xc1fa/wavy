import { useScaleX } from "@/contexts/ScaleXProvider";
import { RefObject, useLayoutEffect, useRef } from "react";

export function useLeftAnchoredScale<T extends HTMLElement>(ref: RefObject<T>) {
  const { scaleX } = useScaleX();
  const prevScaleX = useRef(scaleX);
  useLayoutEffect(() => {
    const scaleDifference = scaleX / prevScaleX.current;
    const scrollLeft = ref.current!.scrollLeft + 0.5;
    ref.current!.scrollTo({ left: scrollLeft * scaleDifference });
    prevScaleX.current = scaleX;
  }, [scaleX]);
}
