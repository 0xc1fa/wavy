import { useEventListener } from "./useEventListener";

export function usePointerCapture(ref: React.RefObject<HTMLElement>) {
  useEventListener(ref, "pointerdown", (event) => {
    const eventCurrentTarget = event.currentTarget as HTMLElement;
    eventCurrentTarget.setPointerCapture(event.pointerId);
  });

  useEventListener(ref, "pointerup", (event) => {
    const eventCurrentTarget = event.currentTarget as HTMLElement;
    eventCurrentTarget.releasePointerCapture(event.pointerId);
  });
}
