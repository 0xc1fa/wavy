import { useEventListener } from "@/hooks/useEventListener";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";

export function useHandleSpaceDown<T extends HTMLElement>(ref: RefObject<T>) {
  let spaceDown = useRef(false);
  const isPlaying = useRef(false);

  const spaceDownHandler = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (spaceDown.current) {
        return;
      }
      if (isPlaying.current) {
        ref.current!.dispatchEvent(
          new CustomEvent("pause", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
        isPlaying.current = false;
      } else {
        ref.current!.dispatchEvent(
          new CustomEvent("play", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
        isPlaying.current = true;
      }
      spaceDown.current = true;
    }
  };
  const spaceUpHandler = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      spaceDown.current = false;
    }
  };

  // useEventListener(ref, "keydown", spaceDownHandler);

  useEffect(() => {
    ref.current!.addEventListener("keydown", spaceDownHandler);
    ref.current!.addEventListener("keyup", spaceUpHandler);

    return () => {
      ref.current!.removeEventListener("keydown", spaceDownHandler);
      ref.current!.removeEventListener("keyup", spaceUpHandler);
    };
  }, []);
}
