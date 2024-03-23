import { RefObject, useEffect } from "react";

export function useEventListener<T extends HTMLElement>(ref: RefObject<T>, event: string, handler: (event: Event) => void) {
  useEffect(() => {
    ref.current!.addEventListener(event, handler);

    return () => {
      ref.current!.removeEventListener(event, handler);
    };
  }, [ref, event, handler]);
}
