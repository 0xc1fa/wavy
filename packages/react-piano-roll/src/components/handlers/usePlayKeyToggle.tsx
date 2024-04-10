import { useEventListener } from "@/hooks/useEventListener";
import { RefObject, useRef } from "react";

export function usePlayKeyToggle<T extends HTMLElement>(ref: RefObject<T>) {
  const spaceDown = useRef(false);
  const isPlaying = useRef(false);

  function togglePlay() {
    if (isPlaying.current) {
      ref.current!.dispatchEvent(new CustomEvent("pause"));
    } else {
      ref.current!.dispatchEvent(new CustomEvent("play"));
    }
    isPlaying.current = !isPlaying.current;
  }

  useEventListener(ref, "keydown", (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (spaceDown.current) {
        return;
      }
      spaceDown.current = true;
      togglePlay();
    }
  });

  useEventListener(ref, "keyup", (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      spaceDown.current = false;
    }
  });
}
