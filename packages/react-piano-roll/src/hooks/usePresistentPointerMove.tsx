// import { MutableRefObject, RefObject, useEffect, useRef } from "react";

// type PointerPos = {
//   clientX: number;
//   clientY: number;
// };
// export function usePresistentPointerMove<T extends HTMLElement>(ref?: RefObject<T>) {
//   ref = ref || useRef<T>(null);

//   const clientPos = useRef({ clientX: 0, clientY: 0 });
//   const handleSetClientPos = (event: PointerEvent) => setClientPos(event, clientPos);
//   useEffect(() => {
//     ref.current!.addEventListener("pointermove", handleSetClientPos, { passive: true });
//     return () => {
//       ref.current!.removeEventListener("pointermove", handleSetClientPos);
//     };
//   }, []);
//   useEffect(() => {
//     const interval = continuouslyDispatchPointerMove(ref, clientPos);
//     return () => {
//       clearTimeout(interval);
//     };
//   });
//   return ref;
// }

// function setClientPos(event: PointerEvent, clientPos: MutableRefObject<PointerPos>) {
//   clientPos.current = { clientX: event.clientX, clientY: event.clientY };
// }

// function continuouslyDispatchPointerMove<T extends HTMLElement>(
//   ref: RefObject<T>,
//   clientPos: MutableRefObject<PointerPos>,
// ) {
//   const interval = setInterval(() => {
//     ref.current!.dispatchEvent(
//       new PointerEvent("pointermove", {
//         bubbles: true,
//         cancelable: true,
//         clientX: clientPos.current.clientX,
//         clientY: clientPos.current.clientY,
//       }),
//     );
//   }, 1000 / 60);
//   return interval;
// }

import { useEffect, useRef } from "react";

type PointerPos = {
  clientX: number;
  clientY: number;
};

export function usePresistentPointerMove<T extends HTMLElement>(): React.RefObject<T>;
export function usePresistentPointerMove<T extends HTMLElement>(ref: React.RefObject<T>): undefined;
export function usePresistentPointerMove<T extends HTMLElement>(ref?: React.RefObject<T>): React.RefObject<T> | undefined {
  const internalRef = useRef<T>(null);
  const usedRef = ref || internalRef;

  const clientPos = useRef<PointerPos>({ clientX: 0, clientY: 0 });

  useEffect(() => {
    const handleSetClientPos = (event: PointerEvent) => {
      clientPos.current = { clientX: event.clientX, clientY: event.clientY };
    };

    const element = usedRef.current;
    if (element) {
      element.addEventListener("pointermove", handleSetClientPos, { passive: true });
      return () => {
        element.removeEventListener("pointermove", handleSetClientPos);
      };
    }
  }, []);


  useEffect(() => {
    let frameId: number;

    const simulateContinuousDispatch = () => {
      if (usedRef.current) {
        usedRef.current.dispatchEvent(
          new PointerEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            clientX: clientPos.current.clientX,
            clientY: clientPos.current.clientY,
          }),
        );
      }
      frameId = requestAnimationFrame(simulateContinuousDispatch);
    };

    frameId = requestAnimationFrame(simulateContinuousDispatch);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return ref ? undefined : internalRef;
}
