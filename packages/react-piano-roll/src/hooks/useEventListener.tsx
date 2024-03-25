import { RefObject, useEffect } from "react";

export function useEventListener<T extends HTMLElement, U extends Event>(
  ref: RefObject<T>,
  event: string,
  handler: (event: U) => void,
) {
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const eventListener = (event: Event) => handler(event as U);
    currentRef.addEventListener(event, eventListener);

    return () => {
      currentRef.removeEventListener(event, eventListener);
    };
  }, [ref, event, handler]);
}
