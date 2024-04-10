import { useEventListener } from "@/hooks/useEventListener";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";

export function useHandleSpaceDown<T extends HTMLElement>(ref: RefObject<T>) {
  let spaceDown = useRef(false);
  const isPlaying = useRef(false);

  function createEvent(type: string) {
    return new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: {},
    });
  }

  const spaceDownHandler = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (spaceDown.current) {
        return;
      }
      if (isPlaying.current) {
        ref.current!.dispatchEvent(createEvent("pause"));
        isPlaying.current = false;
      } else {
        ref.current!.dispatchEvent(createEvent("play"));
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

  useEventListener("keydown", spaceDownHandler, ref);
  useEventListener("keyup", spaceUpHandler, ref);
}
