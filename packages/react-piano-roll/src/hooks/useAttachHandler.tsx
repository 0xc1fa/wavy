import React, { useEffect } from "react";

export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
  ref: React.RefObject<HTMLElement>,
  type: K,
  listener: (this: HTMLElement, ev: GlobalEventHandlersEventMap[K]) => any
) {
  useEffect(() => {
    ref.current?.addEventListener(type, listener as EventListener);

    return () => {
      ref.current?.removeEventListener(type, listener as EventListener);
    };
  }, []);
}
