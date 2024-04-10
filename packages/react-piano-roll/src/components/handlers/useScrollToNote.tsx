import { useLayoutEffect, useRef } from "react";

export function useScrollToNote(containerRef: React.RefObject<HTMLElement>, initialScrollMiddleNote: number) {
  const scrolled = useRef(false);
  useLayoutEffect(() => {
    if (scrolled.current) {
      return;
    }
    const keyElement = document.querySelector(`[data-keynum="${initialScrollMiddleNote}"]`) as HTMLDivElement;
    const keyTop = keyElement.getBoundingClientRect().top;
    containerRef.current?.scrollBy(0, keyTop);
    scrolled.current = true;
  }, []);
}
