import { RefObject, useEffect } from "react";

export function useEventListener<T extends HTMLElement, U extends Event>(
  event: string,
  handler: (event: U) => void,
  ref: RefObject<T>,
) {
  const eventListener = (event: Event) => handler(event as U);
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    currentRef.addEventListener(event, eventListener);

    return () => {
      currentRef.removeEventListener(event, eventListener);
    };
  }, [ref, event, handler]);
}
