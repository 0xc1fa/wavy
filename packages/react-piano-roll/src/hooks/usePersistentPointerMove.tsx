import { MutableRefObject, RefObject, useEffect, useRef } from "react";

type PointerPos = {
  clientX: number;
  clientY: number;
};
export function usePresistentPointerMove<T extends HTMLElement>(ref: RefObject<T>) {

  const clientPos = useRef({ clientX: 0, clientY: 0 });
  const handleSetClientPos = (event: PointerEvent) => setClientPos(event, clientPos);
  useEffect(() => {
    ref.current!.addEventListener("pointermove", handleSetClientPos);
    return () => {
      ref.current!.removeEventListener("pointermove", handleSetClientPos);
    };
  }, []);
  useEffect(() => {
    const timeout = continuouslyDispatchPointerMove(ref, clientPos);
    return () => {
      clearTimeout(timeout);
    };
  });
}

function setClientPos(event: PointerEvent, clientPos: MutableRefObject<PointerPos>) {
  clientPos.current = { clientX: event.clientX, clientY: event.clientY };
}

function continuouslyDispatchPointerMove<T extends HTMLElement>(ref: RefObject<T>, clientPos: MutableRefObject<PointerPos>) {
  const timeout = setTimeout(() => {
      ref.current!.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          clientX: clientPos.current.clientX,
          clientY: clientPos.current.clientY,
        }),
      );
    continuouslyDispatchPointerMove(ref, clientPos);
  }, 1000 / 61);
  return timeout;
}
